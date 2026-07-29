/**
 * simplyPet: Navigation-Ref (v0.1.5 – E-121 Fix)
 *
 * Ermoeglicht Navigation von ausserhalb der React-Komponenten-Hierarchie
 * (z.B. aus App.tsx fuer Intent-Handling oder Notification-Response).
 *
 * Seit E-75 liegen Unter-Screens innerhalb der Tab-Stacks. Externe
 * Navigation muss daher nested navigieren: Tab -> Screen.
 *
 * E-121: Navigation-Lock verhindert, dass tabPress-Listener die
 * Notification-Navigation ueberschreiben. Wenn eine externe Navigation
 * (Notification-Tap, Intent) aktiv ist, wird der tabPress-Reset
 * fuer 500ms blockiert.
 */
import { createNavigationContainerRef } from '@react-navigation/native';

// Wir verwenden einen generischen Typ, da der Root jetzt ein Tab-Navigator ist.
export const navigationRef = createNavigationContainerRef<any>();

/**
 * Navigation-Lock: Wird gesetzt wenn eine externe Navigation (Notification/Intent)
 * aktiv ist. tabPress-Listener pruefen diesen Lock und ueberspringen den Reset.
 */
let navigationLockActive = false;
let navigationLockTimer: ReturnType<typeof setTimeout> | null = null;

function setNavigationLock(): void {
  navigationLockActive = true;
  if (navigationLockTimer) {
    clearTimeout(navigationLockTimer);
  }
  navigationLockTimer = setTimeout(() => {
    navigationLockActive = false;
    navigationLockTimer = null;
  }, 600);
}

/**
 * Prueft ob gerade eine externe Navigation laeuft.
 * Wird von AppNavigator.tsx in tabPress-Listenern aufgerufen.
 */
export function isNavigationLocked(): boolean {
  return navigationLockActive;
}

/**
 * Navigiert zum Notfallpass – sicher aufrufbar auch wenn Navigation
 * noch nicht bereit ist (wartet bis ready).
 * Seit E-75: Nested Navigation -> Zuhause-Tab -> Notfallpass Screen.
 * E-121: Setzt Navigation-Lock um tabPress-Reset zu blockieren.
 */
export function navigateToEmergencyPass(): void {
  setNavigationLock();

  const doNavigate = () => {
    // Doppelt navigieren: Erst Tab wechseln, dann Screen setzen
    // setTimeout stellt sicher dass wir NACH einem evtl. tabPress-Event kommen
    setTimeout(() => {
      navigationRef.navigate('Zuhause', { screen: 'Notfallpass' });
    }, 150);
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

/**
 * Navigiert zum Termine-Tab – wird aufgerufen wenn der Nutzer
 * auf eine Erinnerungs-Notification tippt.
 * E-121: Setzt Navigation-Lock um tabPress-Reset zu blockieren.
 */
export function navigateToAppointments(): void {
  setNavigationLock();

  const doNavigate = () => {
    setTimeout(() => {
      navigationRef.navigate('Termine', { screen: 'AppointmentsMain' });
    }, 150);
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
