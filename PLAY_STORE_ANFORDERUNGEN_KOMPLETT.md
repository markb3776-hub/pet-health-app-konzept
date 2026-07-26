# Google Play Store – Vollständige Anforderungen (Stand: 26.07.2026)

Quellen:
- https://support.google.com/googleplay/android-developer/answer/14151465
- https://support.google.com/googleplay/android-developer/answer/9845334
- https://featuregate.de/guide/google-play-closed-testing
- https://docs.expo.dev/guides/local-app-production/
- https://reactnative.dev/docs/signed-apk-android
- https://developer.android.com/studio/publish/app-signing

---

## 1. ACCOUNT-ANFORDERUNGEN (vor App-Upload)

| Anforderung | Status bei uns | Aktion nötig? |
|:---|:---|:---|
| Developer Account erstellt | ✅ Simply DevApps | Nein |
| Einmalige Registrierungsgebühr ($25) bezahlt | ✅ | Nein |
| Identitätsbestätigung eingereicht | ⏳ Wartet auf Google (2-7 Tage) | Abwarten |
| Kontakttelefonnummer bestätigt | ❌ Erst nach Identitätsprüfung möglich | Danach erledigen |

---

## 2. APP-SETUP IN PLAY CONSOLE (vor Upload)

| Anforderung | Status bei uns | Aktion nötig? |
|:---|:---|:---|
| App erstellen (Name, Standardsprache, App-Typ) | ❓ Noch nicht angelegt | Ja – App in Console anlegen |
| Datenschutzerklärung (öffentliche URL) | ✅ Text fertig (`PRIVACY_POLICY.md`) | Ja – Hosten (GitHub Pages) |
| App-Zugang (Einschränkungen, Login?) | Keine (frei zugänglich, offline) | Angeben: "Kein Login nötig" |
| Anzeigen-Deklaration | Keine Werbung | Angeben |
| Content Rating (Altersfreigabe-Fragebogen) | Noch nicht ausgefüllt | Ja – Fragebogen in Console ausfüllen |
| Zielgruppe & Inhalte | Alle Altersgruppen | Ja – in Console angeben |
| Daten-Sicherheitsformular (Data Safety) | Noch nicht ausgefüllt | Ja – KRITISCH (s. Abschnitt 6) |
| Store-Listing (Beschreibung, Screenshots) | ✅ Texte + Screenshots fertig | Ja – in Console hochladen |
| App-Kategorie | ✅ Lifestyle (E-106) | Ja – in Console auswählen |
| Kontakt-E-Mail für Store | ✅ simplypet.app@gmail.com | Nein |

---

## 3. BUILD-ANFORDERUNGEN (AAB-Datei)

| Anforderung | Status bei uns | Aktion nötig? |
|:---|:---|:---|
| Format: AAB (nicht APK) | ✅ Workflow funktioniert | Nein |
| Signiert mit Upload-Key (NICHT Debug-Key) | ✅ Upload-Keystore erstellt | Nein |
| targetSdkVersion ≥ 34 (Play Store Pflicht 2025+) | ✅ Wir haben 36 | Nein |
| minSdkVersion dokumentiert | ✅ 29 (Android 10) | Nein |
| versionCode höher als vorherige Uploads | ✅ 6 (erster Upload) | Nein |
| Keine Debug-Signatur | ✅ Upload-Key signiert | Nein |
| AAB erfolgreich gebaut | ✅ Build #5 (28m 57s) | Nein |
| GitHub Secrets angelegt | ✅ Alle 4 | Nein |

### Signing-Setup: ✅ ERLEDIGT
- Upload-Keystore erstellt (PKCS12, Alias: `simplypet-upload`, 10.000 Tage Gültigkeit)
- Speicherort: Marks PC (`C:\Windows\system32\upload-key.keystore` + Desktop-Kopie)
- GitHub Secrets: `UPLOAD_KEYSTORE_BASE64`, `UPLOAD_KEY_ALIAS`, `UPLOAD_STORE_PASSWORD`, `UPLOAD_KEY_PASSWORD`
- **WARNUNG:** Bei Verlust des Keystores kann die App im Play Store NIE WIEDER aktualisiert werden!
- Play App Signing in Console aktivieren (Google verwaltet dann den finalen Signierungsschlüssel)

