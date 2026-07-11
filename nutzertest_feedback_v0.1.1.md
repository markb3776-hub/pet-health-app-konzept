# Nutzertest-Feedback: simplyPet v0.1.1

**Stand:** 11.07.2026  
**Testgeräte:** Samsung S23 + Samsung S24 (SM-S921B/DS, Android 16, One UI 8.5)  
**Tester:** Hauptnutzer + zweite Testperson (Interview ausstehend)

> Alle getroffenen Entscheidungen und offenen Punkte: siehe `ENTSCHEIDUNGSREGISTER.md`

---

## Bereits in v0.1.1 behoben

| Bug | Lösung | Status |
|:---|:---|:---|
| Tab-Leiste und Buttons von Samsung-Navigationsleiste überlappt | Edge-to-Edge Insets-Fix (alle 19 Screens) | ✅ Behoben |
| Jahr-Auswahl im Datums-Picker nicht intuitiv | Jahr-Schnellzugriff-Button ergänzt | ✅ Behoben |

---

## Geplant für v0.1.2 (wartet auf GO)

### Features & UX

| Nr. | Feature | Beschreibung | Status |
|:---|:---|:---|:---|
| 1 | Rasse-Feld | Freitext in Stammdaten (AddPet + EditPet) | ✅ Bestätigt |
| 2 | Tierarzt-Tipp | Permanenter Hinweis unter Rasse-Feld (wenn ausgefüllt) | ✅ Bestätigt |
| 3 | Allergien & Vorerkrankungen | Ein Bereich, zwei separate Titelfelder in Stammdaten | ✅ Bestätigt |
| 4 | Erinnerungs-Vorlauf | X Tage vorher erinnern (min. 1 Tag) | ✅ Bestätigt |
| 5 | Überfällig-Hinweis Impfungen | Ehrlicher Text, keine medizinische Empfehlung | ✅ Bestätigt |
| 6 | Parasitenschutz-Typ | Eigene Kategorie oder Typ-Auswahl? | ⏳ Offen (O-03) |

### Datensicherung & Datenhoheit

| Nr. | Feature | Beschreibung | Status |
|:---|:---|:---|:---|
| 13 | Automatisches Backup | Lokale .simplypet-Datei, bei jeder Änderung aktualisiert | ✅ Bestätigt |
| 14 | Backup exportieren | Android-Teilen-Dialog (kein Internet nötig) | ✅ Bestätigt |
| 15 | Backup importieren | Import-Button + .simplypet als registrierter Dateityp | ✅ Bestätigt |
| 16 | Einträge bearbeiten | Stift-Symbol, Formular vorausgefüllt | ✅ Bestätigt (Vermerk-Sichtbarkeit offen: O-01) |
| 17 | Einträge löschen | Bestätigungs-Dialog, doppelt bei Impfungen/Medikamenten | ✅ Bestätigt (endgültig vs. Papierkorb offen: O-02) |

### Robustheit (präventiv)

| Nr. | Maßnahme | Begründung |
|:---|:---|:---|
| 7 | Doppelklick-Schutz auf Speichern-Buttons | Doppeleinträge verhindern |
| 8 | Rotation sperren (Portrait-only) | Layout-Brüche verhindern |
| 9 | Dark Mode → Light erzwingen | Unsichtbare Texte verhindern |
| 10 | Foto-Komprimierung sicherstellen | Speicher-Überlauf verhindern |
| 11 | Zukunfts-Datum-Validierung | Fehleingaben verhindern |
| 12 | Try/Catch bei DB-Schreibfehlern | Stummes Scheitern verhindern |
| 18 | Lange Texte: numberOfLines + Ellipsis oder flexibler Umbruch | Tablet niedrige DPI → Texte können überlaufen |
| 19 | Mindest-Tap-Target 48dp auf allen Buttons/Icons | ZTE kleiner Bildschirm → Finger treffen sonst nicht |
| 20 | ScrollView auf allen Screens (kein festes Layout) | Split-Screen / kleine Displays → Inhalte müssen scrollbar sein |
| 21 | Flexible Höhen statt fixer Pixel-Werte bei Eingabefeldern | Große Systemschrift (Barrierefreiheit) → Felder müssen mitwachsen |
| 22 | Keine Abhängigkeit von Google Play Services | Budget-Tablets haben oft kein Google → App muss trotzdem laufen |

### Weitere Punkte (vom zweiten Tester – Interview ausstehend)

_Wird ergänzt sobald Interview-Ergebnisse vorliegen._

---

## Geräte-Kompatibilität

### Testgeräte-Matrix

| Gerät | Segment | Display | RAM | Android | Status |
|:---|:---|:---|:---|:---|:---|
| Samsung S23 | Premium | 6,1" FHD+ | 8 GB | 16 | ✅ Getestet |
| Samsung S24 | Premium | 6,2" FHD+ | 8 GB | 16 | ✅ Getestet |
| ZTE Blade A35e | Budget | 6,52" HD (720p) | 2 GB | 13/14 | ⏳ Bestellt |
| PRITOM 7" Tablet | Budget-Tablet | 7" (~1024×600) | 8 GB | 15 | ⏳ Bestellt |

### Bekannte Risiken

- **Insets-Fix:** Universell gültig (Standard-Android-API, kein Hersteller-Workaround)
- **Xiaomi/Huawei/ZTE-Risiko:** Notifications können verschluckt werden → Hinweis-Dialog für spätere Version
- **RAM (ZTE, 2 GB):** App ~80–120 MB, sollte passen – aber härtester Test
- **Tablet niedrige DPI:** Texte erscheinen größer → Präventiv: flexible Umbruch-Logik (Nr. 18)
- **Tablet ohne Google:** Keine Play Services nötig → App läuft unabhängig (Nr. 22)

---

## Konkurrenzanalyse

Vollständige Analyse: siehe `konkurrenzanalyse_simplypet.md`

**Kernerkenntnisse:**
1. Häufigster 1-Stern-Grund: Datenverlust durch Server/Updates → Wir: komplett offline
2. Zweit-häufigster Frust: Abo-Zwang / Paywall → Wir: Einmalkauf 2,99€
3. Trend 2026: Privacy-First → Wir: keine INTERNET-Permission (stärker als Konkurrenz)
4. Nutzer-Erkenntnis: „Less friction, not more features" → Wir: klare Navigation lösen

---

## Nächste Schritte

1. ⏳ Interview-Ergebnisse vom zweiten Tester abwarten
2. ⏳ GO vom Hauptnutzer abwarten
3. 🔧 Gebündelter Korrektur-Durchlauf (alle Punkte oben)
4. 🧪 quality_check.sh + TypeScript-Prüfung
5. 📦 Neue APK bauen (v0.1.2)
6. 🔄 Erneuter Nutzertest
