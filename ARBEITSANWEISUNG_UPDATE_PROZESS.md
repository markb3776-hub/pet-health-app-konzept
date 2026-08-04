# Arbeitsanweisung: App-Bau / Update-Prozess

> **PFLICHT – gilt für JEDE Session, keine Ausnahmen.**
> Erstellt: 11.07.2026 | Überarbeitet: 04.08.2026
> Grund der Überarbeitung: Timer/EXPIRY_DAYS entfernt, Agent darf
> Builds jetzt selbst triggern (vorher: nur Nutzer) – dafür
> Pflicht-Rückfrage vor jedem Build-Trigger eingeführt.
> AGENTS.md-Idee verworfen (Manus lädt eigene Projektanweisung
> automatisch, keine zusätzliche Datei nötig). Kurzfassung der
> Kernregeln liegt direkt in der Manus-Projektanweisung.
> Versionierte Dateinamen (v015_arbeitsstand.md, vXX_aenderungen.md,
> PROGRESS_v012.md) abgeschafft – Ursache für veraltete/vergessene
> Dokumente. Ab jetzt: ARBEITSSTAND.md und AENDERUNGEN.md als
> laufend aktualisierte Einzeldateien ohne Versionsnummer im Namen.

---

## Phase 0: Session-Start

**Bevor du irgendetwas anderes tust – auch bevor du auf die Nutzernachricht reagierst –**
lies in dieser Reihenfolge:

1. `SCHLACHTPLAN_STORE_RELEASE.md` – nächste Schritte, Priorität 1
2. `INFRASTRUKTUR_UND_KONTEXT.md` – was existiert bereits
3. `ENTSCHEIDUNGSREGISTER.md` – bisherige Entscheidungen
4. `ARBEITSSTAND.md` – aktueller offener Stand

**Deine allererste Ausgabe** (vor jedem Tool-Call, vor jeder inhaltlichen Reaktion):

```
Kartoffel. Arbeitsanweisung gelesen.
- Stand Arbeitsanweisung: [Datum aus Zeile 4 dieser Datei]
- versionCode (aus app/app.json): [grep versionCode app/app.json]
- Letzter Commit: [git log --oneline -1]
- Nächster Schritt laut Schlachtplan: [1 Satz]
```

**Prüfung durch den Nutzer:** Kein "Kartoffel" → Session abbrechen. versionCode oder Commit falsch/unbekannt → nachfragen, ob wirklich gepullt/aktualisiert wurde.

**In Phase 0 verboten:** Code anfassen, etwas vorschlagen oder bauen, das schon existiert, auf den Nutzer reagieren bevor die Pflicht-Bestätigung gesendet wurde.

---

## Phase 1: Rückmeldung & Besprechung

Nutzer gibt Feedback → gemeinsam besprechen, was umgesetzt/verworfen wird. **Kein Code ohne GO.**

---

## Phase 2: Dokumentation aktualisieren

Entscheidungsregister-Eintrag (Begründung + Datum) → neuer Eintrag in `AENDERUNGEN.md` (eine laufende Datei, chronologisch, neueste Einträge oben – KEINE neue Datei pro Version) → auf GitHub pushen. **Dokumentation vor Code.**

---

## Phase 3: Code aktualisieren

1. Code-Änderungen durchführen
2. TypeScript-Check: `cd app && npx tsc --noEmit` – muss 0 Fehler haben
3. Konsistenz-Check vor jedem Push:
   - Werden Daten an mehreren Stellen angezeigt (Notfallpass-UI, QR-Code, PDF)? Alle Stellen gleiche Felder?
   - SQL-Queries: alle benötigten Spalten gelesen? SELECT-Spaltenanzahl passt zu Parametern?
   - Neue Routen registriert und erreichbar?
4. Sofort auf GitHub pushen (Sicherung)

**Wichtig:** Ein gepushter Commit ist noch KEIN Build-Auftrag. Phase 3 endet mit dem Push, nicht mit einem Build.

---

## Phase 4: GO abwarten – zweistufig

15. Nutzer bestätigt allgemein, dass es weitergehen/gebaut werden soll (GO für den Code/das Feature).
16. **Das ist noch nicht das GO zum Bauen.** Bevor der Agent einen Build tatsächlich triggert, MUSS er separat und explizit fragen:
    > "Soll ich jetzt [APK/AAB] bauen? Bitte bestätige."
17. Erst nach einer eindeutigen Ja-Antwort auf genau diese Frage (z. B. "Ja, bau die AAB") darf Phase 5 beginnen.
18. Ein "Ja, das klingt gut", "passt so", "mach weiter" im Kontext einer Code-Besprechung zählt NICHT als Build-Bestätigung.

---

## Phase 5: Build

19. Builds laufen **ausschließlich über GitHub Actions**, niemals in der Sandbox (Sandbox hat ~2 GB RAM, Gradle braucht ~4 GB; GitHub Actions hat 7 GB und funktioniert zuverlässig – jeder Sandbox-Build-Versuch verbrennt nur Credits).
20. `setup_build_env.sh` und `build_apk.sh` (egal ob im Repo-Root oder unter `scripts/`) sind **außer Betrieb** – nicht ausführen, auch nicht testweise.
21. **APK:** `gh workflow run build-apk.yml` – nach Bestätigung aus Phase 4.
22. **AAB (Play Store):** `gh workflow run build-aab.yml` – nach Bestätigung aus Phase 4.
23. Beide Workflows können vom Agenten getriggert werden (Stand 04.08.2026 – vorher war das technisch nur dem Nutzer möglich, weil `build-apk.yml` über einen automatischen Push-Trigger lief statt über `workflow_dispatch`; das ist jetzt vereinheitlicht). Die Kontrolle läuft seither ausschließlich über die Rückfrage-Pflicht in Phase 4, nicht mehr über eine technische Sperre.
24. Artifacts: APK 30 Tage, AAB 90 Tage.
25. Kein Timer/EXPIRY_DAYS mehr (entfernt 04.08.2026) – keine TESTER/DEV-Unterscheidung mehr nötig.

---

## Reihenfolge in einem Satz

> Kontext lesen → Kartoffel-Bestätigung → Besprechen → Dokumentieren → Ändern → Pushen → GO abwarten → Build-Rückfrage stellen → nach Bestätigung: GitHub Actions triggern.

---

## Sandbox-Hinweise (nach Reset)

```
gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace
cd app && npm install
cd app && ./node_modules/.bin/tsc --noEmit
```
Android SDK nur für lokale Diagnosezwecke relevant, NICHT für den eigentlichen Build – der läuft immer über GitHub Actions (Phase 5).
