/**
 * simplyPet: Kotprobe erfassen (E-80 / v0.1.5)
 * Quelle: Datenmodell Migration 005 (health_records: record_type = 'Kotprobe',
 * epg_value = Eier pro Gramm).
 *
 * Nur fuer Pferde sichtbar (selektive Entwurmung). Der EpG-Wert (Eier pro
 * Gramm) ist das Ergebnis einer Kotuntersuchung durch das Labor und bestimmt,
 * ob eine Entwurmung noetig ist.
 *
 * Grobe Orientierung (KEIN medizinischer Rat – nur zur Einordnung):
 * - < 200 EpG: gering
 * - 200–500 EpG: mittel
 * - > 500 EpG: hoch
 * Die App gibt KEINE medizinischen Warnhinweise (Doktrin).
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { getDb, uuid } from '../../db/database';
import { getSpeciesConfig } from '../../config/species';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import DateField from '../../components/DateField';
import { PetPicker, FieldLabel, Hint, SaveButton } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { todayKey, nowUtcIso } from '../../time/timeModule';

interface FecalDraft {
  petId: string | null;
  epgText: string;
  notes: string;
  dateKey: string;
}

export default function FecalSampleEntryScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();

  // Nur Pferde anzeigen (Kotprobe ist pferdespezifisch)
  const horsePets = useMemo(() => pets.filter((p) => p.species === 'pferd'), [pets]);

  const emptyForm = useMemo<FecalDraft>(
    () => ({
      petId: presetPetId,
      epgText: '',
      notes: '',
      dateKey: todayKey(),
    }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<FecalDraft>({
    draftKey: 'entry_fecal_sample',
    emptyForm,
    resumeDescription: 'Du hattest eine Kotprobe begonnen',
    isDirty: (f) => f.epgText.trim().length > 0 || f.notes.trim().length > 0,
  });

  const effectivePetId = form.petId ?? (horsePets.length === 1 ? horsePets[0].id : null);
  const pet = horsePets.find((p) => p.id === effectivePetId);

  const parsedEpg = useMemo(() => {
    const t = form.epgText.trim().replace(',', '.');
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
  }, [form.epgText]);

  const canSave = effectivePetId !== null && !saving && !saved && parsedEpg !== null;

  async function save() {
    if (!canSave || !effectivePetId) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        await db.runAsync(
          `INSERT INTO health_records (id, pet_id, record_type, date, epg_value, notes, created_at, updated_at, is_synced)
           VALUES (?, ?, 'Kotprobe', ?, ?, ?, ?, ?, 0)`,
          [
            uuid(),
            effectivePetId,
            form.dateKey,
            parsedEpg,
            form.notes.trim() || null,
            ts,
            ts,
          ]
        );
      },
      {
        title: 'Kotprobe gespeichert',
        message: `Das Ergebnis (${parsedEpg} EpG) für ${pet?.name ?? 'dein Pferd'} ist im Verlauf festgehalten.`,
      }
    );
  }

  if (loaded && horsePets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>
          Kotproben sind aktuell nur für Pferde verfügbar (selektive Entwurmung).
          {'\n\n'}Lege zuerst ein Pferd an, um Kotproben-Ergebnisse zu erfassen.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <PetPicker pets={horsePets} selectedId={effectivePetId} onSelect={(id) => update('petId', id)} />

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>EpG-Wert (Eier pro Gramm)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.epgText}
              onChangeText={(t) => update('epgText', t)}
              placeholder="z. B. 350"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              accessibilityLabel="EpG-Wert"
            />
            <Hint>
              Der EpG-Wert steht auf dem Laborbefund deiner Kotuntersuchung. Er zeigt die Anzahl
              der Wurmeier pro Gramm Kot und hilft bei der Entscheidung zur selektiven Entwurmung.
            </Hint>

            <FieldLabel>Notiz (optional)</FieldLabel>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={form.notes}
              onChangeText={(t) => update('notes', t)}
              placeholder="z. B. Labor XY, Strongyliden nachgewiesen"
              placeholderTextColor={colors.textSecondary}
              multiline
              accessibilityLabel="Notiz zur Kotprobe"
            />
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Datum der Probenentnahme</FieldLabel>
            <DateField
              label="Wann wurde die Probe genommen?"
              value={form.dateKey}
              onChange={(key) => update('dateKey', key)}
              hint="Auch ältere Ergebnisse kannst du nachtragen."
            />
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
  notesInput: { minHeight: 100, textAlignVertical: 'top' },
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
