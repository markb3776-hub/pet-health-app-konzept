# v0.1.8 Änderungen (25.07.2026)

## Neue Features / Fixes (v0.1.7 → v0.1.8)

### BUG-3: Tägliche Checkbox resettet um 00:00 Uhr
- Tägliche Erinnerungen (z.B. "Ohren eincremen") werden beim App-Start automatisch auf "unerledigt" zurückgesetzt wenn das Erledigungsdatum < heute ist
- Scheduler-Logik prüft beim App-Start und bei Datumswechsel

### BUG-4: Routine-Erledigungen nicht mehr im Verlauf
- Tägliche Routine-Erledigungen erzeugen keinen Eintrag mehr in der Tierakte/Verlauf
- Verlauf zeigt nur noch essentielle Informationsänderungen: Gewicht, Impfungen, TA-Besuche, Diagnosen, Untersuchungsergebnisse, Medikamentenänderungen

### E-101: Farben pro Tiergruppe
- Farbliche Kennzeichnung von individuell-pro-Tier auf pro-Tiergruppe umgestellt
- Hunde = Teal (#008080), Katzen = Orange (#E67E22), Reptilien = Grün (#27AE60), Fische = Gold (#D4AC0D), Pferde = Braun (#8B4513), Vögel = Blau (#2980B9), Kaninchen/Nager = Lila (#8E44AD)

### E-102: Gruppen-Icons im Header
- Tier-Icons im Gruppen-Header (neben Gruppennamen)
- Einzel-Avatar bleibt Großbuchstabe oder eigenes Foto
- Icons als SVG/Vektor, weiß auf Gruppenfarbe

### E-103: HomeScreen Variante C – Gruppen-Accordion
- Tiere nach Tiergruppe gruppiert mit einklappbaren Headern
- Chevron zum Ein-/Ausklappen
- Kompakte Zeilen: Buchstaben-Avatar + Name + Rasse
- Gruppen und Tiere alphabetisch sortiert

### GitHub Actions Workflow
- `.github/workflows/build-apk.yml` erstellt
- Zwei Jobs: `build-tester` (mit 90-Tage-Timer) + `build-dev` (Timer deaktiviert)
- Trigger: Push in `app/`-Ordner oder manuell via `workflow_dispatch`
- Artifacts: 30 Tage Aufbewahrung
- APK-Benennung: `simplyPet_v{version}.apk` / `simplyPet_v{version}_DEV.apk`

## Version
- app.json: version "0.1.8", versionCode 6

---

# v0.1.7 Änderungen (20.07.2026)

## Neue Features (v0.1.6 → v0.1.7)

### E-94: Chip-Implantationsdaten
- Datum + Stelle in Stammdaten (EditPetScreen)
- Nur bei Hund/Katze/Pferd/Kaninchen sichtbar

### E-95: Tätowierungsnummer
- Nummer + Datum + Stelle (Hund/Katze/Kaninchen)
- Optionale Felder in Stammdaten

### E-96: Impfungen erweitert
- Chargen-Nr. (Freitext)
- Gültig-ab (Datum)
- Hersteller/Impfstoff (Freitext)
- Alle Felder optional

### E-97 Phase 1: Dokumentenscan
- Kamera oder Galerie → Tier-Zuordnung → Speicherung in Tierakte
- Kein OCR in Phase 1

### E-98: Alphabetische + Gruppen-Sortierung
- Toggle-Button auf HomeScreen (A-Z / Gruppen)
- Innerhalb Gruppen alphabetisch

### E-99: Untersuchungsergebnis als Erfassungstyp
- Art der Untersuchung (Freitext)
- Ergebnis/Befund (multiline)
- Optional: Foto/Scan anhängen

### E-100: EU-Heimtierausweis-Nummer
- Optionales Feld in Stammdaten
- Nur bei Hund/Katze/Frettchen sichtbar

### DB-Migration 007
- Neue Spalten für alle E-94 bis E-100 Features

## Version
- app.json: version "0.1.7", versionCode 6

---

# v0.1.6 Änderungen (20.07.2026)

## Neue Features (v0.1.6)

### 90-Tage-Ablauf-Timer für Tester
- App.tsx prüft beim Start, ob BUILD_DATE + EXPIRY_DAYS überschritten
- BUILD_DATE: 2026-07-20
- EXPIRY_DAYS: 90 (Ablauf ca. 18. Oktober 2026)
- Alert „Testversion abgelaufen" + App beendet sich

### Backup-System: app_version dynamisch
- backupService.ts liest Version aus `Constants.expoConfig?.version`

## Version
- app.json: version "0.1.6", versionCode 6

---

# v0.1.5 Änderungen (15.07.2026)

## Neue Features

### E-88: EditPetScreen – Pferde-Eingabefelder
- 9 equine_* Felder (Equidenpass-Nr., Haltungsform, Gewicht, Kolik-Vorgeschichte, Stallkontakt, Hufschmied)
- Nur bei Tierart Pferd sichtbar

### E-89: Kotprobe als eigener Erfassungstyp
- FecalSampleEntryScreen.tsx
- EpG-Wert, Datum, Notiz
- Nur für Pferde

### E-93: Backup-System komplett überarbeitet (17.07.2026)
- autoBackup bei jeder Datenänderung (6 Screens)
- Export: SAF (lokaler Speicher) + Share-Intent
- Import: DocumentPicker → JSON-Validierung → DB-Restore
- AsyncStorage für Backup-Status

## Fixes
- E-90/E-92: Notification-Icon (simplyPet-Pfote, DPI-skaliert)
- E-91: Konsistenter APK-Dateiname (withApkName.js Plugin)

## Version
- app.json: version "0.1.5", versionCode 5
