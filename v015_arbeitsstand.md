# v0.1.8 Arbeitsstand (26.07.2026)

## STATUS: 🚧 IN ARBEIT – Fehlende Features werden implementiert

## AKTUELLE SITUATION (29.07.2026):
- App-Code ist auf v1.0.0 (app.json: version "1.0.0", versionCode 11)
- GitHub Actions AAB-Build **ERFOLGREICH** abgeschlossen (28m 57s)
- **AAB verfügbar als GitHub Artifact (90 Tage):**
  - `simplyPet_v0.1.8_AAB` (signiert mit Upload-Keystore, Play Store ready)
- **APKs weiterhin verfügbar (30 Tage):**
  - `simplyPet_v0.1.8_TESTER` (51.8 MB, mit 90-Tage-Timer)
  - `simplyPet_v0.1.8_DEV` (51.8 MB, ohne Timer)
- ✅ Sitter-Modus (E-105) spezifiziert und tierarten-spezifische Informationen in `SITTER_MODUS_SPEZIFIKATION.md` dokumentiert
- ✅ E-105 Implementierung geplant als Update NACH Play Store Closed Test

## GOOGLE PLAY STORE – ACCOUNT EINGERICHTET:
- **Developer Account:** Simply DevApps
- **E-Mail:** simplypet.app@gmail.com
- **Konto-ID:** 7410284957463056128
- **Kontotyp:** Privates Konto (Einzelperson)
- **Servicegebühr:** 15 % (statt 30 %, bis 1 Mio USD/Jahr)
- **Preismodell:** Einmalkauf 2,99 €
- **Entwicklersymbol:** Simply DevApps Logo (CRT-Monitor, Patina) – hochgeladen
- **Kopfzeilenbild:** Banner (3 CRT-Monitore, Werkbank) – hochgeladen
- **Werbetext:** "Simple apps for everyone. Keep your data and information on your device and decide what you're willing to share."
- **Identitätsbestätigung:** Eingereicht, wartet auf Google-Prüfung (2-7 Tage)
- **Kontakttelefonnummer:** Noch nicht bestätigt (erst nach Identitätsprüfung möglich)
- **App-Kategorie:** Lifestyle (E-106)
- **Logo-Dateien im Repo:**
  - `simply_devapps_logo_v2.png` (1920x1920, Original)
  - `simply_devapps_icon_512x512.jpg` (512x512, für Play Store)
  - `simply_devapps_banner_4096x2304.jpg` (4096x2304, Kopfzeilenbild)

## PLAY STORE VORBEREITUNG – ERLEDIGT:
| Aufgabe | Status | Datei/Ort |
|:---|:---|:---|
| Datenschutzerklärung | ✅ Erstellt | `PRIVACY_POLICY.md` |
| Store-Listing (Texte) | ✅ Erstellt | `STORE_LISTING.md` |
| App-Kategorie festgelegt | ✅ Lifestyle | `STORE_LISTING.md` |
| AAB-Workflow (mit Signing) | ✅ Funktioniert | `.github/workflows/build-aab.yml` |
| Upload-Keystore erstellt | ✅ Auf Marks PC | `C:\Windows\system32\upload-key.keystore` |
| GitHub Secrets angelegt | ✅ Alle 4 | UPLOAD_KEYSTORE_BASE64, UPLOAD_KEY_ALIAS, UPLOAD_STORE_PASSWORD, UPLOAD_KEY_PASSWORD |
| AAB erfolgreich gebaut | ✅ Build #5 | Artifact: `simplyPet_v0.1.8_AAB` |
| Vollständige Anforderungen-Checkliste | ✅ | `PLAY_STORE_ANFORDERUNGEN_KOMPLETT.md` |
| Feature Graphic (1024x500) | ✅ Erstellt | `feature_graphic_1024x500.png` |

## PLAY STORE – NOCH OFFEN (nach Identitätsprüfung):
| Aufgabe | Wer | Hinweis |
|:---|:---|:---|
| Datenschutzerklärung hosten | Mark | GitHub Pages aktivieren oder simplypet.de |
| App in Play Console anlegen | Mark | AAB hochladen |
| Data Safety Formular ausfüllen | Mark | Alles "Nein" (offline App) |
| Content Rating Fragebogen | Mark | USK 0 / PEGI 0 |
| Feature Graphic (1024x500) | ✅ Erledigt | `feature_graphic_1024x500.png` im Repo |
| Screenshots (min. 2) | ✅ Erledigt | 13 Screenshots im Ordner `screenshots/` |
| 12 Tester finden | Mark | Gmail-Adressen (seit Dez 2024 nur noch 12 nötig) |
| Kontakttelefon bestätigen | Mark | Nach Identitätsprüfung |

