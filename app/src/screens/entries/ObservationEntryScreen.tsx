/**
 * simplyPet: Beobachtung notieren (Teilauftrag 4.2)
 * Quelle: Datenmodell 2.3 (health_records: 'Symptom' | 'Notiz' | 'Wasserwert'),
 * Screen-Flow 2.4 ("Symptom bzw. Notiz erfassen").
 *
 * Freitext-first: Das Beschreibungsfeld ist das Herzstueck – immer sichtbar,
 * ohne Zeichenlimit. Die Einordnung (Symptom oder Notiz) ist nur eine
 * Komfort-Zuordnung fuer die spaetere Filterbarkeit.
 *
 * Aquarium (isHabitat): Statt Symptom/Notiz bietet das Formular zusaetzlich
 * den Modus "Wasserwert" mit Messwert + Einheit (pH, Nitrit mg/l, ...) an –
 * artgerechte Terminologie gemaess Tierarten-Matrix.
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getDb, uuid } from '../../db/database';
import { getSpeciesConfig } from '../../config/species';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import DateField from '../../components/DateField';
import { PetPicker, FieldLabel, Hint, SaveButton, ChoiceChips } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { todayKey, nowUtcIso } from '../../time/timeModule';

interface ObservationDraft {
  petId: string | null;
  kind: 'Symptom' | 'Notiz' | 'Wasserwert';
  notes: string;
  dateKey: string;
  photoUri: string | null;
  // Nur fuer Wasserwert:
  waterParam: string | null;
  waterValueText: string;
}

const WATER_PARAMS = ['pH', 'Nitrit (mg/l)', 'Nitrat (mg/l)', 'Ammoniak (mg/l)', 'Temperatur (°C)', 'GH (°dH)', 'KH (°dH)'];

export default function ObservationEntryScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();

  const emptyForm = useMemo<ObservationDraft>(
    () => ({
      petId: presetPetId,
      kind: 'Symptom',
      notes: '',
      dateKey: todayKey(),
      photoUri: null,
      waterParam: null,
      waterValueText: '',
    }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<ObservationDraft>({
    draftKey: 'entry_observation',
    emptyForm,
    resumeDescription: 'Du hattest eine Beobachtung begonnen',
    isDirty: (f) => f.notes.trim().length > 0 || f.photoUri !== null || f.waterValueText.trim().length > 0,
  });

  const effectivePetId = form.petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === effectivePetId);
  const speciesCfg = pet ? getSpeciesConfig(pet.species) : undefined;
  const isHabitat = speciesCfg?.isHabitat === true;

  // Aquarium: Wasserwert als sinnvoller Standard-Modus.
  const kindOptions: ObservationDraft['kind'][] = isHabitat
    ? ['Wasserwert', 'Notiz']
    : ['Symptom', 'Notiz'];
  const effectiveKind = kindOptions.includes(form.kind) ? form.kind : kindOptions[0];
  const isWater = effectiveKind === 'Wasserwert';

  const parsedWaterValue = useMemo(() => {
    const t = form.waterValueText.trim().replace(',', '.');
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }, [form.waterValueText]);

  const canSave =
    effectivePetId !== null &&
    !saving &&
    !saved &&
    (isWater
      ? form.waterParam !== null && parsedWaterValue !== null
      : form.notes.trim().length > 0);

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
    if (!canSave || !effectivePetId) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        if (isWater) {
          await db.runAsync(
            `INSERT INTO health_records (id, pet_id, record_type, date, value, unit, notes, photo_uri, created_at, updated_at, is_synced)
             VALUES (?, ?, 'Wasserwert', ?, ?, ?, ?, ?, ?, ?, 0)`,
            [
              uuid(),
              effectivePetId,
              form.dateKey,
              parsedWaterValue,
              form.waterParam,
              form.notes.trim() || null,
              form.photoUri,
              ts,
              ts,
            ]
          );
        } else {
          await db.runAsync(
            `INSERT INTO health_records (id, pet_id, record_type, date, notes, photo_uri, created_at, updated_at, is_synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [uuid(), effectivePetId, effectiveKind, form.dateKey, form.notes.trim(), form.photoUri, ts, ts]
          );
        }
      },
      {
        title: 'Beobachtung gespeichert',
        message: isWater
          ? `Der Wasserwert für ${pet?.name ?? 'dein Becken'} ist festgehalten.`
          : `Die Beobachtung für ${pet?.name ?? 'dein Tier'} ist im Verlauf festgehalten – hilfreich für den nächsten ${speciesCfg?.terminology.vet ?? 'Tierarzt'}-Besuch.`,
      }
    );
  }

  if (loaded && pets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lege zuerst ein Tier an – danach kannst du Beobachtungen festhalten.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <PetPicker pets={pets} selectedId={effectivePetId} onSelect={(id) => update('petId', id)} />

        <FieldLabel>Art der Beobachtung</FieldLabel>
        <ChoiceChips
          options={kindOptions}
          value={effectiveKind}
          onChange={(v) => update('kind', (v as ObservationDraft['kind']) ?? kindOptions[0])}
          allowDeselect={false}
        />

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            {isWater ? (
              <>
                <FieldLabel>Welcher Wert?</FieldLabel>
                <ChoiceChips
                  options={WATER_PARAMS}
                  value={form.waterParam}
                  onChange={(v) => update('waterParam', v)}
                />
                <FieldLabel>Messwert</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.waterValueText}
                  onChangeText={(t) => update('waterValueText', t)}
                  placeholder="z. B. 7,2"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  accessibilityLabel="Messwert"
                />
              </>
            ) : null}

            <FieldLabel>{isWater ? 'Notiz zur Messung (optional)' : 'Was hast du beobachtet?'}</FieldLabel>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={form.notes}
              onChangeText={(t) => update('notes', t)}
              placeholder={
                isWater
                  ? 'z. B. nach Teilwasserwechsel gemessen'
                  : 'Beschreibe frei, was dir aufgefallen ist – z. B. „humpelt seit gestern hinten links“'
              }
              placeholderTextColor={colors.textSecondary}
              multiline
              accessibilityLabel="Beschreibung der Beobachtung"
            />
            {!isWater ? (
              <Hint>Deine Worte zählen – je genauer die Beschreibung, desto wertvoller ist sie später beim {speciesCfg?.terminology.vet ?? 'Tierarzt'}.</Hint>
            ) : null}
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Wann war das?</FieldLabel>
            <DateField
              label="Datum der Beobachtung"
              value={form.dateKey}
              onChange={(key) => update('dateKey', key)}
              hint="Auch Vergangenes kannst du nachtragen – es sortiert sich automatisch richtig ein."
            />

            <FieldLabel>Foto (optional)</FieldLabel>
            {form.photoUri ? (
              <View>
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
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(true)} accessibilityLabel="Foto aufnehmen">
                  <Text style={styles.photoButtonText}>📷 Foto aufnehmen</Text>
                </Pressable>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(false)} accessibilityLabel="Aus Galerie wählen">
                  <Text style={styles.photoButtonText}>🖼 Aus Galerie</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} />
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
  notesInput: { minHeight: 140, textAlignVertical: 'top' },
  photo: { width: '100%', height: 180, borderRadius: 12, backgroundColor: colors.border },
  photoRemove: { marginTop: spacing.s, minHeight: minTouchTarget - 8, justifyContent: 'center' },
  photoRemoveText: { fontSize: typography.bodySmall, color: colors.signalRed },
  photoButtons: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
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
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
