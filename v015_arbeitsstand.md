# v0.1.6 Arbeitsstand (20.07.2026)

## STATUS: ✅ RELEASE – Tester-APK mit 90-Tage-Timer

## IMPLEMENTIERT (v0.1.5 → v0.1.6):
1. ✅ E-93: Backup-System vollständig (autoBackup bei jeder Datenänderung, SAF Export, DocumentPicker Import)
2. ✅ E-93: AsyncStorage-Status (KEY_LAST_BACKUP_DATE, überlebt App-Updates)
3. ✅ E-93: app_version dynamisch via Constants.expoConfig?.version
4. ✅ 90-Tage-Ablauf-Timer für Tester (BUILD_DATE=2026-07-20, EXPIRY_DAYS=90)
5. ✅ Feedback-PDF aktualisiert (90-Tage-Hinweis + Backup-Sektion)
6. ✅ TypeScript 0 Fehler

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
