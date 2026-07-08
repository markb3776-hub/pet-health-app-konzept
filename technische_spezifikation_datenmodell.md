# Technische Spezifikation: Datenmodell (simplyPet)

**Datum:** Juli 2026
**Autor:** Manus AI

Dieses Dokument definiert das Datenmodell für die Pet-Health-App "simplyPet" (Roadmap Schritt 2). Es übersetzt die Anforderungen aus dem Datenkatalog und dem Tierarten-Abdeckungskonzept in konkrete Tabellenstrukturen für PostgreSQL.

## 1. Grundprinzipien

Das Datenmodell basiert auf drei zentralen Grundprinzipien. Erstens der Offline-First-Ansatz: Die Datenbank wird primär lokal auf dem Gerät (mittels SQLite via Expo oder WatermelonDB) gehalten und asynchron mit dem Server (PostgreSQL) synchronisiert, sobald eine Verbindung besteht. Das hier definierte Modell stellt das serverseitige Schema dar; das lokale Schema ist identisch strukturiert. Zweitens die Mandantenfähigkeit: Alle Daten sind strikt einer eindeutigen `user_id` zugeordnet, um die Trennung der Nutzerdaten zu gewährleisten. Drittens das modulare Tierprofil: Die gewählte Tierart steuert dynamisch, welche Felder und Module für das jeweilige Tier relevant sind. Diese Steuerung erfolgt über eine flexible JSON-Konfiguration.

## 2. Tabellen-Definitionen

### 2.1. Users (Nutzer/Halter)

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `email` | VARCHAR | E-Mail-Adresse (verschlüsselt/gehasht je nach Auth-Konzept) |
| `name` | VARCHAR | Name des Halters (für Notfallpass) |
| `phone` | VARCHAR | Telefonnummer (für Notfallpass) |
| `created_at` | TIMESTAMP | Erstellungsdatum |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### 2.2. Pets (Tiere)

Dies ist die zentrale Entität. Das Feld `species` (Tierart) steuert die Logik.

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `user_id` | UUID | Fremdschlüssel (Users) |
| `name` | VARCHAR | Name des Tieres (oder Bezeichnung des Aquariums) |
| `species` | VARCHAR | Tierart (z.B. 'Hund', 'Katze', 'Aquarium') aus Matrix |
| `breed` | VARCHAR | Rasse |
| `gender` | VARCHAR | Geschlecht ('M', 'W', 'Unbekannt') |
| `birth_date` | DATE | Geburtsdatum (ggf. geschätzt) |
| `castration_status` | VARCHAR | Kastrationsstatus ('Ja', 'Nein', 'Unbekannt') + Datum |
| `chip_number` | VARCHAR(15) | 15-stellige Transponder-Nummer |
| `color_theme` | VARCHAR(7) | Hex-Code der gewählten Kennfarbe (UI) |
| `photo_uri` | VARCHAR | Pfad/URL zum Hauptfoto (Passbild) |
| `special_features` | TEXT | Besondere Erkennungsmerkmale (Narben, Zeichnungen etc.) |
| `specialist_vet_id` | UUID | FK zu Vets (für vogel-/reptilienkundige Tierärzte) |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### 2.3. Health_Records (Gesundheitstagebuch / Verlauf)

Für Symptome, Gewichts-Einträge und allgemeine Notizen.

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `pet_id` | UUID | Fremdschlüssel (Pets) |
| `record_type` | VARCHAR | Art ('Gewicht', 'Symptom', 'Notiz', 'Wasserwert') |
| `date` | TIMESTAMP | Zeitpunkt des Eintrags |
| `value` | NUMERIC | Zahlenwert (z.B. Gewicht in kg, pH-Wert) |
| `notes` | TEXT | Freitext-Beschreibung |
| `photo_uri` | VARCHAR | Optionales Foto zum Eintrag |

### 2.4. Vaccinations (Impfungen & Prophylaxe)

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `pet_id` | UUID | Fremdschlüssel (Pets) |
| `type` | VARCHAR | 'Impfung', 'Entwurmung', 'Zeckenschutz' |
| `disease` | VARCHAR | Krankheit (z.B. 'Tollwut', 'RCP') |
| `product_name` | VARCHAR | Name des Präparats |
| `date_given` | DATE | Datum der Verabreichung |
| `valid_until` | DATE | Fälligkeitsdatum (für Erinnerungen) |

### 2.5. Medications (Dauermedikation & Vorerkrankungen)

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `pet_id` | UUID | Fremdschlüssel (Pets) |
| `type` | VARCHAR | 'Medikament', 'Vorerkrankung', 'Allergie' |
| `name` | VARCHAR | Name (Präparat oder Krankheit) |
| `dosage` | VARCHAR | Dosierung (z.B. '1/2 Tablette abends') |
| `active_since` | DATE | Seit wann aktiv/bekannt |
| `is_active` | BOOLEAN | Aktuell noch relevant? |

### 2.6. Documents (Dokumenten-Safe)

Für Scans von Rechnungen, Befunden und amtlichen Dokumenten (CITES, Equidenpass).

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `pet_id` | UUID | Fremdschlüssel (Pets) |
| `title` | VARCHAR | Titel des Dokuments |
| `doc_type` | VARCHAR | 'Rechnung', 'Befund', 'Impfpass', 'Amtlich' |
| `file_uri` | VARCHAR | Pfad/URL zur Datei (Bild/PDF) |
| `upload_date` | TIMESTAMP | Datum des Uploads |

### 2.7. Reminders (Erinnerungen / Termine)

Zustandsbasiertes Erinnerungssystem.

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Primärschlüssel |
| `pet_id` | UUID | Fremdschlüssel (Pets) |
| `title` | VARCHAR | Was steht an? (z.B. 'Impftermin vereinbaren') |
| `due_date` | TIMESTAMP | Wann ist es fällig? |
| `status` | VARCHAR | 'Offen', 'Termin vereinbart', 'Erledigt', 'Pausiert' |
| `reminder_chain`| JSONB | Konfiguration der Vorlauf-Eskalation |

## 3. Tierarten-Konfiguration (JSON)

Die App lädt beim Onboarding eine Konfigurationsdatei, die steuert, welche Felder/Module für die gewählte Tierart (`species`) aktiv sind.

```json
{
  "Hund": {
    "modules": ["vaccinations", "weight", "documents"],
    "terminology": {"vet": "Tierarzt"}
  },
  "Kaninchen": {
    "modules": ["vaccinations", "weight", "teeth"],
    "terminology": {"vet": "Kaninchenkundiger Tierarzt"}
  },
  "Aquarium": {
    "modules": ["water_values", "maintenance"],
    "terminology": {"name": "Becken-Bezeichnung"}
  }
}
```
