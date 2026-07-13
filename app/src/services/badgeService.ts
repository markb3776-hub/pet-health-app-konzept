/**
 * simplyPet: App-Icon Badge (E-85)
 *
 * Setzt die Badge-Zahl auf dem App-Icon (wie Instagram) basierend auf
 * der Anzahl überfälliger Aufgaben. Funktioniert lokal ohne Push-Notifications.
 *
 * Wird aufgerufen bei:
 * - App-Start (initBadge)
 * - Jeder Statusänderung (Aufgabe erledigt / neue Aufgabe überfällig)
 * - Tageswechsel (über useTodayKey-Refresh)
 */
import { Platform } from 'react-native';
import { getDb } from '../db/database';

/**
 * Berechnet die Anzahl überfälliger Aufgaben und setzt den Badge-Count.
 * Nutzt expo-notifications setBadgeCountAsync (funktioniert ohne Push-Permission).
 */
export async function updateBadgeCount(todayKey: string): Promise<void> {
  try {
    const db = await getDb();
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) AS count FROM reminders r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.deleted_at IS NULL AND r.status = 'Offen'
         AND p.deleted_at IS NULL AND p.archived = 0
         AND r.due_date < ?`,
      [todayKey]
    );
    const overdueCount = result?.count ?? 0;

    // expo-notifications Badge API (funktioniert ohne Push-Permission)
    const Notifications = await import('expo-notifications');
    await Notifications.setBadgeCountAsync(overdueCount);
  } catch {
    // Badge ist nice-to-have, kein Crash bei Fehler.
  }
}

/**
 * Wird beim App-Start aufgerufen.
 * Nur auf Plattformen die Badges unterstützen (Android 8+, iOS).
 */
export async function initBadge(todayKey: string): Promise<void> {
  if (Platform.OS === 'web') return;
  await updateBadgeCount(todayKey);
}
