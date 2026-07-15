# v0.1.5 Änderungen (15.07.2026)

## Neue Features

### E-88: EditPetScreen – Pferde-Eingabefelder
- **Nur bei Tierart Pferd sichtbar** (species === 'pferd')
- Eigene Sektion "Pferde-Daten" mit visueller Trennlinie
- Felder:
  - Equidenpass-Nr. (Freitext, Hint: EU-Verordnung 2015/262)
  - Haltungsform (ChoiceChips: Box / Offenstall / Weide / Paddock)
  - Geschätztes Gewicht (kg, Zahlenfeld, Hint: Maßband-Schätzung)
  - Kolik-Vorgeschichte (Freitext, multiline)
  - Stallkontakt: Name / Telefon / Box-Nummer
  - Hufschmied: Name / Telefon
- Alle Felder optional
- Daten fließen in den Notfallpass (EquinePassBlocks)
- DB-Felder aus Migration 005 (equine_*)
- PetRow + EditPetDraft Interface erweitert
- SQL UPDATE erweitert (+9 Spalten)

### E-89: Kotprobe als eigener Erfassungstyp
- **Neuer Screen:** `FecalSampleEntryScreen.tsx`
- **CaptureSheet:** Neue Option "Kotprobe (Pferd)" mit Hint
- **Navigation:** Route 'KotprobeEintragen' registriert
- **Nur für Pferde:** PetPicker filtert auf species === 'pferd'
- Felder:
  - EpG-Wert (Eier pro Gramm) – Pflichtfeld, Zahlenfeld
  - Notiz (optional, z. B. Labor, Befund)
  - Datum der Probenentnahme
- record_type = 'Kotprobe' in health_records
- epg_value als INTEGER in DB (Migration 005)
- **PetFileScreen:** Anzeige "Kotprobe: X EpG" im Verlauf
- **Keine medizinischen Warnhinweise** (Doktrin)
- Draft-System: draftKey 'entry_fecal_sample'

## Bestätigte vorhandene Features (kein Code-Change nötig)
- E-52: Low-Memory-Handling (registerLowMemoryHandler in App.tsx)
- E-72: Show-on-Lock-Screen (plugins/withShowOnLockScreen.js)
- HomeScreen: FlatList (seit v0.1.2)
- Auto-Backup nach Save (useEntryForm.ts Zeile 114-120)

## Fixes
- backupService.ts: Locale-Datumsformatierung gefixt (TT.MM.JJJJ statt toLocaleDateString)

## Version
- app.json: version "0.1.5", versionCode 5

## Geänderte Dateien
| Datei | Änderung |
|:---|:---|
| src/screens/EditPetScreen.tsx | PetRow +9 equine_* Felder, EditPetDraft +9 Felder, petToDraft erweitert, SQL UPDATE +9 Spalten, UI-Sektion "Pferde-Daten" |
| src/screens/entries/FecalSampleEntryScreen.tsx | **NEU** – Kotprobe-Erfassungsscreen |
| src/components/CaptureSheet.tsx | CaptureAction + 'kotprobe', neue Option im Sheet |
| src/navigation/AppNavigator.tsx | Import FecalSampleEntryScreen, Route KotprobeEintragen, CAPTURE_ROUTE + kotprobe |
| src/screens/PetFileScreen.tsx | HealthRecordRow + epg_value, SELECT + epg_value, RECORD_TYPE_LABELS + Kotprobe, Anzeige-Logik |
| app.json | version 0.1.5, versionCode 5 |
