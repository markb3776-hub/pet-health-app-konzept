# Infrastruktur & Kontext – simplyPet

> **PFLICHT-LEKTÜRE** zu Beginn jeder Session.  
> Enthält alles was bereits existiert, eingerichtet ist und funktioniert.  
> Erstellt: 17.07.2026

---

## Repository

| Eigenschaft | Wert |
|:---|:---|
| GitHub-Repo | `markb3776-hub/pet-health-app-konzept` (privat) |
| Branch | `main` |
| Clone-Befehl | `gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace` |
| GitHub CLI | Eingerichtet und authentifiziert (seit ~03.07.2026) |

---

## App-Technologie

| Eigenschaft | Wert |
|:---|:---|
| Framework | React Native + Expo (Managed Workflow mit Prebuild) |
| Sprache | TypeScript (strict) |
| Datenbank | SQLite (expo-sqlite) – lokal, kein Server |
| Navigation | React Navigation (Native Stack) |
| Package-Name | `de.simplypet.app` |
| Aktuelle Version | 0.1.8 (versionCode 6) |
| Min SDK | 29 (Android 10) |
| Target/Compile SDK | 36 |

---

## Versionierung

**Schema: `MAJOR.MINOR.PATCH` (Semantic Versioning)**

| Stelle | Wann hochzählen | Beispiel |
|:--|:--|:--|
| **MAJOR** (0 → 1) | App ist Release-ready für den Store | 1.0.0 |
| **MINOR** (0.1 → 0.2) | Neues Feature oder größere Funktionserweiterung | 0.1.7 → 0.1.8 |
| **PATCH** (0.1.8 → 0.1.8.1) | Bugfix, kleine Korrekturen ohne neue Funktion | Icon-Fix, Crash-Fix |

**Regeln:**
- `versionCode` zählt bei JEDEM Build hoch (egal ob Feature oder Fix)
- APK-Name: `simplyPet_v{version}.apk`
- MAJOR = 0 solange in Entwicklung, MAJOR = 1 ab Store-Release
- Version wird NUR in `app/app.json` geändert (eine einzige Stelle)
- Alle anderen Stellen (MoreScreen, backupService) lesen dynamisch aus `Constants.expoConfig?.version`

---

## Build-System

| Eigenschaft | Wert |
|:---|:---|
| **APK-Build** | **GitHub Actions** (bevorzugt, ~30 Min erster Lauf, danach schneller) |
| APK-Dateiname | `simplyPet_v{version}.apk` (Plugin: `withApkName.js`) |
| **Cloud Computer** | `Mark B.s Cloud-Computer` – 1 GB RAM, nur für Git-Ops geeignet, NICHT für Builds |
| **GitHub Actions** | Workflow existiert (`.github/workflows/build-apk.yml`). Manus kann Workflow-Dateien NICHT pushen (fehlende `workflows`-Permission). App-Code-Pushes triggern den Build automatisch. |
| **Sandbox** | Fallback für lokale Builds mit Swap (3.8 GB RAM + 6 GB Swap, ~20-30 Min) |

### Build-Ablauf (Sandbox mit Swap):
1. `bash setup_build_env.sh` (JDK + Android SDK)
2. `sudo fallocate -l 6G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
3. `cd app/android && ./gradlew app:assembleRelease --no-daemon --max-workers=1`
4. Falls Lint-Fehler: `lint { checkReleaseBuilds false; abortOnError false }` in `app/build.gradle` unter `android {}`
5. APK liegt unter: `app/android/app/build/outputs/apk/release/simplyPet_v0.1.5.apk`

### Build-Scripts im Repo:
- `setup_build_env.sh` – Richtet JDK + Android SDK ein
- `build_apk.sh` – Baut APK (braucht Swap oder >4 GB RAM)

---

## Backup-System (E-93, implementiert 17.07.2026)

| Feature | Status |
|:---|:---|
| Auto-Backup bei jeder Datenänderung | Implementiert (6 Screens) |
| Backup-Status in AsyncStorage | `simplypet.last_backup_date` (überlebt App-Updates) |
| Export: Lokal speichern (SAF) | Nativer "Speichern unter..."-Dialog |
| Export: Teilen (Share-Intent) | WhatsApp, Drive, E-Mail etc. |
| Import: DocumentPicker | Findet alle .simplypet-Dateien |

---

## Notification-System (E-90/E-92)

| Feature | Status |
|:---|:---|
| Notification-Icon | simplyPet-Pfote (DPI-skaliert 24-96px) |
| Icon-Farbe | `0xFF2E9E83` (simplyPet-Grün) |
| Plugin | `withForegroundService.js` |

---

## Wichtige Dateien im Repo

| Datei | Zweck |
|:---|:---|
| `ARBEITSANWEISUNG_UPDATE_PROZESS.md` | Pflicht-Ablauf jeder Session |
| `INFRASTRUKTUR_UND_KONTEXT.md` | **Diese Datei** – was existiert |
| `ENTSCHEIDUNGSREGISTER.md` | Alle Entscheidungen mit Begründung |
| `PROGRESS_v012.md` | Fortschritt nach Phasen |
| `v015_arbeitsstand.md` | Aktueller Arbeitsstand |
| `v015_aenderungen.md` | Änderungen der aktuellen Version |
| `E-93_Backup_Analyse.md` | Analyse des Backup-Systems |
| `TESTGERAETE_MATRIX.md` | Geräte und OS-Versionen |

---

## Was NICHT nochmal gemacht werden muss

- GitHub-Connector einrichten (existiert seit ~03.07.2026)
- Build-Scripts schreiben (existieren)
- GitHub Actions Workflow erstellen (existiert seit 25.07.2026, manueller Fix für APK-Pfad ausstehend)
- Backup-System implementieren (E-93, erledigt 17.07.2026)
- Notification-Icon fixen (E-90/E-92, erledigt 15.07.2026)
- APK-Namenskonvention (E-91, erledigt 15.07.2026)
- Kotprobe-Screen (erledigt)
- Pferde-Felder in EditPet (erledigt)

---

## Bekannte Einschränkungen

| Problem | Lösung |
|:---|:---|
| Sandbox hat nur ~3.8 GB RAM | APK mit 6 GB Swap bauen (funktioniert, dauert ~20-30 Min) |
| Sandbox wird nach Inaktivität resettet | Alles liegt auf GitHub, einfach neu klonen |
| Kontext geht zwischen Sessions verloren | DIESE DATEI zu Beginn lesen |
| GitHub Actions Workflow kann nicht gepusht werden | Manus-Connector hat keine `workflows`-Permission. Nutzer muss Workflow-Änderungen manuell auf GitHub committen. |
| Cloud Computer hat nur 1 GB RAM | Nur für Git-Ops und leichte Tasks. Builds in GitHub Actions oder Sandbox. |
| APK-Pfad nach Expo-Build nicht vorhersagbar | Workflow muss `find` statt hardcoded Pfad verwenden (Fix vorbereitet, muss manuell committed werden) |
