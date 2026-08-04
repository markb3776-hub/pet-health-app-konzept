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
| Aktuelle Version | 1.0.0 (versionCode 17) |
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
| **APK-Build** | **GitHub Actions** – Nur manuell triggerbar: "Build APK" → "Run workflow". Ein Job, ein Artifact. |
| **AAB-Build** | **GitHub Actions** – Nur manuell triggerbar: "Build AAB" → "Run workflow". |
| APK-Dateiname | `simplyPet_v{version}.apk` |
| **Beide Builds** | **NUR durch den Nutzer triggerbar!** Manus-Token hat KEINE `workflow_dispatch`-Berechtigung. |
| **Cloud Computer** | `Mark B.s Cloud-Computer` – 1 GB RAM, nur für Git-Ops geeignet, NICHT für Builds |
| **GitHub Actions** | Workflows existieren. Manus kann Workflow-Dateien NICHT pushen (fehlende `workflows`-Permission). |
| **Sandbox** | NICHT für Builds geeignet (zu wenig RAM). Nur für Code-Änderungen und TypeScript-Check. |

### Build-Regeln (PFLICHT):
- **APK:** Nur manuell durch Nutzer triggerbar. Kein Auto-Trigger bei Push. Ein Job, ein Artifact.
- **AAB:** Nur manuell durch Nutzer triggerbar. GitHub Actions → "Build AAB" → "Run workflow".
- **Kein Timer mehr!** Die Timer-Logik (EXPIRY_DAYS, TESTER/DEV-Unterscheidung) wurde am 04.08.2026 komplett entfernt.
- **Sandbox:** NIEMALS Builds in der Sandbox. Nicht genug RAM.

### Build-Scripts im Repo (historisch, werden nicht mehr genutzt):
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
| `ARBEITSSTAND.md` | Aktueller Arbeitsstand |
| `AENDERUNGEN.md` | Änderungen aller Versionen (laufende Datei, neueste oben) |
| `E-93_Backup_Analyse.md` | Analyse des Backup-Systems |
| `TESTGERAETE_MATRIX.md` | Geräte und OS-Versionen |

---

## Was NICHT nochmal gemacht werden muss

- GitHub-Connector einrichten (existiert seit ~03.07.2026)
- Build-Scripts schreiben (existieren)
- GitHub Actions Workflow erstellen (existiert seit 25.07.2026, APK-Pfad-Fix committed ✅)
- Google Play Developer Account einrichten (Simply DevApps, 25.07.2026 ✅)
- Markenrecherche "SimplyPet" durchführen (25.07.2026 ✅, Name ist frei)
- Backup-System implementieren (E-93, erledigt 17.07.2026)
- Notification-Icon fixen (E-90/E-92, erledigt 15.07.2026)
- APK-Namenskonvention (E-91, erledigt 15.07.2026)
- Kotprobe-Screen (erledigt)
- Pferde-Felder in EditPet (erledigt)

---

## Bekannte Einschränkungen

| Problem | Lösung |
|:---|:---|
| Sandbox hat nur ~3.8 GB RAM | NICHT für Builds verwenden. Nur Code + TypeScript-Check. |
| Sandbox wird nach Inaktivität resettet | Alles liegt auf GitHub, einfach neu klonen |
| Kontext geht zwischen Sessions verloren | DIESE DATEI zu Beginn lesen |
| GitHub Actions Workflow kann nicht gepusht werden | Manus-Connector hat keine `workflows`-Permission. Nutzer muss Workflow-Änderungen manuell auf GitHub committen. |
| AAB-Build kann nicht getriggert werden | Manus-Token hat keine `workflow_dispatch`-Berechtigung. Nutzer muss manuell triggern. |
| APK manuell triggern erzeugt Doppel-Artifacts | NICHT manuell triggern. Push auf main reicht (baut nur TESTER). |
| Cloud Computer hat nur 1 GB RAM | Nur für Git-Ops und leichte Tasks. Builds nur in GitHub Actions. |
| APK-Pfad nach Expo-Build nicht vorhersagbar | Workflow verwendet `find` statt hardcoded Pfad (✅ gefixt 25.07.2026) |

---

## Google Play Store

