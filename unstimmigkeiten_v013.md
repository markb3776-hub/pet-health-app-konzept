# Unstimmigkeiten & Fixes – erkannt während v0.1.3 Prüfung

Datum: 11.07.2026

---

## BEHOBEN in diesem Commit:

### 1. Versionsnummer hardcoded (Bug)
- **Problem:** MoreScreen zeigte immer "v0.1.2" – egal welche Version installiert war
- **Ursache:** Drei Stellen mit hardcoded String statt dynamischem Wert
- **Fix:** `Constants.expoConfig?.version` aus expo-constants eingebunden
- **Status:** ✅ BEHOBEN

---

## GESCHLOSSEN (Nutzer-validiert):

### 2. Teal-Buttons vs. ISO-Grün Notfall-Tab – kein Problem
- **Ursprüngliche Bedenken:** Teal (#2E9E83) für Buttons und ISO-Grün (#237F52) für Notfall-Tab liegen im Grünspektrum nah beieinander.
- **Nutzer-Feedback (11.07.2026):** Rücksprache mit Testperson ergab: Grün wird mit "OK / Bestätigung" assoziiert. Die aktuelle Farbgebung ist völlig in Ordnung. Der Notfall-Tab hebt sich durch Form (Quadrat + Kreuz) und Position (immer rechts unten) ausreichend ab.
- **Entscheidung:** Keine Farbänderung nötig. Teal bleibt App-Farbe für alle Buttons und aktive Elemente.
- **Status:** ✅ GESCHLOSSEN – Nutzer-validiert, kein Handlungsbedarf

---

## Regel für die Zukunft:

- Versionsnummern NIEMALS hardcoden – immer dynamisch aus app.json/Constants lesen
- Bei jedem Update: Prüfen ob alle Farben der Doktrin E-69 entsprechen
