/**
 * simplyPet: Termine-Liste (Teilauftrag 4.2: voll funktionsfähig)
 * Quelle: Screen-Flow 2.5 + Datenmodell 2.7 (reminders).
 *
 * - Gruppen "Überfällig / Heute / Demnächst"; jede Karte zeigt Tier-Farbe
 *   und Tier-Name (Mehrtier-Haushalte: keine Verwechslung).
 * - EIN-TAP-CHECKBOX: Ein Tap auf die Checkbox erledigt die Aufgabe –
 *   keine Zwischendialoge (Spez: "Erledigt-Bestätigung ist Ein-Tap").
 * - Tägliche Erinnerungen (repeat_rule='taeglich'): Abhaken protokolliert
 *   die Gabe (health_records 'Medikamentengabe') und setzt die Fälligkeit
 *   auf morgen – die Erinnerung bleibt bestehen.
 * - Saisonfenster (season_start/end): Erinnerungen außerhalb ihrer Monate
 *   werden ausgeblendet (inkl. Jahreswechsel-Fenster, z. B. Nov–Feb).
 * - Erledigt-Liste (letzte 30 Tage) mit RÜCKGÄNGIG – ein Fehl-Tap ist
 *   folgenlos (Eingabe-Stabilitäts-Doktrin: verzeihende Bedienung).
 * - Zeit ausschließlich über das zentrale Zeit-Modul (kein stiller Drift).
 */
import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getDb, uuid } from '../db/database';
import {
  useTodayKey,
  formatDate,
  nowUtcIso,
  dateKeyWithOffset,
} from '../time/timeModule';
import EmergencyFab from '../components/EmergencyFab';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

interface ReminderRow {
  id: string;
  title: string;
  due_date: string;
  status: string;
  repeat_rule: string | null;
  season_start: number | null;
  season_end: number | null;
  hint_text: string | null;
  source_type: string | null;
  source_id: string | null;
  done_at: string | null;
  pet_id: string;
  pet_name: string;
  pet_species: string;
  pet_color: string | null;
}

/** Ist der Monat (1-12) im Saisonfenster? Fenster über den Jahreswechsel (z. B. 11–2) inklusive. */
export function isInSeason(month: number, start: number | null, end: number | null): boolean {
  if (start === null || end === null) return true; // ganzjaehrig
  return start <= end ? month >= start && month <= end : month >= start || month <= end;
}

