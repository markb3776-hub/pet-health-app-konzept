/**
 * simplyPet: Gewicht festhalten (Teilauftrag 4.2)
 * Quelle: Datenmodell 2.3 (health_records, record_type 'Gewicht'),
 * Screen-Flow 1.2 (Datums-Regeln: Kalender-Picker, rueckdatierbar, Zukunft gesperrt).
 *
 * Artgerecht: Der plausible Gewichtsbereich der Tierart (species.weightRangeKg)
 * erzeugt einen ehrlichen WARNHINWEIS bei unplausiblen Werten – blockiert aber
 * nie (der Nutzer kennt sein Tier besser als die App). Fuer Tierarten ohne
 * Gewichts-Tracking (Pferd, Aquarium) bietet das Formular die Einheit frei an
 * bzw. wird gar nicht angeboten (CaptureSheet zeigt fuer Aquarium "Wasserwert").
 */
import React, { useMemo, useState } from 'react';
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
import ScreenBackground from '../../components/ScreenBackground';

interface WeightDraft {
  petId: string | null;
  valueText: string;
  dateKey: string;
  notes: string;
}

export default function WeightEntryScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();

  const emptyForm = useMemo<WeightDraft>(
    () => ({ petId: presetPetId, valueText: '', dateKey: todayKey(), notes: '' }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<WeightDraft>({
    draftKey: 'entry_weight',
    emptyForm,
    resumeDescription: 'Du hattest einen Gewichts-Eintrag begonnen',
    isDirty: (f) => f.valueText.trim().length > 0 || f.notes.trim().length > 0,
  });

  // Ein Tier: automatisch zuordnen (kein Extra-Schritt).
  const effectivePetId = form.petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === effectivePetId);
  const speciesCfg = pet ? getSpeciesConfig(pet.species) : undefined;

  // Deutsches Dezimalkomma akzeptieren ("4,2" -> 4.2).
  const parsedKg = useMemo(() => {
    const t = form.valueText.trim().replace(',', '.');
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [form.valueText]);

  // Ehrlicher Plausibilitaets-HINWEIS (nie ein Blocker).
  const plausibility = useMemo(() => {
    if (parsedKg === null || !speciesCfg?.weightRangeKg) return null;
    const [min, max] = speciesCfg.weightRangeKg;
    if (parsedKg < min || parsedKg > max) {
      return `Hinweis: ${form.valueText.trim()} kg ist für ${speciesCfg.label} ungewöhnlich (üblich: ${min}–${max} kg). Prüfe, ob du dich vertippt hast – speichern kannst du trotzdem.`;
    }
    return null;
  }, [parsedKg, speciesCfg, form.valueText]);

  const canSave = effectivePetId !== null && parsedKg !== null && !saving && !saved;

  async function save() {
    if (!canSave || !effectivePetId || parsedKg === null) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        await db.runAsync(
          `INSERT INTO health_records (id, pet_id, record_type, date, value, unit, notes, created_at, updated_at, is_synced)
           VALUES (?, ?, 'Gewicht', ?, ?, 'kg', ?, ?, ?, 0)`,
          [uuid(), effectivePetId, form.dateKey, parsedKg, form.notes.trim() || null, ts, ts]
        );
      },
      {
        title: 'Gewicht gespeichert',
        message: `${form.valueText.trim().replace('.', ',')} kg für ${pet?.name ?? 'dein Tier'} ist festgehalten.`,
      }
    );
  }

  if (loaded && pets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lege zuerst ein Tier an – danach kannst du Gewichte festhalten.</Text>
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
            <FieldLabel>Gewicht in kg</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.valueText}
              onChangeText={(t) => update('valueText', t)}
              placeholder="z. B. 4,2"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              accessibilityLabel="Gewicht in Kilogramm"
            />
            {plausibility ? <Text style={styles.warnText}>{plausibility}</Text> : null}
            <Hint>Ein Wert genügt – die Verlaufskurve entsteht mit der Zeit von selbst.</Hint>
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Wann gewogen?</FieldLabel>
            <DateField
              label="Datum des Wiegens"
              value={form.dateKey}
              onChange={(key) => update('dateKey', key)}
              hint="Auch ältere Werte kannst du nachtragen – sie sortieren sich automatisch richtig ein."
            />

            <FieldLabel>Notiz (optional)</FieldLabel>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={form.notes}
              onChangeText={(t) => update('notes', t)}
              placeholder="z. B. nach dem Fressen gewogen"
              placeholderTextColor={colors.textSecondary}
              multiline
              accessibilityLabel="Notiz zum Gewichts-Eintrag"
            />
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
  notesInput: { minHeight: 96, textAlignVertical: 'top' },
  warnText: {
    fontSize: typography.bodySmall,
    color: colors.signalRed,
    marginTop: spacing.s,
    lineHeight: 22,
  },
  emptyWrap: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