## OFFENE BUGS / VERBESSERUNGEN:
| ID | Beschreibung | Status |
|:---|:---|:---|
| E-110 | "In Erinnerung"-Modus (verstorbene Tiere) – Wolke+Kreuz-Icon, unter "Tiere verwalten", Akte read-only, Notifications stoppen, kein Sitter/Notfallpass | ⏳ Geplant für v1.1.0, spezifiziert (30.07.2026) |
| E-111 | Befund-Import via Share-Intent (PDF aus Mail teilen → App parst → Eintrag vorausfüllen) + Foto-OCR für Papier-Rechnungen | ⏳ Geplant für v1.1.0 |
| E-112 | NFC-Tag am Halsband als digitaler Notfallpass (Finder scannt → Kontaktdaten + Allergien) | 🔮 Zukunftsmusik |
| E-113 | Notification-Vorlauf wählbar (1 Tag / 3 Tage / 1 Woche vorher) | ⏳ Geplant für v1.1.0 |
| E-114 | Notification-Uhrzeit wählbar (statt fest 09:00) | ⏳ Geplant für v1.1.0 |
| E-115 | Mehrfach-Erinnerung (z.B. morgens + abends bei 2x täglich Medikament) | ⏳ Geplant für v1.1.0 |

## GERADE ERLEDIGT (28.07.2026):
| ID | Beschreibung | Fix |
|:---|:---|:---|
| BUG | Bearbeiten-Buttons in "Tiere verwalten" funktionierten nicht | ✅ StammdatenBearbeiten + TierAnlegen im MoreStack registriert (AppNavigator.tsx) |
| BUG | Unterschrift-Zeichenfeld: Löschen/Übernehmen-Buttons nicht sichtbar | ✅ WebView-Footer ausgeblendet, native Pressable-Buttons (Übernehmen/Löschen/Abbrechen) wie Abbrechen-Stil (SitterScreen.tsx) |
| BUG | Tab-Navigation: Unter-Screens blieben hängen (z.B. Notfallpass bei Zuhause-Tab) | ✅ Alle Tabs setzen Stack auf Main zurück bei Tab-Press (AppNavigator.tsx) |
| BUG | Notification-Tap öffnete Hauptseite statt Notfallpass | ✅ LockScreenActivity setzt Action OPEN_EMERGENCY statt Intent-Extra (withShowOnLockScreen.js) |
| STORE | FOREGROUND_SERVICE_SPECIAL_USE blockierte Play Console (Video-Nachweis nötig) | ✅ Berechtigung aus app.json UND withForegroundService.js entfernt, foregroundServiceType → shortService |
| STORE | versionCode 7 bereits in Console verwendet | ✅ versionCode auf 9 erhöht (app.json) |
| BUG | Über-Dialog zeigte "(Prototyp)" und "Tiergesundheits-App" | ✅ Entfernt bzw. geändert zu "Pocket-Tool-App für dein Tier" (MoreScreen.tsx) |
| BUG | DateField Quick-Chips bei allowFuture=true zeigten Vergangenheit | ✅ Dynamische Chips (Heute/In 1 Woche/In 2 Wochen) |
| BUG | Unterschrift-Modal Buttons abgeschnitten (sigPad flex:1) | ✅ maxHeight 350px + SafeArea paddingBottom |
| BUG | PDF-Crash bei fehlender Unterschrift (img src="") | ✅ Null-Check + Fallback-Text in vollmachtPdf.ts |
| BUG | EditEntryModal Buttons hinter System-Navigation | ✅ useSafeAreaInsets paddingBottom |
| BUG | EditEntryModal Datum als YYYY-MM-DD statt TT.MM.JJJJ | ✅ formatDate() für Anzeige |
| E-109 | Backup-Verschlüsselung (AES-256-GCM) | ✅ cryptoService.ts, backupService.ts erweitert, MoreScreen Passwort-Modal, expo-crypto |
| E-105 | Sitter-Modus komplett implementiert | ✅ SitterScreen.tsx, sitterConfig.ts, sitterPdf.ts, vollmachtPdf.ts, Migration 009, EditPetScreen Sitter-Infos, PetFileScreen Button, Navigation |
| E-108 | Push-Notifications (Erinnerungen) | ✅ notificationService.ts, Migration 008, AppointmentsScreen Toggle, VaccinationEntry + MedicationEntry Scheduling |
| – | Prototyp-Banner entfernt | ✅ AppointmentsScreen.tsx |
| – | Notification-Tap → Termine-Tab | ✅ navigationRef.ts + App.tsx |

