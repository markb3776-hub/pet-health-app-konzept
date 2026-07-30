/**
 * simplyPet: Medikament / Pflege / Vorerkrankung anlegen (Teilauftrag 4.2)
 * Quelle: Datenmodell 2.5 (medications) + 2.7 (reminders, Saisonfenster).
 *
 * - Typen: Medikament, Pflege, Vorerkrankung, Allergie.
 * - Uhrzeit NUR bei mehrmals taeglicher Dosierung (Screen-Flow 1.2, Regel 5):
 *   times_per_day > 1 blendet die Uhrzeitfelder ein (Morgen-/Abendgabe).
 * - Pflege-Typ: artgerechte Vorschlagsliste (tierarten_abdeckung_festlegungen.md §2),
 *   optionales Saisonfenster (z. B. April-September) + Hinweistext ("Bei Sonnenschein").
 * - Taegliche Erinnerung optional: entsteht atomar in derselben Transaktion.
 */
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { getDb, uuid } from '../../db/database';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import DateField from '../../components/DateField';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PetPicker, FieldLabel, Hint, SaveButton, ChoiceChips } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { todayKey, nowUtcIso } from '../../time/timeModule';
import {
  scheduleDailyNotification,
  buildReminderBody,
} from '../../services/notificationService';

const MED_TYPES = ['Medikament', 'Pflege', 'Parasitenschutz', 'Vorerkrankung', 'Allergie'];
const PARASIT_SUB_TYPES = ['Spot-On', 'Halsband', 'Tablette', 'Sonstiges'];

/** Artgerechte Pflege-Vorschlaege (tierarten_abdeckung_festlegungen.md §2). */
const CARE_SUGGESTIONS: Record<string, string[]> = {
  hund: ['Krallen schneiden', 'Zahnpflege', 'Fellpflege', 'Pfotenpflege (Winter/Streusalz)'],
  katze: ['Ohren eincremen (Sonnenschutz)', 'Fellpflege Langhaar', 'Krallen schneiden'],
  kaninchen: ['Krallen schneiden', 'Zahnkontrolle', 'Gewichtskontrolle wöchentlich', 'Po-Kontrolle (Fliegenmaden, Sommer)'],
  meerschweinchen: ['Krallen schneiden', 'Zahnkontrolle', 'Gewichtskontrolle wöchentlich', 'Po-Kontrolle (Fliegenmaden, Sommer)'],
  chinchilla: ['Sandbad wechseln', 'Zahnkontrolle', 'Krallen schneiden'],
  degu: ['Sandbad wechseln', 'Zahnkontrolle', 'Krallen schneiden'],
  ratte: ['Käfigreinigung', 'Zahnkontrolle', 'Gewichtskontrolle'],
  maus: ['Käfigreinigung', 'Zahnkontrolle', 'Gewichtskontrolle'],
  hamster: ['Käfigreinigung', 'Zahnkontrolle', 'Gewichtskontrolle'],
  frettchen: ['Krallen schneiden', 'Ohrenreinigung'],
  vogel: ['Krallen-/Schnabelkontrolle', 'Käfig-/Volierenreinigung', 'Bade-/Sprühgelegenheit'],
  reptil: ['UV-Lampen-Wechsel', 'Terrarienreinigung', 'Häutungskontrolle', 'Wasserbecken reinigen'],
  pferd: ['Hufschmied (alle 6–8 Wochen)', 'Fellwechsel-Pflege', 'Equidenpass-Kontrolle'],
  aquarium: ['Teilwasserwechsel (wöchentlich)', 'Filterreinigung', 'Wasserwerte messen', 'Scheiben reinigen'],
};

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

/** Einfache Uhrzeit-Pruefung HH:MM (24h). */
function isValidTime(t: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(t.trim());
}

interface MedicationDraft {
  petId: string | null;
  medType: string;
  subType: string | null;
  name: string;
  dosage: string;
  timesPerDay: number;
  doseTimes: string[];
  activeSince: string | null;
  hintText: string;
  createDailyReminder: boolean;
  reminderHour: number;
  reminderMinute: number;
  seasonStart: number | null; // Monat 1-12
  seasonEnd: number | null;
}

