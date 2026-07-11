/**
 * simplyPet: Navigation-Ref (v0.1.4 – E-75 Fix)
 *
 * Ermoeglicht Navigation von ausserhalb der React-Komponenten-Hierarchie
 * (z.B. aus App.tsx fuer Intent-Handling oder Notification-Response).
 *
 * Seit E-75 liegen Unter-Screens innerhalb der Tab-Stacks. Externe
 * Navigation muss daher nested navigieren: Tab -> Screen.
 */
import { createNavigationContainerRef } from '@react-navigation/native';

// Wir verwenden einen generischen Typ, da der Root jetzt ein Tab-Navigator ist.
export const navigationRef = createNavigationContainerRef<any>();

/**
 * Navigiert zum Notfallpass – sicher aufrufbar auch wenn Navigation
 * noch nicht bereit ist (wartet bis ready).
 * Seit E-75: Nested Navigation -> Zuhause-Tab -> Notfallpass Screen.
 */
export function navigateToEmergencyPass(): void {
  const doNavigate = () => {
    navigationRef.navigate('Zuhause', { screen: 'Notfallpass' });
  };

  if (navigationRef.isReady()) {
    doNavigate();
  } else {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        doNavigate();
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 3000);
  }
}
