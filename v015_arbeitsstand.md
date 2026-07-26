# v0.1.8 Arbeitsstand (26.07.2026)

## STATUS: ✅ AAB BUILD ERFOLGREICH – Play Store ready

## AKTUELLE SITUATION (26.07.2026):
- App-Code ist auf v0.1.8 (app.json: version "0.1.8", versionCode 6)
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
| Screenshots (min. 2) | Mark | App auf Gerät fotografieren |
| 12 Tester finden | Mark | Gmail-Adressen (seit Dez 2024 nur noch 12 nötig) |
| Kontakttelefon bestätigen | Mark | Nach Identitätsprüfung |

## OFFENE BUGS / VERBESSERUNGEN:
| ID | Beschreibung | Status |
|:---|:---|:---|
| – | Aktuell keine offenen Bugs | – |

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
1. ~~Datenschutzerklärung erstellen~~ ✅ ERLEDIGT
2. ~~Store-Listing vorbereiten~~ ✅ ERLEDIGT
3. ~~AAB-Workflow erstellen + testen~~ ✅ ERLEDIGT
4. ~~Upload-Keystore + Secrets~~ ✅ ERLEDIGT
5. ~~AAB erfolgreich bauen~~ ✅ ERLEDIGT
6. Datenschutzerklärung hosten (GitHub Pages oder simplypet.de)
7. Google Identitätsprüfung abwarten
8. App in Play Console anlegen + AAB hochladen
9. Geschlossener Test starten (12 Tester, 14 Tage)
10. E-105 Sitter-Modus implementieren (als Update nach Closed Test)
11. Onboarding-Screen für Erstnutzer erstellen
12. Domain sichern (simplypet.de / .app)

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
- app.json: version "0.1.8", versionCode 6
- APK-Name: simplyPet_v0.1.8.apk / simplyPet_v0.1.8_DEV.apk
- AAB-Name: simplyPet_v0.1.8.aab
