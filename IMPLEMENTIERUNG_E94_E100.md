# Implementierungsplan E-94 bis E-100 (v0.1.7)

## Status: IN ARBEIT

## Bereits erledigt:
- ✅ Migration 007 in database.ts (E-94/E-95/E-96/E-100 Spalten)
- ✅ E-97 im Entscheidungsregister auf Phase 1/2 aufgeteilt
- ⏳ EditPetScreen: Neue UI-Felder (E-94, E-95, E-100)
- ⏳ EditPetScreen: PetRow + EditPetDraft + petToDraft + SQL UPDATE erweitern
- ⏳ Impf-Screen: E-96 Felder (Charge, Gültig-ab, Impfstoff/Hersteller)
- ⏳ Dokumentenscan-Screen: E-97 Phase 1 (Kamera → Tier zuordnen → documents-Tabelle)
- ⏳ HomeScreen: E-98 Sortierung (alphabetisch + Gruppen)
- ⏳ Untersuchungsergebnis-Screen: E-99 (neuer CaptureSheet-Typ)
- ⏳ TypeScript-Check + APK v0.1.7 Build

## DB-Spalten (Migration 007):
### pets-Tabelle:
- chip_implant_date TEXT (E-94)
- chip_implant_location TEXT (E-94)
- tattoo_number TEXT (E-95)
- tattoo_date TEXT (E-95)
- tattoo_location TEXT (E-95)
- eu_pet_passport_number TEXT (E-100)

### vaccinations-Tabelle:
- batch_number TEXT (E-96)
- valid_from TEXT (E-96)
- manufacturer TEXT (E-96)

## Bestehende DB-Tabelle für E-97:
- documents (id, pet_id, title, doc_type, file_uri, upload_date, ...) → BEREITS VORHANDEN

## EditPetScreen Änderungen nötig:
1. PetRow Interface: +chip_implant_date, +chip_implant_location, +tattoo_number, +tattoo_date, +tattoo_location, +eu_pet_passport_number
2. EditPetDraft Interface: +chipImplantDate, +chipImplantLocation, +tattooNumber, +tattooDate, +tattooLocation, +euPetPassportNumber
3. petToDraft(): Mapping hinzufügen
4. SQL UPDATE: +6 Spalten
5. UI: Nach Chip-Nummer-Feld → Implantationsdatum + Implantationsstelle
   Nach Chip-Sektion → Tätowierungs-Sektion (nur Hund/Katze/Kaninchen)
   Nach Allergien-Sektion → EU-Heimtierausweis (nur Hund/Katze/Frettchen)

## Sichtbarkeitsregeln:
- E-94 (Chip-Implantation): Gleiche Sichtbarkeit wie Chip-Nummer (nicht bei CHIP_HIDDEN_SPECIES)
- E-95 (Tätowierung): Nur bei hund, katze, kaninchen
- E-100 (EU-Pass): Nur bei hund, katze, frettchen

## Dateien die geändert werden müssen:
- src/db/database.ts ✅ (Migration 007)
- src/screens/EditPetScreen.tsx (Interfaces, petToDraft, SQL, UI)
- src/screens/entries/ → neuer DocumentScanScreen.tsx (E-97)
- src/screens/entries/ → neuer ExaminationEntryScreen.tsx (E-99)
- src/components/CaptureSheet.tsx (neue Optionen: Dokument, Untersuchung)
- src/navigation/AppNavigator.tsx (neue Routen)
- src/screens/HomeScreen.tsx (E-98: Sortierung)
- Impf-Erfassungsscreen (E-96: neue Felder)

## Build-Infos:
- Version: 0.1.7, versionCode 7
- Build-Befehl: Sandbox mit Swap (6 GB), Java 17, gradle assembleRelease
- APK-Name: simplyPet_v0.1.7.apk
