# Session-Kontext (gesichert 30.07.2026)

## Build-Prozess (KORREKT – nicht halluzinieren!)

### APK (für Tester):
- **Trigger:** Push auf `main` (wenn Dateien unter `app/` geändert) ODER manuell `gh workflow run build-apk.yml`
- **Workflow:** `.github/workflows/build-apk.yml`
- **Ergebnis:** `simplyPet_v{version}.apk` als GitHub Actions Artifact (30 Tage)
- **Varianten:** `tester` (mit 90-Tage-Timer), `dev` (ohne Timer)

### AAB (für Play Store):
- **Trigger:** NUR manuell: `gh workflow run build-aab.yml`
- **Workflow:** `.github/workflows/build-aab.yml`
- **Ergebnis:** `simplyPet_v{version}.aab` als GitHub Actions Artifact (90 Tage)
- **Signing:** Upload-Keystore in GitHub Secrets (UPLOAD_KEYSTORE_BASE64, UPLOAD_KEY_ALIAS, UPLOAD_STORE_PASSWORD, UPLOAD_KEY_PASSWORD)
- **Timer:** Wird im AAB-Build automatisch deaktiviert (sed EXPIRY_DAYS = 9999)

### NIEMALS in der Sandbox bauen!
- Sandbox hat ~3.8 GB RAM, Gradle braucht ~4 GB
- GitHub Actions hat 7 GB RAM
- Sandbox-Build = Credits-Verschwendung

### Sandbox-Fallback (nur wenn GitHub Actions nicht geht):
- `setup_build_env.sh` + 6 GB Swap + `build_apk.sh`
- Dauert 20-30 Min

## Aktuelle Version:
- version: 1.0.0
- versionCode: 13 (gerade hochgesetzt für E-124)
- Paketname: de.simplypet.app

## Play Store Status:
- Developer Account: Simply DevApps
- E-Mail: simplypet.app@gmail.com
- Identitätsprüfung: eingereicht 25.07.2026, wartet
- AAB bereits hochgeladen (Run #5, versionCode war damals niedriger)
- Preis: 2,99€ Einmalkauf

## Pflicht-Ablauf jeder Session:
1. Repo klonen
2. ARBEITSANWEISUNG_UPDATE_PROZESS.md lesen
3. SCHLACHTPLAN_STORE_RELEASE.md lesen
4. INFRASTRUKTUR_UND_KONTEXT.md lesen
5. ENTSCHEIDUNGSREGISTER.md lesen
6. ARBEITSSTAND.md lesen

## Verbote:
- NIEMALS APK/AAB in Sandbox bauen
- NIEMALS bauen ohne GO vom Nutzer
- NIEMALS Code ändern ohne Besprechung
- NIEMALS etwas vorschlagen was laut INFRASTRUKTUR bereits existiert
- NIEMALS Phase 0 überspringen
- NIEMALS halluzinieren – wenn ich etwas nicht weiß: NACHSCHAUEN oder ZUGEBEN

## GitHub Actions Permissions:
- Manus-Connector kann KEINE Workflow-Dateien pushen (fehlende `workflows`-Permission)
- Nutzer muss Workflow-Änderungen manuell committen
