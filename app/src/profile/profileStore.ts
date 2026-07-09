/**
 * simplyPet: Halter-Profil und Onboarding-Status (KONTOLOS)
 * Freigabe des Projektinhabers (09.07.2026): Der Prototyp arbeitet ohne
 * Konto – KEIN E-Mail, KEIN Passwort, KEIN Login. Erfasst wird nur der
 * Name des Halters (wichtig fuer den Notfallpass). Alle Daten bleiben
 * auf dem Geraet ("Deine Daten gehören dir.").
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_OWNER_NAME = 'simplypet.owner_name';
const KEY_ONBOARDING_DONE = 'simplypet.onboarding_done';

export async function getOwnerName(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEY_OWNER_NAME);
  } catch {
    return null;
  }
}

export async function setOwnerName(name: string): Promise<void> {
  await AsyncStorage.setItem(KEY_OWNER_NAME, name.trim());
}

export async function isOnboardingDone(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY_ONBOARDING_DONE)) === '1';
  } catch {
    return false;
  }
}

export async function markOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEY_ONBOARDING_DONE, '1');
}
