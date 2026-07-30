/**
 * simplyPet: Lokale Datenbank (Offline-First)
 * Quelle: technische_spezifikation_offline_strategie.md
 *
 * Die App liest und schreibt IMMER lokal (SQLite). Ein spaeterer
 * Sync-Prozess uebertraegt Aenderungen (is_synced = 0) an den Server.
 * Das lokale Schema spiegelt das Server-Schema (001_initial_schema.sql).
 */
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('simplypet.db');
  await migrate(db);
  return db;
}

async function migrate(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      gender TEXT,
      birth_date TEXT,
      castration_status TEXT,
      castration_date TEXT,
      chip_number TEXT,
      color_theme TEXT,
      photo_uri TEXT,
      special_features TEXT,
      specialist_vet_name TEXT,
      specialist_vet_phone TEXT,
      archived INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS health_records (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      record_type TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT (datetime('now')),
      value REAL,
      unit TEXT,
      notes TEXT,
      photo_uri TEXT,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS vaccinations (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      disease TEXT,
      product_name TEXT,
      date_given TEXT NOT NULL,
      valid_until TEXT,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT,
      active_since TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      title TEXT,
      doc_type TEXT NOT NULL DEFAULT 'Sonstiges',
      file_uri TEXT NOT NULL,
      upload_date TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Offen',
      reminder_chain TEXT,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_synced INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Migration 002 (Teilauftrag 4.2): additive Spalten gemaess Datenmodell-Spez.
  // SQLite kennt kein "ADD COLUMN IF NOT EXISTS" – deshalb Spalten-Check via PRAGMA.
  await addColumnIfMissing(database, 'medications', 'times_per_day', 'INTEGER NOT NULL DEFAULT 1');
  await addColumnIfMissing(database, 'medications', 'dose_times', 'TEXT'); // JSON: ["07:00","19:00"]
  await addColumnIfMissing(database, 'medications', 'hint_text', 'TEXT'); // z. B. "Bei Sonnenschein"
  await addColumnIfMissing(database, 'health_records', 'medication_id', 'TEXT'); // Gabe -> Dauermedikation
  await addColumnIfMissing(database, 'reminders', 'season_start', 'INTEGER'); // Monat 1-12
  await addColumnIfMissing(database, 'reminders', 'season_end', 'INTEGER');
  await addColumnIfMissing(database, 'reminders', 'hint_text', 'TEXT');
  await addColumnIfMissing(database, 'reminders', 'source_type', 'TEXT'); // 'impfung' | 'medikament' | 'manuell'
  await addColumnIfMissing(database, 'reminders', 'source_id', 'TEXT'); // FK auf vaccinations/medications
  await addColumnIfMissing(database, 'reminders', 'repeat_rule', 'TEXT'); // 'taeglich' | null (Prototyp)
  await addColumnIfMissing(database, 'reminders', 'done_at', 'TEXT'); // fuer Erledigt-Liste + Rueckgaengig

  // Migration 003 (Teilauftrag 4.3, Notfallpass): Signalement + Stammtierarzt.
  // Quelle: notfallpass_design_spezifikation.md Abschnitt 1 (Passkarte + Fussbereich).
  await addColumnIfMissing(database, 'pets', 'coat_color', 'TEXT'); // Fellfarbe/Zeichnung
  await addColumnIfMissing(database, 'pets', 'vet_practice_name', 'TEXT'); // Stammtierarzt-Praxis
  await addColumnIfMissing(database, 'pets', 'vet_practice_phone', 'TEXT');

  // Migration 004 (v0.1.2): Allergien/Vorerkrankungen in Stammdaten,
  // Parasitenschutz-Untertyp, Erinnerungs-Vorlauf, Bearbeitungs-Vermerk.
  await addColumnIfMissing(database, 'pets', 'allergies', 'TEXT'); // Freitext, separate Anzeige
  await addColumnIfMissing(database, 'pets', 'pre_conditions', 'TEXT'); // Freitext, separate Anzeige
  await addColumnIfMissing(database, 'medications', 'sub_type', 'TEXT'); // Parasitenschutz: Spot-On/Halsband/Tablette
  await addColumnIfMissing(database, 'reminders', 'offset_days', 'INTEGER'); // Vorlauf-Tage (z.B. 7 = 7 Tage vorher)
  // Bearbeitungs-Vermerk: wann wurde ein Eintrag zuletzt bearbeitet (fuer Transparenz)
  await addColumnIfMissing(database, 'health_records', 'edited_at', 'TEXT');
  await addColumnIfMissing(database, 'vaccinations', 'edited_at', 'TEXT');
  await addColumnIfMissing(database, 'medications', 'edited_at', 'TEXT');
  await addColumnIfMissing(database, 'reminders', 'edited_at', 'TEXT');
  // Backup-Metadaten
  await addColumnIfMissing(database, 'pets', 'last_backup_at', 'TEXT');

  // Migration 005 (E-80): Pferde-spezifische Felder im Notfallpass.
  // Equidenpass ist EU-Pflichtdokument (VO 2015/262); Stallkontakt fuer Notfall;
  // Geschaetztes Gewicht (Massband) statt Waage; Kolik-Vorgeschichte; Hufschmied.
  await addColumnIfMissing(database, 'pets', 'equine_pass_number', 'TEXT'); // Equidenpass-Nummer
  await addColumnIfMissing(database, 'pets', 'equine_brand', 'TEXT'); // Brand/Brandzeichen
  await addColumnIfMissing(database, 'pets', 'equine_markings', 'TEXT'); // Abzeichen (Blesse, Socken etc.)
  await addColumnIfMissing(database, 'pets', 'equine_estimated_weight_kg', 'REAL'); // Geschaetztes Gewicht (Massband)
  await addColumnIfMissing(database, 'pets', 'equine_weight_date', 'TEXT'); // Datum der Schaetzung
  await addColumnIfMissing(database, 'pets', 'equine_colic_history', 'TEXT'); // Kolik-Vorgeschichte (Freitext)
  await addColumnIfMissing(database, 'pets', 'equine_stable_name', 'TEXT'); // Pensionsstall/Stallname
  await addColumnIfMissing(database, 'pets', 'equine_stable_phone', 'TEXT'); // Stall-Telefon
  await addColumnIfMissing(database, 'pets', 'equine_box_number', 'TEXT'); // Box-/Paddock-Nummer
  await addColumnIfMissing(database, 'pets', 'equine_farrier_name', 'TEXT'); // Hufschmied Name
  await addColumnIfMissing(database, 'pets', 'equine_farrier_phone', 'TEXT'); // Hufschmied Telefon
  await addColumnIfMissing(database, 'pets', 'equine_housing_type', 'TEXT'); // Box/Offenstall/Weide
  // Kotprobe-Ergebnisse werden in health_records gespeichert (record_type = 'Kotprobe')
  await addColumnIfMissing(database, 'health_records', 'epg_value', 'INTEGER'); // Eier pro Gramm

  // Migration 006 (E-86): Aquarium-spezifische Felder.
  // Aquarium ist ein Behaeltnis (isHabitat=true), kein Einzeltier.
  // Beckentyp (Suess/Meer/Brack), Volumen, Einrichtungsdatum.
  await addColumnIfMissing(database, 'pets', 'aquarium_type', 'TEXT'); // Suesswasser/Meerwasser/Brackwasser
  await addColumnIfMissing(database, 'pets', 'aquarium_volume_liters', 'INTEGER'); // Beckengroesse in Liter
  await addColumnIfMissing(database, 'pets', 'setup_date', 'TEXT'); // Einrichtungsdatum (statt birth_date bei Aquarium)

  // Migration 007 (E-94/E-95/E-96/E-100): Kennzeichnung + Impf-Erweiterung + EU-Pass
  // E-94: Chip-Implantationsdaten
  await addColumnIfMissing(database, 'pets', 'chip_implant_date', 'TEXT'); // Datum der Implantation
  await addColumnIfMissing(database, 'pets', 'chip_implant_location', 'TEXT'); // Implantationsstelle
  // E-95: Taetowierung
  await addColumnIfMissing(database, 'pets', 'tattoo_number', 'TEXT'); // Taetowierungsnummer
  await addColumnIfMissing(database, 'pets', 'tattoo_date', 'TEXT'); // Datum der Taetowierung
  await addColumnIfMissing(database, 'pets', 'tattoo_location', 'TEXT'); // Taetowierungsstelle (z.B. linkes Ohr)
  // E-100: EU-Heimtierausweis
  await addColumnIfMissing(database, 'pets', 'eu_pet_passport_number', 'TEXT'); // EU-Heimtierausweis-Nr.
  // E-96: Impfungen erweitern (Chargen-Nr., Gueltig-ab)
  await addColumnIfMissing(database, 'vaccinations', 'batch_number', 'TEXT'); // Chargen-Nummer
  await addColumnIfMissing(database, 'vaccinations', 'valid_from', 'TEXT'); // Gueltig ab
  await addColumnIfMissing(database, 'vaccinations', 'manufacturer', 'TEXT'); // Hersteller/Impfstoff-Name

  // Migration 008 (Push-Notifications): Erinnerungs-Steuerung pro Termin
  // reminder_active: 0 = keine Notification, 1 = Notification geplant
  // notification_id: expo-notifications Identifier (fuer Stornierung)
  // reminder_offset_days: Vorlaufzeit in Tagen (0/1/3/7/14)
  await addColumnIfMissing(database, 'reminders', 'reminder_active', 'INTEGER NOT NULL DEFAULT 1');
  await addColumnIfMissing(database, 'reminders', 'notification_id', 'TEXT');
  await addColumnIfMissing(database, 'reminders', 'reminder_offset_days', 'INTEGER NOT NULL DEFAULT 1');

  // Migration 010 (E-114): Erinnerungs-Uhrzeit pro Termin (Standard 09:00)
  // Nutzer kann wählen wann die Notification feuern soll.
  await addColumnIfMissing(database, 'reminders', 'reminder_hour', 'INTEGER NOT NULL DEFAULT 9');
  await addColumnIfMissing(database, 'reminders', 'reminder_minute', 'INTEGER NOT NULL DEFAULT 0');

  // Migration 009 (Sitter-Modus E-105): Freitextfelder fuer Sitter-Infos pro Tier
  // Werden in den Stammdaten gepflegt und vom Sitter-Modus als PDF exportiert.
  await addColumnIfMissing(database, 'pets', 'sitter_feeding', 'TEXT');       // Fütterung
  await addColumnIfMissing(database, 'pets', 'sitter_routine', 'TEXT');       // Routine / Gassi / Freigang
  await addColumnIfMissing(database, 'pets', 'sitter_behavior', 'TEXT');      // Verhalten & Eigenheiten
  await addColumnIfMissing(database, 'pets', 'sitter_equipment', 'TEXT');     // Ausstattung / Standorte
  await addColumnIfMissing(database, 'pets', 'sitter_climate', 'TEXT');       // Klima/Technik (Reptilien, Fische)
  await addColumnIfMissing(database, 'pets', 'sitter_notes', 'TEXT');         // Sonstige Hinweise
}

async function addColumnIfMissing(
  database: SQLite.SQLiteDatabase,
  table: string,
  column: string,
  definition: string
): Promise<void> {
  const cols = await database.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (!cols.some((c) => c.name === column)) {
    await database.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

/** Einfache UUID v4 (ohne Zusatzabhaengigkeit) */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