---

## 4. GESCHLOSSENER TEST – ANFORDERUNGEN

| Anforderung | Status bei uns | Aktion nötig? |
|:---|:---|:---|
| Mindestens **12 Tester** (seit Dez 2024, vorher 20) | ❌ Noch keine gesammelt | Ja – 12+ Gmail-Adressen finden |
| Tester müssen **14 Tage kontinuierlich** opted-in sein | ❌ Noch nicht gestartet | Startet nach Upload |
| Tester brauchen Gmail/@google Konto | – | Ja – sicherstellen |
| Tester müssen Opt-in-Link akzeptieren | – | Ja – Link verschicken |
| Tester-Liste als E-Mail-Liste ODER Google Group | – | Ja – anlegen |
| App muss in allen gewünschten Ländern verfügbar sein | – | Ja – Deutschland + ggf. AT/CH |
| App wird von Google **reviewed** (1-3 Tage) | – | Abwarten nach Upload |

### Tipps:
- 15-20 Tester als Puffer (falls jemand abspringt, resettet der 14-Tage-Timer)
- Tester müssen NICHT aktiv testen, nur opted-in bleiben
- Keine offensichtlich gefakten Accounts (test1@gmail.com etc.)
- Nicht dieselben 12 Adressen für mehrere Apps verwenden

---

## 5. STORE-LISTING – PFLICHTFELDER

| Feld | Max. Zeichen | Status |
|:---|:---|:---|
| App-Name | 30 | ✅ "SimplyPet" |
| Kurzbeschreibung | 80 | ✅ fertig (in `STORE_LISTING.md`) |
| Ausführliche Beschreibung | 4000 | ✅ fertig (in `STORE_LISTING.md`) |
| App-Symbol (Icon) | 512x512 PNG/JPG | ✅ `simply_devapps_icon_512x512.jpg` |
| Feature Graphic (Kopfzeilenbild) | 1024x500 | ✅ `feature_graphic_1024x500.png` |
| Screenshots (Smartphone) | Min. 2, max. 8 (9:16) | ✅ 13 Screenshots im Ordner `screenshots/` |
| Screenshots (Tablet, optional) | – | Optional, nicht nötig |
| Kategorie | – | ✅ Lifestyle |
| Kontakt-E-Mail | – | ✅ simplypet.app@gmail.com |
| Datenschutz-URL | – | ⚠️ Text fertig, URL fehlt (GitHub Pages aktivieren) |

### Empfohlene Screenshots für den Play Store (5 von 13):
1. `screenshots/01_homescreen_meine_tiere.jpg` – Übersicht aller Tiere
2. `screenshots/02_termine_bald_faellig.jpg` – Termine & Erinnerungen
3. `screenshots/08_notfallpass_profil.jpg` – Notfall-Pass mit Tierprofil
4. `screenshots/10_notfallpass_qrcode.jpg` – QR-Code & PDF-Teilen
5. `screenshots/07_datensicherung.jpg` – Datensicherung (Offline-Prinzip)

---

## 6. DATA SAFETY FORMULAR (KRITISCH!)

Google verlangt seit 2022 ein **Data Safety**-Formular für JEDE App. Hier muss deklariert werden welche Daten die App sammelt, ob sie geteilt werden, ob Verschlüsselung verwendet wird etc.

**Für SimplyPet (100% offline, kein Tracking):**

