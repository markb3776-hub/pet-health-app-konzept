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
