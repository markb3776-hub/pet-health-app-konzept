# Entwickler-Handbuch: simplyPet

**Stand:** 11.07.2026  
**Zweck:** Dieses Dokument ist die zentrale Referenz für jede Entwicklungs-Session. Es beschreibt Konventionen, Workflows und Regeln, die eingehalten werden MÜSSEN.

---

## 1. Session-Start (Quickstart)

Jede neue Session beginnt mit:

```bash
cd /home/ubuntu
gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace
cd simplypet_workspace
chmod +x scripts/*.sh
./scripts/setup_build_env.sh
```

Oder als Ein-Kommando-Variante:
```bash
bash <(curl -s https://raw.githubusercontent.com/markb3776-hub/pet-health-app-konzept/main/scripts/quickstart.sh)
```

---

## 2. Repo-Struktur

```
pet-health-app-konzept/
├── app/                          ← Der gesamte App-Code (Expo/React Native)
│   ├── src/                      ← Quellcode
│   │   ├── components/           ← Wiederverwendbare UI-Komponenten
│   │   ├── screens/              ← Bildschirme (je einer pro Screen)
│   │   ├── database/             ← SQLite-Schema, Migrationen, Queries
│   │   ├── navigation/           ← React Navigation Setup
│   │   ├── stores/               ← Zustandsverwaltung (Zustand/AsyncStorage)
│   │   ├── utils/                ← Hilfsfunktionen (Zeit, Validierung, etc.)
│   │   ├── config/               ← Tierarten-Config, Theme, Konstanten
│   │   └── services/             ← Notifications, PDF-Export, QR-Erzeugung
│   ├── android/                  ← Android-Build-Ordner (generiert via prebuild)
│   ├── assets/                   ← Bilder, Fonts, Icons
│   ├── app.json                  ← Expo-Konfiguration
│   └── package.json              ← Abhängigkeiten
├── scripts/                      ← Build- und Qualitäts-Skripte
│   ├── quickstart.sh             ← Ein-Kommando-Setup für neue Sessions
│   ├── setup_build_env.sh        ← Build-Umgebung einrichten
│   ├── build_apk.sh             ← APK bauen (mit allen Prüfungen)
│   └── quality_check.sh          ← Qualitätsprüfung (Pre-Release)
├── *.md                          ← Konzept- und Dokumentationsdateien
└── README.md                     ← Projekt-Übersicht
```

---

## 3. Unveränderliche Regeln (Doktrin)

> Vollständige Doktrin-Liste: siehe `ENTSCHEIDUNGSREGISTER.md` → Abschnitt „Doktrin"

Diese Regeln dürfen NIEMALS gebrochen werden. Automatisierte Prüfung:

| Regel | Automatische Prüfung durch |
|:---|:---|
| Keine INTERNET-Permission | `quality_check.sh` → AndroidManifest.xml |
| Kein Tracking/Analytics | `quality_check.sh` → package.json |
| Kein Netzwerk-Code | `quality_check.sh` → src/ auf fetch/axios |
| Defensive Migrationen | `quality_check.sh` → CREATE TABLE ohne IF NOT EXISTS |

---

## 4. Code-Konventionen

### TypeScript
- Strikt typisiert (kein `any` ohne Begründung)
- Alle Dateien mit `.ts` oder `.tsx` Endung
- Interfaces für alle Datenbank-Entities