| Frage | Unsere Antwort |
|:---|:---|
| Sammelt die App Nutzerdaten? | Ja (lokal: Tierdaten, Fotos, Kontakte) |
| Werden Daten an Dritte geteilt? | Nein |
| Werden Daten verschlüsselt übertragen? | N/A (keine Übertragung) |
| Können Nutzer Löschung beantragen? | Ja (App deinstallieren = alles gelöscht) |
| Werden Daten für Werbung verwendet? | Nein |
| Werden Daten für Personalisierung verwendet? | Nein |
| Werden Standortdaten erhoben? | Nein (Permission explizit geblockt) |

### Schritt-für-Schritt im Data Safety Formular:
1. "Does your app collect or share any of the required user data types?" → **Yes**
2. "Is all of the user data collected by your app encrypted in transit?" → **Not applicable** (keine Datenübertragung)
3. "Do you provide a way for users to request that their data is deleted?" → **Yes** (App deinstallieren)
4. Dann für jede Datenkategorie:
   - **Personal info** → Nein
   - **Financial info** → Nein
   - **Health and fitness** → Nein (wir speichern Tier-Gesundheit, nicht Mensch!)
   - **Messages** → Nein
   - **Photos and videos** → Ja, aber NUR lokal gespeichert, NICHT geteilt
   - **Files and docs** → Ja (Backup-Dateien), aber NUR lokal
   - **App activity** → Nein
   - **Device or other IDs** → Nein

---

## 7. NACH DEM GESCHLOSSENEN TEST – PRODUKTION

| Anforderung | Beschreibung |
|:---|:---|
| "Apply for production" | Button im Dashboard nach 14 Tagen |
| Fragen beantworten | Über den Test, die App, Produktionsreife |
| Google Review | Ca. 7 Tage |
| Preismodell festlegen | Einmalkauf 2,99 € |
| Version hochsetzen | Auf 1.0.0 (versionCode 7+) |

---

## 8. ZUSAMMENFASSUNG: WAS IST ERLEDIGT / WAS FEHLT

### ✅ ERLEDIGT:
| # | Was | Erledigt am |
|:---|:---|:---|
| 1 | Developer Account erstellt | 25.07.2026 |
| 2 | Upload-Keystore erstellt + gesichert | 26.07.2026 |
| 3 | GitHub Secrets angelegt (alle 4) | 26.07.2026 |
| 4 | AAB-Workflow erstellt + getestet | 26.07.2026 |
| 5 | AAB erfolgreich gebaut (Build #5) | 26.07.2026 |
| 6 | Datenschutzerklärung geschrieben | 26.07.2026 |
| 7 | Store-Listing Texte fertig | 26.07.2026 |
| 8 | Feature Graphic (1024x500) erstellt | 26.07.2026 |
| 9 | Screenshots erstellt (13 Stück) | 26.07.2026 |
| 10 | App-Kategorie festgelegt (Lifestyle) | 26.07.2026 |
| 11 | Sitter-Modus spezifiziert (E-105) | 26.07.2026 |

### ❌ NOCH OFFEN (nach Identitätsprüfung):
| # | Was | Priorität | Wer |
|:---|:---|:---|:---|
| 1 | Google Identitätsprüfung abwarten | Hoch | Google (läuft) |
| 2 | Datenschutzerklärung hosten (GitHub Pages) | Hoch | Mark |
| 3 | Kontakttelefon bestätigen | Hoch | Mark |
| 4 | App in Play Console anlegen | Hoch | Mark |
| 5 | AAB hochladen | Hoch | Mark |
| 6 | Data Safety Formular ausfüllen | Hoch | Mark |
| 7 | Content Rating Fragebogen | Hoch | Mark |
| 8 | Store-Listing in Console eintragen | Hoch | Mark |
| 9 | Screenshots + Feature Graphic hochladen | Hoch | Mark |
| 10 | 12+ Tester finden (Gmail-Adressen) | Hoch | Mark |
| 11 | Geschlossenen Test starten | Hoch | Mark |
| 12 | Play App Signing aktivieren | Hoch | Mark |

→ **Detaillierte Schritt-für-Schritt-Anleitung:** Siehe `PLAY_STORE_SCHRITT_FUER_SCHRITT.md`
