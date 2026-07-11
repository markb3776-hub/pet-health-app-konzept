# Implementierungsplan v0.1.2 – Gebündelter Durchlauf

## Bereits vorhanden (kein Handlungsbedarf):
- WAL-Modus (Nr. 31) → database.ts Zeile 22: `PRAGMA journal_mode = WAL;`
- POST_NOTIFICATIONS Permission (Nr. 23) → app.json Zeile 21
- Hermes-Engine (Nr. 27) → Standard bei Expo 57
- Rasse-Feld in DB (Nr. 1) → `breed TEXT` in pets-Tabelle existiert
- Rasse-Feld in EditPetScreen → Zeile 311-319 existiert bereits
- Google-unabhängig (Nr. 22) → keine Play Services Abhängigkeit im Code
- Leerer Zustand HomeScreen (Nr. 30) → Zeile 124-138 hat guideCard

## Phase 3: Features (Nr. 1-6)

### Nr. 1 – Rasse in AddPetScreen
- AddPetDraft erweitern: `breed: string` hinzufügen (Zeile 54-61)
- EMPTY_DRAFT erweitern: `breed: ''`
- INSERT-Statement erweitern (Zeile 176-189): breed-Spalte + Wert
- UI: TextInput nach Name-Feld einfügen (nach Zeile 259)
- Nur für !isHabitat anzeigen

### Nr. 2 – Tierarzt-Tipp unter Rasse
- In EditPetScreen nach Rasse-Feld (Zeile 319): Hint-Komponente einfügen
- Bedingung: form.breed.trim().length > 0
- Text: "Tipp: Frag deinen Tierarzt nach rassetypischen Vorsorge-Untersuchungen für deine Rasse."
- In AddPetScreen gleiche Logik

### Nr. 3 – Allergien & Vorerkrankungen in Stammdaten
- ENTSCHEIDUNG: Allergien/Vorerkrankungen bleiben AUCH in medications-Tabelle (Rückwärtskompatibilität)
- ZUSÄTZLICH: Neue Felder in pets-Tabelle: `allergies TEXT`, `pre_conditions TEXT`
- Migration 004: addColumnIfMissing für beide Felder
- EditPetScreen: Neuer Abschnitt nach "Besonderheiten" mit zwei TextInputs
- EditPetDraft erweitern: `allergies: string`, `preConditions: string`
- passData.ts: Allergien/Vorerkrankungen ZUERST aus pets-Feldern lesen, DANN aus medications als Fallback
- PetRow-Interface in EditPetScreen erweitern

### Nr. 4 – Erinnerungs-Vorlauf
- VaccinationEntryScreen: Neues Feld `reminderDaysBefore: number` (Default 7)
- Beim Reminder-Insert: due_date = valid_until MINUS reminderDaysBefore Tage
- UI: NumberInput "Tage vorher erinnern" (min 1, max 90)
- MedicationEntryScreen: gleiche Logik für tägliche Erinnerungen (optional)

### Nr. 5 – Überfällig-Hinweis
- AppointmentsScreen: Bei Überfällig-Gruppe den Text anpassen
- Wenn source_type='impfung': "Überfällig – bitte Tierarzt konsultieren"
- Styling: Rot/Orange Hintergrund für Überfällig-Karten

### Nr. 6 – Parasitenschutz (offen O-03, erstmal als Typ unter Medikament/Pflege)
- MED_TYPES erweitern: 'Parasitenschutz' hinzufügen
- Untertypen: Spot-On, Halsband, Tablette (als ChoiceChips wenn Parasitenschutz gewählt)

## Phase 4: Datensicherung (Nr. 13-17)

### Nr. 13-15 – Backup System
- Neues Modul: src/backup/backupManager.ts
- Funktionen: createBackup(), importBackup(uri), getBackupInfo()
- Format: JSON mit Versionsnummer, alle Tabellen, Fotos als Base64
- Export: expo-sharing (Share-Intent)
- Import: expo-document-picker (neues Package nötig!)
- MoreScreen: "Deine Daten" Menüpunkt aktivieren → neuer Screen BackupScreen
- BackupScreen: Export-Button, Import-Button, letzte Sicherung Datum, Hinweis-Text

### Nr. 16 – Einträge bearbeiten
- Jeder Eintrag braucht Stift-Symbol in der Anzeige (PetFileScreen, AppointmentsScreen)
- Navigation zu entsprechendem Entry-Screen mit vorausgefüllten Daten
- UPDATE statt INSERT, updated_at setzen
- Bearbeitungs-Vermerk: `edited_at TEXT` Spalte in allen Tabellen (Migration)

### Nr. 17 – Einträge löschen
- Soft-Delete: deleted_at setzen (haben wir schon in Schema!)
- Papierkorb-Symbol an jedem Eintrag
- Bestätigungs-Dialog, doppelt bei Impfungen/Medikamenten
- Kein Papierkorb-Screen (endgültig nach Bestätigung, da Backup schützt)

