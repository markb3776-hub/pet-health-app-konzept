/**
 * simplyPet: Permanente Notification via Foreground Service (E-73)
 *
 * Verhalten wie ein Lichtschalter:
 * - AN = Notification ist da (nicht wegwischbar, bleibt nach Antippen)
 * - AUS = Notification verschwindet sofort
 *
 * Nutzt nativen Android Foreground Service (EmergencyForegroundService.kt)
 * ueber das Bridge-Modul (EmergencyServiceBridge).
 *
 * Fallback: Wenn NativeModules nicht verfuegbar (z.B. Expo Go),
 * wird expo-notifications mit sticky:true verwendet (begrenzt funktional).
 */
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PERSISTENT_ENABLED = 'simplypet.persistent_notification';

const { EmergencyServiceBridge } = NativeModules;

async function startForegroundService(): Promise<void> {
  if (EmergencyServiceBridge) {
    await EmergencyServiceBridge.startService();
  } else {
    // Fallback fuer Expo Go (begrenzt funktional)
    const Notifications = await import('expo-notifications');
    await Notifications.setNotificationChannelAsync('simplypet-emergency-channel', {
      name: 'Notfallpass',
      description: 'Permanenter Schnellzugriff auf den Notfallpass',
      importance: Notifications.AndroidImportance.LOW,
      sound: undefined,
      vibrationPattern: [],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableVibrate: false,
      showBadge: false,
    });
    await Notifications.scheduleNotificationAsync({
      identifier: 'simplypet-emergency-persistent',
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
}

async function stopForegroundService(): Promise<void> {
  if (EmergencyServiceBridge) {
    await EmergencyServiceBridge.stopService();
  } else {
    const Notifications = await import('expo-notifications');
    await Notifications.dismissNotificationAsync('simplypet-emergency-persistent');
  }
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
    await startForegroundService();
  } else {
    await stopForegroundService();
  }
}

/**
 * Wird beim App-Start aufgerufen: Prueft ob aktiviert und startet ggf. den Service.
 */
export async function initPersistentNotification(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const enabled = await isPersistentNotificationEnabled();
  if (enabled) {
    await startForegroundService();
  }
}
