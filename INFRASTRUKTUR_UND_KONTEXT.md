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
| Aktuelle Version | 0.1.5 (versionCode 5) |
| Min SDK | 29 (Android 10) |
| Target/Compile SDK | 36 |

---

## Build-System

| Eigenschaft | Wert |
|:---|:---|
| **APK-Build** | **GitHub Actions** (`.github/workflows/build-apk.yml`) |
| Trigger | Automatisch bei Push auf `main` (Pfad: `app/**`) |
| Manueller Trigger | `gh workflow run build-apk.yml` |
| APK-Artifact | Im GitHub Actions Run, 30 Tage verfügbar |
| APK-Dateiname | `simplyPet_v{version}.apk` (Plugin: `withApkName.js`) |
| **SANDBOX-BUILD** | **VERBOTEN** – nicht genug RAM, verschwendet nur Credits |

### Build-Scripts im Repo (Legacy/Fallback):
- `setup_build_env.sh` – Richtet JDK + Android SDK in der Sandbox ein
- `build_apk.sh` – Baut APK lokal (nur für Notfälle auf einem echten Rechner)

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
- GitHub Actions Workflow erstellen (existiert seit 17.07.2026)
- Backup-System implementieren (E-93, erledigt 17.07.2026)
- Notification-Icon fixen (E-90/E-92, erledigt 15.07.2026)
- APK-Namenskonvention (E-91, erledigt 15.07.2026)
- Kotprobe-Screen (erledigt)
- Pferde-Felder in EditPet (erledigt)

---

## Bekannte Einschränkungen

| Problem | Lösung |
|:---|:---|
| Sandbox hat nur ~2 GB RAM | APK über GitHub Actions bauen, NICHT lokal |
| Sandbox wird nach Inaktivität resettet | Alles liegt auf GitHub, einfach neu klonen |
| Kontext geht zwischen Sessions verloren | DIESE DATEI zu Beginn lesen |
