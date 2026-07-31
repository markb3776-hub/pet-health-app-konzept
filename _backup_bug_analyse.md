# Backup-Bug Analyse (31.07.2026)

## Situation
- Backup erstellt auf APK (ältere Version, vor E-125 Fix)
- Import auf AAB vC 14 (mit E-125 Fix) → NICHTS importiert
- Tester musste erst Tier im Onboarding anlegen, dann Import → nur das manuell angelegte Tier sichtbar
- Keine Fehlermeldung beobachtet (User stand nebenan)

## E-125 Fix (bereits implementiert)
- `AESSealedData.fromCombined()` akzeptiert auf Android nur ByteArray
- Fix: `base64ToUint8(envelope.data)` vor `fromCombined()`
- Zeile 125-126 in cryptoService.ts

## Mögliche verbleibende Probleme

### Problem 1: `aesDecryptAsync` Output
- Zeile 130: `aesDecryptAsync(sealed, key, { output: 'base64' })` 
- Gibt Base64-String zurück
- Zeile 132: `base64ToUint8(decryptedBase64)` → Uint8Array
- Zeile 133-134: `TextDecoder().decode(decryptedBytes)` → JSON-String
- **MÖGLICHER BUG:** Wenn `aesDecryptAsync` den Output anders formatiert als erwartet

### Problem 2: `fromCombined` Format-Mismatch
- Export (Zeile 89): `sealed.combined('base64')` → Base64-String
- Import (Zeile 125): `base64ToUint8(envelope.data)` → Uint8Array
- Import (Zeile 126): `AESSealedData.fromCombined(combinedBytes)` 
- **FRAGE:** Erwartet `fromCombined` das gleiche Byte-Layout wie `combined()` produziert?
- Laut expo-crypto Issue #47274: combined() gibt [IV (12 bytes) | Ciphertext | Tag (16 bytes)]
- fromCombined() erwartet das gleiche Layout

### Problem 3: Transaktion + Onboarding-Interaktion
- Import löscht ALLE pets → fügt Backup-Pets ein
- Wenn die App zwischendurch das Onboarding triggert (weil pets leer)
  → könnte ein Race Condition entstehen
- ABER: Onboarding-Check ist nur bei App-Start, nicht bei Focus

### Problem 4: Stilles Scheitern
- Zeile 135-136: catch wirft Error("Falsches Passwort...")
- backupService.ts Zeile 411-416: catch zeigt Alert
- ABER: Was wenn der Fehler NICHT in aesDecryptAsync passiert sondern DANACH?
- Z.B. wenn JSON.parse() des entschlüsselten Strings fehlschlägt?
- backupService.ts Zeile 422-426: separater try/catch für JSON.parse

## Nächste Schritte
1. Onboarding-Flow fixen: Import-Option VOR Tier-Anlage
2. Logging einbauen um zu sehen WO genau der Import scheitert
3. Testen: Backup auf vC14 erstellen → App-Daten löschen → Import
4. Falls Entschlüsselung das Problem: expo-crypto auf neuere Version updaten (Fix aus PR #47317)

## Expo-Crypto Version
- Installiert: 57.0.1
- Bug-Fix PR #47317 merged 27.06.2026
- Unklar ob 57.0.1 den Fix enthält oder ob wir updaten müssen
