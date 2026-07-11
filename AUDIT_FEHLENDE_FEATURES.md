# Audit: Beschlossen aber NICHT implementiert

**Datum:** 11.07.2026 (Abend)
**Methode:** Systematischer Abgleich Entscheidungsregister vs. Code

---

## FEHLEND (beschlossen, nicht im Code)

| ID | Thema | Status im Code |
|:---|:---|:---|
| E-29 | Einträge bearbeiten (Tierakte) | NUR Stammdaten-Bearbeitung. Tierakte-Einträge (Gewicht, Medikamentengabe, Beobachtung, Vorfall, Impfung) haben KEINEN Bearbeiten-Button. |
| E-30 | Einträge löschen (Tierakte) | NICHT vorhanden. Kein Löschen-Button, kein Swipe-to-Delete, kein Bestätigungs-Dialog. |
| E-52 | Low-Memory-Handling | NICHT vorhanden. Kein AppState-Listener für Memory-Warning, kein Cache-Clear. |
| E-72 | Show-on-Lock-Screen (ohne Entsperren) | Verschoben auf v0.1.5 – korrekt dokumentiert. |
| E-75 | Tab-Bar überall sichtbar | GERADE IN ARBEIT – Navigation umgebaut. |
| E-76 | Tierakte-Einträge bearbeiten/löschen | GERADE IN ARBEIT – hängt an E-29/E-30. |

---

## VORHANDEN (korrekt implementiert)

| ID | Thema | Bestätigung |
|:---|:---|:---|
| E-31 | Doppelklick-Schutz | ✓ In 8 Screens (FormParts, EditPet, Onboarding, alle Entry-Screens) |
| E-34 | Foto-Komprimierung | ✓ imagePicker.ts |
| E-44 | FlatList bei Listen | ✓ HomeScreen nutzt FlatList |
| E-51 | Speicherplatz-Check | ✓ backupService.ts |
| E-59 | Überfällig-Karte antippbar | ✓ Pressable → navigiert zu Termine |
| E-68 | Familien-Teilen | ✓ Sharing in backupService + EmergencyPassScreen |
| Doktrin 6 | Draft-Autosave | ✓ draftStore.ts + useEntryForm.ts |
| E-61 | App-Shortcut | ✓ Config Plugin (wartet auf Build) |
| E-62 | Permanente Notification | ✓ Foreground Service (wartet auf Build) |
| E-73 | Foreground Service Fix | ✓ Plugin (wartet auf Build) |
| E-74 | Backup-Dateiname mit Nummer | ✓ backupService.ts |

---

## ZUSAMMENFASSUNG: Was muss noch gemacht werden

1. **E-29/E-30/E-76: Tierakte-Einträge bearbeiten + löschen** (PRIORITÄT)
2. **E-52: Low-Memory-Handling** (Bilder-Cache leeren bei Memory-Warning)
3. **E-75: Tab-Bar überall** (in Arbeit)

---

## NICHT GEPRÜFT (benötigt Laufzeit-Test auf Gerät)

- E-32 Rotation gesperrt (Portrait-only)
- E-33 Dark Mode (Light erzwingen)
- E-37 Textumbruch
- E-38 Tap-Targets 48dp
- E-39 ScrollView überall
- E-40 Flexible Feldhöhen
- E-42 Notification-Permission Android 13+
- E-43 Kamera-Permission Android 13+
- E-46 Hermes-Engine
- E-47 Scoped Storage
- E-48 Locale-sichere Daten
- E-49 Leerer Zustand (Empty-States)
- E-50 SQLite WAL-Modus
