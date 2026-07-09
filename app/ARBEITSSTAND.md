# Arbeitsstand simplyPet – Roadmap Schritt 3 (08.07.2026)

## Wichtige Fakten (nicht verlieren)

### Neon-Datenbank (Testumgebung)
- Neon-Connector (MCP) ist aktiviert, OAuth authentifiziert, Organisation "Mark" (org-floral-rice-19787374)
- **Aktives Testprojekt:** `simplypet-test`, Project-ID: `royal-pond-21225992`, Branch: main (br-odd-water-aty1l9h4), DB: neondb
- Connection-String: `postgresql://neondb_owner:***REMOVED***@ep-super-leaf-atyj9hw0-pooler.c-9.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require`
- **ACHTUNG Region: us-east-1 (USA)!** MCP erlaubt keine Regionswahl; region_id-Parameter wird ignoriert.
- **Nutzer-Entscheidung (08.07.2026):** US-Testprojekt vorerst OK (nur Testdaten). VOR echten Daten zwingend Umzug auf EU (Frankfurt) / eigenen Server. Nutzer ist im Urlaub, Passwort zuhause – EU-Projekt wird nachgeholt.
- Zweites versehentliches US-Projekt "simplypet-eu" (solitary-dew-71197418) wurde mit Nutzer-Freigabe GELÖSCHT.
- Neon-Konsole-Login: Google (Login gescheitert: Handy-In-App-Browser blockiert, Passwort nicht verfügbar)

### Projektstand Schritt 3
- Expo-Projekt initialisiert: /home/ubuntu/simplypet (create-expo-app, blank-typescript)
- Expo SDK 57, React Native 0.86, TypeScript 6
- Installiert: expo-sqlite, expo-camera, expo-image-picker, expo-notifications, expo-file-system, react-navigation (native, bottom-tabs, native-stack), react-native-qrcode-svg, react-native-svg, async-storage, expo-build-properties, safe-area-context, screens
- app.json: package de.simplypet.app, targetSdk 35, minSdk 29, deutsche Berechtigungstexte, blockedPermissions (Mikrofon/Standort/Kontakte laut Berechtigungskonzept erst später/nie)
- Angelegt:
  - server/migrations/001_initial_schema.sql (7 Tabellen: users, pets, health_records, vaccinations, medications, documents, reminders; Soft-Delete, updated_at für LWW)
  - src/config/species.ts (14 Tierarten-Konfigurationen gemäß Matrix)
  - src/db/database.ts (lokale SQLite-Spiegelung, is_synced-Flag, uuid())
  - src/theme/theme.ts (Farbsystem, reserviertes Signalrot, Palette, große Schrift 50+)
  - src/navigation/AppNavigator.tsx (4 Tabs + Stack: Notfallpass, Tierakte, TierAnlegen)
  - src/screens/HomeScreen.tsx (3 Zonen, Notfall-Knopf)

