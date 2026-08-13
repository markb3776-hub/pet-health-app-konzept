# Impfpass-Scan Feature – Machbarkeits-Check

## 1. On-Device-OCR Library

### Empfehlung: `expo-mlkit-ocr` (v0.2.7, Mai 2026)

**Warum diese Library:**
- Speziell für Expo gebaut (Expo Modules API)
- Google ML Kit Text Recognition v2 (Android) + Apple Vision (iOS)
- **Komplett offline** – kein Netzwerk nötig
- Structured Output: Blocks → Lines → Elements mit Bounding Boxes
- TypeScript-Support, Config Plugin
- Kompatibel mit expo-camera und expo-image-picker URIs
- 0 Dependencies (außer expo-build-properties für iOS)
- ~3.000 Downloads/Woche (aktiv gepflegt)
- MIT-Lizenz

**Alternative: `@react-native-ml-kit/text-recognition`**
- Älter, aber bewährt
- Braucht manuelles Native-Setup
- Weniger Expo-Integration

**Alternative: `infinitered/react-native-mlkit`**
- Umfangreiches Monorepo (Face Detection, Object Detection, etc.)
- Kompatibilitätstabelle: Expo SDK 56 → MLKit ^6.0.0
- Wir sind auf SDK 57 → müsste geprüft werden ob ^6.0.0 oder ^7.0.0 nötig
- Kein dediziertes OCR-Modul (nur Text Recognition als Teil des Pakets)

### Einschränkungen:
- Funktioniert NICHT in Expo Go (Custom Native Module)
- Funktioniert NICHT im Web
- minSdkVersion 21+ (wir haben 29 → OK)
- iOS 16+ (wir haben iOS nicht aktiv, aber für Zukunft OK)

### Installation:
```bash
npx expo install expo-mlkit-ocr
```

### app.json Plugin:
```json
["expo-mlkit-ocr", { "iosEngine": "auto" }]
```

---

## 2. Temporäres Foto-Handling

### Wo landet das Foto?

**expo-camera** speichert Fotos standardmäßig in `FileSystem.cacheDirectory`:
- Android: `/data/data/de.simplypet.app/cache/`
- Das System kann diesen Ordner bei Speicherknappheit automatisch leeren
- Aber: NICHT garantiert sofort gelöscht bei App-Schließung

### Strategie für "Foto nur temporär":

1. **Aufnahme:** `expo-camera` → Foto landet in cacheDirectory (Standard)
2. **OCR:** `recognizeText(uri)` direkt auf die Cache-URI
3. **Nach OCR (egal ob Erfolg/Abbruch):** `FileSystem.deleteAsync(uri)` explizit aufrufen
4. **Absicherung gegen Prozess-Abbruch:**
   - Beim App-Start: Cleanup-Funktion die alle Dateien mit Scan-Prefix im Cache löscht
   - Dateiname-Konvention: `scan_impfpass_{timestamp}.jpg`
   - `AppState.addEventListener('change', ...)` → bei Background-Wechsel ebenfalls löschen

### Garantie-Level:
- **Normal-Fall (Nutzer bestätigt/bricht ab):** 100% gelöscht (expliziter deleteAsync)
- **App-Crash/Force-Kill:** Datei bleibt im Cache bis:
  a) Nächster App-Start (Cleanup-Funktion)
  b) System räumt Cache bei Speicherknappheit
- **Worst Case:** Foto im Cache bis nächster App-Start – akzeptabel, da:
  - Nur App selbst hat Zugriff (private App-Sandbox)
  - Kein Cloud-Upload, kein Galerie-Eintrag
  - Wird beim nächsten Öffnen gelöscht

---

## 3. Duplikat-Check Strategie

### Problem:
OCR liefert leicht abweichende Schreibweisen:
- "Nobivac SHP" vs "NOBIVAC SHP" vs "Nobivac® SHP"
- Datum: "12.03.2025" vs "12.3.25" vs "12/03/2025"

### Lösung (3-stufig):

**Stufe 1: Datum-Normalisierung**
- Alle erkannten Datumsformate auf ISO (YYYY-MM-DD) normalisieren
- Toleranz: ±1 Tag (für Schreibfehler/Rundung)

**Stufe 2: Impfstoffname-Normalisierung**
- Lowercase
- Sonderzeichen entfernen (®, ™, etc.)
- Whitespace normalisieren

**Stufe 3: Fuzzy-Matching**
- Levenshtein-Distanz auf normalisierten Impfstoffnamen
- Schwellenwert: ≤ 2 Edits bei Strings < 15 Zeichen, ≤ 3 bei längeren
- ODER: Enthält-Check (einer ist Substring des anderen)

