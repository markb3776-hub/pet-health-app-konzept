# Testgeräte-Dokumentation (simplyPet Prototyp)

**Stand:** 09.07.2026
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

## Testgerät 2: Samsung Galaxy S25 (vorläufig – wartet auf Zustimmung des Gerätebesitzers)

**Vorabinfo des Projektinhabers (09.07.2026):** Es handelt sich um ein **Samsung Galaxy S25**; die genaue Variante (Basis / S25+ / S25 Ultra / Edge) ist noch unbekannt. Das Gerät gehört einer anderen Person; der Projektinhaber holt zuerst deren Zustimmung ein, bevor die vollständigen Gerätedaten (Telefoninfo) erfasst werden – im Einklang mit der Projektdoktrin: keine Gerätedaten ohne Einwilligung.

Vorläufige Einordnung für die Testplanung (alle S25-Varianten gemeinsam): Samsung-Flaggschiff-Generation 2025, ausgeliefert mit Android 15/One UI 7, inzwischen auf Android 16/One UI 8.x aktualisierbar – also gleiche Hersteller-Oberfläche und gleiches Akku-Management wie Gerät 1. Displaygröße je nach Variante 6,2 bis 6,9 Zoll. **Konsequenz für die Testabdeckung:** Beide Geräte sind Samsung – andere Hersteller-Oberflächen (z. B. Xiaomi/MIUI, Pixel/Stock-Android) sind physisch nicht abgedeckt und bleiben Emulator-Terrain; für den Prototyp (Zielnutzer = Projektinhaber) ist das völlig ausreichend, für den späteren Play-Store-Launch sorgt die ohnehin verpflichtende 12–20-Tester-Phase für Gerätevielfalt.

Die vollständigen Daten (Modellnummer, Android-Version, One-UI-Version, Patch-Stand) werden nach Zustimmung per Telefoninfo-Screenshot nachgetragen – spätestens zu Teilauftrag 4.4 (APK-Bau/Gerätetest). **Fallback ohne Zweitgerät:** Test nur auf Gerät 1, abweichende Bildschirmgrößen werden per Emulator abgedeckt – kein Blocker.

---

*Hinweis: Seriennummern werden bewusst nicht dokumentiert (Datensparsamkeit; für die Entwicklung irrelevant).*
