/**
 * simplyPet: Termine-Liste
 * Quelle: technische_spezifikation_screen_flow.md
 *
 * Chronologische Liste offener Erinnerungen ueber alle Tiere hinweg.
 * Zustandsbasierte Logik: eine Erinnerung gilt erst als erledigt,
 * wenn der Eintrag in der Akte nachgetragen wurde (kein blindes Abhaken).
 */
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../db/database';
import { colors, typography, spacing } from '../theme/theme';

interface ReminderRow {
  id: string;
  title: string;
  due_date: string;
  status: string;
  pet_name: string;
}

export default function AppointmentsScreen() {
  const [reminders, setReminders] = useState<ReminderRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const rows = await db.getAllAsync<ReminderRow>(
          `SELECT r.id, r.title, r.due_date, r.status, p.name AS pet_name
           FROM reminders r JOIN pets p ON p.id = r.pet_id
           WHERE r.deleted_at IS NULL AND r.status = 'Offen'
           ORDER BY r.due_date ASC`
        );
        if (active) setReminders(rows);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.headline}>Termine</Text>
      {reminders.length === 0 ? (
        <Text style={styles.empty}>
          Keine offenen Termine. Erinnerungen entstehen automatisch, wenn du Impfungen oder
          Behandlungen mit Fälligkeitsdatum einträgst.
        </Text>
      ) : (
        reminders.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.cardTitle}>{r.title}</Text>
            <Text style={styles.cardMeta}>
              {r.pet_name} · fällig am {new Date(r.due_date).toLocaleDateString('de-DE')}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m },
  headline: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.l,
  },
  empty: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 26 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  cardTitle: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  cardMeta: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
