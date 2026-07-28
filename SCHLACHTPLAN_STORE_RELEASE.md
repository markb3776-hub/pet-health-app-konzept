# Schlachtplan: SimplyPet Store-Release

**Ziel:** Alle im Store-Listing beworbenen Features implementieren, dann App in den geschlossenen Play Store Test bringen.
**Entscheidung (28.07.2026):** Option A – Alles implementieren. Store-Listing bleibt wie es ist.
**Geschätzter Aufwand:** 2-3 Sessions

---

## REIHENFOLGE DER IMPLEMENTIERUNG

### Session 1: Push-Notifications (Erinnerungen & Termine) ✅ ERLEDIGT (28.07.2026)

**Was im Store-Listing steht:**
> "Erinnerungen & Termine: Verpasse nie wieder eine Wurmkur, eine Impfung oder den nächsten Tierarztbesuch."

**Was zu tun ist:**
1. `expo-notifications` und `expo-device` als Dependencies hinzufügen
2. `app.json` aktualisieren (Notification-Berechtigungen)
3. Neuen Service erstellen: `app/src/services/notificationService.ts`
   - Berechtigungsabfrage
   - Lokales Scheduling (Titel, Body, Trigger-Datum)
   - Stornierung einzelner Notifications
4. `AppointmentsScreen.tsx`: Prototyp-Banner ENTFERNEN
5. UI pro Termin: Toggle "Erinnerung" + Vorlaufzeit-Auswahl (1 Tag / 3 Tage / 1 Woche)
6. DB-Migration 008: Spalten `reminder_active` (INTEGER 0/1) und `notification_id` (TEXT) in `appointments`
7. Beim Speichern/Ändern/Löschen eines Termins → Notification planen/aktualisieren/stornieren
8. TypeScript-Check: 0 Fehler

**Abhängigkeiten:** Keine. Kann sofort starten.

---

### Session 2: Sitter-Modus (E-105) ✅ ERLEDIGT (28.07.2026)

**Was im Store-Listing steht:**
> "Sitter-Modus: Du fährst in den Urlaub? Generiere ein Info-Paket für deinen Tiersitter – inklusive tierartspezifischer Checklisten und einer digitalen Tierarzt-Vollmacht mit deiner Unterschrift."

**Was zu tun ist:**
1. Neuer Screen: `SitterScreen.tsx`
   - Sitter-Daten eingeben (Name, Telefon, Zeitraum von–bis)
   - Tier auswählen
   - Checkboxen: Was soll der Sitter sehen (Fütterung, Medikamente, Eigenheiten, Tierarzt-Kontakt, Notfallpass)
2. Tierartspezifische Checklisten (aus `SITTER_MODUS_SPEZIFIKATION.md`):
   - Hunde: Gassi-Zeiten, Futter, Leine/Geschirr, Kommandos
   - Katzen: Futter, Katzenklo, Indoor/Outdoor
   - Reptilien: Terrarien-Klima, UV-Lampe, Fütterungsrhythmus
   - Fische: Wasserwerte, Fütterung, Filter
   - Vögel: Freiflug, Futter, Abdeckung nachts
   - Pferde: Futter, Weide, Hufpflege
   - Nager: Futter, Einstreu, Auslauf
3. PDF-Vollmacht generieren:
   - Halter-Name + Adresse + Telefon
   - Sitter-Name
   - Tier + Zeitraum
   - Berechtigung (Behandlung + Kostenübernahme)
   - Finger-Unterschrift (einmalig in App hinterlegt, `expo-signature-pad` oder ähnlich)
   - QR-Code mit Klartext-Daten
   - Dateiname: `Vollmacht_{Tiername}_{Datum}.pdf`
4. Teilen-Funktion: Info-Paket + Vollmacht per Share-Intent
5. Navigation: Button "Sitter-Modus" auf Tier-Profil
6. TypeScript-Check: 0 Fehler

**Abhängigkeiten:** Spezifikation existiert bereits (`SITTER_MODUS_SPEZIFIKATION.md`).

---

### Session 2 oder 3: Backup-Verschlüsselung ✅ ERLEDIGT (28.07.2026)

**Was im Store-Listing steht:**
> "Souveräne Backups: Exportiere deine verschlüsselte Backup-Datei lokal..."

**Was zu tun ist:**
1. Crypto-Library hinzufügen (z.B. `expo-crypto` oder `react-native-aes-crypto`)
2. Beim Export: Passwort-Eingabe (2x) → JSON mit AES-256 verschlüsseln → verschlüsselte Datei exportieren
3. Beim Import: Passwort-Eingabe → Entschlüsseln → JSON-Validierung → DB-Restore
4. Abwärtskompatibilität: Alte unverschlüsselte Backups müssen weiterhin importierbar sein (Auto-Detect)
5. UI in Backup-Screen: Passwort-Feld + Hinweis "Passwort merken – ohne Passwort kein Restore!"
6. TypeScript-Check: 0 Fehler

**Abhängigkeiten:** Keine. Kann parallel zu Session 2 oder danach.

---

## NACH ALLEN FEATURES: Release-Vorbereitung

1. **Version bumpen:** `app.json` → version `1.0.0`, versionCode `7`
2. **AAB bauen:** GitHub Actions `build-aab.yml` triggern (Mark)
3. **Play Console (Mark):**
   - Neue App anlegen mit Paketnamen `de.simplypet.app`
   - Alle Formulare ausfüllen (Datensicherheit, Zielgruppe, Altersfreigabe etc.)
   - Store-Listing-Texte einfügen (unverändert aus `STORE_LISTING.md`)
   - Preis: 2,99€ Basispreis setzen → für alle Länder übernehmen
   - AAB im geschlossenen Test-Track hochladen
   - FOREGROUND_SERVICE_SPECIAL_USE: Video aufnehmen das die Notification zeigt
4. **12 Tester einladen** (Gmail-Adressen)
5. **14 Tage warten** → Produktion beantragen

---

## CHECKLISTE VOR AAB-BUILD

- [x] Push-Notifications funktionieren (Termin anlegen → Erinnerung kommt) ✅ 28.07.2026
- [x] Sitter-Modus funktioniert (Info-Paket + Vollmacht-PDF generierbar) ✅ 28.07.2026
- [x] Backup-Verschlüsselung funktioniert (Export verschlüsselt, Import entschlüsselt) ✅ 28.07.2026
- [x] Prototyp-Banner aus AppointmentsScreen entfernt ✅ 28.07.2026
- [ ] Version 1.0.0, versionCode 7
- [x] TypeScript 0 Fehler ✅ 28.07.2026
- [x] Jedes Store-Listing-Feature gegen Code verifiziert (kein Bullet ohne Funktion) ✅ 28.07.2026

## TO-DO NACH STORE-RELEASE (Version 1.1.0+)

- [ ] **"In Erinnerung"-Modus (E-110):**
  - Nutzer kann Tier als verstorben markieren (Datum + Notiz)
  - Tier verschwindet vom HomeScreen, wandert in "In Erinnerung"-Bereich
  - Tierakte bleibt vollständig einsehbar (read-only)
  - Archiv-Option: Endgültiges Löschen aus dem "In Erinnerung"-Bereich möglich (mit Warnung)