### Datenbank (SQLite)
- Alle Tabellen mit `IF NOT EXISTS`
- Migrationen als nummerierte Funktionen: `migration_001()`, `migration_002()`
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
1. Dokument aktualisieren (nutzertest_feedback_v0.1.1.md oder roadmap)
2. DB-Migration schreiben (falls neue Spalte/Tabelle nötig)
3. Code implementieren
4. quality_check.sh ausführen → muss PASS sein
5. TypeScript prüfen: npx tsc --noEmit
6. APK bauen: ./scripts/build_apk.sh
7. Testen auf Gerät
8. Commit + Push mit aussagekräftiger Message
```

---

## 6. Workflow: Bug fixen

```
1. Bug dokumentieren (in nutzertest_feedback_*.md)
2. Ursache identifizieren
3. Fix implementieren
4. quality_check.sh → PASS
5. Regression prüfen (hat der Fix etwas anderes kaputt gemacht?)
6. APK bauen
7. Commit: "fix: [Beschreibung des Bugs]"
```

---

## 7. Commit-Konventionen

```
feat: Neues Feature hinzugefügt
fix:  Bug behoben
docs: Dokumentation aktualisiert
refactor: Code umstrukturiert (keine Funktionsänderung)
chore: Build-Skripte, Konfiguration, Abhängigkeiten
test: Tests hinzugefügt oder geändert
```

Beispiele:
```
feat: Rasse-Feld in Stammdaten und Tier-Anlegen ergänzt
fix: Doppelklick auf Speichern erzeugt keine Doppeleinträge mehr
docs: Konkurrenzanalyse und Nutzertest-Feedback v0.1.1 hinzugefügt
chore: Gradle auf speicherschonende Konfiguration umgestellt
```

---

## 8. Versionierung

| Version | Bedeutung |
|:---|:---|
| 0.1.x | Prototyp-Phase (interner Test) |
| 0.2.x | Erweiterter Prototyp (nach Korrektur-Durchlauf) |
| 0.9.x | Beta (Play Store interner Test) |
| 1.0.0 | Erster öffentlicher Release |

Versionsnummer MUSS in `package.json` UND `app.json` identisch sein.

---

## 9. Bekannte Einschränkungen der Sandbox

| Problem | Workaround |
|:---|:---|
| RAM-Limit (~4GB) | Gradle: 1 Worker, kein Daemon, max 2GB JVM |
| Kein persistenter Speicher | Alles ins Repo pushen, Setup-Skript nutzen |
| Kein echtes Android-Gerät | APK bauen → per Download-Link an Nutzer übergeben |
| Lange Build-Zeiten | Prebuild nur wenn nötig, android/ wiederverwenden |

---

## 10. Wichtige Dateien (Schnellreferenz)

**Zuerst lesen (bei jeder Session):**

| Datei | Zweck |
|:---|:---|
| `ENTSCHEIDUNGSREGISTER.md` | Quelle der Wahrheit: alle Entscheidungen + offene Punkte + Doktrin |
| `nutzertest_feedback_v0.1.1.md` | Was wird im nächsten Durchlauf gebaut? |
| `roadmap_prototyp.md` | Wo stehen wir im Gesamtplan? |

**Nachschlagen bei Bedarf:**

| Datei | Zweck |
|:---|:---|
| `konkurrenzanalyse_simplypet.md` | Wettbewerber-Analyse + Differenzierung |
| `pruefdoktrin_eingabe_stabilitaet.md` | Null-Datenverlust-Regel (3-fach-Prüfung) |
| `technische_spezifikation_datenmodell.md` | DB-Schema-Referenz |
| `technische_spezifikation_screen_flow.md` | Alle Screens und ihre Verbindungen |
| `tierarten_abdeckung_festlegungen.md` | 14 Tierarten mit Modulen |

---

## 11. Checkliste vor jedem Push

- [ ] `quality_check.sh` → alle PASS
- [ ] TypeScript: 0 Fehler
- [ ] Keine neuen `any`-Typen ohne Kommentar
- [ ] Keine INTERNET-Permission
- [ ] Keine neuen npm-Pakete ohne Begründung
- [ ] Commit-Message folgt Konvention
- [ ] Versionsnummer erhöht (bei Feature/Fix)
- [ ] Relevante .md-Datei aktualisiert
- [ ] `ENTSCHEIDUNGSREGISTER.md` aktualisiert (falls neue Entscheidung/offener Punkt)

---

## 12. Dokumentations-Hygiene

**Prinzipien:**
- Jede Information hat genau EINEN Ort (keine Dopplungen)
- `ENTSCHEIDUNGSREGISTER.md` ist die Quelle der Wahrheit für Entscheidungen
- Andere Dateien verweisen auf das Register, wiederholen es nicht
- Wenn sich etwas ändert, wird die ALTE Version überschrieben (nicht daneben geschrieben)
- Jede Datei hat EINEN klaren Zweck
- Bei jeder Einigung oder neuem offenen Punkt: sofort dokumentieren und pushen

**Dateihierarchie:**
```
ENTSCHEIDUNGSREGISTER.md    → Was ist entschieden? Was ist offen? (Quelle der Wahrheit)
nutzertest_feedback_*.md     → Was wird gebaut? (Arbeitsliste)
roadmap_prototyp.md          → Wo stehen wir? (Gesamtplan)
ENTWICKLER_HANDBUCH.md       → Wie arbeiten wir? (Konventionen)
konkurrenzanalyse_*.md       → Warum? (Hintergrund)
technische_spezifikation_*.md → Wie genau? (Technische Details)
```
