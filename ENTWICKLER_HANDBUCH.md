# Entwickler-Handbuch: simplyPet

**Stand:** 25.07.2026  
**Zweck:** Dieses Dokument ist die zentrale Referenz für jede Entwicklungs-Session. Es beschreibt Konventionen, Workflows und Regeln, die eingehalten werden MÜSSEN.

---

## 1. Session-Start (Quickstart)

Jede neue Session beginnt mit:

```bash
cd /home/ubuntu
gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace
cd simplypet_workspace
```

Dann PFLICHT-LEKTÜRE in dieser Reihenfolge:
1. `ARBEITSANWEISUNG_UPDATE_PROZESS.md`
2. `INFRASTRUKTUR_UND_KONTEXT.md`
3. `ENTSCHEIDUNGSREGISTER.md`
4. `ARBEITSSTAND.md`

---

## 2. Repo-Struktur

```
pet-health-app-konzept/
├── app/                          ← Der gesamte App-Code (Expo/React Native)
│   ├── src/                      ← Quellcode
│   │   ├── components/           ← Wiederverwendbare UI-Komponenten
│   │   ├── screens/              ← Bildschirme (je einer pro Screen)
│   │   │   └── entries/          ← Erfassungs-Screens (Impfung, Kotprobe, etc.)
│   │   ├── db/                   ← SQLite-Schema, Migrationen, Queries
│   │   ├── navigation/           ← React Navigation Setup
│   │   ├── backup/               ← Backup-Service (Export/Import/Auto)
│   │   ├── utils/                ← Hilfsfunktionen (Zeit, Validierung, etc.)
│   │   ├── config/               ← Tierarten-Config, Theme, Konstanten
│   │   └── services/             ← Notifications, PDF-Export, QR-Erzeugung
│   ├── android/                  ← Android-Build-Ordner (generiert via prebuild)
│   ├── assets/                   ← Bilder, Fonts, Icons
│   ├── plugins/                  ← Expo Config Plugins (withApkName, withForegroundService, etc.)
│   ├── App.tsx                   ← Einstiegspunkt (Timer, Expiry, Navigation)
│   ├── app.json                  ← Expo-Konfiguration (EINZIGE Stelle für Version)
│   └── package.json              ← Abhängigkeiten
├── .github/workflows/            ← GitHub Actions (build-apk.yml)
├── setup_build_env.sh            ← Build-Umgebung einrichten (Fallback, nur Sandbox)
├── build_apk.sh                  ← APK lokal bauen (Fallback, nur Sandbox)
├── tester/                       ← Tester-Dokumente (Feedback-PDF, Installationshilfe)
├── *.md                          ← Konzept- und Dokumentationsdateien
└── README.md                     ← Projekt-Übersicht
```

---

## 3. Unveränderliche Regeln (Doktrin)

> Vollständige Doktrin-Liste: siehe `ENTSCHEIDUNGSREGISTER.md` → Abschnitt „Doktrin"

Diese Regeln dürfen NIEMALS gebrochen werden:

| Regel | Prüfung |
|:---|:---|
| Keine INTERNET-Permission | AndroidManifest.xml prüfen |
| Kein Tracking/Analytics | package.json prüfen |
| Kein Netzwerk-Code | src/ auf fetch/axios prüfen |
| Defensive Migrationen | CREATE TABLE mit IF NOT EXISTS |
| TypeScript 0 Fehler | `cd app && npx tsc --noEmit` |

---

## 4. Code-Konventionen

### TypeScript
- Strikt typisiert (kein `any` ohne Begründung)
- Alle Dateien mit `.ts` oder `.tsx` Endung
- Interfaces für alle Datenbank-Entities

### Datenbank (SQLite)
- Alle Tabellen mit `IF NOT EXISTS`
- Migrationen als nummerierte Funktionen: `migration_001()`, `migration_002()` ... `migration_007()`
- Neue Spalten immer mit `ALTER TABLE ... ADD COLUMN ... DEFAULT ...`
- Niemals Spalten löschen oder umbenennen (Rückwärtskompatibilität)

### Screens
- Ein Screen = eine Datei
- Maximale Dateigröße: 500 Zeilen (sonst aufteilen)
- Jeder Screen nutzt SafeAreaView mit Insets

### Formulare
- Draft-Autosave auf JEDEM Formular (≤2s Intervall)
- Doppelklick-Schutz auf allen Speichern-Buttons
- Bestätigungs-Dialog bei Zurück-Geste wenn Daten vorhanden
- Zukunfts-Datum gesperrt (außer bei Terminen)

### Notifications
- Nur lokale Notifications (kein Push-Server)
- Erinnerungs-Vorlauf einstellbar (min. 1 Tag)
- Saisonfenster-Logik für wiederkehrende Erinnerungen

---

## 5. Workflow: Feature hinzufügen

```
1. ARBEITSANWEISUNG_UPDATE_PROZESS.md befolgen (Phase 0 zuerst!)
2. Besprechen mit Nutzer → GO abwarten
3. ENTSCHEIDUNGSREGISTER.md aktualisieren
4. DB-Migration schreiben (falls neue Spalte/Tabelle nötig)
5. Code implementieren
6. TypeScript prüfen: cd app && npx tsc --noEmit → 0 Fehler
7. Commit + Push (triggert automatisch GitHub Actions Build)
8. Dokumentation aktualisieren (arbeitsstand, aenderungen)
9. Commit + Push der Doku
```

---

## 6. Workflow: Bug fixen

