/**
 * simplyPet: Datumsfeld (einheitlich fuer alle Formulare)
 * Quelle: technische_spezifikation_screen_flow.md (Abschnitt 1.2)
 *
 * Verbindliche Regeln:
 * - Eingabe AUSSCHLIESSLICH ueber den nativen Kalender-Picker, kein Freitext.
 * - Schnellwahl-Chips kontextabhaengig: Vergangenheit (Heute/Gestern/Vorgestern)
 *   oder Zukunft (Heute/In 1 Woche/In 2 Wochen) je nach allowFuture.
 * - Anzeigeformat immer TT.MM.JJJJ.
 * - Rueckdatierung ohne harte Grenze; Zukunft gesperrt (ausser bei Terminen,
 *   dann allowFuture=true).
 *
 * Korrektur aus Nutzertest (10.07.2026): Die Jahr-Aenderung war im
 * System-Kalender schwer zu entdecken (kleine Jahreszahl im Dialog-Kopf).
 * Deshalb gibt es jetzt einen SICHTBAREN "Jahr"-Knopf direkt neben dem
 * Kalender-Knopf: Er oeffnet eine grosse, scrollbare Jahresliste. Nach der
 * Jahr-Wahl oeffnet sich der Kalender direkt im gewaehlten Jahr, sodass nur
 * noch Monat und Tag angetippt werden muessen (wichtig fuer Geburtsdaten
 * aelterer Tiere).
 */
import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Modal, FlatList, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  dateKeyToDate,
  dateKeyWithOffset,
  formatDate,
  now,
  toLocalDateKey,
} from '../time/timeModule';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

interface DateFieldProps {
  label: string;
  /** Datums-Schluessel "JJJJ-MM-TT" oder null (kein Datum gewaehlt). */
  value: string | null;
  onChange: (dateKey: string) => void;
  /** Zukunftsdaten erlauben? Nur fuer geplante Termine true. */
  allowFuture?: boolean;
  /** Optionaler Zusatz unter dem Feld. */
  hint?: string;
}

const PAST_CHIPS: { label: string; offset: number }[] = [
  { label: 'Heute', offset: 0 },
  { label: 'Gestern', offset: -1 },
  { label: 'Vorgestern', offset: -2 },
];

const FUTURE_CHIPS: { label: string; offset: number }[] = [
  { label: 'Heute', offset: 0 },
  { label: 'In 1 Woche', offset: 7 },
  { label: 'In 2 Wochen', offset: 14 },
];

/** Wie viele Jahre rueckwirkend die Jahresliste anbietet (Schildkroeten & Co.). */
const YEARS_BACK = 80;
/** Wie viele Jahre in die Zukunft (nur wenn allowFuture, z. B. Impf-Gueltigkeit). */
const YEARS_FORWARD = 10;