### Technische Umsetzung:
```typescript
function isDuplicate(scanned: {name: string, date: string}, existing: VaccinationEntry[]): VaccinationEntry | null {
  const normalizedName = normalize(scanned.name);
  const normalizedDate = parseDate(scanned.date);
  
  return existing.find(entry => {
    const dateDiff = Math.abs(daysBetween(normalizedDate, entry.date));
    if (dateDiff > 1) return false; // Datum muss ±1 Tag passen
    
    const nameDist = levenshtein(normalizedName, normalize(entry.vaccine_name));
    return nameDist <= 2 || normalizedName.includes(normalize(entry.vaccine_name)) || normalize(entry.vaccine_name).includes(normalizedName);
  });
}
```

### Library für Levenshtein:
- `fastest-levenshtein` (npm, 0 Dependencies, ~50 Bytes, schnellste JS-Implementierung)
- Kein externer Service nötig

---

## 4. Aufwandsschätzung (MVP-Scope)

### Scope: Nur Impfungen-Tabelle (Impfstoffname + Datum)

| Komponente | Aufwand | Beschreibung |
|:---|:---|:---|
| expo-mlkit-ocr Integration | 2-3h | Installation, Plugin-Config, prebuild-Test |
| Scan-Screen (UI) | 4-6h | Camera-View, Auslöser, Preview, "Erneut scannen" |
| OCR-Parsing-Logik | 6-8h | Aus strukturiertem OCR-Output (Blocks/Lines) die Impfstoff+Datum-Paare extrahieren. Schwierigster Teil: Tabellen-Erkennung in unstrukturiertem Text |
| Formular-Vorbefüllung | 2-3h | Erkannte Werte in VaccinationEntryScreen vorausfüllen, "unbestätigt"-Markierung |
| Duplikat-Check | 3-4h | Normalisierung, Levenshtein, UI-Hinweis |
| Temporäres Foto-Handling | 2h | Cache-Cleanup, App-Start-Bereinigung |
| Testen + Edge Cases | 4-6h | Verschiedene Impfpässe, Handschrift, schlechte Beleuchtung |
| **GESAMT MVP** | **~23-32h** | |

### Risiken:
- **Tabellen-Erkennung:** Impfpässe haben kein einheitliches Format. Die Zuordnung "welcher Text gehört zu welcher Spalte" ist der schwierigste Teil.
- **Handschrift:** ML Kit v2 kann gedruckten Text sehr gut (>95%), handschriftliche Daten deutlich schlechter (~60-70%).
- **Aufkleber vs. Handschrift:** Impfstoffname (Aufkleber) = gut erkennbar. Datum (oft handschriftlich) = problematisch.

---

## 5. Erkennungsrate (Einschätzung ohne Live-Test)

| Szenario | Erwartete Rate | Begründung |
|:---|:---|:---|
| Gedruckter Aufkleber (Impfstoffname) | 90-98% | ML Kit v2 ist exzellent bei gedrucktem Text |
| Handschriftliches Datum (Kugelschreiber) | 50-70% | Stark abhängig von Handschrift-Qualität |
| Gestempeltes Datum | 80-90% | Besser als Handschrift, aber oft verwischt |
| Gesamte Zeile korrekt (Name + Datum) | 45-65% | Kombination beider Schwächen |

### Hinweis zu Punkt 5 der Anfrage:
Ein Live-Test mit Beispielfotos ist in der Sandbox nicht möglich (kein Android-Gerät, kein ML Kit). Der Test muss auf dem echten Gerät stattfinden, nachdem expo-mlkit-ocr installiert und ein Dev-Build erstellt wurde.

---

## Zusammenfassung / Empfehlung

**Machbar: Ja.** Die technischen Bausteine existieren und passen zu unserem Stack.

**Größtes Risiko:** Die Parsing-Logik (OCR-Output → strukturierte Impfstoff+Datum-Paare). ML Kit liefert rohen Text mit Positionen, aber keine semantische Tabellen-Erkennung. Wir müssen selbst herausfinden, welche Textblöcke zusammengehören.

**Empfohlener Ansatz für MVP:**
1. Nutzer fotografiert eine Impfpass-Seite
2. OCR erkennt allen Text
3. Regex-basierte Extraktion: Datumsformate finden + benachbarten Text als Impfstoffname interpretieren
4. Nutzer sieht Vorschläge und bestätigt/korrigiert manuell
5. Duplikat-Check vor dem Speichern

**Nicht im MVP:**
- Automatische Tabellen-Erkennung (zu komplex)
- Multi-Page-Scan (eine Seite pro Scan reicht)
- Handschrift-Training/Custom Model
