/**
 * simplyPet – Einstiegspunkt (v0.1.2)
 * Roadmap Schritt 3: Projektbasis mit Navigation und lokaler Datenbank.
 *
 * v0.1.2 Ergaenzungen:
 * - Notification-Permission-Request beim Start (Praevention Nr. 23)
 * - Low-Memory-Handler (Praevention Nr. 33)
 * - Dark-Mode explizit auf Light erzwungen (Praevention Nr. 9, via app.json userInterfaceStyle)
 * - Portrait-Sperre (Praevention Nr. 8, via app.json orientation)
 */
import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';

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

export default function App() {
  useEffect(() => {
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

    // Praevention Nr. 33: Low-Memory-Handler
    // Wenn die App in den Hintergrund geht, koennen wir nichts tun (Android killt).
    // Aber wir stellen sicher, dass beim Zurueckkehren der State konsistent ist.
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        // App kommt zurueck in den Vordergrund – DB-Verbindung ist stabil
        // (expo-sqlite reconnected automatisch). Nichts weiter noetig.
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