export default function DateField({ label, value, onChange, allowFuture = false, hint }: DateFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const currentYear = now().getFullYear();
  const selectedDate = value ? dateKeyToDate(value) : now();

  function onPicked(event: DateTimePickerEvent, selected?: Date) {
    // Android: Picker schliesst sich nach Auswahl oder Abbruch selbst.
    setPickerOpen(false);
    if (event.type === 'set' && selected) {
      onChange(toLocalDateKey(selected));
    }
  }

  /**
   * Jahr gewaehlt: Datum aufs gewaehlte Jahr umstellen (Monat/Tag beibehalten,
   * 29.02. wird sicher behandelt) und danach direkt den Kalender oeffnen,
   * damit Monat/Tag im richtigen Jahr feinjustiert werden koennen.
   */
  function onYearPicked(year: number) {
    setYearOpen(false);
    const base = selectedDate;
    const month = base.getMonth();
    const day = base.getDate();
    // Tag-Ueberlauf vermeiden (z. B. 29.02. in Nicht-Schaltjahr -> 28.02.).
    const daysInTarget = new Date(year, month + 1, 0).getDate();
    let candidate = new Date(year, month, Math.min(day, daysInTarget));
    // Zukunftssperre respektieren: bei gesperrter Zukunft aufs Heute kappen.
    if (!allowFuture && candidate.getTime() > now().getTime()) {
      candidate = now();
    }
    onChange(toLocalDateKey(candidate));
    // Kalender direkt anbieten, um Monat/Tag zu praezisieren.
    setPickerOpen(true);
  }

  const firstYear = allowFuture ? currentYear + YEARS_FORWARD : currentYear;
  const years: number[] = [];
  for (let y = firstYear; y >= currentYear - YEARS_BACK; y -= 1) years.push(y);
  const selectedYear = selectedDate.getFullYear();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.chipRow}>
        {(allowFuture ? FUTURE_CHIPS : PAST_CHIPS).map((chip) => {
          const chipKey = dateKeyWithOffset(chip.offset);
          const active = value === chipKey;
          return (
            <Pressable
              key={chip.label}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(chipKey)}
              accessibilityLabel={`Datum ${chip.label}`}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.dateButton, styles.dateButtonMain]}
          onPress={() => setPickerOpen(true)}
          accessibilityLabel={`${label}: Kalender öffnen`}
        >
          <Text style={styles.dateButtonText}>{value ? formatDate(value) : 'Datum wählen …'}</Text>
          <Text style={styles.dateButtonIcon}>▦</Text>
        </Pressable>
        <Pressable
          style={[styles.dateButton, styles.yearButton]}
          onPress={() => setYearOpen(true)}
          accessibilityLabel={`${label}: Jahr direkt wählen`}
        >
          <Text style={styles.yearButtonText}>Jahr</Text>
        </Pressable>
      </View>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      {pickerOpen && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
          maximumDate={allowFuture ? undefined : now()}
          onChange={onPicked}
        />
      )}

      {/* Jahr-Schnellwahl: grosse, scrollbare Liste (Korrektur Nutzertest 10.07.2026). */}
      <Modal visible={yearOpen} transparent animationType="fade" onRequestClose={() => setYearOpen(false)}>
        <Pressable
          style={styles.yearBackdrop}
          onPress={() => setYearOpen(false)}
          accessibilityLabel="Jahresauswahl schließen"
        />
        <View style={[styles.yearSheet, { paddingBottom: spacing.l + insets.bottom }]}>
          <Text style={styles.yearHeadline}>Jahr wählen</Text>
          <Text style={styles.yearSub}>
            Danach öffnet sich der Kalender im gewählten Jahr – dort tippst du Monat und Tag an.
          </Text>
          <FlatList
            data={years}
            keyExtractor={(y) => String(y)}
            initialNumToRender={30}
            getItemLayout={(_, index) => ({
              length: YEAR_ROW_HEIGHT,
              offset: YEAR_ROW_HEIGHT * index,
              index,
            })}
            initialScrollIndex={Math.max(0, years.indexOf(selectedYear) - 2)}
            style={styles.yearList}
            renderItem={({ item: y }) => {
              const active = y === selectedYear;
              return (
                <Pressable
                  style={[styles.yearRow, active && styles.yearRowActive]}
                  onPress={() => onYearPicked(y)}
                  accessibilityLabel={`Jahr ${y}`}
                >
                  <Text style={[styles.yearRowText, active && styles.yearRowTextActive]}>{y}</Text>
                </Pressable>
              );
            }}
          />
          <Pressable
            style={styles.yearClose}
            onPress={() => setYearOpen(false)}
            accessibilityLabel="Abbrechen"
          >
            <Text style={styles.yearCloseText}>Abbrechen</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const YEAR_ROW_HEIGHT = 52;

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.m },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  chipRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.s, flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: spacing.s },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
  },
  dateButtonMain: { flex: 1 },
  yearButton: {
    justifyContent: 'center',
    borderColor: colors.primary,
    paddingHorizontal: spacing.m,
  },
  yearButtonText: { fontSize: typography.body, color: colors.primary, fontWeight: '700' },
  dateButtonText: { fontSize: typography.body, color: colors.textPrimary },
  dateButtonIcon: { fontSize: typography.body, color: colors.textSecondary },
  hint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  yearBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  yearSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.m,
    maxHeight: '70%',
  },
  yearHeadline: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  yearSub: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.s,
  },
  yearList: { flexGrow: 0 },
  yearRow: {
    height: YEAR_ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    borderRadius: 10,
  },
  yearRowActive: { backgroundColor: colors.primary },
  yearRowText: { fontSize: typography.body, color: colors.textPrimary },
  yearRowTextActive: { color: '#FFFFFF', fontWeight: '700' },
  yearClose: {
    marginTop: spacing.s,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  yearCloseText: { fontSize: typography.body, color: colors.textPrimary, fontWeight: '600' },
});
