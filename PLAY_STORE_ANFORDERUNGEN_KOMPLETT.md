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
| Store-Listing (Beschreibung, Screenshots) | ✅ Texte fertig (`STORE_LISTING.md`) | Ja – Screenshots erstellen + hochladen |
| App-Kategorie | Lifestyle | Ja – in Console auswählen |
| Kontakt-E-Mail für Store | ✅ simplypet.app@gmail.com | Nein |

---

## 3. BUILD-ANFORDERUNGEN (AAB-Datei)

| Anforderung | Status bei uns | Aktion nötig? |
|:---|:---|:---|
| Format: AAB (nicht APK) | ✅ Workflow vorbereitet | Ja – Workflow pushen |
| Signiert mit Upload-Key (NICHT Debug-Key) | ❌ Kein Keystore vorhanden | Ja – KRITISCH |
| targetSdkVersion ≥ 34 (Play Store Pflicht 2025+) | ✅ Wir haben 36 | Nein |
| minSdkVersion dokumentiert | ✅ 29 (Android 10) | Nein |
| versionCode höher als vorherige Uploads | ✅ 6 (erster Upload) | Nein |
| Keine Debug-Signatur | ❌ Aktuell Debug | Ja – Upload-Key erstellen |

### Signing-Setup (einmalig):
1. **Keystore erstellen:** `keytool -genkeypair -v -storetype PKCS12 -keystore upload-key.keystore -alias simplypet-upload -keyalg RSA -keysize 2048 -validity 10000`
2. **Keystore als Base64 kodieren:** `base64 upload-key.keystore > upload-key-base64.txt`
3. **GitHub Secrets anlegen:**
   - `UPLOAD_KEYSTORE_BASE64` = Inhalt von upload-key-base64.txt
   - `UPLOAD_KEY_ALIAS` = simplypet-upload
   - `UPLOAD_STORE_PASSWORD` = gewähltes Passwort
   - `UPLOAD_KEY_PASSWORD` = gewähltes Passwort
4. **Keystore SICHER aufbewahren** (Verlust = App kann nie wieder aktualisiert werden!)
5. **Play App Signing aktivieren** in Play Console (Google verwaltet dann den finalen Signierungsschlüssel)

---

## 4. GESCHLOSSENER TEST – ANFORDERUNGEN

| Anforderung | Status bei uns | Aktion nötig? |
|:---|:---|:---|
| Mindestens **12 Tester** (seit Dez 2024, vorher 20) | ❌ 3 Tester bisher | Ja – 9+ weitere finden |
| Tester müssen **14 Tage kontinuierlich** opted-in sein | ❌ Noch nicht gestartet | Startet nach Upload |
| Tester brauchen Gmail/@google Konto | Prüfen bei bestehenden 3 | Ja – sicherstellen |
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
| Kurzbeschreibung | 80 | ✅ fertig |
| Ausführliche Beschreibung | 4000 | ✅ fertig |
| App-Symbol (Icon) | 512x512 PNG/JPG | ✅ vorhanden |
| Feature Graphic (Kopfzeilenbild) | 1024x500 | ⚠️ Aktuelles Bild ist 4096x2304 – muss skaliert werden |
| Screenshots (Smartphone) | Min. 2, max. 8 (16:9 oder 9:16) | ❌ Fehlen komplett |
| Screenshots (Tablet, optional) | – | Optional |
| Kategorie | – | Noch auswählen |
| Kontakt-E-Mail | – | ✅ simplypet.app@gmail.com |
| Datenschutz-URL | – | ⚠️ Text fertig, URL fehlt noch |

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

---

## 7. NACH DEM GESCHLOSSENEN TEST – PRODUKTION

| Anforderung | Beschreibung |
|:---|:---|
| "Apply for production" | Button im Dashboard nach 14 Tagen |
| Fragen beantworten | Über den Test, die App, Produktionsreife |
| Google Review | Ca. 7 Tage |
| Preismodell festlegen | Einmalkauf 2,99 € |

---

## 8. ZUSAMMENFASSUNG: WAS FEHLT NOCH

| # | Was | Priorität | Wer |
|:---|:---|:---|:---|
| 1 | Google Identitätsprüfung abwarten | Hoch | Google (läuft) |
| 2 | Upload-Keystore erstellen | Hoch | Mark |
| 3 | GitHub Secrets anlegen | Hoch | Mark |
| 4 | Workflow-Datei `build-aab.yml` pushen | Hoch | Mark |
| 5 | Datenschutzerklärung hosten (GitHub Pages) | Hoch | Mark/Manus |
| 6 | App in Play Console anlegen | Hoch | Mark |
| 7 | Data Safety Formular ausfüllen | Hoch | Mark (mit Vorlage von Manus) |
| 8 | Content Rating Fragebogen | Mittel | Mark |
| 9 | Feature Graphic auf 1024x500 skalieren | Mittel | Manus |
| 10 | Screenshots erstellen (min. 2) | Mittel | Mark (aus App) |
| 11 | 12+ Tester finden | Hoch | Mark |
| 12 | Store-Listing in Console eintragen | Mittel | Mark (Texte von Manus) |
| 13 | Kontakttelefon bestätigen | Nach Identitätsprüfung | Mark |
