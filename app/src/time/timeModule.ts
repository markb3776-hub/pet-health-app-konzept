/**
 * simplyPet: Zentrales Zeit-Modul
 * Quelle: technische_spezifikation_offline_strategie.md (Abschnitt 2.3, Zeit-Integritaet)
 * und technische_spezifikation_screen_flow.md (Abschnitt 1.2, Datums-Regeln)
 *
 * Verbindliche Regeln:
 * 1. EINE Zeitquelle: Kein Screen rechnet selbst mit eigenem Datum –
 *    alle Zeitberechnungen laufen ueber dieses Modul.
 * 2. UTC intern, lokale Anzeige: Zeitstempel werden als ISO-8601 (UTC)
 *    gespeichert und erst bei der Anzeige in die Geraete-Zeitzone umgerechnet.
 * 3. Anzeigeformat ausschliesslich TT.MM.JJJJ.
 * 4. Kein stiller Drift: Nach App-Start und Rueckkehr aus dem Hintergrund
 *    wird der "Heute"-Bezug neu berechnet (useTodayKey / notifyTimeListeners).
 */
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** Aktueller Zeitpunkt als Date-Objekt. Einzige Stelle, die `new Date()` fuer "jetzt" aufruft. */
export function now(): Date {
  return new Date();
}

/** Aktueller Zeitstempel in UTC (ISO-8601) – fuer Datenbank-Felder (created_at, updated_at). */
export function nowUtcIso(): string {
  return new Date().toISOString();
}

/**
 * Kalendertag in LOKALER Zeit als Schluessel "JJJJ-MM-TT".
 * Fuer Ereignis-Datumsfelder (Gewicht, Symptom, Impfung): Der Nutzer meint
 * immer seinen lokalen Kalendertag, nicht den UTC-Tag.
 */
export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Heutiger lokaler Kalendertag als "JJJJ-MM-TT". */
export function todayKey(): string {
  return toLocalDateKey(now());
}

/** Lokaler Kalendertag mit Offset in Tagen (z. B. -1 = gestern). */
export function dateKeyWithOffset(offsetDays: number): string {
  const d = now();
  d.setDate(d.getDate() + offsetDays);
  return toLocalDateKey(d);
}

/** Wandelt einen Datums-Schluessel "JJJJ-MM-TT" in ein lokales Date-Objekt (Mitternacht lokal). */
export function dateKeyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map((p) => parseInt(p, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

/**
 * Anzeigeformat TT.MM.JJJJ – EINZIGES Datumsformat der App.
 * Akzeptiert Datums-Schluessel ("2026-07-09"), ISO-Zeitstempel
 * ("2026-07-09T14:30:00.000Z") und Date-Objekte.
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '–';
  let d: Date;
  if (value instanceof Date) {
    d = value;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    d = dateKeyToDate(value); // reiner Kalendertag: lokal interpretieren
  } else {
    d = new Date(value); // ISO-Zeitstempel: UTC -> lokal
  }
  if (isNaN(d.getTime())) return '–';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/** Uhrzeit-Anzeige HH:MM (lokal) – nur fuer Termine, Mehrfach-Dosierung, Sitter-Zeiten. */
export function formatTime(value: string | Date | null | undefined): string {
  if (!value) return '–';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '–';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Prueft, ob ein Datums-Schluessel in der Zukunft liegt (lokaler Kalendertag).
 * Zukunftsdaten sind fuer Ereignis-Eintraege gesperrt (Ausnahme: geplante Termine).
 */
export function isFutureDateKey(key: string): boolean {
  return key > todayKey();
}

/** Vergleich zweier Datums-Schluessel fuer Sortierung (Neuestes zuerst: b vor a). */
export function compareDateKeysDesc(a: string, b: string): number {
  return b.localeCompare(a);
}

/**
 * Weicht das Ereignis-Datum vom Erfassungs-Datum ab? Dann zeigt die
 * Detail-Ansicht "Nachgetragen am …" (Screen-Flow 1.2, Regel 4).
 */
export function isBackdated(eventDateKey: string, createdAtIso: string): boolean {
  const createdLocalKey = toLocalDateKey(new Date(createdAtIso));
  return eventDateKey !== createdLocalKey;
}

/**
 * React-Hook: Liefert den heutigen lokalen Kalendertag und berechnet ihn neu,
 * wenn die App aus dem Hintergrund zurueckkehrt (kein stiller Drift –
 * "Heute faellig" ist immer aktuell, auch nach Mitternacht oder Zeitzonenwechsel).
 */
export function useTodayKey(): string {
  const [key, setKey] = useState(todayKey());
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        const fresh = todayKey();
        setKey((prev) => (prev === fresh ? prev : fresh));
      }
    });
    // Zusaetzlich einmal pro Minute pruefen, falls die App offen ueber
    // Mitternacht laeuft (Testfall aus Offline-Strategie Abschnitt 2.3).
    const interval = setInterval(() => {
      const fresh = todayKey();
      setKey((prev) => (prev === fresh ? prev : fresh));
    }, 60_000);
    return () => {
      sub.remove();
      clearInterval(interval);
    };
  }, []);
  return key;
}
