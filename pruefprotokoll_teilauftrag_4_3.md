# Prüfprotokoll – Teilauftrag 4.3: Notfallpass + QR-Code

**Datum der Prüfung:** 09.07.2026
**Geprüfter Stand:** simplyPet-Prototyp nach Umsetzung Teilauftrag 4.3
**Prüfgrundlagen:** `notfallpass_design_spezifikation.md`, `technische_spezifikation_screen_flow.md` (Abschnitte 1.1, 2.6), `pruefdoktrin_eingabe_stabilitaet.md`, `technische_spezifikation_offline_strategie.md` (Zeit-Integrität), Projektdoktrin (Ehrlichkeit, keine toten Knöpfe)

---

## 1. Umfang des Teilauftrags

Teilauftrag 4.3 umfasst den vollständigen Notfallpass mit QR-Code-Generierung und -Anzeige:

| Baustein | Beschreibung |
|:---|:---|
| Zentrales Pass-Datenmodul | `src/emergency/passData.ts` – eine einzige Datenquelle für Bildschirm-Anzeige, QR-Inhalt und PDF-Export (verhindert Abweichungen zwischen den drei Darstellungen) |
| Notfallpass-Screen (neu) | Passkarte mit Foto (Tap → Vollbild), Signalement, Erkennungsmerkmale, Chip-Nummer mit Kopieren-Funktion, Notfall-Block in fester Reihenfolge, Mehrtier-Umschaltung, Querformat-Layout |
| QR-Code offline | `react-native-qrcode-svg` – deutscher Klartext, ohne Internet von jeder Handykamera lesbar |
| PDF-Export | A4-Pass über `expo-print` + Teilen über `expo-sharing`, Graustufen-tauglich (Schwarz-Weiß-Druck) |
| Neue Stammdaten-Felder | Fellfarbe/Zeichnung, Stamm-Tierarztpraxis (Name + Telefon) in Bearbeiten-Formular und DB (additive Migration) |
| Halter-Telefon | Kontolos im Mehr-Bereich hinterlegbar, erscheint im Kontakt-Block des Passes |

## 2. Prüfergebnisse

### 2.1 Technische Basisprüfungen

| Prüfung | Methode | Ergebnis |
|:---|:---|:---|
| TypeScript-Kompilierung | `npx tsc --noEmit` | **0 Fehler** |
| Projektgesundheit | `npx expo-doctor` | **20/20 Checks bestanden** |
| Baubarkeit Android | `npx expo export --platform android` | **Bundle (.hbc) fehlerfrei erzeugt** |
| API-Verifikation | `expo-file-system` `File.base64()` direkt in den Paket-Typdefinitionen verifiziert (`NativeFileSystem.types.ts:184`) | **Vorhanden als `Promise<string>`** – Foto-Einbettung ins PDF funktioniert |
| SQL-Spalten-Abgleich | Skriptbasiert: alle in `passData.ts` und `EditPetScreen` referenzierten Spalten gegen das Schema inkl. additiver Migrationen geprüft | **Alle Spalten vorhanden** |

### 2.2 Logiktests QR-Payload und PDF (24/24 bestanden)

Skriptbasierter Test (esbuild-transpiliert, Node) mit vollständigem und leerem Testtier:

