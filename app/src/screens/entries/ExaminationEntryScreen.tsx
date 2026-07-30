/**
 * simplyPet: Untersuchungsergebnis eintragen (E-99)
 * Quelle: Impfpass-Analyse 20.07.2026 – Sektion "Ergebnisse weiterführender Untersuchungen".
 *
 * Felder: Art der Untersuchung (Freitext), Ergebnis/Befund (Freitext, multiline),
 * Datum, optional Foto/Scan des Befunds. Für alle Tierarten verfügbar.
 * Wird in health_records gespeichert mit record_type = 'Untersuchung'.
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { getDb, uuid } from '../../db/database';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import DateField from '../../components/DateField';
import { PetPicker, FieldLabel, Hint, SaveButton } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { todayKey, nowUtcIso } from '../../time/timeModule';
import ScreenBackground from '../../components/ScreenBackground';

interface ExaminationDraft {
  petId: string | null;
  examType: string;
  result: string;
  datePerformed: string;
  photoUri: string | null;
}

export default function ExaminationEntryScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();

  const emptyForm = useMemo<ExaminationDraft>(
    () => ({
      petId: presetPetId,
      examType: '',
      result: '',
      datePerformed: todayKey(),
      photoUri: null,
    }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<ExaminationDraft>({
    draftKey: 'entry_examination',
    emptyForm,
    resumeDescription: 'Du hattest ein Untersuchungsergebnis begonnen',
    isDirty: (f) => f.examType.trim().length > 0 || f.result.trim().length > 0,
  });

  const effectivePetId = form.petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === effectivePetId);
  const canSave = effectivePetId !== null && form.examType.trim().length > 0 && !saving && !saved;

  async function attachPhoto() {
    const { pickFromGallery } = require('../../utils/imagePicker');
    const result = await pickFromGallery();
    if (!result.cancelled) update('photoUri', result.uri);
  }

  async function takePhoto() {
    const { takePhoto: capture } = require('../../utils/imagePicker');
    const result = await capture();
    if (!result.cancelled) update('photoUri', result.uri);
  }

  async function save() {
    if (!canSave || !effectivePetId) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        await db.runAsync(
          `INSERT INTO health_records (id, pet_id, record_type, date, notes, photo_uri, created_at, updated_at, is_synced)
           VALUES (?, ?, 'Untersuchung', ?, ?, ?, ?, ?, 0)`,
          [
            uuid(),
            effectivePetId,
            form.datePerformed,
            `${form.examType.trim()}: ${form.result.trim()}`,
            form.photoUri,
            ts,
            ts,
          ]
        );
      },
      {
        title: 'Ergebnis gespeichert',
        message: `Das Untersuchungsergebnis liegt in der Akte von ${pet?.name ?? 'deinem Tier'}.`,
      }
    );
  }

  if (loaded && pets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lege zuerst ein Tier an – danach kannst du Untersuchungsergebnisse festhalten.</Text>
      </View>
    );
  }

  return (
    <ScreenBackground>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <PetPicker pets={pets} selectedId={effectivePetId} onSelect={(id) => update('petId', id)} />

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Art der Untersuchung</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.examType}
              onChangeText={(t) => update('examType', t)}
              placeholder="z. B. Blutbild, Ultraschall, Röntgen"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Art der Untersuchung"
            />

            <FieldLabel>Ergebnis / Befund (optional)</FieldLabel>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.result}
              onChangeText={(t) => update('result', t)}
              placeholder="Befund in eigenen Worten oder vom Laborbericht abtippen"
              placeholderTextColor={colors.textSecondary}
              multiline
              accessibilityLabel="Ergebnis oder Befund"
            />
            <Hint>Hilfreich für den nächsten Tierarztbesuch – du hast alles auf einen Blick.</Hint>
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Datum der Untersuchung</FieldLabel>
            <DateField
              label="Wann wurde untersucht?"
              value={form.datePerformed}
              onChange={(key) => update('datePerformed', key)}
            />

            <FieldLabel>Befund-Foto (optional)</FieldLabel>
            {form.photoUri ? (
              <View>
                <Image source={{ uri: form.photoUri }} style={styles.photo} resizeMode="cover" />
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
                <Pressable style={styles.photoButton} onPress={takePhoto} accessibilityLabel="Befund fotografieren">
                  <Text style={styles.photoButtonText}>📷 Fotografieren</Text>
                </Pressable>
                <Pressable style={styles.photoButton} onPress={attachPhoto} accessibilityLabel="Aus Galerie wählen">
                  <Text style={styles.photoButtonText}>🖼 Galerie</Text>
                </Pressable>
              </View>
            )}
            <Hint>Foto vom Laborbericht oder Befundblatt – bleibt lokal auf deinem Gerät.</Hint>
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
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
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  photo: { width: '100%', height: 200, borderRadius: 12, backgroundColor: colors.border },
  photoRemove: { marginTop: spacing.s, minHeight: minTouchTarget - 8, justifyContent: 'center' },
  photoRemoveText: { fontSize: typography.bodySmall, color: colors.signalRed },
  photoButtons: { flexDirection: 'row', gap: spacing.s },
  photoButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: { fontSize: typography.body, color: colors.textPrimary },
  emptyWrap: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