### Schritt 3 KOMPLETT ABGESCHLOSSEN (alle Punkte erledigt, Commit d292d02)
1. Restliche Platzhalter-Screens: AppointmentsScreen, CaptureScreen, MoreScreen, EmergencyPassScreen, PetFileScreen, AddPetScreen
2. App.tsx auf AppNavigator umstellen
3. Schema in Neon-Testdatenbank einspielen (psql mit obigem Connection-String, Datei server/migrations/001_initial_schema.sql)
4. TypeScript-Check: npx tsc --noEmit
5. .env.example mit DATABASE_URL-Platzhalter (NICHT den echten String committen!)
6. README.md im Projekt (Hinweis US-Testdaten-Kompromiss + EU-Umzugspflicht)
7. infrastruktur_und_kellerserver_konzept.md ergänzen: US-Test-Kompromiss dokumentieren
8. GitHub: Code in Repo markb3776-hub/pet-health-app-konzept pushen (Unterordner app/ oder eigenes Repo? -> als Unterordner "app" ins bestehende private Repo, da Single Source of Truth)
   - Bestehendes Konzept-Repo liegt lokal in /home/ubuntu/app_defizit_analyse (git, remote https://github.com/markb3776-hub/pet-health-app-konzept.git)
9. roadmap_prototyp.md: Schritt 3 als abgeschlossen markieren, committen, pushen
10. Ergebnis liefern

### Konventionen
- Alle Quellen-Kommentare in Code-Dateien verweisen auf Konzeptdokumente
- Doktrin: ehrliche Hinweise, kein toter Knopf, große Schrift, Zwei-Tap-Notfallpass

## ABSCHLUSS Schritt 3 (08.07.2026, Commit d292d02)
Alle Punkte erledigt: Screens, App.tsx, Schema in Neon eingespielt (7 Tabellen verifiziert), tsc fehlerfrei, expo-doctor 20/20, README+.env.example, Infrastruktur-Doku Abschnitt 5 (US-Kompromiss), Code als app/ ins Konzept-Repo gepusht, Roadmap aktualisiert. Kein Secret im Repo (geprüft).
Nächster Schritt: Roadmap Schritt 4 in Teilaufträgen (4.1 Fundament+Kern-Screens, 4.2 Einträge, 4.3 Notfallpass+QR, 4.4 Prüfung+APK).

## ABSCHLUSS Teilauftrag 4.1 (09.07.2026, Commit 1ee6ed7)
Fundament + Kern-Screens: zentrales Zeit-Modul (src/time/timeModule.ts), Draft-Autosave (src/drafts/draftStore.ts), kontoloses Onboarding (src/profile/profileStore.ts, OnboardingScreen), DateField (Kalender-Picker only, Zukunftssperre), Erfassen als Overlay (CaptureSheet statt Tab), Notfall-FAB (Zwei-Tap-Regel), Home 3 Zonen, AddPet dynamisch je Tierart, Tierakte mit Passkarte + dynamischen Reitern, Querformat überall. Prüfung: pruefprotokoll_teilauftrag_4_1.md.

## ABSCHLUSS Teilauftrag 4.2 (09.07.2026)
Funktionen & Einträge:
- DB-Migration additiv (addColumnIfMissing): medications.times_per_day/dose_times/hint_text, health_records.medication_id, reminders.season_start/season_end/hint_text/source_type/source_id/repeat_rule/done_at
- Gemeinsame Bausteine: src/components/FormParts.tsx (PetPicker, FieldLabel, Hint, ChoiceChips, SaveButton), src/forms/useEntryForm.ts (Tiere laden, Draft-Wiring, atomares Speichern mit Bestätigung)
- 6 Eintragsformulare unter src/screens/entries/: Weight (Plausibilitäts-Hinweis je Art, Aquarium-Hinweis), Observation (Freitext-first, Aquarium: Wasserwert-Modus), Incident (Freitext „Was ist passiert?" vollwertig, artneutrale Kategorien, JSON in notes, Wundfoto, Tierarzt-Flag), Vaccination (auto-Erinnerung aus valid_until, atomare Transaktion), Medication (Typen, Mehrfach-Dosierung mit Uhrzeiten als JSON, tägliche Erinnerung repeat_rule='taeglich', Saisonfenster inkl. Jahreswechsel), DocumentCapture (ehrliche Erklärung VOR System-Dialog, Kamera/Galerie)
- AppointmentsScreen: Ein-Tap-Checkbox (täglich: Gabe → health_records 'Medikamentengabe' + due_date=morgen, atomar), Erledigt-Liste 30 Tage mit Rückgängig, Saisonfenster-Filter (isInSeason, Wrap-around getestet), archivierte Tiere ausgefiltert
- EditPetScreen: alle Stammdaten (Kastration, Chip mit 15-Ziffern-Hinweis nicht-blockierend, Spezialisten-Tierarzt, Foto, Farbe), Tierart nicht änderbar (ehrlicher Hinweis), Draft edit_pet_<id>
- ManagePetsScreen: Archiv (archivieren/zurückholen, kein Löschen im Prototyp – ehrlich), erreichbar über Mehr → Tiere verwalten
- PetFileScreen: Edit-Stift verdrahtet, „Gabe protokollieren"-Knopf, Vorfall-JSON-Darstellung, Foto in Verlaufskarten, Dokument-Vollbild-Modal, Labels alt+neu (Altdaten-sicher)
- HomeScreen: Status-Queries mit archived=0 + Saisonfenster (identisch zum Termine-Tab, 60-Kombinationen-Test)
Prüfung: pruefprotokoll_teilauftrag_4_2.md (tsc 0 Fehler, expo-doctor 20/20, expo export OK, 18 SQL-Statements gegen Schema verifiziert, Saisonlogik-Tests bestanden).
Nächster Schritt: 4.3 Notfallpass + QR-Code (Machbarkeit bereits getestet), danach 4.4 interne Prüfung + APK (inkl. Tageswechsel-Testfall und Mehrarten-Stabilitätstest).
