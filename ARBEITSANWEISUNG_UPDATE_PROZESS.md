# Arbeitsanweisung: App-Bau / Update-Prozess

> **PFLICHT** – Diese Anweisung gilt für JEDE Session. Keine Ausnahmen.  
> Erstellt: 11.07.2026 | Überarbeitet: 17.07.2026  
> Grund der Überarbeitung: Credits-Verschwendung durch vergessenen Kontext verhindern.

---

## PHASE 0: SESSION-START (VOR ALLEM ANDEREN)

> **DIESE PHASE IST NICHT OPTIONAL. SIE WIRD IMMER ZUERST AUSGEFÜHRT.**

1. **Repository klonen:** `gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace`
2. **Diese Datei lesen** (ARBEITSANWEISUNG_UPDATE_PROZESS.md)
3. **INFRASTRUKTUR_UND_KONTEXT.md lesen** – enthält alles was bereits existiert, eingerichtet ist, funktioniert
4. **ENTSCHEIDUNGSREGISTER.md lesen** – alle bisherigen Entscheidungen
5. **v0XX_arbeitsstand.md lesen** – aktueller Stand, was offen ist
6. **PROGRESS_v012.md lesen** – was in welcher Phase erledigt wurde

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
14. TypeScript-Check (`./node_modules/.bin/tsc --noEmit` – muss 0 Fehler haben)
15. **Sofort auf GitHub pushen** (Sicherung)

---

## Phase 4: GO abwarten

16. **GO vom Nutzer abwarten** – NICHT eigenständig mit dem Build beginnen
17. Nutzer bestätigt explizit dass gebaut werden soll

---

## Phase 5: APK bauen

18. **APK wird über GitHub Actions gebaut** – NICHT in der Sandbox
19. Push auf `main` triggert automatisch `.github/workflows/build-apk.yml`
20. APK liegt als Artifact im GitHub Actions Run (30 Tage verfügbar)
21. Alternativ: `gh workflow run build-apk.yml` für manuellen Trigger

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
