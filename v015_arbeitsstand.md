# v0.1.6 Arbeitsstand (20.07.2026)

## STATUS: ✅ RELEASE – v0.1.7 mit erweiterten Impfpass-Feldern

## IMPLEMENTIERT (v0.1.6 → v0.1.7):
1. ✅ E-94: Chip-Implantationsdaten (Datum + Stelle) in Stammdaten
2. ✅ E-95: Tätowierungsnummer + Datum + Stelle (Hund/Katze/Kaninchen)
3. ✅ E-96: Impfungen erweitert (Chargen-Nr., Gültig-ab, Hersteller/Impfstoff)
4. ✅ E-97 Phase 1: Dokumentenscan (war bereits implementiert – Kamera + Galerie + Tier-Zuordnung)
5. ✅ E-98: Alphabetische + Gruppen-Sortierung Tiere auf HomeScreen (Toggle-Button)
6. ✅ E-99: Untersuchungsergebnis als neuer Erfassungstyp (Blutbild, Röntgen etc.)
7. ✅ E-100: EU-Heimtierausweis-Nummer in Stammdaten (Hund/Katze/Frettchen)
8. ✅ DB-Migration 007: Neue Spalten für alle Features
9. ✅ TypeScript 0 Fehler

## MITGENOMMEN AUS v0.1.6:
- ✅ E-93: Backup-System vollständig
- ✅ 90-Tage-Ablauf-Timer für Tester
- ✅ Feedback-PDF mit Geräte-Info-Feldern

## MITGENOMMEN AUS v0.1.5:
7. ✅ E-29/E-30/E-76: Tierakte-Einträge bearbeiten + löschen
8. ✅ E-52: Low-Memory-Handling
9. ✅ E-72: Show-on-Lock-Screen
10. ✅ E-77 bis E-87: Alle Session-Änderungen aus v0.1.4
11. ✅ EditPetScreen Pferde-Felder (9 equine_* Felder)
12. ✅ Kotprobe-Erfassungstyp (FecalSampleEntryScreen, EpG-Wert)
13. ✅ Bugfix E-90/E-92: Notification-Icon (simplyPet-Pfote)
14. ✅ E-91: Konsistenter APK-Dateiname

## TECHNISCHE DETAILS:

### 90-Tage-Timer (App.tsx):
- BUILD_DATE = new Date('2026-07-20')
- EXPIRY_DAYS = 90
- checkExpiry() prüft beim App-Start
- Alert mit "Testversion abgelaufen" + BackHandler.exitApp()
- Ablauf: ca. 18. Oktober 2026

### Backup-System (E-93):
- autoBackup bei: AddPet, EditPet, ManagePets, PetFile, Appointments, CaptureSheet
- Export: SAF (lokaler Speicher) + Share-Intent
- Import: DocumentPicker → JSON-Validierung → DB-Restore
- Status: AsyncStorage KEY_LAST_BACKUP_DATE
- app_version: dynamisch aus Constants.expoConfig?.version

### Version:
- app.json: version "0.1.6", versionCode 6
- APK-Name: simplyPet_v0.1.6.apk
