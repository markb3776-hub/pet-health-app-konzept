/**
 * simplyPet: Tier anlegen
 * Quelle: technische_spezifikation_screen_flow.md (2.1, Onboarding Schritt 3)
 *
 * Ablauf: Tierart ZUERST waehlen -> das Formular passt sich dynamisch an
 * (Begriffe, Felder). Pflicht sind nur Tierart und Name ("Du kannst alles
 * später ergänzen"). Optional: Geburtsdatum (Kalender-Picker, Zukunft
 * gesperrt), Geschlecht, Foto (Kamera/Galerie), Tierfarbe.
 *
 * Eingabe-Stabilitaet (pruefdoktrin_eingabe_stabilitaet.md):
 * - Draft-Autosave bei jeder Aenderung (spaetestens alle 2 s)
 * - "Fortsetzen oder verwerfen?"-Dialog bei vorhandenem Entwurf
 * - Zurueck-Geste mit ungespeicherten Aenderungen fragt nach
 * - Speichern ist atomar (eine INSERT-Transaktion) mit sichtbarer Bestaetigung
 *
 * Querformat: Formular-Bloecke liegen im Querformat nebeneinander
 * (Screen-Flow 1.1, Regel 2); Rotation verliert keinen Zustand, da der
 * gesamte Formularzustand in React-State + Draft liegt.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getDb, uuid } from '../db/database';
import { SPECIES_LIST } from '../config/species';
import { colors, typography, spacing, minTouchTarget, petColorPalette } from '../theme/theme';
import DateField from '../components/DateField';
import { nowUtcIso } from '../time/timeModule';
import {
  loadDraft,
  clearDraft,
  useDraftAutosave,
  useUnsavedChangesGuard,
  offerDraftResume,
} from '../drafts/draftStore';

const DRAFT_KEY = 'add_pet';

interface AddPetDraft {
  species: string | null;
  name: string;
  birthDate: string | null;
  gender: string | null;
  colorKey: string;
  photoUri: string | null;
}

const EMPTY_DRAFT: AddPetDraft = {
  species: null,
  name: '',
  birthDate: null,
  gender: null,
  colorKey: petColorPalette[0].key,
  photoUri: null,
};

const GENDER_OPTIONS = ['Männlich', 'Weiblich', 'Unbekannt'];

export default function AddPetScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const isFirstPet = (route.params as { firstPet?: boolean } | undefined)?.firstPet === true;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [form, setForm] = useState<AddPetDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedSpecies = SPECIES_LIST.find((s) => s.key === form.species);
  const nameLabel = selectedSpecies?.terminology.nameField ?? 'Name';
  const isHabitat = selectedSpecies?.isHabitat === true;
  const canSave = form.species !== null && form.name.trim().length > 0 && !saving;

  const isDirty = useMemo(
    () =>
      form.species !== null ||
      form.name.trim().length > 0 ||
      form.birthDate !== null ||
      form.gender !== null ||
      form.photoUri !== null,
    [form]
  );

  function update<K extends keyof AddPetDraft>(key: K, value: AddPetDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Entwurf anbieten (Null-Datenverlust-Regel, Baupflicht 1).
  useEffect(() => {
    let active = true;
    (async () => {
      const draft = await loadDraft<AddPetDraft>(DRAFT_KEY);
      if (!active) return;
      const d = draft?.data;
      const hasContent =
        d && (d.species !== null || (d.name ?? '').trim().length > 0 || d.photoUri !== null);
      if (hasContent) {
        offerDraftResume(
          d.name?.trim()
            ? `Du hattest einen Eintrag für „${d.name.trim()}" begonnen`
            : 'Du hattest begonnen, ein Tier anzulegen',
          () => setForm({ ...EMPTY_DRAFT, ...d }),
          () => void clearDraft(DRAFT_KEY)
        );
      }
      setHydrated(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useDraftAutosave(DRAFT_KEY, form, hydrated && isDirty && !saved);

  // Zurueck-Geste: Nachfrage bei ungespeicherten Aenderungen (Baupflicht 2).
  useUnsavedChangesGuard(hydrated && isDirty && !saved, () => clearDraft(DRAFT_KEY));

  async function pickPhoto(fromCamera: boolean) {
    try {
      if (fromCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            'Kamera nicht freigegeben',
            'Ohne Kamera-Freigabe kann kein Foto aufgenommen werden. Du kannst stattdessen ein Bild aus der Galerie wählen.'
          );
          return;
        }
        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (!result.canceled && result.assets[0]) update('photoUri', result.assets[0].uri);
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            'Galerie nicht freigegeben',
            'Ohne Freigabe kann kein Bild aus der Galerie gewählt werden.'
          );
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
        if (!result.canceled && result.assets[0]) update('photoUri', result.assets[0].uri);
      }
    } catch {
      Alert.alert('Foto nicht möglich', 'Das Foto konnte nicht übernommen werden. Bitte versuche es erneut.');
    }
  }

  async function save() {
    if (!canSave || !form.species) return;
    setSaving(true);
    try {
      const db = await getDb();
      const hex =
        petColorPalette.find((c) => c.key === form.colorKey)?.hex ?? petColorPalette[0].hex;
      const ts = nowUtcIso();
      // Atomar: EIN Insert – entweder vollstaendig gespeichert oder gar nicht.
      await db.runAsync(
        `INSERT INTO pets (id, name, species, gender, birth_date, color_theme, photo_uri, created_at, updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          uuid(),
          form.name.trim(),
          form.species,
          form.gender,
          form.birthDate,
          hex,
          form.photoUri,
          ts,
          ts,
        ]
      );
      setSaved(true);
      await clearDraft(DRAFT_KEY);
      // Sichtbare Bestaetigung (Baupflicht 3): Der Nutzer raetselt nie, ob es geklappt hat.
      Alert.alert(
        'Gespeichert',
        `${form.name.trim()} ist jetzt angelegt. Alles Weitere kannst du in Ruhe in der Tierakte ergänzen.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch {
      setSaved(false);
      Alert.alert(
        'Speichern fehlgeschlagen',
        'Der Eintrag konnte nicht gespeichert werden. Deine Eingaben bleiben erhalten – bitte versuche es erneut.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        {isFirstPet ? (
          <Text style={styles.introText}>
            Lege jetzt dein erstes Tier an – danach bist du startklar.
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>Welches Tier möchtest du anlegen?</Text>
        <View style={styles.speciesGrid}>
          {SPECIES_LIST.map((s) => (
            <Pressable
              key={s.key}
              style={[styles.speciesChip, form.species === s.key && styles.speciesChipActive]}
              onPress={() => update('species', s.key)}
              accessibilityLabel={s.label}
            >
              <Text
                style={[
                  styles.speciesChipText,
                  form.species === s.key && styles.speciesChipTextActive,
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Dynamischer Formularteil: erscheint erst nach Tierart-Wahl */}
        {selectedSpecies ? (
          <View style={isLandscape ? styles.landscapeColumns : undefined}>
            <View style={isLandscape ? styles.landscapeColumn : undefined}>
              <Text style={styles.sectionTitle}>{nameLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(t) => update('name', t)}
                placeholder={isHabitat ? 'z. B. Wohnzimmer-Becken' : 'z. B. Benno'}
                placeholderTextColor={colors.textSecondary}
                accessibilityLabel={nameLabel}
              />

              {/* Geburtsdatum & Geschlecht nur fuer Einzeltiere, nicht fuer Behaeltnisse (Aquarium) */}
              {!isHabitat ? (
                <>
                  <Text style={styles.sectionTitle}>Geburtsdatum (optional)</Text>
                  <DateField
                    label="Geburtstag oder ungefähres Datum"
                    value={form.birthDate}
                    onChange={(key) => update('birthDate', key)}
                    hint="Wenn du es nicht genau weißt, reicht eine Schätzung – du kannst es jederzeit ändern."
                  />

                  <Text style={styles.sectionTitle}>Geschlecht (optional)</Text>
                  <View style={styles.genderRow}>
                    {GENDER_OPTIONS.map((g) => (
                      <Pressable
                        key={g}
                        style={[styles.genderChip, form.gender === g && styles.genderChipActive]}
                        onPress={() => update('gender', form.gender === g ? null : g)}
                        accessibilityLabel={`Geschlecht ${g}`}
                      >
                        <Text
                          style={[
                            styles.genderChipText,
                            form.gender === g && styles.genderChipTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : null}
            </View>

            <View style={isLandscape ? styles.landscapeColumn : undefined}>
              <Text style={styles.sectionTitle}>Foto (optional)</Text>
              {form.photoUri ? (
                <View style={styles.photoWrap}>
                  <Image source={{ uri: form.photoUri }} style={styles.photo} />
                  <Pressable
                    style={styles.photoRemove}
                    onPress={() => update('photoUri', null)}
                    accessibilityLabel="Foto entfernen"
                  >
                    <Text style={styles.photoRemoveText}>Foto entfernen</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <Pressable
                    style={styles.photoButton}
                    onPress={() => pickPhoto(true)}
                    accessibilityLabel="Foto aufnehmen"
                  >
                    <Text style={styles.photoButtonText}>📷 Foto aufnehmen</Text>
                  </Pressable>
                  <Pressable
                    style={styles.photoButton}
                    onPress={() => pickPhoto(false)}
                    accessibilityLabel="Aus Galerie wählen"
                  >
                    <Text style={styles.photoButtonText}>🖼 Aus Galerie</Text>
                  </Pressable>
                </View>
              )}

              <Text style={styles.sectionTitle}>Farbe für dieses Tier</Text>
              <View style={styles.colorRow}>
                {petColorPalette.map((c) => (
                  <Pressable
                    key={c.key}
                    accessibilityLabel={`Farbe ${c.label}`}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c.hex },
                      form.colorKey === c.key && styles.colorDotActive,
                    ]}
                    onPress={() => update('colorKey', c.key)}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : null}

        <Text style={styles.footnote}>
          Nur Tierart und {nameLabel.toLowerCase()} sind nötig – alles andere kannst du später in
          Ruhe ergänzen. Deine Eingaben werden fortlaufend gesichert.
        </Text>

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          disabled={!canSave}
          onPress={save}
          accessibilityLabel="Tier speichern"
        >
          <Text style={styles.saveButtonText}>{saving ? 'Speichert …' : 'Speichern'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  introText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
    marginTop: spacing.l,
  },
  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  speciesChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  speciesChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  speciesChipText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  speciesChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  landscapeColumns: { flexDirection: 'row', gap: spacing.xl },
  landscapeColumn: { flex: 1 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    fontSize: typography.body,
    color: colors.textPrimary,
    minHeight: minTouchTarget,
  },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  genderChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  genderChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderChipText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  genderChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  photoButtons: { flexDirection: 'row', gap: spacing.m, flexWrap: 'wrap' },
  photoButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
    justifyContent: 'center',
    flexGrow: 1,
    alignItems: 'center',
  },
  photoButtonText: { fontSize: typography.body, color: colors.textPrimary },
  photoWrap: { alignItems: 'flex-start', gap: spacing.s },
  photo: { width: 140, height: 140, borderRadius: 16, backgroundColor: colors.border },
  photoRemove: { minHeight: minTouchTarget, justifyContent: 'center' },
  photoRemoveText: { fontSize: typography.bodySmall, color: colors.textSecondary },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  colorDot: { width: 40, height: 40, borderRadius: 20 },
  colorDotActive: { borderWidth: 3, borderColor: colors.textPrimary },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.l,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.l,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
});
