# Arbeitsnotizen für Roadmap-Erstellung (interne Sichtung, 08.07.2026)

## Kontext
Nutzer fragt: "Was fehlt noch alles, um eine erste überprüfbare App erstellen zu können? Schritt für Schritt."
Ziel: Roadmap-Dokument von heute bis zum ersten testbaren Prototyp. Keine neuen teuren Recherchen, nur vorhandene Dokumente nutzen.

## Vorhandene Assets (46 Dateien im GitHub-Repo markb3776-hub/pet-health-app-konzept, privat)

### Konzeptseite (weitgehend KOMPLETT)
- app_struktur_konzept.md: Startbildschirm (3 Zonen), 4-Bereiche-Navigation, Tierakte-Aufbau, Farbsystem pro Tier, Sonderzustände (Onboarding/Offline/Notfall), Testpflichtige Punkte definiert. 14 Tierarten-Konfigurationen (Tierarten-Matrix).
- nutzerkonzept, mehrtier_konzept, tierarten_abdeckungskonzept, berechtigungs_konzept, notfallpass_design_spezifikation, vertrauens_und_erlebnis_konzept, praxis_workflow_konzept, praxissuche_konzept, datenkatalog vorhanden.
- Mockups: 3 Screens als HTML+PNG (Startbildschirm, Tierakte, Notfallpass) + design_grundlagen.md
- workflow_test: Notfallpass-PDF- und QR-Generierung als Python-Machbarkeitstest OK.

### Infrastruktur (ENTSCHIEDEN, aber nicht aufgebaut)
- Selbst-Hosting-Strategie für KI-Scan verbindlich (kein US, keine Mistral-API). App startet OHNE KI-Scan (manuelle Eingabe).
- Zwei Umgebungen: Kellerserver (Test, VPN-only, Testdaten) + dt. Rechenzentrum (Prod, ~20-30 €/M).
- Software-Stack definiert: Ubuntu 24.04, Docker, PostgreSQL, Node.js, MinIO, vLLM/Ollama, Tailscale, restic, Uptime Kuma.
- Tech-Stack App laut Blindspot B.7: React Native / Expo (API Level 35 / Android 15 Pflicht seit 31.08.2025).

### Werkzeuge verbunden
- GitHub aktiv (markb3776-hub), Repo pet-health-app-konzept existiert.
- Neon Postgres aktiv, EU-Region gewählt (nur für Test/Dev-Daten OK; Prod = eigene Infra wg. CLOUD Act, Neon gehört Databricks/US).

## Blindspot-Bericht Status (21 Lücken: 3 verifiziert, 6 plausibel, 12 offen)
Offene Punkte relevant für Prototyp vs. Launch:
- FÜR PROTOTYP NICHT BLOCKIEREND: Anwalt (AGB/DSGVO-Texte), Steuerberater/Rechtsform, Markenrecht/Name (Arbeitstitel reicht), Versicherungsdetails, UPD-API-Zugang, StIKo-Pflegeprozess, Support-Organisation, Internationalisierung, iOS.
- FÜR PROTOTYP RELEVANT: Offline-Sync-Strategie (C.15), Push-Zuverlässigkeit (C.14) — beides Technikphase, im Prototyp testbar.
- FÜR LAUNCH RELEVANT: Play-Store-Testpflicht (12 Tester/14 Tage bei persönlichem Konto), Konto-Löschung in-App + Web-Formular, Backup/Monitoring.

## Was FEHLT konkret bis zum ersten überprüfbaren Prototyp (Kernbefund für Roadmap)

### Block A: Entscheidungen des Nutzers (vor Codestart)
1. Arbeitstitel festlegen (nur intern, keine Markenprüfung nötig für Prototyp)
2. MVP-Funktionsumfang final bestätigen (Vorschlag: Tiere anlegen, Akte, manuelle Einträge, Erinnerungen, Notfallpass mit QR, Familien-Freigabe NICHT im ersten Prototyp)
3. Zielgerät(e) für Test definieren (Android-Handy des Nutzers)
4. Budget-OK: 25 $ Google-Play-Registrierung (einmalig) — erst bei Store-Test nötig, für APK-Direktinstallation nicht

### Block B: Technische Spezifikation (fehlt komplett — muss aus Konzepten abgeleitet werden)
1. Datenmodell (Entitäten: Nutzer, Tier, Akte-Einträge, Termine, Dokumente, ...) — Datenkatalog existiert als Grundlage
2. API-Spezifikation Backend
3. Offline-Sync-Strategie festlegen (C.15: z.B. Last-Writer-Wins für MVP)
4. Screen-Flow komplett (nur 3 von ~10 Screens als Mockup vorhanden: fehlen z.B. Onboarding, Erfassen-Dialoge, Termine, Einstellungen, Tier-anlegen)

### Block C: Entwicklungsumgebung (teils vorhanden)
1. VORHANDEN: GitHub, Neon (Test-DB)
2. FEHLT: Expo/React-Native-Projekt initialisieren
3. OPTIONAL: Kellerserver (für Prototyp NICHT nötig — Neon + Sandbox/Cloud reicht; Kellerserver wird erst für OCR-Tests wichtig)

### Block D: Entwicklung Prototyp (Reihenfolge)
1. Projekt-Setup (Expo, API Level 35, GitHub-Repo)
2. Datenmodell + lokale Speicherung (offline-first)
3. Kern-Screens: Onboarding light → Tier anlegen → Startbildschirm → Tierakte → manueller Eintrag
4. Notfallpass + QR (Machbarkeit bereits getestet in workflow_test)
5. Erinnerungen/Termine (lokale Notifications; exakte Alarme = Testpunkt C.14)
6. Interne Testrunde gegen Testpflichtige-Punkte-Liste aus app_struktur_konzept.md Abschnitt 7

### Block E: Überprüfbarkeit (Definition "erste überprüfbare App")
- Installierbare APK auf Nutzer-Handy (Direktinstallation, ohne Play Store möglich)
- Alternativ Expo Go für schnelle Iteration
- Prüfkatalog: Zwei-Tap-Notfallpass, größte Schriftgröße, Offline-Start, leerer Zustand, Farbsystem

### NICHT im ersten Prototyp (bewusst)
- KI-Scan (wartet auf Selbst-Hosting), Versicherungs-Feature, Praxis-Anbindung, UPD-Anbindung, Familien-Sync, iOS, Play-Store-Launch

## Kostenschätzung Prototyp-Phase (ehrlich kennzeichnen)
- Werkzeuge: 0 € (GitHub free, Neon free tier, Expo free)
- Google Play erst bei Store-Beta: 25 $ einmalig
- Agent-Credits für Entwicklung: der eigentliche Kostenfaktor — gestufte Aufträge empfehlen
- Kellerserver: erst für OCR-Phase (150-300 € Stufe 1)

## Vorgemerkte Features nach Prototyp-Abnahme
- Verwandtschaftsgrad zwischen Haushalts-Tieren (09.07.2026, Idee Projektinhaber): optionales Feld "Verwandt mit …" (Elterntier/Nachkomme/Wurfgeschwister), Anzeige in Tierakte + Notfallpass. AUSDRÜCKLICH KEIN Stammbaum, keine Zucht-Funktionen. Details: mehrtier_konzept.md Abschnitt 6.
