# Prüfprotokoll Teilauftrag 4.2 – Funktionen & Einträge

**Datum:** 09.07.2026 · **Prüfumfang:** Alle in 4.2 gebauten Funktionen, vor Auslieferung geprüft und korrigiert (Projektvorgabe: Selbstüberprüfung auf Funktion vor Auslieferung).

## 1. Technische Prüfungen

| Prüfung | Werkzeug / Methode | Ergebnis |
|:---|:---|:---|
| TypeScript-Kompilierung | `npx tsc --noEmit` | **0 Fehler** |
| Projektgesundheit | `npx expo-doctor` | **20/20 Checks bestanden** |
| Android-Bundle (Rauchtest) | `npx expo export --platform android` | **Baut fehlerfrei** (keine Laufzeit-Importfehler) |
| SQL-Schema-Abgleich | Eigenes Prüfskript: alle 18 INSERT/UPDATE-Statements gegen das Tabellenschema (Spalten existieren? Spalten- = Wertanzahl?) | **OK** – ein anfänglicher Fehlalarm des Prüfskripts (Regex) wurde untersucht und der Code als korrekt verifiziert |
| Saisonfenster-Logik | Node-Logiktest `isInSeason()`: 11 Fälle inkl. Jahreswechsel-Fenster (Nov–Feb), Randmonate; plus Äquivalenz-Test SQL-Filter ↔ JS-Funktion (60 Kombinationen) | **Alle bestanden** |
| Routen-Konsistenz | Grep-Abgleich: alle `navigate()`-Ziele und alle 6 Erfassen-Overlay-Optionen gegen registrierte Stack-Routen | **Vollständig verdrahtet** |
| Zeit-Integrität | Kein `new Date()` außerhalb des zentralen Zeit-Moduls | **Bestanden** (0 Treffer) |

## 2. Spezifikations-Abgleich (Screen-Flow, Datenmodell, Doktrinen)