## Phase 5: Robustheit (Nr. 7-12, 18-33)

### Nr. 7 – Doppelklick-Schutz
- SaveButton in FormParts.tsx: useRef für lastPress, 1000ms Cooldown
- Auch in AddPetScreen und EditPetScreen (eigene Save-Buttons)

### Nr. 8 – Rotation sperren
- app.json: "orientation": "portrait" (statt "default")

### Nr. 9 – Dark Mode erzwingen
- app.json: "userInterfaceStyle": "light" (BEREITS GESETZT!)

### Nr. 10 – Foto-Komprimierung
- ImagePicker: quality: 0.7 (BEREITS GESETZT in EditPetScreen!)
- AddPetScreen prüfen: quality auch dort setzen

### Nr. 11 – Zukunfts-Datum-Validierung
- DateField-Komponente: maximumDate = new Date()
- Ausnahme: Impfung valid_until DARF in der Zukunft liegen
- Ausnahme: Reminder due_date DARF in der Zukunft liegen

### Nr. 12 – Try/Catch bei DB
- BEREITS in EditPetScreen und AddPetScreen implementiert
- Prüfen: alle Entry-Screens (useEntryForm.ts hat runSave mit try/catch)

### Nr. 18 – Textumbruch
- Alle Text-Elemente: numberOfLines={2} + ellipsizeMode="tail" wo sinnvoll
- Oder: flexShrink: 1 für flexible Container

### Nr. 19 – Tap-Targets 48dp
- theme.ts: minTouchTarget BEREITS definiert (prüfen ob überall genutzt)
- Alle Pressable: minHeight: minTouchTarget, minWidth: minTouchTarget

### Nr. 20 – ScrollView auf allen Screens
- HomeScreen: ScrollView ✓
- AppointmentsScreen: prüfen
- MoreScreen: ScrollView ✓
- Entry-Screens: ScrollView ✓

### Nr. 21 – Flexible Höhen
- styles.input: KEINE feste height, statt dessen minHeight + padding

### Nr. 24 – Kamera-Permission Android 13+
- expo-image-picker handhabt das automatisch (requestMediaLibraryPermissionsAsync)
- Prüfen ob READ_MEDIA_IMAGES in app.json Plugins korrekt konfiguriert

### Nr. 25 – FlatList bei Listen
- HomeScreen Tier-Kacheln: aktuell ScrollView mit map → FlatList
- PetFileScreen Timeline: prüfen
- AppointmentsScreen: prüfen

### Nr. 26 – Thumbnails
- Beim Laden von Tierfotos in Listen: Image mit resizeMode="cover" + feste kleine Größe
- Expo Image Manipulator für echte Thumbnail-Erstellung (neues Package?)
- MITTELWEG: Einfach kleine Image-Dimensionen setzen (React Native skaliert intern)

### Nr. 28 – Scoped Storage
- expo-sharing nutzt Share-Intent → automatisch Scoped-Storage-kompatibel ✓
- expo-document-picker für Import → ebenfalls kompatibel ✓

### Nr. 29 – Locale-sichere Daten
- timeModule.ts: formatDate nutzt manuelles TT.MM.JJJJ (KEIN toLocaleDateString) ✓
- Prüfen ob nirgends sonst locale-abhängige Formatierung

### Nr. 32 – Speicherplatz prüfen
- expo-file-system: getFreeDiskStorageAsync()
- Vor Backup: prüfen ob > 50 MB frei, sonst Warnung

### Nr. 33 – Low-Memory-Handling
- AppState listener für 'memoryWarning' → Bilder-Cache leeren
- React Native Image: keine eigene Cache-Verwaltung nötig bei lokalen URIs
- MITTELWEG: Einfach saubere Komponenten-Unmounts sicherstellen

## Neue Packages benötigt:
- expo-document-picker (für Backup-Import)

## Dateien die geändert werden:
1. app.json (orientation, version)
2. package.json (version, expo-document-picker)
3. src/db/database.ts (Migration 004: allergies, pre_conditions, edited_at)
4. src/screens/AddPetScreen.tsx (Rasse-Feld, Doppelklick)
5. src/screens/EditPetScreen.tsx (Allergien, Vorerkrankungen, Tierarzt-Tipp)
6. src/screens/MoreScreen.tsx (Backup-Menü aktivieren)
7. src/screens/entries/VaccinationEntryScreen.tsx (Vorlauf-Tage)
8. src/screens/entries/MedicationEntryScreen.tsx (Parasitenschutz-Typ)
9. src/screens/AppointmentsScreen.tsx (Überfällig-Text)
10. src/screens/HomeScreen.tsx (FlatList)
11. src/components/FormParts.tsx (Doppelklick-Schutz SaveButton)
12. src/emergency/passData.ts (Allergien aus pets-Feld lesen)
13. src/navigation/AppNavigator.tsx (BackupScreen Route)
14. NEU: src/backup/backupManager.ts
15. NEU: src/screens/BackupScreen.tsx
