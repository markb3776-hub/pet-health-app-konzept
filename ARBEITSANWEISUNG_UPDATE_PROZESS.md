# Arbeitsanweisung: App-Bau / Update-Prozess

> **PFLICHT** – Diese Anweisung gilt für JEDE Session. Keine Ausnahmen.  
> Erstellt: 11.07.2026 | Überarbeitet: 25.07.2026  
> Grund der Überarbeitung: Code-Review/Konsistenz-Check als Pflicht-Schritt eingeführt (BUG-5 Prävention).

---

## PHASE 0: SESSION-START (VOR ALLEM ANDEREN)

> **DIESE PHASE IST NICHT OPTIONAL. SIE WIRD IMMER ZUERST AUSGEFÜHRT.**

1. **Repository klonen:** `gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace`
2. **Diese Datei lesen** (ARBEITSANWEISUNG_UPDATE_PROZESS.md)
3. **SCHLACHTPLAN_STORE_RELEASE.md lesen** – enthält die exakten nächsten Schritte für den Store-Release (Prio 1)
4. **INFRASTRUKTUR_UND_KONTEXT.md lesen** – enthält alles was bereits existiert, eingerichtet ist, funktioniert
5. **ENTSCHEIDUNGSREGISTER.md lesen** – alle bisherigen Entscheidungen
6. **v015_arbeitsstand.md lesen** – aktueller Stand, was offen ist

### VERBOTEN in Phase 0:
- Code anfassen
- Etwas vorschlagen was bereits existiert
- Etwas bauen was schon eingerichtet ist
- Irgendwas tun bevor alle oben genannten Dateien gelesen wurden

---

## Phase 1: Rückmeldung & Besprechung

7. Nutzer gibt Feedback (Tester-Rückmeldung, eigene Beobachtungen, neue Wünsche)
8. Gemeinsame Besprechung: Was wird umgesetzt? Was wird verworfen?
9. **Kein Code ohne GO vom Nutzer.**

---

## Phase 2: Dokumentation aktualisieren

10. Entscheidungsregister aktualisieren (neuer Eintrag mit Begründung + Datum)
11. Änderungsdokument erstellen/aktualisieren (vXX_aenderungen.md)
12. Auf GitHub speichern (Dokumentation VOR Code)

---

## Phase 3: Code aktualisieren

13. Code-Änderungen durchführen
14. TypeScript-Check (`cd app && npx tsc --noEmit` – muss 0 Fehler haben)
15. **Code-Review & Konsistenz-Check** (PFLICHT vor jedem Push):
    - Alle geänderten Funktionen durchlesen: Stimmt Input/Output?
    - Werden Daten an mehreren Stellen angezeigt (z.B. Notfall-Pass UI, QR-Code, PDF)? → Prüfen ob ALLE Stellen die gleichen Felder abfragen
    - SQL-Queries prüfen: Werden alle benötigten Spalten gelesen?
    - Navigation: Sind alle neuen Routen registriert und erreichbar?
    - Wenn ein Feature Daten aus der DB liest: Stimmt die Spaltenanzahl im SELECT mit den Parametern überein?
16. **Sofort auf GitHub pushen** (Sicherung)

---

## Phase 4: GO abwarten

17. **GO vom Nutzer abwarten** – NICHT eigenständig mit dem Build beginnen
18. Nutzer bestätigt explizit dass gebaut werden soll

---

## Phase 5: Build (APK oder AAB)
19. **Builds werden über GitHub Actions gebaut** – NICHT in der Sandbox
20. **APK (für direkte Tester):** Push auf `main` triggert automatisch `.github/workflows/build-apk.yml`
21. **AAB (für Play Store):** Manuell triggern – **NUR durch den Nutzer möglich!** Der Manus-Token hat KEINE Berechtigung für `workflow_dispatch`. Nutzer muss in GitHub Actions → "Build AAB" → "Run workflow" klicken.
22. Artifacts liegen im GitHub Actions Run (APK: 30 Tage, AAB: 90 Tage)
23. **APK NICHT manuell triggern!** Der Push auf `main` baut automatisch nur die TESTER-Variante. Ein manueller `gh workflow run build-apk.yml` ohne Parameter nutzt Default `both` und erzeugt unnötige Doppel-Artifacts (TESTER + DEV). Manueller Trigger ist überflüssig.

### NIEMALS in der Sandbox bauen:
- Die Sandbox hat nicht genug RAM für Gradle (~2 GB vs. benötigte ~4 GB)
- GitHub Actions hat 7 GB RAM – dort funktioniert es immer
- Jeder Sandbox-Build-Versuch ist reine Credits-Verschwendung

---

## Verbote

- **NIEMALS** APK in der Sandbox bauen (GitHub Actions existiert dafür)
- **NIEMALS** APK bauen bevor Code auf GitHub liegt
- **NIEMALS** APK bauen ohne explizites GO vom Nutzer
- **NIEMALS** Code ändern ohne vorherige Besprechung/GO
- **NIEMALS** etwas vorschlagen was laut INFRASTRUKTUR_UND_KONTEXT.md bereits existiert
- **NIEMALS** von Null anfangen wenn 80% schon existieren
- **NIEMALS** Phase 0 überspringen

---

## Reihenfolge in einem Satz

> **Kontext lesen → Besprechen → Dokumentieren → Ändern → Pushen → GO abwarten → GitHub Actions baut.**

---

## Hinweise für die Sandbox

- Nach Sandbox-Reset: `gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace`
- `node_modules`: `cd app && npm install`
- TypeScript-Check: `cd app && ./node_modules/.bin/tsc --noEmit`
- APK-Build: **GitHub Actions** (nicht lokal!)
- Android SDK: nur für `expo prebuild` nötig, NICHT für den eigentlichen Build