## GERADE ERLEDIGT (26.07.2026):
| ID | Beschreibung | Fix |
|:---|:---|:---|
| BUG-5 | QR-Code enthielt nicht alle Notfall-Pass-Daten | ✅ Geschlecht, Kastration, Fellfarbe, Impfstatus, Gewicht hinzugefügt |
| E-104 | PDF-Dateiname war kryptisch (UUID) | ✅ Jetzt `Notfallpass_{Tiername}_{Datum}.pdf` |
| E-105 | Sitter-Modus Recherche & Spezifikation | ✅ Alle 7 Tiergruppen recherchiert und in `SITTER_MODUS_SPEZIFIKATION.md` dokumentiert |
| E-106 | App-Kategorie festgelegt | ✅ Lifestyle |
| – | Play Store Datenschutzerklärung | ✅ `PRIVACY_POLICY.md` |
| – | Play Store Listing Texte | ✅ `STORE_LISTING.md` |
| – | AAB-Workflow mit Signing | ✅ Getestet und funktionsfähig |
| – | Upload-Keystore + GitHub Secrets | ✅ Eingerichtet |

## NÄCHSTE SCHRITTE (Reihenfolge):
> **Entscheidung 28.07.2026: ALLE beworbenen Features werden implementiert. Store-Listing bleibt unverändert.**

1. ~~**Push-Notifications implementieren**~~ ✅ ERLEDIGT (28.07.2026)
2. ~~**Sitter-Modus implementieren**~~ ✅ ERLEDIGT (28.07.2026)
3. ~~**Backup-Verschlüsselung implementieren**~~ ✅ ERLEDIGT (28.07.2026)
4. Version auf 1.0.0 bumpen + neuen AAB-Build erstellen
5. Neue App in Play Console anlegen (Paketname `de.simplypet.app`)
6. Store-Listing (unverändert) + AAB hochladen
7. 12 Tester einladen, 14 Tage warten, Produktion beantragen

Details: siehe `SCHLACHTPLAN_STORE_RELEASE.md`

## PLAY STORE ANFORDERUNGEN (vor Produktion):
- 12 Tester müssen App 14 Tage lang über geschlossenen Test nutzen
- Datenschutzerklärung (öffentliche URL)
- AAB-Format (nicht APK) ✅
- Altersfreigabe-Fragebogen
- Data Safety Formular
- Store Listing (Screenshots, Beschreibung)
- Timer entfernen für Release-Version ✅ (AAB-Workflow baut ohne Timer)
- Version auf 1.0.0 hochsetzen

## IMPLEMENTIERT (v0.1.7 → v0.1.8):
1. ✅ BUG-3: Tägliche Checkbox resettet um 00:00 Uhr
2. ✅ BUG-4: Routine-Erledigungen nicht mehr im Verlauf
3. ✅ E-101: Farben pro Tiergruppe
4. ✅ E-102: Gruppen-Icons im Header
5. ✅ E-103: HomeScreen Variante C (Gruppen-Accordion)
6. ✅ GitHub Actions Workflow erstellt (build-apk.yml)

## IMPLEMENTIERT (v0.1.6 → v0.1.7):
1. ✅ E-94: Chip-Implantationsdaten (Datum + Stelle) in Stammdaten
2. ✅ E-95: Tätowierungsnummer + Datum + Stelle (Hund/Katze/Kaninchen)
3. ✅ E-96: Impfungen erweitert (Chargen-Nr., Gültig-ab, Hersteller/Impfstoff)
4. ✅ E-97 Phase 1: Dokumentenscan (Kamera + Galerie + Tier-Zuordnung)
5. ✅ E-98: Alphabetische + Gruppen-Sortierung Tiere auf HomeScreen
6. ✅ E-99: Untersuchungsergebnis als neuer Erfassungstyp
7. ✅ E-100: EU-Heimtierausweis-Nummer in Stammdaten
8. ✅ DB-Migration 007: Neue Spalten für alle Features
9. ✅ TypeScript 0 Fehler

