# Arbeitsstand simplyPet – Roadmap Schritt 4, Teilauftrag 4.1 (09.07.2026)

## ABSCHLUSS Teilauftrag 4.1 (09.07.2026) — Fundament + Kern-Screens
**Kontoloser Prototyp (Freigabe 09.07.2026):** Onboarding erfasst NUR den Halter-Namen (für den Notfall-Pass). KEIN E-Mail, KEIN Passwort, KEIN Login.

**Neues Fundament:**
- `src/time/timeModule.ts` – EINE Zeitquelle: UTC intern, Anzeige TT.MM.JJJJ, `useTodayKey` mit Neuberechnung bei App-Start/Foreground (kein stiller Datums-Drift), `isBackdated` („Nachgetragen am …“), `compareDateKeysDesc` (Sortierung Neuestes-zuerst).
- `src/drafts/draftStore.ts` – Null-Datenverlust-Regel: fortlaufende Entwurfs-Sicherung (≤ 2 s + Unmount), `offerDraftResume` („Fortsetzen oder verwerfen?“), `useUnsavedChangesGuard` (Nachfrage bei Zurück-Geste).
- `src/profile/profileStore.ts` – kontoloses Halter-Profil (AsyncStorage).
- `src/components/DateField.tsx` – Kalender-Picker only (kein Freitext), Chips Heute/Gestern/Vorgestern, Zukunft gesperrt (außer `allowFuture`). Neu installiert: @react-native-community/datetimepicker.

**Navigation & Kern-Screens:**
- `AppNavigator.tsx` – „Erfassen“ ist KEIN Screen mehr, sondern öffnet das `CaptureSheet`-Overlay (Tab-Knopf bleibt, wechselt aber nie den Bildschirm); Onboarding-Gate vor erster Nutzung. `CaptureScreen.tsx` entfernt.
- Zwei-Tap-Regel überall: Zuhause fester Notfall-Knopf, Termine + Mehr `EmergencyFab`.
- `OnboardingScreen` – Begrüßung („Deine Daten gehören dir.“) → Name → Start (dort Anleitungskarte „Erstes Tier anlegen“).
- `HomeScreen` – 3 Zonen (Status-Karten Heute-fällig/Überfällig, Tier-Kacheln + Plus-Kachel, Notfall-Knopf), Leerzustand-Anleitungskarte, Querformat mehrspaltig.
- `AddPetScreen` – Tierart zuerst, dynamische Felder je Art, Foto (Kamera/Galerie), voller Draft-Schutz, atomares Speichern mit Bestätigung.
- `PetFileScreen` – Passkarte + dynamische Reiter je Art (Aquarium: „Wasserwerte“ statt Gesundheit), Sortierung Ereignis-Datum desc, „Nachgetragen am …“; Querformat: Passkarte und Inhalt nebeneinander.
- `AppointmentsScreen` – Gruppen Überfällig/Heute/Demnächst mit Tier-Farbe (zentrales Zeit-Modul).
- `EmergencyPassScreen` – Tier-Umschaltung bei Mehrtier-Haushalt, Halter-Name, 100 % offline.
- `MoreScreen` – Halter-Name bearbeitbar; nicht gebaute Unterseiten EHRLICH gekennzeichnet („Kommt in 4.x“), keine toten Knöpfe.

**Interne Prüfung (bestanden):** tsc 0 Fehler, expo-doctor 20/20, `expo export` Android-Bundle baubar, Zeit-Modul-Logiktests grün. Protokoll: `../pruefprotokoll_teilauftrag_4_1.md`.

**Nächste Teilaufträge:** 4.2 Einträge (Gewicht, Symptom Freitext-first, Impfung, Dokument-Foto mit Berechtigungs-Kette, Erinnerungs-Erzeugung + Ein-Tap-Checkbox, Stammdaten-Bearbeiten, Tiere verwalten/Archiv) · 4.3 Notfallpass + QR · 4.4 Störfall-Matrix + Mehrarten-Test + APK.

---

# Historie: Roadmap Schritt 3 (08.07.2026)

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