export default function MedicationEntryScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const emptyForm = useMemo<MedicationDraft>(
    () => ({
      petId: presetPetId,
      medType: 'Medikament',
      subType: null,
      name: '',
      dosage: '',
      timesPerDay: 1,
      doseTimes: [],
      activeSince: todayKey(),
      hintText: '',
      createDailyReminder: false,
      reminderHour: 9,
      reminderMinute: 0,
      seasonStart: null,
      seasonEnd: null,
    }),
    [presetPetId]
  );

  const { form, update, setForm, saving, saved, runSave } = useEntryForm<MedicationDraft>({
    draftKey: 'entry_medication',
    emptyForm,
    resumeDescription: 'Du hattest einen Medikamenten- oder Pflege-Eintrag begonnen',
    isDirty: (f) => f.name.trim().length > 0 || f.dosage.trim().length > 0,
  });

  const effectivePetId = form.petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === effectivePetId);
  const isCare = form.medType === 'Pflege';
  const isParasit = form.medType === 'Parasitenschutz';
  const isCondition = form.medType === 'Vorerkrankung' || form.medType === 'Allergie';
  const suggestions = isCare && pet ? CARE_SUGGESTIONS[pet.species] ?? [] : [];

  // Uhrzeit NUR bei Mehrfach-Dosierung (Screen-Flow 1.2, Regel 5).
  const showDoseTimes = !isCondition && form.timesPerDay > 1;
  const doseTimesValid =
    !showDoseTimes ||
    form.doseTimes.slice(0, form.timesPerDay).every((t) => t.trim() === '' || isValidTime(t));

  const canSave = effectivePetId !== null && form.name.trim().length > 0 && doseTimesValid && !saving && !saved;

  function setTimesPerDay(n: number) {
    setForm((prev) => ({
      ...prev,
      timesPerDay: n,
      doseTimes: Array.from({ length: n > 1 ? n : 0 }, (_, i) => prev.doseTimes[i] ?? ''),
    }));
  }

  function setDoseTime(index: number, value: string) {
    setForm((prev) => {
      const next = [...prev.doseTimes];
      next[index] = value;
      return { ...prev, doseTimes: next };
    });
  }

  async function save() {
    if (!canSave || !effectivePetId) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        const medId = uuid();
        const cleanTimes = showDoseTimes
          ? form.doseTimes.slice(0, form.timesPerDay).map((t) => t.trim()).filter((t) => isValidTime(t))
          : [];
        await db.withTransactionAsync(async () => {
          await db.runAsync(
            `INSERT INTO medications (id, pet_id, type, sub_type, name, dosage, times_per_day, dose_times, hint_text, active_since, is_active, created_at, updated_at, is_synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 0)`,
            [
              medId,
              effectivePetId,
              form.medType,
              form.subType || null,
              form.name.trim(),
              form.dosage.trim() || null,
              isCondition ? 1 : form.timesPerDay,
              cleanTimes.length > 0 ? JSON.stringify(cleanTimes) : null,
              form.hintText.trim() || null,
              form.activeSince,
              ts,
              ts,
            ]
          );
          // Optionale taegliche Erinnerung – atomar mitgespeichert (E-114: mit waehlbarer Uhrzeit).
          if (form.createDailyReminder && !isCondition) {
            const reminderId = uuid();
            const reminderTitle = `${form.name.trim()}${form.dosage.trim() ? ` (${form.dosage.trim()})` : ''}`;
            const dueDate = todayKey();
            await db.runAsync(
              `INSERT INTO reminders (id, pet_id, title, due_date, status, source_type, source_id, repeat_rule, season_start, season_end, hint_text, reminder_active, reminder_offset_days, reminder_hour, reminder_minute, created_at, updated_at, is_synced)
               VALUES (?, ?, ?, ?, 'Offen', 'medikament', ?, 'taeglich', ?, ?, ?, 1, 0, ?, ?, ?, ?, 0)`,
              [
                reminderId,
                effectivePetId,
                reminderTitle,
                dueDate,
                medId,
                form.seasonStart,
                form.seasonEnd,
                form.hintText.trim() || null,
                form.reminderHour,
                form.reminderMinute,
                ts,
                ts,
              ]
            );
            // DailyTrigger: feuert jeden Tag zur gewaehlten Uhrzeit (E-123)
            await scheduleDailyNotification(
              reminderId,
              reminderTitle,
              buildReminderBody(pet?.name ?? 'Dein Tier', dueDate, 0),
              form.reminderHour,
              form.reminderMinute
            );
          }
        });
      },
      {
        title: 'Gespeichert',
        message:
          form.createDailyReminder && !isCondition
            ? `${form.name.trim()} ist für ${pet?.name ?? 'dein Tier'} angelegt. Die tägliche Erinnerung ist aktiv${form.seasonStart ? ' (im gewählten Saisonfenster)' : ''}.`
            : `${form.name.trim()} ist für ${pet?.name ?? 'dein Tier'} in der Akte festgehalten.`,
      }
    );
  }

  if (loaded && pets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lege zuerst ein Tier an – danach kannst du Medikamente und Pflege-Aufgaben anlegen.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <PetPicker pets={pets} selectedId={effectivePetId} onSelect={(id) => update('petId', id)} />

        <FieldLabel>Was möchtest du anlegen?</FieldLabel>
        <ChoiceChips
          options={MED_TYPES}
          value={form.medType}
          onChange={(v) => update('medType', v ?? 'Medikament')}
          allowDeselect={false}
        />

        {isParasit ? (
          <>
            <FieldLabel>Art des Parasitenschutzes</FieldLabel>
            <ChoiceChips
              options={PARASIT_SUB_TYPES}
              value={form.subType}
              onChange={(v) => update('subType', v ?? null)}
              allowDeselect
            />
          </>
        ) : null}

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>
              {isCare ? 'Welche Pflege-Aufgabe?' : isCondition ? `Welche ${form.medType}?` : isParasit ? 'Produktname' : 'Name des Medikaments'}
            </FieldLabel>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(t) => update('name', t)}
              placeholder={
                isCare
                  ? 'z. B. Ohren eincremen (Sonnenschutz)'
                  : isCondition
                    ? form.medType === 'Allergie'
                      ? 'z. B. Futtermilben'
                      : 'z. B. Niereninsuffizienz'
                    : 'z. B. Thyronorm'
              }
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Name"
            />
            {suggestions.length > 0 ? (
              <View style={styles.suggestionWrap}>
                <Text style={styles.suggestionTitle}>Typisch für {pet ? pet.name : 'dein Tier'}:</Text>
                <View style={styles.suggestionRow}>
                  {suggestions.map((s) => (
                    <Pressable
                      key={s}
                      style={styles.suggestionChip}
                      onPress={() => update('name', s)}
                      accessibilityLabel={`Vorschlag ${s}`}
                    >
                      <Text style={styles.suggestionText}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {!isCondition ? (
              <>
                <FieldLabel>Dosierung / Anleitung (optional)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.dosage}
                  onChangeText={(t) => update('dosage', t)}
                  placeholder={isCare ? 'z. B. dünn auf beide Ohren' : 'z. B. ½ Tablette abends'}
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Dosierung"
                />

                <FieldLabel>Wie oft am Tag?</FieldLabel>
                <ChoiceChips
                  options={['1×', '2×', '3×']}
                  value={`${form.timesPerDay}×`}
                  onChange={(v) => setTimesPerDay(v ? parseInt(v, 10) : 1)}
                  allowDeselect={false}
                />
                {showDoseTimes ? (
                  <>
                    <Hint>
                      Bei mehreren Gaben am Tag helfen Uhrzeiten, Morgen- und Abendgabe zu unterscheiden –
                      auch für den Sitter später wichtig.
                    </Hint>
                    {Array.from({ length: form.timesPerDay }).map((_, i) => (
                      <TextInput
                        key={i}
                        style={[styles.input, styles.timeInput]}
                        value={form.doseTimes[i] ?? ''}
                        onChangeText={(t) => setDoseTime(i, t)}
                        placeholder={i === 0 ? 'z. B. 07:00' : i === 1 ? 'z. B. 19:00' : 'z. B. 13:00'}
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numbers-and-punctuation"
                        accessibilityLabel={`Uhrzeit der ${i + 1}. Gabe`}
                      />
                    ))}
                    {!doseTimesValid ? (
                      <Text style={styles.warnText}>Bitte Uhrzeiten im Format HH:MM angeben (z. B. 07:00).</Text>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Seit wann {isCondition ? 'bekannt' : 'aktiv'}? (optional)</FieldLabel>
            <DateField
              label="Datum"
              value={form.activeSince}
              onChange={(key) => update('activeSince', key)}
            />

            {!isCondition ? (
              <>
                <FieldLabel>Hinweistext (optional)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.hintText}
                  onChangeText={(t) => update('hintText', t)}
                  placeholder="z. B. Bei Sonnenschein"
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Hinweistext für die Erinnerung"
                />

                <FieldLabel>Tägliche Erinnerung?</FieldLabel>
                <ChoiceChips
                  options={['Ja', 'Nein']}
                  value={form.createDailyReminder ? 'Ja' : 'Nein'}
                  onChange={(v) => update('createDailyReminder', v === 'Ja')}
                  allowDeselect={false}
                />

                {form.createDailyReminder ? (
                  <>
                    <FieldLabel>Uhrzeit der Erinnerung</FieldLabel>
                    <Pressable
                      style={styles.timePickerButton}
                      onPress={() => setShowTimePicker(true)}
                      accessibilityLabel="Erinnerungszeit w\u00e4hlen"
                    >
                      <Text style={styles.timePickerText}>
                        {String(form.reminderHour).padStart(2, '0')}:{String(form.reminderMinute).padStart(2, '0')} Uhr
                      </Text>
                      <Text style={styles.timePickerHint}>Tippe zum \u00c4ndern</Text>
                    </Pressable>
                    {showTimePicker ? (
                      <DateTimePicker
                        value={(() => { const d = new Date(); d.setHours(form.reminderHour, form.reminderMinute, 0, 0); return d; })()}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={(_e: any, selected?: Date) => {
                          setShowTimePicker(false);
                          if (selected) {
                            setForm((prev) => ({ ...prev, reminderHour: selected.getHours(), reminderMinute: selected.getMinutes() }));
                          }
                        }}
                      />
                    ) : null}

                    <FieldLabel>Nur in bestimmten Monaten? (optional)</FieldLabel>
                    <Hint>
                      Beispiel: Sonnenschutz nur April–September. Tippe Start- und End-Monat an; ohne
                      Auswahl gilt die Erinnerung das ganze Jahr.
                    </Hint>
                    <View style={styles.monthRow}>
                      {MONTHS.map((m, i) => {
                        const monthNum = i + 1;
                        const isStart = form.seasonStart === monthNum;
                        const isEnd = form.seasonEnd === monthNum;
                        const inRange =
                          form.seasonStart !== null &&
                          form.seasonEnd !== null &&
                          (form.seasonStart <= form.seasonEnd
                            ? monthNum >= form.seasonStart && monthNum <= form.seasonEnd
                            : monthNum >= form.seasonStart || monthNum <= form.seasonEnd);
                        return (
                          <Pressable
                            key={m}
                            style={[styles.monthChip, (isStart || isEnd) && styles.monthChipActive, inRange && !isStart && !isEnd && styles.monthChipRange]}
                            onPress={() => {
                              // Erste Auswahl = Start, zweite = Ende, dritte = zuruecksetzen.
                              if (form.seasonStart === null || (form.seasonStart !== null && form.seasonEnd !== null)) {
                                setForm((prev) => ({ ...prev, seasonStart: monthNum, seasonEnd: null }));
                              } else {
                                update('seasonEnd', monthNum);
                              }
                            }}
                            accessibilityLabel={`Monat ${m}`}
                          >
                            <Text style={[styles.monthText, (isStart || isEnd || inRange) && styles.monthTextActive]}>{m}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    {form.seasonStart !== null && form.seasonEnd === null ? (
                      <Text style={styles.hintSmall}>Tippe jetzt den End-Monat an.</Text>
                    ) : null}
                    {form.seasonStart !== null && form.seasonEnd !== null ? (
                      <Pressable
                        onPress={() => setForm((prev) => ({ ...prev, seasonStart: null, seasonEnd: null }))}
                        style={styles.clearSeason}
                        accessibilityLabel="Saisonfenster entfernen"
                      >
                        <Text style={styles.clearSeasonText}>Saisonfenster entfernen (ganzjährig)</Text>
                      </Pressable>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}
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
  timeInput: { marginTop: spacing.s },
  warnText: { fontSize: typography.bodySmall, color: colors.signalRed, marginTop: spacing.s },
  suggestionWrap: { marginTop: spacing.s },
  suggestionTitle: { fontSize: typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  suggestionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  suggestionChip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 12,
    justifyContent: 'center',
  },
  suggestionText: { fontSize: typography.bodySmall, color: colors.primary },
  monthRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.s },
  monthChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.s,
    minHeight: minTouchTarget - 8,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  monthChipRange: { backgroundColor: '#DCE8DF', borderColor: colors.primary },
  monthText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  monthTextActive: { color: '#1E3A28', fontWeight: '600' },
  hintSmall: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  clearSeason: { marginTop: spacing.s, minHeight: minTouchTarget - 12, justifyContent: 'center' },
  clearSeasonText: { fontSize: typography.bodySmall, color: colors.signalRed },
  timePickerButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerText: { fontSize: typography.body, color: colors.textPrimary, fontWeight: '600' },
  timePickerHint: { fontSize: typography.bodySmall, color: colors.textSecondary },
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
