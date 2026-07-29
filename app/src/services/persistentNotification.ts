/**
 * simplyPet: Permanente Notification (E-73, E-119 Revision, E-121)
 *
 * Verhalten wie ein Lichtschalter:
 * - AN = Notification ist da (nicht wegwischbar, bleibt nach Antippen)
 * - AUS = Notification verschwindet sofort
 *
 * Implementierung: expo-notifications mit sticky:true.
 * Der native Foreground Service (specialUse) bleibt im Manifest registriert
 * (Video-Nachweis fuer Google wurde aufgenommen, E-121).
 *
 * Die Notification ist auf dem Sperrbildschirm sichtbar (lockscreenVisibility: PUBLIC)
 * und oeffnet beim Antippen den Notfallpass (via Notification-Response-Handler in App.tsx).
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const KEY_PERSISTENT_ENABLED = 'simplypet.persistent_notification';
const NOTIFICATION_ID = 'simplypet-emergency-persistent';
const CHANNEL_ID = 'simplypet-emergency-channel';

async function ensureChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Notfallpass',
    description: 'Permanenter Schnellzugriff auf den Notfallpass',
    importance: Notifications.AndroidImportance.LOW,
    sound: undefined,
    vibrationPattern: [],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableVibrate: false,
    showBadge: false,
  });
}

async function showNotification(): Promise<void> {
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: 'simplyPet Notfallpass',
      body: 'Tippe für sofortigen Zugriff auf den Notfallpass.',
      data: { action: 'open_emergency_pass' },
      sticky: true,
      priority: Notifications.AndroidNotificationPriority.LOW,
    },
    trigger: null,
  });
}

async function hideNotification(): Promise<void> {
  await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
}

export async function isPersistentNotificationEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEY_PERSISTENT_ENABLED);
    return value === '1';
  } catch {
    return false;
  }
}

export async function setPersistentNotificationEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY_PERSISTENT_ENABLED, enabled ? '1' : '0');

  if (enabled) {
    await showNotification();
  } else {
    await hideNotification();
  }
}

/**
 * Wird beim App-Start aufgerufen: Prueft ob aktiviert und zeigt ggf. die Notification.
 */
export async function initPersistentNotification(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const enabled = await isPersistentNotificationEnabled();
  if (enabled) {
    await showNotification();
  }
}
