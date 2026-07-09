/**
 * simplyPet: Entwurfs-Sicherung (Draft-Autosave)
 * Quelle: pruefdoktrin_eingabe_stabilitaet.md (Null-Datenverlust-Regel)
 *
 * Baupflicht 1: Jedes Formular sichert seinen Zustand fortlaufend lokal
 * (bei jeder Feldaenderung, spaetestens alle 2 Sekunden). Wird die App
 * unterbrochen oder beendet, bietet sie beim naechsten Oeffnen an, den
 * Entwurf fortzusetzen. Verwerfen tut nur der Nutzer, nie die App.
 *
 * Baupflicht 2: Zurueck-Geste mit ungespeicherten Aenderungen fragt immer
 * nach ("Eintrag verwerfen?") – einheitlich in der ganzen App
 * (useUnsavedChangesGuard).
 */
import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { nowUtcIso } from '../time/timeModule';

const DRAFT_PREFIX = 'simplypet.draft.';
/** Spaetestens alle 2 Sekunden sichern (Doktrin-Vorgabe). */
const AUTOSAVE_DELAY_MS = 1500;

export interface Draft<T> {
  data: T;
  savedAt: string; // UTC ISO
}

/** Entwurf lesen (null, wenn keiner existiert). */
export async function loadDraft<T>(formKey: string): Promise<Draft<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_PREFIX + formKey);
    if (!raw) return null;
    return JSON.parse(raw) as Draft<T>;
  } catch {
    return null; // defekter Entwurf darf die App nie blockieren
  }
}

/** Entwurf sofort sichern (fire-and-forget, blockiert die Eingabe nicht). */
export async function saveDraft<T>(formKey: string, data: T): Promise<void> {
  try {
    const draft: Draft<T> = { data, savedAt: nowUtcIso() };
    await AsyncStorage.setItem(DRAFT_PREFIX + formKey, JSON.stringify(draft));
  } catch {
    // Speicherfehler beim Draft darf die laufende Eingabe nicht stoeren.
  }
}

/** Entwurf verwerfen – ausschliesslich auf Nutzer-Entscheidung oder nach erfolgreichem Speichern. */
export async function clearDraft(formKey: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(DRAFT_PREFIX + formKey);
  } catch {
    // ignorieren
  }
}

/**
 * React-Hook: Fortlaufende Entwurfs-Sicherung mit Entprellung.
 * Bei jeder Aenderung von `data` wird der Entwurf nach kurzer Pause
 * gesichert (spaetestens nach 2 s, Doktrin-Vorgabe). Beim Unmount wird
 * ein ausstehender Entwurf sofort geschrieben (App-Wechsel, Navigation).
 *
 * `enabled` steuert, ob gesichert wird (false solange das Formular leer
 * ist oder gerade ein alter Entwurf geladen wird).
 */
export function useDraftAutosave<T>(formKey: string, data: T, enabled: boolean): void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<{ data: T; enabled: boolean }>({ data, enabled });
  latest.current = { data, enabled };

  useEffect(() => {
    if (!enabled) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void saveDraft(formKey, latest.current.data);
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [formKey, data, enabled]);

  // Beim Verlassen des Formulars (Unmount) ausstehende Aenderungen sofort sichern.
  useEffect(() => {
    return () => {
      if (latest.current.enabled) {
        void saveDraft(formKey, latest.current.data);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey]);
}

/**
 * React-Hook: Schutz vor versehentlichem Verwerfen (Baupflicht 2).
 * Faengt die Zurueck-Geste/den Zurueck-Knopf ab, solange ungespeicherte
 * Aenderungen bestehen, und fragt einheitlich nach. Der Entwurf bleibt
 * beim "Verwerfen" NICHT erhalten (bewusste Nutzer-Entscheidung),
 * beim Abbrechen bleibt alles stehen.
 */
export function useUnsavedChangesGuard(
  hasUnsavedChanges: boolean,
  onDiscard: () => void | Promise<void>
): void {
  const navigation = useNavigation();
  const guard = useRef({ hasUnsavedChanges, onDiscard });
  guard.current = { hasUnsavedChanges, onDiscard };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!guard.current.hasUnsavedChanges) return;
      e.preventDefault();
      Alert.alert(
        'Eintrag verwerfen?',
        'Deine Eingaben sind noch nicht gespeichert. Möchtest du sie wirklich verwerfen?',
        [
          { text: 'Weiter bearbeiten', style: 'cancel' },
          {
            text: 'Verwerfen',
            style: 'destructive',
            onPress: async () => {
              await guard.current.onDiscard();
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation]);
}

/**
 * Einheitlicher "Fortsetzen oder verwerfen?"-Dialog beim Wiederoeffnen
 * eines Formulars mit vorhandenem Entwurf (Baupflicht 1).
 */
export function offerDraftResume(
  description: string,
  onResume: () => void,
  onDiscard: () => void
): void {
  Alert.alert('Entwurf gefunden', `${description} – fortsetzen oder verwerfen?`, [
    { text: 'Verwerfen', style: 'destructive', onPress: onDiscard },
    { text: 'Fortsetzen', onPress: onResume },
  ]);
}
