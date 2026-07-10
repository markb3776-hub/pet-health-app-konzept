# Prüfprotokoll Teilauftrag 4.4 — Interne Gesamtprüfung + APK

**Datum:** 10.07.2026 · **Projekt:** simplyPet-Prototyp (Expo SDK 57, React Native 0.86, TypeScript)
**Prüfgrundlagen:** Strukturkonzept Abschnitt 7 (testpflichtige Punkte), pruefdoktrin_eingabe_stabilitaet.md, technische_spezifikation_screen_flow.md, notfallpass_design_spezifikation.md, Roadmap Schritt 4 Punkte 5+6 (inkl. verbindlicher Tageswechsel-Testfall, Commit 7837302).

## 1. Prüfumfang und Methode

Die interne Prüfung deckt alles ab, was ohne echtes Gerät prüfbar ist: statische Analysen, Logiktests (jeweils in **3 Durchgängen** gemäß Prüfdoktrin), SQL-Szenariotests gegen die echten Query-Strukturen sowie Build-Rauchtests. Punkte, die nur auf echter Hardware prüfbar sind (Berechtigungsdialoge, echtes Über-Nacht-Verhalten, Systemschrift-Maximum auf Gerät), sind ehrlich an die Nutzertest-Checkliste (`pruefprotokoll_prototyp_nutzertest.md`) delegiert und dort als 🔴 offen markiert.

## 2. Ergebnisse der Prüfblöcke

| Block | Prüfpunkt | Methode | Ergebnis |
|:---|:---|:---|:---|
| A1 | TypeScript-Gesamtprüfung | `tsc --noEmit` | **PASS** (0 Fehler) |
| A2 | Draft-Autosave-Wiring (Null-Datenverlust) | Code-Prüfung aller 9 Formulare | **PASS** — 8 Formulare mit Autosave + Zurück-Schutz; Onboarding mit Autosave ohne Zurück-Schutz (korrekt: dort existiert kein Zurück-Weg) |
| B | Artspezifische Register aller 14 Tierarten | Logiktest species.ts gegen Tierakte-Tab-Logik | **PASS** (17/17; Impf-Modul nur Hund/Katze/Kaninchen/Frettchen/Pferd, Aquarium mit Wasserwerten ohne Impfungen) |
| C | Farbsystem (Graustufen, Rot-Grün-Schwäche, Signalrot-Sperre) | Python-Simulation (Luminanz, Deuteranopie) | **FUND → KORRIGIERT** (siehe 3.1), danach 4/4 PASS |
| D | Tageswechsel-Logik | Logiktest timeModule + Nutzungs-Prüfung | **PASS** (6/6 in 3 Durchgängen; AppState-Listener + 60-Sekunden-Intervall aktiv in Startseite und Terminen) |
| E | Mehrarten-Stabilität (≥3 Arten) | SQL-Szenariotest (Hund/Hamster/Aquarium, echte Query-Strukturen, 50× schneller Wechsel, Archiv-Störprobe) | **PASS** (11/11 in 3 Durchgängen, keine Datenvermischung) |
| F | Nachtragen-Testfall | Logiktest (rückdatiert korrekt einsortiert, Vermerk, Zukunft gesperrt, Chips) | **PASS** |
| G | Leer-/Maximalzustand-Layout | Code-Prüfung Scroll-Fähigkeit aller 5 Kern-Screens | **PASS** |
| H | Offline-Start | Code-Prüfung: kein Netzwerkaufruf im gesamten App-Code | **PASS** |
| I | Große Schrift | Code-Prüfung: Schriftskalierung nirgends deaktiviert, Mindest-Touchflächen in 18 Dateien | **PASS** |
| J | Zwei-Tap-Regel auf jedem Bildschirm | Code-Prüfung aller Screens | **FUND → KORRIGIERT** (siehe 3.2), danach PASS |
| K | Export-Rauchtest + Projektgesundheit | `expo export` + `expo-doctor` | **PASS** (Bundle baubar, 20/20 Checks) |

## 3. Funde und Korrekturen

### 3.1 Farbpalette bestand Sehschwäche-Tests nicht (korrigiert)

Die Tierfarben-Palette hatte zwei Verstöße gegen das Strukturkonzept: Violett und Braun waren in Graustufen praktisch identisch (Luminanz-Abstand 0,004), Blau und Violett für Rot-Grün-Schwäche kaum unterscheidbar (Deuteranopie-Abstand 13,7). **Korrektur:** Sechs Farbtöne wurden rechnerisch neu bestimmt (u. a. Blau `#2F6495`, Violett `#61517A`, Braun `#A7795E`), unter gleichzeitiger Einhaltung aller vier Bedingungen: Graustufen-Abstand ≥ 0,016, Deuteranopie-Abstand ≥ 28, Weiß-Kontrast ≥ 3,1 (Text auf Kennfarbe lesbar), großer Abstand zum reservierten Signalrot. Finale Palette: 4/4 PASS.

### 3.2 Tierakte ohne direkten Notfall-Zugang (korrigiert)

Das Strukturkonzept verlangt den Notfall-Knopf **auf jedem Bildschirm**; die Tierakte hatte keinen (nur über Zurück erreichbar). **Korrektur:** Der Notfall-Knopf wurde in die Tierakte eingebaut und öffnet dort direkt den Notfallpass **dieses** Tieres (ein Tap). Nach der Korrektur: TypeScript 0 Fehler, Export-Rauchtest PASS.

## 4. APK-Build

| Eigenschaft | Wert |
|:---|:---|
| Datei | `app-release.apk` (134 MB) |
| App-ID / Version | `de.simplypet.app` / 0.1.0 |
| Mindest-Android | Android 10 (API 29), Ziel: Android 15 (API 35) |
| Signatur | Debug-Zertifikat (für Testgeräte vorgesehen; Play-Store-Signatur folgt erst bei Veröffentlichung) |
| Verifikation | `apksigner verify` PASS, Manifest-Prüfung PASS |

**Build-Weg:** Lokaler Build (expo prebuild + Gradle, JDK 17, Android SDK 36). Zwei Hürden wurden behoben: eine fehlerhafte Zeile in den Build-Einstellungen und eine Kamera-Bibliothek, die Kompilierung gegen API 36 verlangt (compileSdk 35 → 36; das Zielsystem bleibt API 35). Ein Sandbox-Neustart durch Speicherlast beim ersten Versuch wurde durch speicherschonende Build-Einstellungen (begrenzter Heap, 2 Worker, kein Daemon) gelöst; der Arbeitsstand war durch Repo-Sicherung und Session-Stand-Datei vollständig geschützt — kein Datenverlust.

## 5. An den Nutzertest delegierte Punkte (echtes Gerät erforderlich)

Kamera-/Galerie-Berechtigungsdialoge, tatsächliches Über-Nacht-Verhalten (Prüfblock 4d der Nutzertest-Checkliste), maximale Systemschrift auf echtem Display, QR-Scan mit zweitem Handy, PDF-Druckbild, App-Kill während Eingabe (Störfall-Matrix Ebene 2/3 der Prüfdoktrin). Diese stehen in `pruefprotokoll_prototyp_nutzertest.md` und werden vom Projektinhaber auf den beiden Testgeräten geprüft.

## 6. Fazit

Alle intern prüfbaren Punkte bestanden (nach zwei korrigierten Funden). Die APK ist gebaut, signiert und verifiziert. Der Prototyp ist bereit für den Nutzertest auf den echten Geräten.
