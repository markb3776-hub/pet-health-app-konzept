/**
 * simplyPet – Einstiegspunkt (v0.1.4)
 * Roadmap Schritt 3: Projektbasis mit Navigation und lokaler Datenbank.
 *
 * v0.1.4 Ergaenzungen:
 * - App-Shortcut Intent-Handling (E-61): Lang druecken -> Notfallpass
 * - Notification-Response-Handler (E-62): Tipp auf Notification -> Notfallpass
 * - Permanente Notification beim Start pruefen und ggf. setzen
 *
 * v0.1.2 Ergaenzungen:
 * - Notification-Permission-Request beim Start (Praevention Nr. 23)
 * - Low-Memory-Handler (Praevention Nr. 33)
 * - Dark-Mode explizit auf Light erzwungen (Praevention Nr. 9, via app.json userInterfaceStyle)
 * - Portrait-Sperre (Praevention Nr. 8, via app.json orientation)
 */
import React, { useEffect } from 'react';
import { Alert, AppState, BackHandler, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { navigateToEmergencyPass, navigateToAppointments } from './src/navigation/navigationRef';
import { checkShortcutIntent, onShortcutIntent } from './src/utils/intentHandler';
import { initPersistentNotification } from './src/services/persistentNotification';
import { initReminderChannel } from './src/services/notificationService';
import { registerLowMemoryHandler } from './src/utils/lowMemoryHandler';

// Notification-Handler: Zeigt Benachrichtigungen auch im Vordergrund an
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Testversion: Ablaufdatum 90 Tage nach Build
const BUILD_DATE = new Date('2026-07-20');
const EXPIRY_DAYS = 9999;

function checkExpiry(): boolean {
  const now = new Date();
  const diffMs = now.getTime() - BUILD_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > EXPIRY_DAYS;
}

export default function App() {
  useEffect(() => {
    // Testversion: 90-Tage-Ablaufprüfung
    if (checkExpiry()) {
      Alert.alert(
        'Testversion abgelaufen',
        'Diese Testversion von simplyPet ist nach 90 Tagen abgelaufen. Bitte wende dich an den Entwickler f\u00fcr eine aktualisierte Version.',
        [{ text: 'OK', onPress: () => BackHandler.exitApp() }],
        { cancelable: false }
      );
      return;
    }
    // Praevention Nr. 23: Notification-Permission aktiv anfragen (Android 13+)
    async function requestNotificationPermission() {
      if (Platform.OS === 'android') {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }
    }
    requestNotificationPermission();

    // E-61: App-Shortcut Intent pruefen (lang druecken auf Icon)
    async function handleShortcutOnStart() {
      const shouldOpenEmergency = await checkShortcutIntent();
      if (shouldOpenEmergency) {
        setTimeout(() => navigateToEmergencyPass(), 500);
      }
    }
    handleShortcutOnStart();

    // E-61: Shortcut-Intent waehrend App laeuft (z.B. aus Recents)
    const cleanupShortcut = onShortcutIntent(() => {
      navigateToEmergencyPass();
    });

    // E-62: Notification-Response-Handler (Tipp auf Notification -> Notfallpass / Termine)
    const notificationResponseSub =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.action === 'open_emergency_pass') {
          navigateToEmergencyPass();
        } else if (data?.action === 'open_appointments') {
          navigateToAppointments();
        }
      });

    // E-62: Permanente Notification pruefen und ggf. setzen
    initPersistentNotification();

    // Push-Notifications: Reminder-Channel anlegen
    initReminderChannel();

    // E-52 / Praevention Nr. 33: Low-Memory-Handler
    registerLowMemoryHandler();
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        // App kommt zurueck in den Vordergrund – DB-Verbindung ist stabil
      }
    });

    return () => {
      cleanupShortcut();
      notificationResponseSub.remove();
      appStateSub.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
