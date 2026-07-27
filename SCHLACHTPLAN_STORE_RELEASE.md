# Schlachtplan: SimplyPet Store-Release

**Ziel:** Die App "SimplyPet" (de.simplypet.app) in den geschlossenen Play Store Test bringen.
**Status:** Audit hat 3 fehlende Features ergeben, die im Store-Listing beworben wurden.
**Entscheidung:** Option C (Kombination aus Implementierung des wichtigsten Features und Korrektur des Listings).

---

## Phase 1: Store-Listing bereinigen (SOFORT)
Da der Sitter-Modus und die Verschlüsselung erst in späteren Updates kommen, muss das Store-Listing korrigiert werden, um Falschaussagen (und damit Ablehnungen durch Google) zu vermeiden.

**Aufgaben:**
1. In `STORE_LISTING.md` den Punkt "Sitter-Modus" komplett entfernen.
2. In `STORE_LISTING.md` beim Punkt "Souveräne Backups" das Wort "verschlüsselte" durch "lokale" ersetzen.
3. In der Play Console (durch Mark): Diese Texte ebenfalls aktualisieren.

---

## Phase 2: Push-Notifications implementieren (Kern-Feature)
Eine Termin-App ohne Erinnerungen ist nutzlos. Dieses Feature MUSS vor dem Release rein.

**Aufgaben (Code):**
1. **Abhängigkeiten installieren:** `expo-notifications` und `expo-device` hinzufügen.
2. **Berechtigungen:** `app.json` aktualisieren (Vibration, Wake Lock, Post_Notifications).
3. **Notification Service (`notificationService.ts`):**
   - Berechtigungsabfrage beim Start
   - Lokales Scheduling von Benachrichtigungen (Titel, Body, Trigger-Datum)
   - Stornierung von Benachrichtigungen
4. **Termin-Integration (`AppointmentsScreen.tsx` & `EditAppointmentModal.tsx`):**
   - Prototyp-Banner entfernen!
   - UI-Toggle "Erinnerung aktivieren" hinzufügen
   - Auswahl der Vorlaufzeit (z.B. 1 Tag vorher, 1 Woche vorher)
   - Beim Speichern/Ändern/Löschen eines Termins die entsprechende Notification planen/stornieren.
5. **Datenbank (`database.ts`):**
   - Ggf. Spalten `reminder_active` (boolean) und `reminder_id` (string) zur Tabelle `appointments` hinzufügen (Migration 008).
6. **Testen:** TypeScript-Check (`npx tsc --noEmit`) muss 0 Fehler ergeben.

---

## Phase 3: Play Console Setup & Build
Wenn der Code steht und getestet ist, geht es an den Release.

**Aufgaben:**
1. **Versions-Bump:** In `app.json` die Version auf `1.0.0` und `versionCode` auf `7` setzen.
2. **Build:** AAB über GitHub Actions bauen (`build-aab.yml`).
3. **Play Console (durch Mark):**
   - Neue App anlegen mit exaktem Paketnamen `de.simplypet.app`.
   - Alle Formulare (Datensicherheit, Zielgruppe etc.) erneut ausfüllen.
   - Korrigierte Store-Listing-Texte einfügen.
   - Preis festlegen (Basispreis 2,99€, dann für alle Länder übernehmen).
   - AAB im geschlossenen Test-Track hochladen.
4. **Tester einladen:** 12 Tester per E-Mail hinzufügen.

---

## Phase 4: Zukünftige Updates (Post-Release)
Diese Features sind im Repo spezifiziert und kommen als Updates nach dem 14-tägigen Test.

1. **Sitter-Modus (E-105):** Spezifikation existiert bereits (`SITTER_MODUS_SPEZIFIKATION.md`).
2. **Backup-Verschlüsselung:** Integration einer Crypto-Library für sichere JSON-Exporte.
3. **Onboarding-Screen:** Für Erstnutzer.
