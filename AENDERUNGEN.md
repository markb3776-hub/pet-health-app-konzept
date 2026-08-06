# v1.0.0 Änderungen

## versionCode 18 (06.08.2026)

### versionCode-Bump für Play Store
- versionCode 17 → 18 (vC 17 bereits im geschlossenen Test-Track seit 03.08.2026)
- Keine Code-Änderungen, nur Versions-Bump für nächsten AAB-Upload

## versionCode 17 (04.08.2026)

### E-129: Timer-Logik komplett entfernt
- 90-Tage-Timer (BUILD_DATE, EXPIRY_DAYS, checkExpiry, Alert + BackHandler.exitApp) aus App.tsx entfernt
- Keine TESTER/DEV-Unterscheidung mehr
- Ungenutzte Imports (`Alert`, `BackHandler`) aus App.tsx entfernt
- TypeScript: 0 Fehler

### APK-Workflow vereinfacht
- `.github/workflows/build-apk.yml` komplett ersetzt
- Nur noch `workflow_dispatch` (kein Auto-Trigger bei Push)
- Ein Job (`build-apk`), ein Artifact (`simplyPet_v{version}.apk`)
- Retention: 30 Tage

### Dokumentation aktualisiert
- ARBEITSANWEISUNG_UPDATE_PROZESS.md: Phase 5 (Build-Regeln) aktualisiert
- INFRASTRUKTUR_UND_KONTEXT.md: Build-System komplett überarbeitet
- ARBEITSSTAND.md: Alle Timer-Referenzen entfernt/aktualisiert
- ENTSCHEIDUNGSREGISTER.md: E-129 dokumentiert

### withRemovePermissions Plugin hinzugefügt
- Neues Expo Config Plugin: `plugins/withRemovePermissions.js`
- Entfernt transitiv eingeschleuste Permissions aus dem Android-Manifest bei `expo prebuild`
- Aktuell entfernt: `android.permission.DUMP`
- app.json: Plugin-Eintrag `["./plugins/withRemovePermissions", ["android.permission.DUMP"]]` ergänzt

### Version
- app.json: version "1.0.0", versionCode 17
- Commits: `6c2fb42`, `af2348f`

---

## versionCode 16 (01.08.2026)

### E-128: Lesbarkeits-Fix – Texte auf grünem Hintergrund
- Alle Texte mit schlechtem Kontrast auf app-background.png auf #000000 (schwarz) gesetzt
- WCAG-Kontrastanalyse: textSecondary 1.82:1 (FAIL) → schwarz 7.17:1 (PASS)
- Betroffene Dateien: FormParts, EditPetScreen, SitterScreen, ManagePetsScreen, EmergencyPassScreen, MoreScreen, HomeScreen

---

## versionCode 15 (31.07.2026)

### E-126: Backup-Import-Fix (fromCombined → fromParts)
- expo-crypto Bug #47274: `fromCombined()` komplett umgangen
- Combined-Bytes manuell aufgeteilt: IV (12B) + Ciphertext + AuthTag (16B)
- `AESSealedData.fromParts(iv, ciphertext, tag)` statt `fromCombined()`

### E-127: UX-Fix Passwort-Modal
- `KeyboardAvoidingView` statt `View` für Passwort-Overlay
- Buttons bleiben bei geöffneter Tastatur sichtbar

---

## versionCode 14 (30.07.2026)

### E-124: App-Hintergrund (grüner Gradient + Blasen)
- Programmatisch generiertes Hintergrundbild (1080x2340)
- ScreenBackground-Komponente auf allen 18 Screens

### E-125: Fix Backup-Entschlüsselung (erster Versuch)
- base64ToUint8 vor fromCombined (später durch E-126 ersetzt)

### E-114: DailyTrigger + Uhrzeit wählbar
- Notifications feuern täglich zur gewählten Uhrzeit (DailyTriggerInput)
- Migration 010: reminder_hour + reminder_minute Spalten

---

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

### E-72: Show-on-Lock-Screen
- plugins/withShowOnLockScreen.js + ForegroundService Intent
- Activity-Flags showWhenLocked + turnScreenOn

### E-93: Backup-System komplett überarbeitet (17.07.2026)
- autoBackup bei jeder Datenänderung (6 Screens)
- Export: SAF (lokaler Speicher) + Share-Intent
- Import: DocumentPicker → JSON-Validierung → DB-Restore
- AsyncStorage für Backup-Status
- Backup-Status in AsyncStorage (KEY_LAST_BACKUP_DATE)
- Export-Dialog mit Auswahl (Lokal / Teilen)

## Fixes
- E-90/E-92: Notification-Icon (simplyPet-Pfote, DPI-skaliert)
- E-91: Konsistenter APK-Dateiname (withApkName.js Plugin)
- Locale-sichere Datumsformatierung in backupService.ts (TT.MM.JJJJ)
- useEntryForm.ts: Auto-Backup nach Save korrekt implementiert

## Version
- app.json: version "0.1.5", versionCode 5

---

# v0.1.4 Änderungen (11.07.2026)

## Neue Features (v0.1.3 → v0.1.4)

### E-61: App-Shortcut "Notfallpass"
- Lang drücken auf App-Icon → Kontextmenü → "Notfallpass"
- Expo Config Plugin: `plugins/withAndroidShortcuts.js`
- Deep-Link: Intent `de.simplypet.app.OPEN_EMERGENCY`

