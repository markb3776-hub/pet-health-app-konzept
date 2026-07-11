/**
 * simplyPet: Permanente Notification (E-62)
 *
 * Opt-in Notification in der Statusleiste:
 * - Prioritaet LOW (kein Sound, keine Vibration)
 * - Beim Tippen: oeffnet Notfallpass
 * - Standardmaessig AUS, Nutzer aktiviert in Einstellungen
 *
 * E-72: Show-on-Lock-Screen (OHNE Entsperren) auf v0.1.5 verschoben.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PERSISTENT_ENABLED = 'simplypet.persistent_notification';
const NOTIFICATION_ID = 'simplypet-emergency-persistent';
const CHANNEL_ID = 'simplypet-emergency-channel';

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

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

async function showPersistentNotification(): Promise<void> {
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

async function dismissPersistentNotification(): Promise<void> {
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
    await showPersistentNotification();
  } else {
    await dismissPersistentNotification();
  }
}

/**
 * Wird beim App-Start aufgerufen: Prueft ob aktiviert und setzt ggf. die Notification.
 */
export async function initPersistentNotification(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const enabled = await isPersistentNotificationEnabled();
  if (enabled) {
    await showPersistentNotification();
  }
}
