/**
 * simplyPet: Termine-Liste
 * Quelle: technische_spezifikation_screen_flow.md (2.5)
 *
 * Chronologische Liste aller offenen Aufgaben, gruppiert in
 * "Überfällig", "Heute" und "Demnächst". Jeder Eintrag zeigt Tier-Farbe
 * und Tier-Name (Mehrtier-Haushalte: keine Verwechslung).
 * Die Ein-Tap-Checkbox-Bestaetigung folgt in Teilauftrag 4.2, da
 * Erinnerungen erst dort entstehen (Eintrags-Formulare).
 *
 * Zeit: alle Berechnungen ueber das zentrale Zeit-Modul (useTodayKey,
 * formatDate) – kein eigenes Datum, kein stiller Drift.
 * Zwei-Tap-Regel: Notfall-FAB fest auf diesem Bildschirm.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../db/database';
import { useTodayKey, formatDate } from '../time/timeModule';
import EmergencyFab from '../components/EmergencyFab';
import { colors, typography, spacing } from '../theme/theme';

interface ReminderRow {
  id: string;
  title: string;
  due_date: string;
  status: string;
  pet_name: string;
  pet_species: string;
  pet_color: string | null;
}

export default function AppointmentsScreen() {
  const todayKey = useTodayKey();
  const [reminders, setReminders] = useState<ReminderRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const rows = await db.getAllAsync<ReminderRow>(
          `SELECT r.id, r.title, r.due_date, r.status,
                  p.name AS pet_name, p.species AS pet_species, p.color_theme AS pet_color
           FROM reminders r JOIN pets p ON p.id = r.pet_id
           WHERE r.deleted_at IS NULL AND r.status = 'Offen'
           ORDER BY r.due_date ASC`
        );
        if (active) setReminders(rows);
      })();
      return () => {
        active = false;
      };
    }, [todayKey])
  );

  const overdue = reminders.filter((r) => r.due_date.slice(0, 10) < todayKey);
  const today = reminders.filter((r) => r.due_date.slice(0, 10) === todayKey);
  const upcoming = reminders.filter((r) => r.due_date.slice(0, 10) > todayKey);

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <Text style={styles.headline}>Termine</Text>
        {reminders.length === 0 ? (
          <Text style={styles.empty}>
            Keine offenen Termine. Erinnerungen entstehen automatisch, wenn du Impfungen oder
            Behandlungen mit Fälligkeitsdatum einträgst.
          </Text>
        ) : (
          <>
            <ReminderGroup title="Überfällig" items={overdue} highlight />
            <ReminderGroup title="Heute" items={today} />
            <ReminderGroup title="Demnächst" items={upcoming} />
          </>
        )}
      </ScrollView>
      <EmergencyFab />
    </View>
  );
}

function ReminderGroup({
  title,
  items,
  highlight = false,
}: {
  title: string;
  items: ReminderRow[];
  highlight?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, highlight && styles.groupTitleOverdue]}>{title}</Text>
      {items.map((r) => (
        <View
          key={r.id}
          style={[
            styles.card,
            { borderLeftColor: r.pet_color ?? colors.border },
            highlight && styles.cardOverdue,
          ]}
        >
          <Text style={styles.cardTitle}>
            {r.pet_name}: {r.title}
          </Text>
          <Text style={styles.cardMeta}>Fällig am {formatDate(r.due_date)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scroll: { padding: spacing.m, paddingBottom: 96 },
  headline: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.l,
  },
  empty: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 26 },
  group: { marginBottom: spacing.l },
  groupTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  groupTitleOverdue: { color: colors.signalRed },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  cardOverdue: { borderWidth: 1, borderColor: colors.signalRed, borderLeftWidth: 6 },
  cardTitle: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  cardMeta: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
