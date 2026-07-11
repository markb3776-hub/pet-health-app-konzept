/**
 * simplyPet: Gemeinsames Grundgeruest fuer Eintrags-Formulare (Teilauftrag 4.2)
 *
 * Buendelt die drei Baupflichten der Eingabe-Stabilitaets-Doktrin fuer alle
 * Eintrags-Formulare an EINER Stelle, damit kein Formular sie vergessen kann:
 * 1. Draft-Autosave (fortlaufend, <= 2 s)
 * 2. "Fortsetzen oder verwerfen?"-Dialog + Zurueck-Geste-Nachfrage
 * 3. Atomares Speichern mit sichtbarer Bestaetigung; bei Fehler bleiben
 *    alle Eingaben stehen.
 *
 * Zusaetzlich: Laden der (nicht archivierten) Tiere fuer die Tier-Zuordnung.
 * Bei genau einem Tier wird es automatisch vorgewaehlt (kein Extra-Schritt).
 */
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDb } from '../db/database';
import {
  loadDraft,
  clearDraft,
  useDraftAutosave,
  useUnsavedChangesGuard,
  offerDraftResume,
} from '../drafts/draftStore';
import type { PetOption } from '../components/FormParts';

export function usePets(): { pets: PetOption[]; loaded: boolean } {
  const [pets, setPets] = useState<PetOption[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const db = await getDb();
        const rows = await db.getAllAsync<PetOption>(
          `SELECT id, name, species, color_theme, photo_uri FROM pets
           WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at ASC`
        );
        if (active) setPets(rows);
      } catch {
        if (active) setPets([]);
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return { pets, loaded };
}

export interface EntryFormOptions<T extends object> {
  draftKey: string;
  emptyForm: T;
  /** Beschreibung fuer den Resume-Dialog, z. B. "Du hattest einen Gewichts-Eintrag begonnen". */
  resumeDescription: string;
  /** Hat das Formular inhaltliche Eingaben? (steuert Draft + Zurueck-Guard) */
  isDirty: (form: T) => boolean;
  /** Hat der Entwurf inhaltliche Eingaben? (steuert, ob Resume angeboten wird) */
  draftHasContent?: (draft: Partial<T>) => boolean;
}

export function useEntryForm<T extends object>(options: EntryFormOptions<T>) {
  const { draftKey, emptyForm, resumeDescription, isDirty, draftHasContent } = options;
  const navigation = useNavigation();
  const [form, setForm] = useState<T>(emptyForm);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof T>(key: K, value: T[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Baupflicht 1: vorhandenen Entwurf anbieten.
  useEffect(() => {
    let active = true;
    (async () => {
      const draft = await loadDraft<T>(draftKey);
      if (!active) return;
      const d = draft?.data;
      const hasContent = d && (draftHasContent ? draftHasContent(d) : isDirty({ ...emptyForm, ...d }));
      if (hasContent) {
        offerDraftResume(
          resumeDescription,
          () => setForm({ ...emptyForm, ...d }),
          () => void clearDraft(draftKey)
        );
      }
      setHydrated(true);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  const dirty = isDirty(form);
  useDraftAutosave(draftKey, form, hydrated && dirty && !saved);
  useUnsavedChangesGuard(hydrated && dirty && !saved, () => clearDraft(draftKey));

  /**
   * Baupflicht 3: atomares Speichern mit sichtbarer Bestaetigung.
   * `write` fuehrt die Datenbank-Schreibvorgaenge aus (bei mehreren
   * Statements innerhalb withTransactionAsync im Aufrufer).
   */
  async function runSave(write: () => Promise<void>, confirmation: { title: string; message: string }) {
    setSaving(true);
    try {
      await write();
      setSaved(true);
      await clearDraft(draftKey);
      // Praevention Nr. 13: Auto-Backup nach jedem erfolgreichen Save
      try {
        const { autoBackup } = require('../backup/backupService');
        autoBackup(); // Fire-and-forget, blockiert nicht
      } catch {
        // Backup-Fehler darf Save-Erfolg nicht beeintraechtigen
      }
      Alert.alert(confirmation.title, confirmation.message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      setSaved(false);
      Alert.alert(
        'Speichern fehlgeschlagen',
        'Der Eintrag konnte nicht gespeichert werden. Deine Eingaben bleiben erhalten – bitte versuche es erneut.'
      );
    } finally {
      setSaving(false);
    }
  }

  return { form, setForm, update, hydrated, saving, saved, runSave };
}
