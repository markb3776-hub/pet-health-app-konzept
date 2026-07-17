# v0.1.5 Arbeitsstand (17.07.2026)

## STATUS: ⚠️ IN BEARBEITUNG – Warten auf GO für E-93 (Backup-Fixes)

## IMPLEMENTIERT (Bisher):
1. ✅ E-29/E-30/E-76: Tierakte-Einträge bearbeiten + löschen
2. ✅ E-52: Low-Memory-Handling (registerLowMemoryHandler in App.tsx)
3. ✅ E-72: Show-on-Lock-Screen (plugins/withShowOnLockScreen.js + ForegroundService Intent umgeleitet)
4. ✅ E-77 bis E-87: Alle Session-Änderungen aus v0.1.4
5. ✅ HomeScreen: Bereits FlatList (war schon in v0.1.2 umgebaut)
6. ✅ Locale-Datumsformatierung: backupService.ts gefixt (TT.MM.JJJJ)
7. ✅ Auto-Backup nach Save: useEntryForm.ts Zeile 114-120 korrekt implementiert
8. ✅ EditPetScreen Pferde-Felder: Equidenpass-Nr., Haltungsform (Box/Offenstall/Weide/Paddock), geschätztes Gewicht (kg), Kolik-Vorgeschichte, Stallkontakt (Name/Tel/Box), Hufschmied (Name/Tel) – nur bei species === 'pferd' sichtbar
9. ✅ Kotprobe-Erfassungstyp: FecalSampleEntryScreen.tsx (NEU), record_type = 'Kotprobe', EpG-Wert als Zahlenfeld, nur für Pferde, im CaptureSheet als Option, in Navigation registriert, PetFileScreen zeigt EpG-Wert an
10. ✅ Bugfix E-90/E-92: Notification-Icon in Statusleiste war Fragezeichen → simplyPet-Pfote (korrekt skalierte DPI-PNGs 24-96px + setColor(0xFF2E9E83))
11. ✅ E-91: Konsistenter APK-Dateiname: simplyPet_v{version}.apk (Plugin withApkName.js)

## OFFEN (E-93 Backup-Fixes):
- ⏳ **Problemanalyse durchgeführt:** Ursachen für Backup-Bugs gefunden (siehe `E-93_Backup_Analyse.md`).
- ⏳ **Lösungsvorschläge erarbeitet:** SAF & AsyncStorage als beste Lösung vorgeschlagen.
- ⏳ **Warten auf Freigabe** durch den Nutzer, bevor der Code in `backupService.ts` und `MoreScreen.tsx` angepasst wird.

## TECHNISCHE DETAILS:

### EditPetScreen Pferde-Felder:
- PetRow Interface: +9 equine_* Felder
- EditPetDraft Interface: +9 equine* Felder (camelCase)
- petToDraft(): Mapping equine DB-Felder → Draft
- SQL UPDATE: +9 equine_* Spalten
- UI: Eigene Sektion "Pferde-Daten" mit Trennlinie, nur bei species === 'pferd'
- EQUINE_HOUSING_OPTIONS: ['Box', 'Offenstall', 'Weide', 'Paddock']

### Kotprobe (FecalSampleEntryScreen):
- Neuer Screen: src/screens/entries/FecalSampleEntryScreen.tsx
- CaptureSheet: CaptureAction um 'kotprobe' erweitert
- AppNavigator: KotprobeEintragen Route + Screen registriert
- PetFileScreen: HealthRecordRow um epg_value, SELECT um epg_value, Anzeige "Kotprobe: X EpG"
- RECORD_TYPE_LABELS: Kotprobe → 'Kotprobe (EpG)'
- Nur Pferde im PetPicker (horsePets Filter)
- Draft-System: draftKey 'entry_fecal_sample'

### Bugfix: Notification-Icon (E-90 / E-92):
- Ursache: `android.R.drawable.ic_menu_help` und fehlende Hintergrund-Maske
- Fix: `R.drawable.ic_notification` (Monochrome-Pfote ohne Hintergrund) + `setColor(0xFF2E9E83)` (simplyPet-Grün)
- Dokumentiert in `TESTGERAETE_MATRIX.md`

### Version:
- app.json: version "0.1.5", versionCode 5