export default function AppointmentsScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): kein Navigations-Header,
  // daher eigenen Abstand zur Statusleiste reservieren.
  const insets = useSafeAreaInsets();
  const todayKey = useTodayKey();
  const currentMonth = parseInt(todayKey.slice(5, 7), 10);
  const [open, setOpen] = useState<ReminderRow[]>([]);
  const [done, setDone] = useState<ReminderRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const db = await getDb();
    const openRows = await db.getAllAsync<ReminderRow>(
      `SELECT r.*, p.id AS pet_id, p.name AS pet_name, p.species AS pet_species, p.color_theme AS pet_color
       FROM reminders r JOIN pets p ON p.id = r.pet_id
       WHERE r.deleted_at IS NULL AND r.status = 'Offen'
         AND p.deleted_at IS NULL AND p.archived = 0
       ORDER BY r.due_date ASC`
    );
    // Erledigt-Liste: die letzten 30 Tage (Rueckgaengig-Fenster).
    const doneRows = await db.getAllAsync<ReminderRow>(
      `SELECT r.*, p.id AS pet_id, p.name AS pet_name, p.species AS pet_species, p.color_theme AS pet_color
       FROM reminders r JOIN pets p ON p.id = r.pet_id
       WHERE r.deleted_at IS NULL AND r.status = 'Erledigt'
         AND p.deleted_at IS NULL
         AND r.done_at IS NOT NULL AND date(r.done_at) >= date(?, '-30 days')
       ORDER BY r.done_at DESC`,
      [todayKey]
    );
    // Saisonfenster: Erinnerungen ausserhalb ihrer Monate ausblenden.
    setOpen(openRows.filter((r) => isInSeason(currentMonth, r.season_start, r.season_end)));
    setDone(doneRows);
  }, [todayKey, currentMonth]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          if (active) await reload();
        } catch {
          // Anzeige bleibt beim letzten Stand.
        }
      })();
      return () => {
        active = false;
      };
    }, [reload])
  );

  /** EIN-TAP: Aufgabe erledigen. Taegliche Erinnerungen ruecken auf morgen. */
  async function complete(r: ReminderRow) {
    if (busyId) return;
    setBusyId(r.id);
    try {
      const db = await getDb();
      const ts = nowUtcIso();
      await db.withTransactionAsync(async () => {
        if (r.repeat_rule === 'taeglich') {
          // Gabe protokollieren (Timeline!) + Faelligkeit auf morgen.
          if (r.source_type === 'medikament' && r.source_id) {
            await db.runAsync(
              `INSERT INTO health_records (id, pet_id, record_type, date, notes, medication_id, created_at, updated_at, is_synced)
               VALUES (?, ?, 'Medikamentengabe', ?, ?, ?, ?, ?, 0)`,
              [uuid(), r.pet_id, todayKey, r.title, r.source_id, ts, ts]
            );
          }
          await db.runAsync(
            `UPDATE reminders SET due_date = ?, updated_at = ?, is_synced = 0 WHERE id = ?`,
            [dateKeyWithOffset(1), ts, r.id]
          );
        } else {
          await db.runAsync(
            `UPDATE reminders SET status = 'Erledigt', done_at = ?, updated_at = ?, is_synced = 0 WHERE id = ?`,
            [ts, ts, r.id]
          );
        }
      });
      await reload();
    } catch {
      // Fehler: Zustand unveraendert, naechster Tap versucht es erneut.
    } finally {
      setBusyId(null);
    }
  }

  /** RUECKGAENGIG: erledigte Aufgabe wieder oeffnen (Fehl-Tap folgenlos). */
  async function undo(r: ReminderRow) {
    if (busyId) return;
    setBusyId(r.id);
    try {
      const db = await getDb();
      await db.runAsync(
        `UPDATE reminders SET status = 'Offen', done_at = NULL, updated_at = ?, is_synced = 0 WHERE id = ?`,
        [nowUtcIso(), r.id]
      );
      await reload();
    } catch {
      // unveraendert
    } finally {
      setBusyId(null);
    }
  }

  const overdue = open.filter((r) => r.due_date.slice(0, 10) < todayKey);
  const today = open.filter((r) => r.due_date.slice(0, 10) === todayKey);
  const upcoming = open.filter((r) => r.due_date.slice(0, 10) > todayKey);

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <Text style={styles.headline}>Termine</Text>
        {open.length === 0 && done.length === 0 ? (
          <Text style={styles.empty}>
            Keine offenen Termine. Erinnerungen entstehen automatisch, wenn du Impfungen mit
            Fälligkeitsdatum einträgst oder Medikamente mit täglicher Erinnerung anlegst.
          </Text>
        ) : (
          <>
            <ReminderGroup title="Überfällig" items={overdue} highlight onCheck={complete} busyId={busyId} />
            <ReminderGroup title="Heute" items={today} onCheck={complete} busyId={busyId} />
            <ReminderGroup title="Demnächst" items={upcoming} onCheck={complete} busyId={busyId} />

            {done.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitleDone}>Erledigt (letzte 30 Tage)</Text>
                {done.map((r) => (
                  <View key={r.id} style={[styles.card, styles.cardDone, { borderLeftColor: r.pet_color ?? colors.border }]}>
                    <View style={styles.cardBody}>
                      <Text style={[styles.cardTitle, styles.cardTitleDone]}>
                        {r.pet_name}: {r.title}
                      </Text>
                      <Text style={styles.cardMeta}>
                        Erledigt am {formatDate(r.done_at ?? r.due_date)}
                      </Text>
                    </View>
                    <Pressable
                      style={styles.undoButton}
                      onPress={() => undo(r)}
                      disabled={busyId !== null}
                      accessibilityLabel={`${r.title} wieder öffnen`}
                    >
                      <Text style={styles.undoText}>Rückgängig</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
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
  onCheck,
  busyId,
}: {
  title: string;
  items: ReminderRow[];
  highlight?: boolean;
  onCheck: (r: ReminderRow) => void;
  busyId: string | null;
}) {
  if (items.length === 0) return null;
  return (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, highlight && styles.groupTitleOverdue]}>{title}</Text>
      {items.map((r) => (
        <View
          key={r.id}
          style={[styles.card, { borderLeftColor: r.pet_color ?? colors.border }, highlight && styles.cardOverdue]}
        >
          {/* EIN-TAP-CHECKBOX: grosse Touchflaeche, keine Rueckfrage. */}
          <Pressable
            style={styles.checkbox}
            onPress={() => onCheck(r)}
            disabled={busyId !== null}
            accessibilityLabel={`${r.title} als erledigt abhaken`}
          >
            <View style={styles.checkboxBox} />
          </Pressable>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>
              {r.pet_name}: {r.title}
            </Text>
            <Text style={styles.cardMeta}>
              {r.repeat_rule === 'taeglich' ? 'Täglich' : `Fällig am ${formatDate(r.due_date)}`}
              {r.hint_text ? ` · ${r.hint_text}` : ''}
            </Text>
            {highlight && r.source_type === 'impfung' ? (
              <Text style={styles.overdueHint}>
                Überfällig – bitte Tierarzt konsultieren
              </Text>
            ) : null}
          </View>
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
  groupTitleDone: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: spacing.m,
    marginBottom: spacing.s,
    gap: spacing.m,
  },
  cardOverdue: { borderWidth: 1, borderColor: colors.signalRed, borderLeftWidth: 6 },
  cardDone: { opacity: 0.75 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  cardTitleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  cardMeta: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  overdueHint: { fontSize: typography.bodySmall, color: colors.signalRed, marginTop: spacing.xs, fontWeight: '600' },
  checkbox: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  undoButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.m,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  undoText: { fontSize: typography.bodySmall, color: colors.primary, fontWeight: '600' },
});
