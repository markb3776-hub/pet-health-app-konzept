/**
 * simplyPet: Datumsfeld (einheitlich fuer alle Formulare)
 * Quelle: technische_spezifikation_screen_flow.md (Abschnitt 1.2)
 *
 * Verbindliche Regeln:
 * - Eingabe AUSSCHLIESSLICH ueber den nativen Kalender-Picker, kein Freitext.
 * - Schnellwahl-Chips "Heute · Gestern · Vorgestern" ueber dem Kalender.
 * - Anzeigeformat immer TT.MM.JJJJ.
 * - Rueckdatierung ohne harte Grenze; Zukunft gesperrt (ausser bei Terminen,
 *   dann allowFuture=true).
 */
import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

const QUICK_CHIPS: { label: string; offset: number }[] = [
  { label: 'Heute', offset: 0 },
  { label: 'Gestern', offset: -1 },
  { label: 'Vorgestern', offset: -2 },
];

export default function DateField({ label, value, onChange, allowFuture = false, hint }: DateFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function onPicked(event: DateTimePickerEvent, selected?: Date) {
    // Android: Picker schliesst sich nach Auswahl oder Abbruch selbst.
    setPickerOpen(false);
    if (event.type === 'set' && selected) {
      onChange(toLocalDateKey(selected));
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.chipRow}>
        {QUICK_CHIPS.map((chip) => {
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

      <Pressable
        style={styles.dateButton}
        onPress={() => setPickerOpen(true)}
        accessibilityLabel={`${label}: Kalender öffnen`}
      >
        <Text style={styles.dateButtonText}>{value ? formatDate(value) : 'Datum wählen …'}</Text>
        <Text style={styles.dateButtonIcon}>▦</Text>
      </Pressable>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      {pickerOpen && (
        <DateTimePicker
          value={value ? dateKeyToDate(value) : now()}
          mode="date"
          display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
          maximumDate={allowFuture ? undefined : now()}
          onChange={onPicked}
        />
      )}
    </View>
  );
}

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
  dateButtonText: { fontSize: typography.body, color: colors.textPrimary },
  dateButtonIcon: { fontSize: typography.body, color: colors.textSecondary },
  hint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