| Testgruppe | Prüfpunkte | Ergebnis |
|:---|:---|:---|
| QR vollständig | Titel, Tiername+Art+Rasse, Chip, Merkmale, Allergie, Medikation mit Dosierung, Vorerkrankung, Halter+Telefon, Tierarzt+Telefon, Stand im Format TT.MM.JJJJ | **PASS (10/10)** |
| QR-Scanbarkeit | Payload-Länge 320 Zeichen (< 800, gut scanbar mit hoher Fehlerkorrektur) | **PASS** |
| QR leeres Tier | Ehrliche Leermeldungen („Keine erfasst", „Keine besonderen Merkmale erfasst"); leere Felder (Chip, Halter) erscheinen gar nicht statt als Leerzeile | **PASS (4/4)** |
| Signalement | 5 Zeilen, Geburtsdatum TT.MM.JJJJ, Fellfarbe enthalten | **PASS (3/3)** |
| PDF-HTML | HTML-Escaping (XSS-sicher bei Sonderzeichen im Tiernamen), Doktrin-Fußnote („ersetzt keinen EU-Heimtierausweis"), ehrlicher Foto-Platzhalter, Gewicht mit Dezimal-Komma (31,5 kg) | **PASS (4/4)** |
| Spezialisten-Arten | Bei Spezialisten-Tierart (z. B. Vogel, Kaninchen) erscheint die Spezialisten-Zeile im QR | **PASS** |

### 2.3 Spezifikations-Abgleich (Grep-basiert)

| Anforderung | Quelle | Ergebnis |
|:---|:---|:---|
| Eine einzige Zeitquelle, kein `new Date()` außerhalb des Zeit-Moduls | Offline-Strategie 2.3 | **Erfüllt** (0 Treffer außerhalb `timeModule.ts`) |
| Erkennungsmerkmale IMMER sichtbar (nie ausgeblendet) | Notfallpass-Spez + Nutzer-Festlegung | **Erfüllt** in allen drei Darstellungen: Screen, QR, PDF |
| Feste Reihenfolge Notfall-Block: Allergien → Dauermedikation → Vorerkrankungen → Impfstatus → letzte Werte → Spezialist → Kontakt | Notfallpass-Spez | **Erfüllt** (Sektions-Reihenfolge im Code verifiziert) |
| Doktrin-Fußnote (ersetzt kein amtliches Dokument) | Projektdoktrin | **Erfüllt** in Screen und PDF |
| QR-Umfang ehrlich gekennzeichnet (Browser-Freigabe für Praxen kommt nach dem Prototyp) | Freigabe-Konzept / Prototyp-Abgrenzung | **Erfüllt** |
| Zwei-Tap-Regel: Notfallpass von jedem Haupt-Tab (Zuhause, Termine, Mehr) in max. 2 Taps | Screen-Flow Z. 16 + 76 | **Erfüllt** (Zuhause: fester Zone-3-Knopf; Termine + Mehr: FAB) |
| Kein Fremdbild als Foto-Platzhalter (nur Initial + Artname) | Doktrin (Wahrheit) | **Erfüllt** |
| Querformat: zweispaltiges Pass-Layout, kein Zustandsverlust | Screen-Flow 1.1 | **Erfüllt** (Layout reagiert auf `useWindowDimensions`) |
| Keine toten Knöpfe | Doktrin | **Erfüllt** – einziger „Kommt in …"-Hinweis betrifft ehrlich gekennzeichnete 4.4+-Punkte im Mehr-Bereich |

### 2.4 Datenschutz-Aspekte

Der QR-Code enthält ausschließlich Daten, die der Halter selbst erfasst hat, als deutschen Klartext – keine Server-URL, kein Tracking, keine Übertragung. Das PDF wird lokal erzeugt und nur über den System-Teilen-Dialog weitergegeben (Nutzer entscheidet über Empfänger). Die Browser-Freigabe für Praxen ist bewusst nicht Teil des Prototyps und in der App ehrlich so benannt.

## 3. Während der Prüfung gefundene und korrigierte Punkte

| Fund | Korrektur |
|:---|:---|
| Erstes Logiktest-Skript scheiterte an TypeScript-Syntax (Regex-basiertes Strippen unzureichend) | Testverfahren auf saubere esbuild-Transpilierung umgestellt; alle 24 Tests danach grün – kein Produktcode-Fehler, reiner Testaufbau |
| „Abbrechen" im Halter-Kontakt-Formular setzte nur den Namen, nicht das Telefon zurück | Behoben: Abbrechen stellt jetzt beide Felder auf den gespeicherten Stand zurück |

## 4. Fazit

Alle Prüfungen bestanden. Teilauftrag 4.3 erfüllt die Notfallpass-Design-Spezifikation, die Eingabe-Stabilitäts-Doktrin und die Projektdoktrin (Ehrlichkeit, keine toten Knöpfe, kein Clickbait). Der Stand ist bereit für Teilauftrag 4.4 (interne Gesamtprüfung + APK-Erstellung), in dem zusätzlich der verbindlich verankerte Tageswechsel-Testfall auf dem echten Gerät geprüft wird.
