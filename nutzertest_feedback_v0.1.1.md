# Nutzertest-Feedback: simplyPet v0.1.1

**Stand:** 11.07.2026  
**Testgeräte:** Samsung S23 + Samsung S24 (SM-S921B/DS, Android 16, One UI 8.5)  
**Tester:** Hauptnutzer + zweite Testperson (Interview ausstehend)

---

## Bereits in v0.1.1 behoben

| Bug | Lösung | Status |
|:---|:---|:---|
| Tab-Leiste und Buttons von Samsung-Navigationsleiste überlappt | Edge-to-Edge Insets-Fix (alle 19 Screens) | ✅ Behoben |
| Jahr-Auswahl im Datums-Picker nicht intuitiv | Jahr-Schnellzugriff-Button ergänzt | ✅ Behoben |

---

## Gesammeltes Feedback für nächsten Durchlauf (v0.1.2)

### Features & UX-Verbesserungen

| Nr. | Feature | Beschreibung | Entscheidung |
|:---|:---|:---|:---|
| 1 | Rasse-Feld | Freitext-Feld in Stammdaten (AddPetScreen + EditPetScreen) | Bestätigt – kein Dropdown, reiner Freitext |
| 2 | Tierarzt-Tipp | Permanenter Hinweis unter Rasse-Feld: „Frag deinen Tierarzt nach rassetypischen Vorsorge-Untersuchungen für deine Rasse." Erscheint nur wenn Rasse ausgefüllt. | Bestätigt – statischer Text, keine medizinische Aussage |
| 3 | Allergien & Vorerkrankungen | Ein Bereich in den Stammdaten mit ZWEI separaten Titelfeldern (Allergien / Vorerkrankungen). Logisch zusammen, visuell getrennt. | Bestätigt – Nutzer bestätigte UX-Problem „wo finde ich das?" |
| 4 | Erinnerungs-Vorlauf | Einstellbar: X Tage vorher erinnern (min. 1 Tag). Bei Impfungen, Medikamenten, Terminen. | Bestätigt |
| 5 | Überfällig-Hinweis Impfungen | Ehrlicher Text: „Überfällig – bitte Tierarzt konsultieren, ob Nachimpfung oder Neustart nötig ist." Keine medizinische Empfehlung. | Bestätigt – Doktrin-konform |
| 6 | Parasitenschutz-Typ | Ggf. eigene Kategorie (Spot-On / Halsband / Tablette). Entscheidung: eigene Kategorie oder Typ-Auswahl unter Medikament/Pflege? | Offen – wartet auf Tester-Feedback |

### Robustheit (präventiv, aus Konkurrenzanalyse abgeleitet)

| Nr. | Maßnahme | Begründung |
|:---|:---|:---|
| 7 | Doppelklick-Schutz auf Speichern-Buttons | Konkurrenz: Doppeleinträge durch schnelles Tippen |
| 8 | Rotation sperren (Portrait-only) | Verhindert Layout-Brüche auf allen Geräten |
| 9 | Dark Mode → Light erzwingen | Verhindert unsichtbare Texte bei System-Dark-Mode |
| 10 | Foto-Komprimierung sicherstellen | Verhindert Speicher-Überlauf bei 12MP-Fotos |
| 11 | Zukunfts-Datum-Validierung | Kein Gewicht/Beobachtung/Vorfall in der Zukunft möglich |
| 12 | Try/Catch mit Fehlermeldung bei DB-Schreibfehlern | Verhindert stummes Scheitern bei vollem Speicher |

### Weitere Punkte (vom zweiten Tester – Interview ausstehend)

_Wird ergänzt sobald Interview-Ergebnisse vorliegen._

---

## Entscheidungen & Doktrin-Ergänzungen

### Preismodell (festgelegt 11.07.2026)
- **Einmalkauf 2,99€** im Play Store (kein Abo, keine Werbung, keine In-App-Käufe)
- Alle Features, alle Tiere, für immer
- Begründung: Konkurrenzanalyse zeigt eindeutig – Nutzer akzeptieren Einmalkauf, hassen Abos

### Rassenspezifische Features (festgelegt 11.07.2026)
- **Prototyp:** Nur Freitext-Feld + statischer Tierarzt-Tipp
- **Später (nach Prototyp):** Ggf. optionale Checkliste häufiger Rasse-Themen (Variante B)
- **Nicht geplant:** Automatische Prädispositions-Vorschläge (Haftungsrisiko)
- Begründung: Doktrin verbietet medizinische Empfehlungen

### Allergien-Zuordnung (festgelegt 11.07.2026)
- Allergien gehören unter den Bereich „Vorerkrankungen & Allergien" in den Stammdaten
- Zwei separate Titel-Felder innerhalb eines logischen Blocks
- Begründung: Nutzer fragte „zählt Allergie zu Vorerkrankung?" → Lösung: beides am selben Ort, aber klar beschriftet

---

## Geräte-Kompatibilität (Analyse 11.07.2026)

### Insets-Fix: Universell gültig
Der SafeAreaView-Fix basiert auf Standard-Android-APIs (react-native-safe-area-context) und greift auf allen Geräten (Samsung, Pixel, Xiaomi, OnePlus). Kein herstellerspezifischer Workaround.

### Bekanntes Risiko: Notification-Unterdrückung auf Xiaomi/Huawei
Aggressive Battery-Management-Systeme können lokale Notifications verschlucken. Lösung für spätere Version: Hinweis-Dialog beim ersten Start auf betroffenen Geräten.

### RAM/Performance: Kein Risiko
App verbraucht geschätzt 80–120 MB RAM (vs. 300–800 MB bei typischen Apps). Kein Netzwerk, keine Hintergrund-Services, keine endlosen Listen.

---

## Konkurrenzanalyse-Zusammenfassung (11.07.2026)

Vollständige Analyse: siehe `konkurrenzanalyse_simplypet.md`

### Kernerkenntnisse:
1. **Häufigster 1-Stern-Grund bei Konkurrenz:** Datenverlust durch Server-Probleme/Updates
2. **Zweit-häufigster Frust:** Abo-Zwang / Paywall (nur 1 Tier kostenlos)
3. **Trend 2026:** Privacy-First wird Verkaufsargument (Pawza, dog-stories)
4. **Zentrale Nutzer-Erkenntnis:** „Pet parents don't need more features, they need less friction"
5. **simplyPets größter Vorteil:** Echte Offline-Garantie (keine INTERNET-Permission) – geht weiter als jeder Konkurrent

### Differenzierung für Play Store Listing:
- Kein Account, kein Abo, kein Internet
- Einmal kaufen (2,99€), für immer nutzen
- Alle Tiere, alle Features, keine Limits
- 14 Tierarten (Konkurrenz: meist nur Hund + Katze)

---

## Nächste Schritte

1. ⏳ **Warten auf Interview-Ergebnisse** vom zweiten Tester
2. ⏳ **Warten auf GO** vom Hauptnutzer
3. 🔧 Gebündelter Korrektur-Durchlauf (alle Punkte oben)
4. 🧪 TypeScript-Prüfung + Expo-Rauchtest
5. 📦 Neue APK bauen (v0.1.2)
6. 🔄 Erneuter Nutzertest