### E-62/E-73: Permanente Notification (Opt-in)
- Notification-Channel "Notfallpass" mit Priorität LOW
- Foreground Service (nicht wegwischbar, Samsung-kompatibel)
- Opt-in Toggle im Mehr-Screen
- Show-on-Lock-Screen auf v0.1.5 verschoben (E-72)

### E-82: Termine-Gruppen
- Überfällig (rot) / Bald fällig (≤14 Tage) / Geplant (>14 Tage)

### E-83: Rasse statt Tierart auf HomeScreen
- Unter Tiernamen wird Rasse angezeigt (wenn vorhanden), sonst Tierart

### E-84: Artspezifisches Fellfarbe-Label
- Hund/Katze: "Fellfarbe / Zeichnung"
- Reptil: "Hautfarbe / Musterung"
- Ziervogel: "Gefiederfarbe / Zeichnung"
- Pferd: "Fellfarbe / Abzeichen"
- Aquarium: ausgeblendet

### E-85: App-Icon Badge
- Badge-Zahl = Anzahl überfälliger Aufgaben (lokal, ohne Push)

### E-86: Aquarium-spezifische Felder
- Migration 006: aquarium_type, aquarium_volume_liters, setup_date
- EditPetScreen: Beckentyp / Volumen / Eingerichtet am
- PetFileScreen: Aquarium-Ansicht

### E-87: Artspezifische Feld-Sichtbarkeit
- Chip bei Kleinnagern ausgeblendet
- Ziervogel: "Ring-/Chip-Nummer"
- Reptil/Pferd: artspezifische Platzhalter

## Version
- app.json: version "0.1.4", versionCode 4

---

# v0.1.3 Änderungen (11.07.2026)

## Neue Features (v0.1.2 → v0.1.3)

### E-70: Theme Primary-Farbe auf Teal #2E9E83
- Alle UI-Elemente (Buttons, aktive Tabs, Akzente) auf Teal umgestellt

### E-69: Emergency-Farbe auf ISO-Grün #237F52
- Erfassen-Tab Icon von ＋ auf ✎ (Kreuz/Plus-Verbot)
- Plus aus "Erstes Tier anlegen"-Button entfernt

### E-58: Notfall als 5. Tab
- Floating Emergency-Button entfernt
- 5. Tab mit ISO-Erste-Hilfe-Zeichen (weißes Kreuz auf grünem Grund)
- EmergencyFab aus allen Screens entfernt

### Überfällig-Karte navigierbar
- Karte auf HomeScreen navigiert zum Termine-Tab

### App-Icon
- Pfote+Kreuz auf Teal generiert (icon.png, foreground, splash)

## Version
- app.json: version "0.1.3", versionCode 3

---

# v0.1.2 Änderungen (10.07.2026)

## Neue Features (v0.1.1 → v0.1.2)

### Stammdaten erweitert
- Rasse-Feld im AddPetScreen + Tierarzt-Tipp
- Allergien & Vorerkrankungen in EditPetScreen
- Notfallpass liest aus Stammdaten + Fallback

### E-53: Parasitenschutz als Kategorie
- Untertypen: Spot-On, Halsband, Tablette

### Erinnerungen
- Erinnerungs-Vorlauf (Tage vorher) in VaccinationEntryScreen
- Überfällig-Hinweis in AppointmentsScreen

### Farbpalette überarbeitet
- Gold/Oliv entfernt, Orange/Gelb hinzugefügt
- Weiß (cremeweiß mit Rand) ergänzt
- "Farbe für dieses Tier" → "Kennfarbe in der App"

### Backup-System (v1)
- backupService.ts: Export/Import/Auto-Backup
- MoreScreen mit Backup-Bereich
- Schema-Fix: health_records statt weights/observations/incidents

### Technische Verbesserungen
- Doppelklick-Schutz auf SaveButton (FormParts.tsx)
- Shared ImagePicker-Helper (utils/imagePicker.ts) – Android 13+ Fix + Komprimierung
- Alle 5 Screens auf shared Helper umgestellt (Add/Edit/Document/Incident/Observation)
- Ungenutzte ImagePicker-Imports entfernt
- app.json: Portrait-Sperre, READ_MEDIA_IMAGES, expo-document-picker
- package.json: expo-image-manipulator + expo-document-picker hinzugefügt
- DB Migration 004: allergies, pre_conditions, sub_type, offset_days, edited_at
- Notification-Permission-Request + Low-Memory-Handler

### Tester-Feedback (eingearbeitet)
- "Fotos aus Galerie nicht aufrufbar" → Android 13+ Fix via shared Helper
- "Farbe weiß fehlt" → Cremeweiß hinzugefügt
- "Farbe für dieses Tier" missverständlich → "Kennfarbe in der App"
- "Zu viel Grün, Orange/Gelb fehlt" → Palette überarbeitet

### E-77–E-81 (Phase 7)
- E-77: Hilfe-Fragezeichen bei Notfallpass-Bereichen
- E-78: Reihenfolge Notfallpass korrigiert
- E-79: Parasitenschutz eigener Block im Notfallpass
- E-80: Pferde-spezifischer Notfallpass (EquinePassBlocks, Migration 005)
- E-81: Termine-Screen Redesign

## Version
- app.json: version "0.1.2", versionCode 2
