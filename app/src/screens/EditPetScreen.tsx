/**
 * simplyPet: Stammdaten bearbeiten (Teilauftrag 4.2)
 * Quelle: Screen-Flow 2.3 (Tierakte, Stift-Symbol auf der Passkarte).
 *
 * Alle Stammdaten des Tieres bearbeiten: Name, Rasse, Geschlecht,
 * Geburtsdatum, Kastration, Chip-Nummer (15-stellig, mit ehrlichem Hinweis
 * statt harter Sperre), Besonderheiten, Spezialisten-Tierarzt, Foto, Farbe.
 * Die Tierart selbst ist NICHT aenderbar (sie bestimmt die Aktenstruktur;
 * ehrlicher Hinweis im Formular).
 *
 * Eingabe-Stabilitaet: Draft-Schutz pro Tier (edit_pet_<id>), Zurueck-Geste
 * fragt nach, UPDATE ist atomar mit sichtbarer Bestaetigung, updated_at und
 * is_synced=0 werden gesetzt (Sync-Vorbereitung).
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
import * as ImagePicker from 'expo-image-picker';
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { colors, typography, spacing, minTouchTarget, petColorPalette } from '../theme/theme';
import DateField from '../components/DateField';
import { FieldLabel, Hint, SaveButton, ChoiceChips } from '../components/FormParts';
import { nowUtcIso } from '../time/timeModule';
import {
  loadDraft,
  clearDraft,
  useDraftAutosave,
  useUnsavedChangesGuard,
  offerDraftResume,
} from '../drafts/draftStore';

interface PetRow {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  castration_status: string | null;
  castration_date: string | null;
  chip_number: string | null;
  color_theme: string | null;
  photo_uri: string | null;
  special_features: string | null;
  specialist_vet_name: string | null;
  specialist_vet_phone: string | null;
  coat_color: string | null;
  vet_practice_name: string | null;
  vet_practice_phone: string | null;
}

interface EditPetDraft {
  name: string;
  breed: string;
  gender: string | null;
  birthDate: string | null;
  castration: string | null;
  castrationDate: string | null;
  chipNumber: string;
  colorHex: string;
  photoUri: string | null;
  specialFeatures: string;
  vetName: string;
  vetPhone: string;
  coatColor: string;
  practiceName: string;
  practicePhone: string;
}

const GENDER_OPTIONS = ['Männlich', 'Weiblich', 'Unbekannt'];
const CASTRATION_OPTIONS = ['Kastriert', 'Sterilisiert', 'Nein', 'Unbekannt'];

function petToDraft(p: PetRow): EditPetDraft {
  return {
    name: p.name,
    breed: p.breed ?? '',
    gender: p.gender,
    birthDate: p.birth_date,
    castration: p.castration_status,
    castrationDate: p.castration_date,
    chipNumber: p.chip_number ?? '',
    colorHex: p.color_theme ?? petColorPalette[0].hex,
    photoUri: p.photo_uri,
    specialFeatures: p.special_features ?? '',
    vetName: p.specialist_vet_name ?? '',
    vetPhone: p.specialist_vet_phone ?? '',
    coatColor: p.coat_color ?? '',
    practiceName: p.vet_practice_name ?? '',
    practicePhone: p.vet_practice_phone ?? '',
  };
}

export default function EditPetScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const petId = (route.params as { petId: string }).petId;
  const draftKey = `edit_pet_${petId}`;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [original, setOriginal] = useState<EditPetDraft | null>(null);
  const [species, setSpecies] = useState<string>('');
  const [form, setForm] = useState<EditPetDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const speciesCfg = getSpeciesConfig(species);
  const isHabitat = speciesCfg?.isHabitat === true;

  // Tier laden, dann ggf. Entwurf anbieten.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const db = await getDb();
        const row = await db.getFirstAsync<PetRow>(
          `SELECT * FROM pets WHERE id = ? AND deleted_at IS NULL`,
          [petId]
        );
        if (!active) return;
        if (!row) {
          setNotFound(true);
          return;
        }
        const base = petToDraft(row);
        setSpecies(row.species);
        setOriginal(base);
        const draft = await loadDraft<EditPetDraft>(draftKey);
        if (!active) return;
        if (draft?.data && JSON.stringify(draft.data) !== JSON.stringify(base)) {
          offerDraftResume(
            `Du hattest Änderungen an „${row.name}" begonnen`,
            () => setForm({ ...base, ...draft.data }),
            () => {
              void clearDraft(draftKey);
              setForm(base);
            }
          );
          // Bis zur Entscheidung die gespeicherten Daten zeigen.
          setForm(base);
        } else {
          setForm(base);
        }
      } catch {
        if (active) setNotFound(true);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const isDirty = useMemo(
    () => form !== null && original !== null && JSON.stringify(form) !== JSON.stringify(original),
    [form, original]
  );

  useDraftAutosave(draftKey, form, form !== null && isDirty && !saved);
  useUnsavedChangesGuard(isDirty && !saved, () => clearDraft(draftKey));

  function update<K extends keyof EditPetDraft>(key: K, value: EditPetDraft[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  // Chip-Nummer: ehrlicher HINWEIS statt harter Sperre (Transponder sind 15-stellig).
  const chipDigits = form?.chipNumber.replace(/\D/g, '') ?? '';
  const chipHint =
    form && form.chipNumber.trim().length > 0 && chipDigits.length !== 15
      ? `Hinweis: Transponder-Nummern haben üblicherweise 15 Ziffern (deine Eingabe: ${chipDigits.length}). Speichern kannst du trotzdem.`
      : null;

  const canSave = form !== null && form.name.trim().length > 0 && isDirty && !saving && !saved;

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
          Alert.alert('Galerie nicht freigegeben', 'Ohne Freigabe kann kein Bild gewählt werden.');
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
    if (!canSave || !form) return;
    setSaving(true);
    try {
      const db = await getDb();
      const ts = nowUtcIso();
      // Atomar: EIN Update – alle Felder in einem Statement.
      await db.runAsync(
        `UPDATE pets SET
           name = ?, breed = ?, gender = ?, birth_date = ?,
           castration_status = ?, castration_date = ?, chip_number = ?,
           color_theme = ?, photo_uri = ?, special_features = ?,
           specialist_vet_name = ?, specialist_vet_phone = ?,
           coat_color = ?, vet_practice_name = ?, vet_practice_phone = ?,
           updated_at = ?, is_synced = 0
         WHERE id = ?`,
        [
          form.name.trim(),
          form.breed.trim() || null,
          form.gender,
          form.birthDate,
          form.castration,
          form.castration === 'Kastriert' || form.castration === 'Sterilisiert'
            ? form.castrationDate
            : null,
          form.chipNumber.trim() || null,
          form.colorHex,
          form.photoUri,
          form.specialFeatures.trim() || null,
          form.vetName.trim() || null,
          form.vetPhone.trim() || null,
          form.coatColor.trim() || null,
          form.practiceName.trim() || null,
          form.practicePhone.trim() || null,
          ts,
          petId,
        ]
      );
      setSaved(true);
      setOriginal(form);
      await clearDraft(draftKey);
      Alert.alert('Gespeichert', `Die Stammdaten von ${form.name.trim()} sind aktualisiert.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      setSaved(false);
      Alert.alert(
        'Speichern fehlgeschlagen',
        'Die Änderungen konnten nicht gespeichert werden. Deine Eingaben bleiben erhalten – bitte versuche es erneut.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (notFound) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Dieses Tier wurde nicht gefunden.</Text>
      </View>
    );
  }
  if (!form) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lädt …</Text>
      </View>
    );
  }

  const showCastration = !isHabitat && (form.castration === 'Kastriert' || form.castration === 'Sterilisiert');

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.speciesNote}>
          Tierart: {speciesCfg?.label ?? species} – die Tierart bestimmt den Aufbau der Akte und
          lässt sich deshalb nicht ändern. Stimmt sie nicht, lege das Tier bitte neu an.
        </Text>

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>{speciesCfg?.terminology.nameField ?? 'Name'}</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(t) => update('name', t)}
              accessibilityLabel="Name"
            />

            {!isHabitat ? (
              <>
                <FieldLabel>Rasse / Art (optional)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.breed}
                  onChangeText={(t) => update('breed', t)}
                  placeholder="z. B. Maine Coon, Zwergwidder"
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Rasse"
                />

                <FieldLabel>Geschlecht</FieldLabel>
                <ChoiceChips options={GENDER_OPTIONS} value={form.gender} onChange={(v) => update('gender', v)} />

                <FieldLabel>Geburtsdatum</FieldLabel>
                <DateField
                  label="Geburtstag oder ungefähres Datum"
                  value={form.birthDate}
                  onChange={(key) => update('birthDate', key)}
                />

                <FieldLabel>Kastriert / sterilisiert?</FieldLabel>
                <ChoiceChips
                  options={CASTRATION_OPTIONS}
                  value={form.castration}
                  onChange={(v) => update('castration', v)}
                />
                {showCastration ? (
                  <DateField
                    label="Datum des Eingriffs (optional)"
                    value={form.castrationDate}
                    onChange={(key) => update('castrationDate', key)}
                  />
                ) : null}

                <FieldLabel>Chip-Nummer (optional)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.chipNumber}
                  onChangeText={(t) => update('chipNumber', t)}
                  placeholder="15-stellige Transponder-Nummer"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  accessibilityLabel="Chip-Nummer"
                />
                {chipHint ? <Text style={styles.warnText}>{chipHint}</Text> : null}

                <FieldLabel>Fellfarbe / Zeichnung (optional)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.coatColor}
                  onChangeText={(t) => update('coatColor', t)}
                  placeholder="z. B. schwarz-weiß, getigert, dreifarbig"
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Fellfarbe oder Zeichnung"
                />
                <Hint>Erscheint auf dem Notfall-Pass – hilft, dein Tier eindeutig zu erkennen.</Hint>
              </>
            ) : null}
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Besonderheiten (optional)</FieldLabel>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.specialFeatures}
              onChangeText={(t) => update('specialFeatures', t)}
              placeholder="z. B. Allergien, Ängste, Eigenheiten – wichtig für Sitter und Tierarzt"
              placeholderTextColor={colors.textSecondary}
              multiline
              accessibilityLabel="Besonderheiten"
            />

            <FieldLabel>{speciesCfg?.terminology.vet ?? 'Tierarzt'} (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.vetName}
              onChangeText={(t) => update('vetName', t)}
              placeholder="Name der Praxis"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Tierarzt-Praxis"
            />
            <TextInput
              style={[styles.input, { marginTop: spacing.s }]}
              value={form.vetPhone}
              onChangeText={(t) => update('vetPhone', t)}
              placeholder="Telefonnummer"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              accessibilityLabel="Tierarzt-Telefonnummer"
            />
            <Hint>Die Nummer erscheint auch auf dem Notfall-Pass – im Ernstfall zählt jeder Griff.</Hint>

            <FieldLabel>Stamm-{speciesCfg?.terminology.vet ?? 'Tierarzt'} (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.practiceName}
              onChangeText={(t) => update('practiceName', t)}
              placeholder="Praxis, die dein Tier regelmäßig betreut"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Stammtierarzt-Praxis"
            />
            <TextInput
              style={[styles.input, { marginTop: spacing.s }]}
              value={form.practicePhone}
              onChangeText={(t) => update('practicePhone', t)}
              placeholder="Telefonnummer"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              accessibilityLabel="Stammtierarzt-Telefonnummer"
            />
            <Hint>
              Der Stamm-{speciesCfg?.terminology.vet ?? 'Tierarzt'} steht im Fußbereich des
              Notfall-Passes – zusätzlich zum Spezialisten oben.
            </Hint>

            <FieldLabel>Foto</FieldLabel>
            {form.photoUri ? (
              <View>
                <Image source={{ uri: form.photoUri }} style={styles.photo} />
                <View style={styles.photoActions}>
                  <Pressable style={styles.photoButton} onPress={() => pickPhoto(true)} accessibilityLabel="Neues Foto aufnehmen">
                    <Text style={styles.photoButtonText}>📷 Neues Foto</Text>
                  </Pressable>
                  <Pressable
                    style={styles.photoButton}
                    onPress={() => update('photoUri', null)}
                    accessibilityLabel="Foto entfernen"
                  >
                    <Text style={[styles.photoButtonText, { color: colors.signalRed }]}>Foto entfernen</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.photoActions}>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(true)} accessibilityLabel="Foto aufnehmen">
                  <Text style={styles.photoButtonText}>📷 Foto aufnehmen</Text>
                </Pressable>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(false)} accessibilityLabel="Aus Galerie wählen">
                  <Text style={styles.photoButtonText}>🖼 Aus Galerie</Text>
                </Pressable>
              </View>
            )}

            <FieldLabel>Farbe für dieses Tier</FieldLabel>
            <View style={styles.colorRow}>
              {petColorPalette.map((c) => (
                <Pressable
                  key={c.key}
                  accessibilityLabel={`Farbe ${c.label}`}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c.hex },
                    form.colorHex === c.hex && styles.colorDotActive,
                  ]}
                  onPress={() => update('colorHex', c.hex)}
                />
              ))}
            </View>
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} label="Änderungen speichern" />
        {!isDirty && !saved ? (
          <Text style={styles.footnote}>Noch keine Änderungen – bearbeite ein Feld, dann wird der Knopf aktiv.</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  landscapeColumns: { flexDirection: 'row', gap: spacing.xl },
  landscapeColumn: { flex: 1 },
  speciesNote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    lineHeight: 22,
  },
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
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  warnText: { fontSize: typography.bodySmall, color: colors.signalRed, marginTop: spacing.s, lineHeight: 22 },
  photo: { width: '100%', height: 180, borderRadius: 12, backgroundColor: colors.border },
  photoActions: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap', marginTop: spacing.s },
  photoButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  photoButtonText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  colorDot: { width: 44, height: 44, borderRadius: 22 },
  colorDotActive: { borderWidth: 4, borderColor: colors.textPrimary },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.m,
  },
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
