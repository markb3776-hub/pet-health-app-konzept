/**
 * simplyPet: Navigation-Ref (v0.1.4)
 *
 * Ermoeglicht Navigation von ausserhalb der React-Komponenten-Hierarchie
 * (z.B. aus App.tsx fuer Intent-Handling oder Notification-Response).
 */
import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigiert zum Notfallpass – sicher aufrufbar auch wenn Navigation
 * noch nicht bereit ist (wartet bis ready).
 */
export function navigateToEmergencyPass(): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Notfallpass');
  } else {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        navigationRef.navigate('Notfallpass');
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 3000);
  }
}