```
1. Bug im ENTSCHEIDUNGSREGISTER.md dokumentieren (BUG-X)
2. Ursache identifizieren
3. Fix implementieren
4. TypeScript-Check → 0 Fehler
5. Regression prüfen (hat der Fix etwas anderes kaputt gemacht?)
6. Commit: "fix: [Beschreibung des Bugs]" + Push
7. GitHub Actions baut automatisch neue APK
```

---

## 7. Build-System: GitHub Actions

**Primärer Build-Weg:** GitHub Actions (`.github/workflows/build-apk.yml`)

| Eigenschaft | Wert |
|:---|:---|
| Trigger | Push in `app/`-Ordner ODER manuell (workflow_dispatch) |
| Jobs | `build-tester` (mit 90-Tage-Timer) + `build-dev` (ohne Timer) |
| Dauer | ~30 Min (erster Lauf), danach mit Cache schneller |
| Artifacts | 30 Tage verfügbar, Download als ZIP |
| APK-Namen | `simplyPet_v{version}.apk` / `simplyPet_v{version}_DEV.apk` |

**WICHTIG:** Manus kann Workflow-Dateien NICHT pushen (fehlende `workflows`-Permission). Änderungen an `.github/workflows/` müssen vom Nutzer manuell auf GitHub committed werden.

**Fallback (nur wenn GitHub Actions nicht verfügbar):**
- Sandbox mit 6 GB Swap: `bash build_apk.sh`
- Dauert ~20-30 Min, funktioniert aber

**NIEMALS in der Sandbox bauen wenn GitHub Actions funktioniert** – das ist Credits-Verschwendung.

---

## 8. Commit-Konventionen

```
feat: Neues Feature hinzugefügt
fix:  Bug behoben
docs: Dokumentation aktualisiert
refactor: Code umstrukturiert (keine Funktionsänderung)
chore: Build-Skripte, Konfiguration, Abhängigkeiten
```

---

## 9. Versionierung

| Version | Bedeutung |
|:---|:---|
| 0.1.x | Prototyp-Phase (interner Test) – **aktuell hier (0.1.8)** |
| 0.2.x | Erweiterter Prototyp (nach Korrektur-Durchlauf) |
| 0.9.x | Beta (Play Store interner Test) |
| 1.0.0 | Erster öffentlicher Release |

Versionsnummer wird NUR in `app/app.json` geändert (eine einzige Stelle). Alle anderen Stellen lesen dynamisch aus `Constants.expoConfig?.version`.

---

## 10. Wichtige Dateien (Schnellreferenz)

**PFLICHT bei jeder Session (in dieser Reihenfolge):**

| Datei | Zweck |
|:---|:---|
| `ARBEITSANWEISUNG_UPDATE_PROZESS.md` | Pflicht-Ablauf jeder Session |
| `INFRASTRUKTUR_UND_KONTEXT.md` | Was existiert, was ist eingerichtet |
| `ENTSCHEIDUNGSREGISTER.md` | Alle Entscheidungen mit Begründung |
| `ARBEITSSTAND.md` | Aktueller Stand + offene Punkte |

**Nachschlagen bei Bedarf:**

| Datei | Zweck |
|:---|:---|
| `AENDERUNGEN.md` | Änderungen pro Version (laufende Datei, neueste oben) |
| `IMPLEMENTIERUNG_E94_E100.md` | Details zu E-94 bis E-100 |
| `TESTGERAETE_MATRIX.md` | Geräte und OS-Versionen |
| `SimplyPet_Markenrecherche_Bericht.md` | Markenrechtliche Analyse |

---

## 11. Checkliste vor jedem Push

- [ ] TypeScript: 0 Fehler (`cd app && npx tsc --noEmit`)
- [ ] Keine neuen `any`-Typen ohne Kommentar
- [ ] Keine INTERNET-Permission
- [ ] Keine neuen npm-Pakete ohne Begründung
- [ ] Commit-Message folgt Konvention
- [ ] Versionsnummer erhöht (bei Feature/Fix)
- [ ] Relevante .md-Datei aktualisiert
- [ ] `ENTSCHEIDUNGSREGISTER.md` aktualisiert (falls neue Entscheidung)

---

## 12. Dokumentations-Hygiene

**Prinzipien:**
- Jede Information hat genau EINEN Ort (keine Dopplungen)
- `ENTSCHEIDUNGSREGISTER.md` ist die Quelle der Wahrheit für Entscheidungen
- Andere Dateien verweisen auf das Register, wiederholen es nicht
- Wenn sich etwas ändert, wird die ALTE Version überschrieben (nicht daneben geschrieben)
- Jede Datei hat EINEN klaren Zweck
- Bei jeder Einigung oder neuem offenen Punkt: sofort dokumentieren und pushen
- **NIEMALS** Dokumentation "auf später" verschieben

**Dateihierarchie:**
```
ARBEITSANWEISUNG_UPDATE_PROZESS.md  → Wie starten wir? (Pflicht-Ablauf)
INFRASTRUKTUR_UND_KONTEXT.md        → Was existiert? (Infrastruktur)
ENTSCHEIDUNGSREGISTER.md            → Was ist entschieden? (Quelle der Wahrheit)
ARBEITSSTAND.md                     → Wo stehen wir? (Aktueller Stand)
AENDERUNGEN.md                      → Was hat sich geändert? (Changelog)
ENTWICKLER_HANDBUCH.md              → Wie arbeiten wir? (Konventionen) ← DIESE DATEI
```
