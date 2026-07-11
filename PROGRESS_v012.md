# v0.1.2 Durchlauf – Fortschritt

## ERLEDIGT:
1. ✅ Rasse-Feld im AddPetScreen + Tierarzt-Tipp (wenn ausgefüllt)
2. ✅ Allergien & Vorerkrankungen in EditPetScreen (Stammdaten)
3. ✅ Notfallpass liest aus Stammdaten + Fallback auf medications
4. ✅ Erinnerungs-Vorlauf (Tage vorher) in VaccinationEntryScreen
5. ✅ Überfällig-Hinweis in AppointmentsScreen
6. ✅ Parasitenschutz als Kategorie + Untertypen (Spot-On/Halsband/Tablette)
7. ✅ Farbe Weiß hinzugefügt (cremeweiß mit Rand)
8. ✅ Farbpalette überarbeitet: Gold/Oliv raus, Orange/Gelb rein
9. ✅ "Farbe für dieses Tier" → "Kennfarbe in der App" + Erklärtext
10. ✅ Backup-Service erstellt (Export/Import/Auto-Backup)
11. ✅ MoreScreen mit Backup-Bereich komplett neu
12. ✅ Doppelklick-Schutz auf SaveButton (FormParts.tsx)
13. ✅ Shared ImagePicker-Helper (utils/imagePicker.ts) – Android 13+ Fix + Komprimierung
14. ✅ Alle 5 Screens auf shared Helper umgestellt (Add/Edit/Document/Incident/Observation)
15. ✅ Ungenutzte ImagePicker-Imports entfernt
16. ✅ app.json: Portrait-Sperre, Version 0.1.2, READ_MEDIA_IMAGES, expo-document-picker
17. ✅ DB Migration 004: allergies, pre_conditions, sub_type, offset_days, edited_at
18. ✅ App.tsx: Notification-Permission-Request + Low-Memory-Handler
19. ✅ package.json: expo-image-manipulator + expo-document-picker hinzugefügt
20. ✅ backupService.ts: Schema-Fix (health_records statt weights/observations/incidents)

## Phase 7 (E-77 bis E-81) – ERLEDIGT:
21. ✅ E-77: Hilfe-Fragezeichen (?) bei Notfallpass-Bereichen (nur in App)
22. ✅ E-78: Reihenfolge Notfallpass korrigiert (Allergien + Vorerkrankungen direkt untereinander)
23. ✅ E-79: Parasitenschutz = eigener Block im Notfallpass (getrennt von Impfstatus)
24. ✅ E-80: Pferde-spezifischer Notfallpass (EquinePassBlocks, Migration 005, PDF+QR)
25. ✅ E-81: Termine-Screen Redesign (Tiername eigene Zeile, Hinweis vs. Termin, Prototyp-Hinweis)

## NOCH OFFEN:
- [ ] HomeScreen: ScrollView → FlatList für Tier-Kacheln (RAM-Schutz Nr. 25)
- [ ] Locale-sichere Datumsformatierung in MoreScreen (toLocaleDateString → manuelles Format)
- [ ] useEntryForm.ts: Auto-Backup nach Save prüfen (wurde in App.tsx referenziert)
- [ ] EditPetScreen: Eingabefelder für Pferde-Felder (Equidenpass-Nr., Stallkontakt, Hufschmied etc.)
- [ ] Kotprobe als eigener Erfassungstyp (record_type = 'Kotprobe' mit EpG-Wert)
- [ ] Quality-Check durchführen
- [ ] APK bauen

## TESTER-FEEDBACK (eingearbeitet):
- "Fotos aus Galerie nicht aufrufbar" → Android 13+ Fix via shared Helper
- "Farbe weiß fehlt" → Cremeweiß hinzugefügt
- "Farbe für dieses Tier" missverständlich → "Kennfarbe in der App"
- "Zu viel Grün, Orange/Gelb fehlt" → Palette überarbeitet

## KRITISCHER FIX:
- backupService.ts referenzierte nicht-existierende Tabellen (weights, observations, incidents)
- Die App nutzt EINE Tabelle: health_records mit record_type Spalte
- Fix: Backup liest/schreibt jetzt health_records korrekt
