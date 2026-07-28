/**
 * simplyPet: Notification-Service für Termin-Erinnerungen
 *
 * Verantwortlich für:
 * - Notification-Channel anlegen (Android)
 * - Lokale Notifications für Termine/Erinnerungen planen (Scheduling)
 * - Geplante Notifications stornieren
 * - Alle Notifications eines Termins neu planen (bei Änderung)
 *
 * Nutzt expo-notifications (bereits als Dependency vorhanden).
 * Alle Notifications sind LOKAL – kein Server, kein Push-Token nötig.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/** Vorlaufzeit-Optionen in Tagen */
export type ReminderOffset = 0 | 1 | 3 | 7 | 14;

export const REMINDER_OFFSET_OPTIONS: { label: string; value: ReminderOffset }[] = [
  { label: 'Am selben Tag', value: 0 },
  { label: '1 Tag vorher', value: 1 },
  { label: '3 Tage vorher', value: 3 },
  { label: '1 Woche vorher', value: 7 },
  { label: '2 Wochen vorher', value: 14 },
];

const CHANNEL_ID = 'simplypet-reminders';

/**
 * Notification-Channel für Erinnerungen anlegen (Android).
 * Wird beim App-Start aufgerufen.
 */
export async function initReminderChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Erinnerungen',
    description: 'Termin- und Medikamenten-Erinnerungen',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableVibrate: true,
    showBadge: true,
  });
}

/**
 * Lokale Notification für einen Termin planen.
 *
 * @param reminderId - ID des Reminder-Eintrags in der DB (wird als Notification-Identifier genutzt)
 * @param title - Titel der Notification (z.B. "Impfung auffrischen: Tollwut")
 * @param body - Body-Text (z.B. "Für Hanna – in 3 Tagen fällig")
 * @param triggerDate - Datum/Uhrzeit wann die Notification erscheinen soll
 * @returns Die Notification-ID (identisch mit reminderId für einfache Stornierung)
 */
export async function scheduleReminderNotification(
  reminderId: string,
  title: string,
  body: string,
  triggerDate: Date
): Promise<string> {
  // Nicht in der Vergangenheit planen
  const now = new Date();
  if (triggerDate <= now) {
    // Termin liegt bereits in der Vergangenheit – keine Notification planen
    return reminderId;
  }

  // Bestehende Notification mit gleicher ID stornieren (falls vorhanden)
  await cancelReminderNotification(reminderId);

  await Notifications.scheduleNotificationAsync({
    identifier: reminderId,
    content: {
      title,
      body,
      data: { reminderId, action: 'open_appointments' },
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return reminderId;
}

/**
 * Geplante Notification stornieren.
 */
export async function cancelReminderNotification(reminderId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(reminderId);
  } catch {
    // Notification existiert nicht – kein Fehler
  }
}

/**
 * ALLE geplanten Reminder-Notifications stornieren (z.B. beim Löschen eines Tiers).
 */
export async function cancelAllReminderNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Berechnet das Trigger-Datum für eine Erinnerung.
 *
 * @param dueDate - Fälligkeitsdatum des Termins (YYYY-MM-DD)
 * @param offsetDays - Wie viele Tage VOR dem Termin erinnert werden soll
 * @param hour - Uhrzeit der Erinnerung (Standard: 9 Uhr morgens)
 * @returns Date-Objekt für den Trigger
 */
export function calculateTriggerDate(
  dueDate: string,
  offsetDays: ReminderOffset = 1,
  hour: number = 9
): Date {
  const date = new Date(dueDate + 'T00:00:00');
  date.setDate(date.getDate() - offsetDays);
  date.setHours(hour, 0, 0, 0);
  return date;
}

/**
 * Erstellt den Body-Text für eine Termin-Erinnerung.
 */
export function buildReminderBody(petName: string, dueDate: string, offsetDays: number): string {
  if (offsetDays === 0) {
    return `Für ${petName} – heute fällig`;
  }
  if (offsetDays === 1) {
    return `Für ${petName} – morgen fällig`;
  }
  return `Für ${petName} – in ${offsetDays} Tagen fällig (${formatDateShort(dueDate)})`;
}

/** Hilfsfunktion: Datum kurz formatieren (DD.MM.YYYY) */
function formatDateShort(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split('-');
  return `${d}.${m}.${y}`;
}
