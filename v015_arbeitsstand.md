# v0.1.8 Arbeitsstand (26.07.2026)

## STATUS: ✅ BUILD ERFOLGREICH – APKs verfügbar

## AKTUELLE SITUATION (26.07.2026):
- App-Code ist auf v0.1.8 (app.json: version "0.1.8", versionCode 6)
- GitHub Actions Build **ERFOLGREICH** abgeschlossen
- **APKs verfügbar als GitHub Artifacts (30 Tage):**
  - `simplyPet_v0.1.8_TESTER` (51.8 MB, mit 90-Tage-Timer)
  - `simplyPet_v0.1.8_DEV` (51.8 MB, ohne Timer)
- Workflow-Fix (find statt hardcoded Pfad) wurde vom Nutzer manuell committed
- ✅ Sitter-Modus (E-105) spezifiziert und tierarten-spezifische Informationen in `SITTER_MODUS_SPEZIFIKATION.md` dokumentiert

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
- **Logo-Dateien im Repo:**
  - `simply_devapps_logo_v2.png` (1920x1920, Original)
  - `simply_devapps_icon_512x512.jpg` (512x512, für Play Store)
  - `simply_devapps_banner_4096x2304.jpg` (4096x2304, Kopfzeilenbild)

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

## NÄCHSTE SCHRITTE (Reihenfolge):
1. ~~BUG-5 fixen (QR-Code alle Felder)~~ ✅ ERLEDIGT
2. ~~E-104 fixen (PDF-Dateiname)~~ ✅ ERLEDIGT
3. Tester-Feedback mit v0.1.8 sammeln (3 Personen, 5 Geräte)
4. Onboarding-Screen für Erstnutzer erstellen
5. Datenschutzerklärung erstellen + hosten
6. AAB (Android App Bundle) statt APK für Play Store
7. Geschlossener Test im Play Store starten (20 Tester, 14 Tage)
8. Domain sichern (simplypet.de / .app)

## PLAY STORE ANFORDERUNGEN (vor Produktion):
- 20 Tester müssen App 14 Tage lang über geschlossenen Test nutzen
- Datenschutzerklärung (öffentliche URL)
- AAB-Format (nicht APK)
- Altersfreigabe-Fragebogen
- Store Listing (Screenshots, Beschreibung)
- Timer entfernen für Release-Version
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

### GitHub Actions Build-System:
- Workflow: `.github/workflows/build-apk.yml`
- Trigger: Push in `app/`-Ordner ODER manuell via `workflow_dispatch`
- Zwei Jobs: `build-tester` (mit 90-Tage-Timer) + `build-dev` (Timer deaktiviert)
- APK-Benennung: `simplyPet_v{version}.apk` (Tester) / `simplyPet_v{version}_DEV.apk`
- APK-Suche: `find app/android/app/build/outputs -name "*.apk"` (dynamisch, nicht hardcoded)
- Artifacts: 30 Tage Aufbewahrung
- Build-Dauer: ca. 30 Min (erster Lauf), danach schneller durch Caching
- **WICHTIG:** Manus kann Workflow-Dateien NICHT pushen (fehlende `workflows`-Permission der GitHub App)

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
