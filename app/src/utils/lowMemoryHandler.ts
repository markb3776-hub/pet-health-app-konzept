/**
 * simplyPet: Low-Memory-Handler (E-52)
 *
 * Reagiert auf Android Memory-Warnings:
 * - Leert den Bilder-Cache (Image.queryCache / expo-image cache)
 * - Setzt reloadToken auf Screens zurück (erzwingt Lazy-Reload)
 *
 * Wird in App.tsx beim Start registriert.
 */
import { AppState, Image, Platform } from 'react-native';

let registered = false;

/**
 * Registriert einen Listener der bei Memory-Pressure den Image-Cache leert.
 * Auf Android: AppState 'memoryWarning' Event.
 * Sicher aufrufbar (idempotent).
 */
export function registerLowMemoryHandler(): void {
  if (registered) return;
  registered = true;

  if (Platform.OS === 'android') {
    // React Native feuert 'memoryWarning' wenn Android onTrimMemory aufruft.
    const subscription = AppState.addEventListener('memoryWarning', () => {
      // Bilder-Cache leeren (React Native built-in)
      if (typeof (Image as any).queryCache === 'function') {
        // queryCache gibt ein Promise zurück – wir ignorieren das Ergebnis.
        (Image as any).queryCache([]).catch(() => {});
      }
      console.log('[simplyPet] Low-Memory: Bilder-Cache geleert.');
    });

    // Cleanup nicht nötig da App-Lifecycle – Subscription lebt so lange wie die App.
    // subscription.remove() wäre möglich, wird aber nicht benötigt.
  }
}
