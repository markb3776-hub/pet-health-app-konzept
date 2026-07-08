-- simplyPet: Initiales Datenbank-Schema (PostgreSQL / Neon Testumgebung)
-- Quelle: technische_spezifikation_datenmodell.md (Roadmap Schritt 2)
-- Hinweis: Testdatenbank enthaelt AUSSCHLIESSLICH Testdaten.
-- Vor echten Nutzerdaten: Umzug auf EU-Infrastruktur (siehe infrastruktur_und_kellerserver_konzept.md).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2.1 Users (Nutzer/Halter)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Pets (Tiere / Aquarien)
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(255),
    gender VARCHAR(20),
    birth_date DATE,
    castration_status VARCHAR(50),
    castration_date DATE,
    chip_number VARCHAR(15),
    color_theme VARCHAR(7),
    photo_uri VARCHAR(1024),
    special_features TEXT,
    specialist_vet_name VARCHAR(255),
    specialist_vet_phone VARCHAR(50),
    archived BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pets_user ON pets(user_id);

-- 2.3 Health_Records (Verlauf: Gewicht, Symptome, Notizen, Wasserwerte)
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    record_type VARCHAR(30) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    value NUMERIC(10,3),
    unit VARCHAR(20),
    notes TEXT,
    photo_uri VARCHAR(1024),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_health_records_pet_date ON health_records(pet_id, date DESC);

-- 2.4 Vaccinations (Impfungen & Prophylaxe)
CREATE TABLE IF NOT EXISTS vaccinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    disease VARCHAR(255),
    product_name VARCHAR(255),
    date_given DATE NOT NULL,
    valid_until DATE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vaccinations_pet ON vaccinations(pet_id, valid_until);

-- 2.5 Medications (Dauermedikation, Vorerkrankungen, Allergien)
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255),
    active_since DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_medications_pet ON medications(pet_id, is_active);

-- 2.6 Documents (Dokumenten-Safe)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    title VARCHAR(255),
    doc_type VARCHAR(30) NOT NULL DEFAULT 'Sonstiges',
    file_uri VARCHAR(1024) NOT NULL,
    upload_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_documents_pet ON documents(pet_id, upload_date DESC);

-- 2.7 Reminders (Erinnerungen / Termine, zustandsbasiert)
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Offen',
    reminder_chain JSONB,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reminders_pet_status ON reminders(pet_id, status, due_date);