| Anforderung | Quelle | Umsetzung | Status |
|:---|:---|:---|:---|
| Gewicht mit Plausibilitäts-Hinweis (nicht blockierend) | Screen-Flow 2.4 | WeightEntryScreen: artspezifischer Bereich, ehrlicher Warnhinweis, Speichern trotzdem möglich | Bestanden |
| Beobachtung Freitext-first, Aquarium → Wasserwert-Modus | Screen-Flow 2.4, Tierarten-Festlegungen | ObservationEntryScreen: Freitext ist Kern, Wasserwert-Variante mit Parameter+Messwert | Bestanden |
| Vorfall Freitext-first, artneutrale Kategorien | Tierarten-Festlegungen | IncidentEntryScreen: „Was ist passiert?" zuerst und allein ausreichend; Kategorien optional; artgerechte Beispiele je Cluster; strukturierte Angaben als JSON in `notes` | Bestanden |
| Impfung erzeugt automatisch Erinnerung aus Fälligkeitsdatum | Screen-Flow 2.4/2.5 | VaccinationEntryScreen: Impfung + Erinnerung atomar in **einer Transaktion** | Bestanden |
| Medikament/Pflege mit Mehrfach-Dosierung, tägliche Erinnerung, Saisonfenster | Datenmodell 2.5/2.7 | MedicationEntryScreen: Typen, Uhrzeiten (JSON), `repeat_rule='taeglich'`, `season_start/end` – atomar mitgespeichert | Bestanden |
| Dokument-Foto mit ehrlicher Berechtigungs-Kette | Berechtigungs-Konzept | DocumentCaptureScreen: eigene Erklärung **vor** dem System-Dialog („Bild bleibt auf deinem Gerät"), Ablehnung wird respektiert mit Alternativweg (Galerie/Einstellungen) | Bestanden |
| Ein-Tap-Checkbox in Terminen, keine Zwischendialoge | Screen-Flow 2.5 | AppointmentsScreen: großflächige Checkbox, ein Tap erledigt; Doppel-Tap-Schutz (`busyId`) | Bestanden |
| Fehl-Tap folgenlos (verzeihende Bedienung) | Eingabe-Stabilitäts-Doktrin | Erledigt-Liste (30 Tage) mit „Rückgängig" | Bestanden |
| Tägliches Abhaken protokolliert Gabe im Verlauf | Datenmodell 2.4 | `health_records`-Eintrag „Medikamentengabe" + Fälligkeit rückt auf morgen – in einer Transaktion | Bestanden |
| Saisonale Erinnerungen außerhalb ihrer Monate ausgeblendet | Datenmodell 2.7 | Filter in Termine-Tab **und** Home-Statuskarten (identische Logik, per Test verifiziert) | Bestanden |
| Stammdaten bearbeiten (Stift auf Passkarte) | Screen-Flow 2.3 | EditPetScreen: alle Felder inkl. Kastration, Chip (15-Ziffern-Hinweis, nicht blockierend), Tierarzt, Foto, Farbe; Tierart bewusst nicht änderbar (ehrlicher Hinweis) | Bestanden |
| Tiere verwalten mit Archiv | Screen-Flow 2.6, Datenmodell 2.1 | ManagePetsScreen: Archivieren/Zurückholen, ehrlicher Hinweis „alle Daten bleiben erhalten"; kein Löschen im Prototyp (bewusst, ehrlich kommuniziert) | Bestanden |
| Archivierte Tiere ohne Störgeräusche | Datenmodell 2.1 | Home-Kacheln, Statuskarten und Termine filtern `archived = 0` | Bestanden |
| Draft-Autosave in **allen** Formularen | Eingabe-Stabilitäts-Doktrin | Alle 6 Eintragsformulare + EditPet: Autosave ≤ 2 s, „Fortsetzen oder verwerfen?", Zurück-Geste fragt nach, atomares Speichern, sichtbare Bestätigung, Eingaben bleiben bei Fehler erhalten | Bestanden |
| Keine toten Knöpfe | Doktrin | Einziger verbleibender „Kommt in 4.x"-Hinweis: Mehr-Bereich („Deine Daten", „Über simplyPet" → 4.4) – ehrlich beschriftet. „Tiere verwalten" jetzt voll funktional, Erfassen-Overlay vollständig verdrahtet | Bestanden |
| Nachgetragen-Vermerk & Sortierung | Screen-Flow 1.2 | Alle neuen Eintragstypen laufen über dieselben Verlaufs-Karten (Ereignisdatum absteigend, „Nachgetragen am …") | Bestanden |

## 3. Gefundene und korrigierte Punkte während der Prüfung

1. **Prüfskript-Fehlalarm (SQL-Abgleich):** Erste Regex koppelte INSERT und VALUES nicht statement-genau und meldete einen Scheinfehler im ObservationEntryScreen. Manuelle Inspektion ergab: Code korrekt (11 Spalten = 11 Werte). Prüfskript verfeinert, Wiederholungslauf: 18/18 Statements fehlerfrei.
2. **Home-Statuskarten:** Ursprünglich zählten überfällige Erinnerungen archivierter Tiere und saisonal pausierte Erinnerungen mit. Korrigiert: identischer Filter wie im Termine-Tab (per 60-Kombinationen-Test als äquivalent verifiziert).
3. **Verlaufs-Labels:** Alte kleingeschriebene `record_type`-Werte aus 4.1-Testdaten blieben lesbar (Labels decken alte und neue Schreibweise ab – Altdaten-sicher).

## 4. Bewusste Prototyp-Grenzen (ehrlich dokumentiert)

- System-Push-Benachrichtigungen kommen in 4.3 (In-App-Erinnerungen sind voll funktional); im Mehr-Bereich entsprechend gekennzeichnet.
- Kein endgültiges Löschen von Tieren (nur Archiv) – Schutz vor versehentlichem Datenverlust, in der App ehrlich erklärt.
- Der Tageswechsel-Testfall (Roadmap 4.5 / Nutzertest-Block 4d) bleibt für den Gerätetest bestehen und gilt zusätzlich für die neuen Erinnerungsfunktionen.
