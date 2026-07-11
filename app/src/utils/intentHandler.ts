/**
 * simplyPet: Intent-Handler fuer App-Shortcuts (E-61)
 *
 * Faengt den Intent "de.simplypet.app.OPEN_EMERGENCY" ab,
 * der vom Android App-Shortcut (lang druecken auf Icon) gesendet wird.
 */
import { Linking, Platform } from 'react-native';

/**
 * Prueft ob die App ueber den Notfallpass-Shortcut gestartet wurde.
 */
export async function checkShortcutIntent(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  try {
    const url = await Linking.getInitialURL();
    if (url && url.includes('OPEN_EMERGENCY')) {
      return true;
    }
  } catch {
    // Kein Intent vorhanden – normaler Start
  }

  return false;
}

/**
 * Registriert einen Listener fuer Shortcut-Intents waehrend die App laeuft.
 * Gibt eine Cleanup-Funktion zurueck.
 */
export function onShortcutIntent(callback: () => void): () => void {
  const subscription = Linking.addEventListener('url', (event) => {
    if (event.url && event.url.includes('OPEN_EMERGENCY')) {
      callback();
    }
  });

  return () => subscription.remove();
}
