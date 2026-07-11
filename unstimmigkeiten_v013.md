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

## OFFEN für v0.1.4 (Farb-Thema):

### 2. Teal-Buttons vs. ISO-Grün Notfall-Tab – visuell zu nah
- **Problem:** Der "Exportieren"-Button (Teal #2E9E83) und der Notfall-Tab (ISO-Grün #237F52) liegen im Grünspektrum nah beieinander. Auf dem Handy-Display schwer zu unterscheiden.
- **Betroffene Stellen:**
  - MoreScreen: "Exportieren"-Button (Teal BG)
  - MoreScreen: "Speichern"-Button (Teal BG)
  - HomeScreen: Action-Buttons (Teal BG)
  - AddPetScreen: "Speichern"-Button (Teal BG)
  - EmergencyPassScreen: Action-Buttons (Teal BG)
  - Alle Screens: Active-Chips (Teal BG)
- **Entscheidung nötig:** Soll die Button-Farbe von Teal auf eine andere Farbe wechseln (z.B. Dunkelblau, Anthrazit), oder bleibt Teal und der Notfall-Tab wird durch Größe/Form stärker differenziert?
- **Status:** ⏳ OFFEN – Nutzer-Entscheidung ausstehend

---

## Regel für die Zukunft:

- Versionsnummern NIEMALS hardcoden – immer dynamisch aus app.json/Constants lesen
- Bei jedem Update: Prüfen ob alle Farben der Doktrin E-69 entsprechen
