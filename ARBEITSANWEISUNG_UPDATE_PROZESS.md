# Arbeitsanweisung: App-Bau / Update-Prozess

> **PFLICHT** – Diese Anweisung gilt für JEDE Session, in der Code geändert oder eine APK gebaut wird.  
> Erstellt: 11.07.2026 | Quelle: Nutzer-Ablaufplan (Samsung Notes)

---

## Ablauf (strikt einzuhalten)

### Phase 1: Rückmeldung & Besprechung

1. Nutzer gibt Feedback (Tester-Rückmeldung, eigene Beobachtungen, neue Wünsche)
2. Gemeinsame Besprechung: Was wird umgesetzt? Was wird verworfen?
3. **Kein Code ohne GO vom Nutzer.**

### Phase 2: Dokumentation aktualisieren

4. Entscheidungsregister aktualisieren (neuer Eintrag mit Begründung + Datum)
5. Änderungsdokument erstellen/aktualisieren (vXX_aenderungen.md)
6. Auf GitHub speichern (Dokumentation VOR Code)

### Phase 3: Code aktualisieren

7. **Frischer Clone aus GitHub** (sauberer Ausgangszustand)
8. `npm install` (Abhängigkeiten sicherstellen)
9. Code-Änderungen durchführen
10. TypeScript-Check (`npx tsc --noEmit` – muss 0 Fehler haben)
11. **Sofort auf GitHub speichern** (Sicherung – geht bei Absturz nichts verloren)

### Phase 4: APK bauen

12. Erst NACH dem Speichern auf GitHub wird gebaut
13. `npx expo prebuild --platform android --no-install`
14. `./gradlew assembleRelease`
15. APK dem Nutzer übergeben

---

## Verbote

- **NIEMALS** APK bauen bevor Code auf GitHub liegt
- **NIEMALS** `rm -rf android` ohne vorher zu prüfen ob Code gesichert ist
- **NIEMALS** Code ändern ohne vorherige Besprechung/GO
- **NIEMALS** von Null anfangen wenn 80% schon existieren

---

## Reihenfolge in einem Satz

> **Besprechen → Dokumentieren → Aus GitHub holen → Ändern → Auf GitHub speichern → Dann erst bauen.**

---

## Hinweise für die Sandbox

- Nach Sandbox-Reset: Alles aus GitHub holen (`gh repo clone`)
- `node_modules` muss neu installiert werden (`npm install --legacy-peer-deps`)
- Android SDK liegt unter `/home/ubuntu/android-sdk` (Setup-Script: `scripts/setup_build_env.sh`)
- Java: `/usr/lib/jvm/jdk-17.0.11+9`
- compileSdk: 36, targetSdk: 36, minSdk: 29
