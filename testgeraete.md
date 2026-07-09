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

## Testgerät 2: (ausstehend – wartet auf Zustimmung des Gerätebesitzers)

Das zweite Gerät gehört einer anderen Person; der Projektinhaber holt zuerst deren Zustimmung ein, bevor Gerätedaten erfasst werden (09.07.2026) – im Einklang mit der Projektdoktrin: keine Gerätedaten ohne Einwilligung. Die Daten werden erst für Teilauftrag 4.4 (APK-Bau/Gerätetest) benötigt. **Fallback ohne Zweitgerät:** Test nur auf Gerät 1, abweichende Bildschirmgrößen werden per Emulator abgedeckt – kein Blocker.

---

*Hinweis: Seriennummern werden bewusst nicht dokumentiert (Datensparsamkeit; für die Entwicklung irrelevant).*
