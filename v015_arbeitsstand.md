# v0.1.8 Arbeitsstand (25.07.2026)

## STATUS: 🔧 BUILD AUSSTEHEND – Workflow-Fix nötig

## AKTUELLE SITUATION (25.07.2026):
- App-Code ist auf v0.1.8 (app.json: version "0.1.8", versionCode 6)
- GitHub Actions Workflow `build-apk.yml` existiert und wurde manuell getriggert
- **Build-Ergebnis:** Kompilierung ERFOLGREICH (30 Min), aber Rename-Schritt fehlgeschlagen
- **Fehler:** `cp: cannot stat 'app/android/app/build/outputs/apk/release/app-release.apk': No such file or directory`
- **Ursache:** Expo/React Native erzeugt die APK unter einem anderen Dateinamen als erwartet (nicht `app-release.apk`)
- **Fix:** `find`-Befehl statt hardcoded Pfad (bereits vorbereitet, muss manuell auf GitHub committed werden)
- **Blocker:** Manus-Token hat keine `workflows`-Permission → Workflow-Dateien können NICHT automatisch gepusht werden

## OFFENE AKTION (Nutzer muss manuell erledigen):
1. GitHub → `.github/workflows/build-apk.yml` → Edit
2. Beide `Rename APK`-Schritte ersetzen durch `Find and Rename APK` mit `find`-Befehl
3. Commit → Build manuell triggern (Actions → Run workflow)

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
- Artifacts: 30 Tage Aufbewahrung
- **WICHTIG:** Manus kann Workflow-Dateien NICHT pushen (fehlende `workflows`-Permission)

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
- APK-Name: simplyPet_v0.1.8.apk (sobald Build läuft)
