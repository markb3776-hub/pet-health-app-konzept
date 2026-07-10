# Testgeräte-Dokumentation (simplyPet Prototyp)

**Stand:** 10.07.2026 (Testgerät 2 korrigiert: Galaxy S24 statt der ursprünglich vermuteten S25, vollständige Daten erfasst)
**Zweck:** Verbindliche Referenz der physischen Zielgeräte für Entwicklung (Schritt 4), APK-Bau (Teilauftrag 4.4) und Nutzertest (Schritt 5, siehe `pruefprotokoll_prototyp_nutzertest.md`).

## Testgerät 1: Samsung Galaxy S23 ("VisionX")

| Merkmal | Wert | Quelle |
| :--- | :--- | :--- |
| Produktname | Galaxy S23 | Telefoninfo-Screenshot, 09.07.2026 |
| Modellnummer | SM-S911B/DS (Dual-SIM, EU-Variante) | Telefoninfo-Screenshot |
| Android-Version | **16** | Softwareinfo-Screenshot |
| Hersteller-Oberfläche | **One UI 8.5** | Softwareinfo-Screenshot |
| Google-Play-Systemupdate | 1. Juni 2026 | Softwareinfo-Screenshot |
| Android-Sicherheitspatch | 5. Mai 2026 | Softwareinfo-Screenshot |
| Display | 6,1 Zoll, 2340×1080 (FHD+), 19,5:9 | Herstellerangabe Galaxy S23 |

**Relevanz für die Entwicklung:**
- **Android 16 > targetSdk 35:** Unser Build-Ziel (API 35 / Android 15) läuft abwärtskompatibel; Gerät 1 prüft damit das Verhalten auf einem *neueren* System als dem Build-Ziel – wichtig für zukunftssichere Berechtigungs- und Notification-Flows.
- **One UI / Samsung-Akku-Management:** Samsung drosselt Hintergrund-Apps aggressiv ("Schlafende Apps", adaptiver Akku). Genau das Zielszenario für den mehrtägigen Erinnerungs-Test (Prüfprotokoll 3.4).
- **Kompakter 6,1-Zoll-Bildschirm:** Ideale Prüfgröße für die Querformat-Doktrin (Screen-Flow 1.1) und größte Systemschrift (Prüfprotokoll 4.3, 4b.7) – die Geräteklasse, bei der Nutzer drehen, weil es eng wird.

## Testgerät 2: Samsung Galaxy S24

**Korrektur (10.07.2026):** Der Projektinhaber hatte zunächst ein Galaxy S25 vermutet; die Telefoninfo-Screenshots vom 10.07.2026 belegen: Es ist ein **Galaxy S24** (Basis-Modell). Die vollständigen Daten liegen damit vor.

| Merkmal | Wert | Quelle |
| :--- | :--- | :--- |
| Produktname | Galaxy S24 | Geräte-Label-Screenshot, 10.07.2026 |
| Modellnummer | SM-S921B/DS (Dual-SIM, EU-Variante) | Geräte-Label-Screenshot |
| Android-Version | **16** | Softwareinfo-Screenshot, 10.07.2026 |
| Hersteller-Oberfläche | **One UI 8.5** | Softwareinfo-Screenshot |
| Google-Play-Systemupdate | 1. Juni 2026 | Softwareinfo-Screenshot |
| Buildnummer | BP4A.251205.006.S921BXXSFDZF2 | Softwareinfo-Screenshot |
| Display | 6,2 Zoll, 2340×1080 (FHD+), 19,5:9 | Herstellerangabe Galaxy S24 |

**Relevanz für die Entwicklung:**
- **Volle APK-Kompatibilität:** Android 16 liegt weit über der Mindestanforderung der Prototyp-APK (Android 10 / minSdk 29) — direkt installierbar.
- **Nahezu identisches Software-Duo:** Beide Geräte laufen mit Android 16 / One UI 8.5 und identischem Play-Systemupdate-Stand. Vorteil: konsistentes Verhalten, Fehler sind gut reproduzierbar. Ehrliche Einschränkung: Die Testabdeckung prüft damit primär Bildschirmgrößen-Unterschiede (6,1 vs. 6,2 Zoll, praktisch ähnlich) und weniger Hersteller-/Versionsvielfalt — andere Oberflächen (Xiaomi/MIUI, Pixel/Stock) bleiben Emulator-Terrain. Für den Prototyp (Zielnutzer = Projektinhaber) völlig ausreichend; Gerätevielfalt liefert später die verpflichtende 12–20-Tester-Phase vor dem Play-Store-Launch.
- **Samsung-Akku-Management ×2:** Der kritische mehrtägige Erinnerungs-Test (Prüfprotokoll 3.4) läuft auf beiden Geräten unter dem aggressiven Samsung-Energiesparverhalten — dem härtesten realistischen Szenario.

---

*Hinweis: Seriennummern werden bewusst nicht dokumentiert (Datensparsamkeit; für die Entwicklung irrelevant).*