| Eigenschaft | Wert |
|:---|:---|
| Developer Account | Simply DevApps |
| E-Mail | simplypet.app@gmail.com |
| Konto-ID | 7410284957463056128 |
| Kontotyp | Privates Konto (Einzelperson) |
| Servicegebühr | 15 % (bis 1 Mio USD/Jahr) |
| Preismodell App | Einmalkauf 2,99 € |
| Identitätsprüfung | ✅ Bestätigt 27.07.2026 |
| App-Status | ✅ LIVE im Play Store (veröffentlicht 29.07.2026) |
| Werbetext | Simple apps for everyone. Keep your data and information on your device and decide what you're willing to share. |

### Play Store Assets:
| Datei | Zweck | Größe |
|:---|:---|:---|
| `simply_devapps_logo_v2.png` | Logo Original | 1920x1920 |
| `simply_devapps_icon_512x512.jpg` | Entwicklersymbol (hochgeladen) | 512x512 |
| `simply_devapps_banner_4096x2304.jpg` | Kopfzeilenbild (hochgeladen) | 4096x2304 |

---

## Promo-Codes für Tester (kostenpflichtige App im geschlossenen Test)

> **Problem:** Bei kostenpflichtigen Apps müssen Tester im geschlossenen Test den vollen Preis zahlen.  
> **Lösung:** Promo-Codes generieren – Tester lösen den Code ein und bekommen die App für 0 €.

### Wo in der Play Console:

1. Play Console → SimplyPet auswählen
2. Linke Sidebar → **Monetarisierung** → **Promotions** (Werbeaktionen)
3. "Promotion erstellen"
4. Typ: **Einmal-Codes** (one-time use) – jeder Code funktioniert nur 1x
5. Produkt: Die App selbst (paid app)
6. Anzahl: 15 Codes (12 Tester + Puffer)
7. Enddatum festlegen

### Wie Tester einlösen:

- Play Store App → Profil-Icon → Zahlungen & Abos → **Code einlösen**
- Oder Deep-Link: `https://play.google.com/redeem?code=DEIN_CODE`

### Limits & Regeln:

| Eigenschaft | Wert |
|:---|:---|
| Max. Codes pro Quartal | 500 (für One-Time-Products/Apps) |
| Code-Typ | Einmal-Code (automatisch generiert, einmalig einlösbar) |
| Gültigkeit | Bis zum festgelegten Enddatum |
| Nicht genutzte Codes | Verfallen am Quartalsende (kein Übertrag) |
| Voraussetzung | Tester muss in der geschlossenen Test-Gruppe sein |

### Wichtig:

- **Interner Test** = App automatisch kostenlos, zählt aber NICHT für die 14-Tage-Anforderung
- **Geschlossener Test** = Tester müssen zahlen, AUSSER sie haben einen Promo-Code
- Promo-Codes funktionieren unabhängig vom Track (geschlossen, offen, Produktion)

### Troubleshooting: "Dieser Code hat nicht funktioniert"

**Häufigste Ursache: Zeitzone!**

- Die Play Console verwendet **UTC (GMT+0)** für Start-/Endzeit der Promotion
- Deutschland = UTC+2 → Wenn du 20:00 als Start eingibst, meint Google 20:00 UTC = 22:00 MESZ
- Solange die UTC-Startzeit nicht erreicht ist, zeigt die Promotion Status **"Scheduled"** (geplant) statt **"Live"**
- Codes funktionieren NUR wenn Status = **"Live"**

**Prüfung:** Play Console → Monetarisierung → Promotions → Status-Spalte muss "Live" zeigen.

**Billing Library NICHT erforderlich:**

- Die Warnung "Achte darauf, dass du deine App mit der Google Play Billing Library integriert hast" erscheint IMMER beim Erstellen von Promo-Codes
- Für **kostenpflichtige Apps** (paid app download) ist die Billing Library NICHT nötig
- Die Billing Library wird nur für In-App-Purchases und Subscriptions benötigt
- Quelle: B4X Forum Thread (2020) – bestätigt dass Codes für paid apps ohne Billing Library funktionieren, das Problem war die Zeitzone

### Quelle:

- [Create promotions (Play Console Help)](https://support.google.com/googleplay/android-developer/answer/6321495)
- [Promo codes (Android Developer Docs)](https://developer.android.com/google/play/billing/promo)
- [B4X Forum: Promo Code - Require Billing Lib?](https://www.b4x.com/android/forum/threads/promo-code-require-billing-lib.123833/) – Bestätigung dass Zeitzone das Problem ist, nicht Billing Library
