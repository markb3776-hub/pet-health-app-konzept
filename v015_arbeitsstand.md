# v0.1.5 Arbeitsstand (15.07.2026)

## STATUS: ✅ FERTIG – alle Aufgaben implementiert, TypeScript 0 Fehler, gepusht.

## IMPLEMENTIERT:
1. ✅ E-29/E-30/E-76: Tierakte-Einträge bearbeiten + löschen
2. ✅ E-52: Low-Memory-Handling (registerLowMemoryHandler in App.tsx)
3. ✅ E-72: Show-on-Lock-Screen (plugins/withShowOnLockScreen.js + ForegroundService Intent umgeleitet)
4. ✅ E-77 bis E-87: Alle Session-Änderungen aus v0.1.4
5. ✅ HomeScreen: Bereits FlatList (war schon in v0.1.2 umgebaut)
6. ✅ Locale-Datumsformatierung: backupService.ts gefixt (TT.MM.JJJJ)
7. ✅ Auto-Backup nach Save: useEntryForm.ts Zeile 114-120 korrekt implementiert
8. ✅ EditPetScreen Pferde-Felder: Equidenpass-Nr., Haltungsform (Box/Offenstall/Weide/Paddock), geschätztes Gewicht (kg), Kolik-Vorgeschichte, Stallkontakt (Name/Tel/Box), Hufschmied (Name/Tel) – nur bei species === 'pferd' sichtbar
9. ✅ Kotprobe-Erfassungstyp: FecalSampleEntryScreen.tsx (NEU), record_type = 'Kotprobe', EpG-Wert als Zahlenfeld, nur für Pferde, im CaptureSheet als Option, in Navigation registriert, PetFileScreen zeigt EpG-Wert an
10. ✅ Bugfix E-90: Notification-Icon in Statusleiste war Fragezeichen → simplyPet-Pfote (Monochrome-PNG)
11. ✅ E-91: Konsistenter APK-Dateiname: simplyPet_v{version}.apk (Plugin withApkName.js)

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

### Bugfix: Notification-Icon Fragezeichen (E-90):
- Ursache: EmergencyForegroundService.kt verwendete `android.R.drawable.ic_menu_help` → Android zeigt generisches "?" in Statusleiste
- Fix: Monochrome-PNG des simplyPet-Logos (Pfote+Kreuz Silhouette) als ic_notification.png in alle DPI-Ordner
- Plugin `withForegroundService.js` generiert das Drawable automatisch bei jedem Prebuild
- EmergencyForegroundService.kt referenziert jetzt `R.drawable.ic_notification`
- Geänderte Dateien: plugins/withForegroundService.js, android/app/src/main/res/drawable-*/ic_notification.png, android/app/src/main/java/.../EmergencyForegroundService.kt

### Version:
- app.json: version "0.1.5", versionCode 5
