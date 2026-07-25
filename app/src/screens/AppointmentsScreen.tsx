/**
 * simplyPet: Termine-Liste (Teilauftrag 4.2: voll funktionsfähig)
 * Quelle: Screen-Flow 2.5 + Datenmodell 2.7 (reminders).
 *
 * - Gruppen "Überfällig / Bald fällig / Geplant" (E-82); jede Karte zeigt Tier-Farbe
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
 *
 * E-81: (1) Tiername eigene Zeile oberhalb des Texts.
 *        (2) Visuelle + schriftliche Trennung "Hinweis" vs. "Termin".
 *        (3) Prototyp-Hinweis am Ende.
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

/**
 * E-81: Bestimmt ob ein Eintrag ein "Termin" (festes Datum, einmalig) oder
 * ein "Hinweis" (taeglich/wiederkehrend, Pflege/Medikament) ist.
 */
function isTermin(r: ReminderRow): boolean {
  // Termine: Impfungen, einmalige Faelligkeiten (kein repeat_rule)
  if (r.source_type === 'impfung') return true;
  if (!r.repeat_rule) return true;
  return false;
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
    // BUG-3 FIX: Tägliche Erinnerungen die in der Vergangenheit liegen auf heute setzen
    // (Catch-up nach Mitternacht oder wenn App einen Tag nicht geöffnet wurde)
    await db.runAsync(
      `UPDATE reminders SET due_date = ?, updated_at = datetime('now'), is_synced = 0
       WHERE repeat_rule = 'taeglich' AND status = 'Offen' AND deleted_at IS NULL
         AND substr(due_date, 1, 10) < ?`,
      [todayKey, todayKey]
    );
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
          // BUG-4 FIX: Kein Verlaufs-Eintrag bei täglichen Routine-Erinnerungen.
          // Der Nutzer sagt: "ergibt sich aus der hinterlegten Erinnerung".
          // Nur essentielle Infos (Gewicht, Impfung, TA-Besuch) gehören in den Verlauf.
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
      // E-93: Auto-Backup nach jeder Datenaenderung
      try { const { autoBackup } = require('../backup/backupService'); autoBackup(); } catch {}
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
      // E-93: Auto-Backup nach jeder Datenaenderung
      try { const { autoBackup } = require('../backup/backupService'); autoBackup(); } catch {}
      await reload();
    } catch {
      // unveraendert
    } finally {
      setBusyId(null);
    }
  }

  const overdue = open.filter((r) => r.due_date.slice(0, 10) < todayKey);
  // E-82: "Bald fällig" = heute + nächste 14 Tage; "Geplant" = > 14 Tage
  const soonCutoff = dateKeyWithOffset(14);
  const soonDue = open.filter(
    (r) => r.due_date.slice(0, 10) >= todayKey && r.due_date.slice(0, 10) <= soonCutoff
  );
  const planned = open.filter((r) => r.due_date.slice(0, 10) > soonCutoff);

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
            {/* E-82: Bald fällig (≤14 Tage) und Geplant (>14 Tage) */}
            <ReminderGroup title="Bald fällig" items={soonDue} onCheck={complete} busyId={busyId} />
            <ReminderGroup title="Geplant" items={planned} onCheck={complete} busyId={busyId} />

            {done.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitleDone}>Erledigt (letzte 30 Tage)</Text>
                {done.map((r) => {
                  const termin = isTermin(r);
                  return (
                    <View
                      key={r.id}
                      style={[
                        styles.card,
                        styles.cardDone,
                        { borderLeftColor: termin ? colors.primary : '#E8890C' },
                      ]}
                    >
                      <View style={styles.cardBody}>
                        {/* E-81: Tiername eigene Zeile */}
                        <Text style={styles.petNameDone}>{r.pet_name}</Text>
                        <Text style={[styles.cardTitle, styles.cardTitleDone]}>
                          {r.title}
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
                  );
                })}
              </View>
            ) : null}
          </>
        )}

        {/* E-81: Prototyp-Hinweis */}
        <View style={styles.protoHint}>
          <Text style={styles.protoHintText}>
            Prototyp – noch keine Push-Notifications oder Kalender-Sync aktiv!
          </Text>
        </View>
      </ScrollView>
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
      {items.map((r) => {
        const termin = isTermin(r);
        return (
          <View
            key={r.id}
            style={[
              styles.card,
              // E-81: Farbbalken – gruen/petrol fuer Termine, orange fuer Hinweise
              { borderLeftColor: termin ? colors.primary : '#E8890C' },
              highlight && styles.cardOverdue,
            ]}
          >
            {/* EIN-TAP-CHECKBOX: grosse Touchflaeche, keine Rueckfrage. */}
            <Pressable
              style={styles.checkbox}
              onPress={() => onCheck(r)}
              disabled={busyId !== null}
              accessibilityLabel={`${r.title} als erledigt abhaken`}
            >
              <View style={[styles.checkboxBox, termin && styles.checkboxBoxTermin]} />
            </Pressable>
            <View style={styles.cardBody}>
              {/* E-81: Tiername eigene Zeile oberhalb */}
              <Text style={styles.petName}>{r.pet_name}</Text>
              <Text style={styles.cardTitle}>{r.title}</Text>
              <Text style={styles.cardMeta}>
                {/* E-81: Schriftlicher Typ-Hinweis "Termin" oder "Hinweis" */}
                <Text style={termin ? styles.typeBadgeTermin : styles.typeBadgeHinweis}>
                  {termin ? 'Termin' : 'Hinweis'}
                </Text>
                {'  '}
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
        );
      })}
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
  // E-81: Tiername eigene Zeile
  petName: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  petNameDone: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  cardTitle: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  cardTitleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  cardMeta: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  // E-81: Schriftlicher Typ-Hinweis
  typeBadgeTermin: {
    fontWeight: '700',
    color: colors.primary,
  },
  typeBadgeHinweis: {
    fontWeight: '700',
    color: '#E8890C',
  },
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
    borderColor: '#E8890C',
    backgroundColor: colors.background,
  },
  // E-81: Termine bekommen gruene Checkbox-Umrandung
  checkboxBoxTermin: {
    borderColor: colors.primary,
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
  // E-81: Prototyp-Hinweis
  protoHint: {
    marginTop: spacing.l,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    alignItems: 'center',
  },
  protoHintText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