## MITGENOMMEN AUS v0.1.6:
- ✅ E-93: Backup-System vollständig
- ✅ 90-Tage-Ablauf-Timer für Tester
- ✅ Feedback-PDF mit Geräte-Info-Feldern

## TECHNISCHE DETAILS:

### 90-Tage-Timer (App.tsx):
- BUILD_DATE = new Date('2026-07-20')
- EXPIRY_DAYS = 90
- checkExpiry() prüft beim App-Start
- Alert mit "Testversion abgelaufen" + BackHandler.exitApp()
- Ablauf: ca. 18. Oktober 2026
- **HINWEIS:** AAB-Workflow deaktiviert Timer automatisch (EXPIRY_DAYS = 9999)

### GitHub Actions Build-System:
- **APK-Workflow:** `.github/workflows/build-apk.yml`
  - Trigger: Push in `app/`-Ordner ODER manuell
  - Zwei Jobs: `build-tester` (mit Timer) + `build-dev` (ohne Timer)
  - Artifacts: 30 Tage Aufbewahrung
- **AAB-Workflow:** `.github/workflows/build-aab.yml`
  - Trigger: Nur manuell (workflow_dispatch)
  - Ein Job: `build-aab` (ohne Timer, signiert mit Upload-Keystore)
  - Signing: Upload-Keystore aus GitHub Secret (Base64-dekodiert)
  - Signing-Config wird per Python-Script in build.gradle injiziert
  - Artifacts: 90 Tage Aufbewahrung
- Build-Dauer: ca. 29 Min
- **WICHTIG:** Manus kann Workflow-Dateien NICHT pushen und Workflows NICHT triggern (fehlende `workflows`-Permission der GitHub App)

### Upload-Keystore:
- Alias: `simplypet-upload`
- Typ: PKCS12
- Gültigkeit: 10.000 Tage (~27 Jahre)
- Erstellt: 26.07.2026
- Speicherort: Marks PC (`C:\Windows\system32\upload-key.keystore`) + Desktop-Kopie
- **WICHTIG:** Bei Verlust kann die App im Play Store NICHT mehr aktualisiert werden!

### Backup-System (E-93):
- autoBackup bei: AddPet, EditPet, ManagePets, PetFile, Appointments, CaptureSheet
- Export: SAF (lokaler Speicher) + Share-Intent
- Import: DocumentPicker → JSON-Validierung → DB-Restore
- Status: AsyncStorage KEY_LAST_BACKUP_DATE
- app_version: dynamisch aus Constants.expoConfig?.version

### Markenrecherche (25.07.2026):
- Name "SimplyPet" ist frei nutzbar (keine registrierte Marke in Klasse 9/42)
- Kein Namenskonflikt in App Stores
- Empfehlung: Domain sichern + DPMA-Anmeldung bei kommerzieller Veröffentlichung
- Detailbericht: `SimplyPet_Markenrecherche_Bericht.md`

### Version:
- app.json: version "1.0.0", versionCode 12
- APK-Name: simplyPet_v1.0.0.apk / simplyPet_v1.0.0_DEV.apk
- AAB-Name: simplyPet_v1.0.0.aab

### Bugfix-Session 5 (29.07.2026):
**ANR-Fix (KRITISCH):**
- Ursache: `foregroundServiceType` stand auf `shortService` (3-Min-Timeout → ANR)
- Fix: Zurück auf `specialUse` + `FOREGROUND_SERVICE_SPECIAL_USE` Permission wieder eingefügt
- Video-Nachweis für Google: YouTube (unlisted) hochgeladen
- Dateien: withForegroundService.js, app.json

**Notification-Tap öffnet Hauptseite statt Notfallpass (E-121):**
- Ursache: tabPress-Listener setzt Stack auf HomeMain zurück BEVOR navigateToEmergencyPass() greift
- Fix: Navigation-Lock-Mechanismus – 600ms Lock blockiert tabPress-Reset bei externer Navigation
- Dateien: navigationRef.ts, AppNavigator.tsx
- ✅ **BESTÄTIGT auf Gerät (30.07.2026)** – Notification-Tap navigiert korrekt zum Notfallpass

**versionCode:** 10 → 11

### Bugfix-Session 6 (29.07.2026):
**PDF-Crash (Notfallpass + Sitter-Vollmacht):**
- Ursache: expo-file-system SDK 57 hat Legacy-API (`readAsStringAsync`, `moveAsync`) als Runtime-Error-Wrapper. `File.base64()` existiert nicht.
- Fix: Import auf `expo-file-system/legacy` umgestellt (beide Screens)
- Dateien: EmergencyPassScreen.tsx, SitterScreen.tsx

**Medikation: Hinweistext fehlt im Notfallpass (E-122):**
- Ursache: `hint_text` wurde in DB-Query und Interface nicht berücksichtigt
- Fix: PassMedication um `hint_text` erweitert. Darstellung in App-Screen, PDF, QR-Code
- Dateien: passData.ts, EmergencyPassScreen.tsx, EquinePassBlocks.tsx

**Vorerkrankungen: Datum fehlt (E-122):**
- Ursache: PassCondition hatte nur `name`, kein Datum
- Fix: PassCondition um `active_since` erweitert. Darstellung überall mit "am [Datum]" (OP = einmaliges Ereignis)
- Dateien: passData.ts, EmergencyPassScreen.tsx, EquinePassBlocks.tsx

**versionCode:** 11 → 12 (für nächsten AAB-Build mit allen Fixes)

**Alle Stellen geprüft und konsistent:**
- App-Screen (Standard): ✅
- App-Screen (Pferd/Equine): ✅
- QR-Code-Text: ✅
- PDF-Export (HTML): ✅
- Sitter-PDF: ✅ (hatte hint_text bereits)

**✅ BESTÄTIGT auf Gerät (30.07.2026, APK versionCode 12):**
- PDF-Crash Notfallpass: behoben ✅
- PDF-Crash Sitter-Vollmacht: behoben ✅
- Medikation mit Hinweistext: sichtbar ✅
- Vorerkrankungen mit Datum ("am"): sichtbar ✅
- ANR-Fix (5+ Min offen): ❓ noch ausstehend

### Bugfix-Session 7 (30.07.2026):

**Tägliche Erinnerungen: Nur 1 von N Notifications wird angezeigt:**
- Ursache: Beim Erstellen einer Medikamenten-Erinnerung wird die Notification einmalig auf morgen 09:00 geplant. Nach dem Feuern ist sie weg. Nur das Abhaken plant die nächste Notification. Erinnerungen die NICHT abgehakt werden (weil z.B. die App nicht geöffnet wird oder der User sie ignoriert) verlieren ihre Notification dauerhaft.
- Fix: Beim Laden des AppointmentsScreen (`reload()`) werden jetzt ALLE aktiven täglichen Erinnerungen automatisch auf morgen 09:00 neu gescheduled. Da `scheduleReminderNotification()` die gleiche ID nutzt, wird keine Duplikat-Notification erzeugt – es wird nur sichergestellt dass immer eine ansteht.
- Datei: AppointmentsScreen.tsx
- **❓ Noch nicht auf Gerät bestätigt** (erst mit nächstem Build)
### E-114 – DailyTrigger + Uhrzeit wählbar (30.07.2026):
**Problem:** E-123 (Reschedule bei App-Start) war ein Workaround – funktioniert nur wenn die App geöffnet wird.
**Lösung:** `DailyTriggerInput` von expo-notifications – feuert automatisch jeden Tag zur gewählten Uhrzeit, ohne dass die App laufen muss.

**Änderungen:**
- `notificationService.ts`: Neue `scheduleDailyNotification()` Funktion mit `SchedulableTriggerInputTypes.DAILY`
- `database.ts`: Migration 010 – `reminder_hour` + `reminder_minute` Spalten (DEFAULT 9/0)
- `MedicationEntryScreen.tsx`: Uhrzeit-Picker (DateTimePicker, Standard 09:00), DailyTrigger beim Speichern
- `AppointmentsScreen.tsx`: Reschedule nutzt DailyTrigger mit gespeicherter Uhrzeit; Toggle/Undo differenziert zwischen täglichen (DailyTrigger) und einmaligen (Date-Trigger)
- `VaccinationEntryScreen.tsx`: Bleibt bei einmaligem Date-Trigger (Impfungen sind keine täglichen Erinnerungen)

**Abhängigkeit:** `@react-native-community/datetimepicker` (bereits in package.json: v9.1.0)
**TypeScript:** 0 Fehler ✅
**versionCode:** 12 (bereits gesetzt)
**❓ Noch nicht auf Gerät bestätigt** (erst mit nächstem Build)
