/**
 * simplyPet: Notfallpass-Datenmodul (Teilauftrag 4.3)
 * Quelle: notfallpass_design_spezifikation.md
 *
 * Prinzip der EINEN Quelle: Diese Datei sammelt alle Pass-Daten aus der
 * lokalen Datenbank und erzeugt daraus alle drei Darstellungen –
 * Bildschirm-Ansicht, QR-Code-Inhalt und PDF-Export. Es gibt keine
 * getrennten, auseinanderlaufenden Kopien.
 *
 * QR-Inhalt (Prototyp-Entscheidung, ehrlich gekennzeichnet):
 * Der QR-Code enthaelt die Notfall-Kerndaten als strukturierten deutschen
 * Klartext. Jede Handy-Kamera kann ihn OHNE Server und OHNE App lesen –
 * damit funktioniert er zu 100 % offline (Offline-Strategie 2.x).
 * Die Browser-Freigabe fuer Praxen (Server-Link) folgt nach dem Prototyp
 * (freigabe_und_sitter_konzept.md: "Nach Prototyp").
 */
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { getOwnerName, getOwnerPhone } from '../profile/profileStore';
import { formatDate } from '../time/timeModule';

export interface PassPet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  castration_status: string | null;
  chip_number: string | null;
  coat_color: string | null;
  photo_uri: string | null;
  special_features: string | null;
  specialist_vet_name: string | null;
  specialist_vet_phone: string | null;
  vet_practice_name: string | null;
  vet_practice_phone: string | null;
  allergies: string | null;
  pre_conditions: string | null;
  updated_at: string;
}

export interface PassMedication {
  name: string;
  dosage: string | null;
  active_since: string | null;
}

export interface PassCondition {
  name: string;
}

export interface PassVaccination {
  disease: string | null;
  product_name: string | null;
  date_given: string;
  valid_until: string | null;
}

export interface PassData {
  pet: PassPet;
  speciesLabel: string;
  vetTerm: string;
  needsSpecialist: boolean;
  allergies: PassCondition[];
  conditions: PassCondition[];
  medications: PassMedication[];
  vaccinations: PassVaccination[];
  lastWeight: { value: number; unit: string; date: string } | null;
  ownerName: string | null;
  ownerPhone: string | null;
  /** Juengstes updated_at ueber alle Datenquellen des Passes (Statuszeile). */
  lastUpdated: string;
}

/** Arten mit Spezialisten-Bedarf laut Design-Spez (Vogel, Kaninchen, Reptil u. ae.). */
const SPECIALIST_SPECIES = new Set([
  'vogel',
  'kaninchen',
  'reptil',
  'meerschweinchen',
  'chinchilla',
  'degu',
  'frettchen',
]);

export async function loadPassData(petId: string): Promise<PassData | null> {
  const db = await getDb();
  const pet = await db.getFirstAsync<PassPet>(
    `SELECT id, name, species, breed, gender, birth_date, castration_status,
            chip_number, coat_color, photo_uri, special_features,
            specialist_vet_name, specialist_vet_phone,
            vet_practice_name, vet_practice_phone,
            allergies, pre_conditions, updated_at
     FROM pets WHERE id = ? AND deleted_at IS NULL`,
    [petId]
  );
  if (!pet) return null;

  // Medizinischer Kernteil: Allergien, Vorerkrankungen und Dauermedikation
  // kommen aus der Gesundheits-Erfassung (medications.type, Teilauftrag 4.2).
  const medRows = await db.getAllAsync<{
    type: string;
    name: string;
    dosage: string | null;
    active_since: string | null;
    updated_at: string;
  }>(
    `SELECT type, name, dosage, active_since, updated_at
     FROM medications
     WHERE pet_id = ? AND is_active = 1 AND deleted_at IS NULL
     ORDER BY created_at`,
    [petId]
  );
  // Allergien/Vorerkrankungen: ZUERST aus pets-Stammdaten (v0.1.2), DANN Fallback auf medications
  const petAllergies = pet.allergies?.trim()
    ? pet.allergies.split(',').map((a) => ({ name: a.trim() })).filter((a) => a.name.length > 0)
    : [];
  const petConditions = pet.pre_conditions?.trim()
    ? pet.pre_conditions.split(',').map((c) => ({ name: c.trim() })).filter((c) => c.name.length > 0)
    : [];
  // Fallback: alte Eintraege aus medications-Tabelle (Rueckwaertskompatibilitaet)
  const medAllergies = medRows.filter((m) => m.type === 'Allergie').map((m) => ({ name: m.name }));
  const medConditions = medRows.filter((m) => m.type === 'Vorerkrankung').map((m) => ({ name: m.name }));
  // Zusammenfuehren ohne Duplikate
  const allergyNames = new Set(petAllergies.map((a) => a.name.toLowerCase()));
  const allergies = [...petAllergies, ...medAllergies.filter((a) => !allergyNames.has(a.name.toLowerCase()))];
  const conditionNames = new Set(petConditions.map((c) => c.name.toLowerCase()));
  const conditions = [...petConditions, ...medConditions.filter((c) => !conditionNames.has(c.name.toLowerCase()))];
  const medications = medRows
    .filter((m) => m.type === 'Medikament')
    .map((m) => ({ name: m.name, dosage: m.dosage, active_since: m.active_since }));

  // Impfstatus: die letzten Impfungen mit Datum (neueste zuerst, max. 5).
  const vaccinations = await db.getAllAsync<PassVaccination & { updated_at: string }>(
    `SELECT disease, product_name, date_given, valid_until, updated_at
     FROM vaccinations WHERE pet_id = ? AND deleted_at IS NULL
     ORDER BY date_given DESC LIMIT 5`,
    [petId]
  );

  // Letzte bekannte Werte: juengstes Gewicht mit Datum.
  const weightRow = await db.getFirstAsync<{
    value: number;
    unit: string | null;
    date: string;
    updated_at: string;
  }>(
    `SELECT value, unit, date, updated_at FROM health_records
     WHERE pet_id = ? AND record_type IN ('Gewicht','gewicht') AND value IS NOT NULL
       AND deleted_at IS NULL
     ORDER BY date DESC LIMIT 1`,
    [petId]
  );

  const ownerName = await getOwnerName();
  const ownerPhone = await getOwnerPhone();

  // Statuszeile "Zuletzt aktualisiert": juengster Stand ueber alle Quellen –
  // Ehrlichkeit ueber die Aktualitaet der Daten (Design-Spez, Kopfbereich).
  const timestamps = [
    pet.updated_at,
    ...medRows.map((m) => m.updated_at),
    ...vaccinations.map((v) => v.updated_at),
    ...(weightRow ? [weightRow.updated_at] : []),
  ].filter(Boolean);
  const lastUpdated = timestamps.sort().at(-1) ?? pet.updated_at;

  const cfg = getSpeciesConfig(pet.species);
  return {
    pet,
    speciesLabel: cfg?.label ?? pet.species,
    vetTerm: cfg?.terminology.vet ?? 'Tierarzt',
    needsSpecialist: SPECIALIST_SPECIES.has(pet.species),
    allergies,
    conditions,
    medications,
    vaccinations: vaccinations.map(({ disease, product_name, date_given, valid_until }) => ({
      disease,
      product_name,
      date_given,
      valid_until,
    })),
    lastWeight: weightRow
      ? { value: weightRow.value, unit: weightRow.unit ?? 'kg', date: weightRow.date }
      : null,
    ownerName,
    ownerPhone,
    lastUpdated,
  };
}

/** Signalement-Zeile (Geburtsdatum, Geschlecht, Kastration, Rasse, Fellfarbe). */
export function buildSignalement(d: PassData): string[] {
  const rows: string[] = [];
  if (d.pet.birth_date) rows.push(`Geboren: ${formatDate(d.pet.birth_date)}`);
  if (d.pet.gender) rows.push(`Geschlecht: ${d.pet.gender}`);
  if (d.pet.castration_status) rows.push(`Kastration: ${d.pet.castration_status}`);
  if (d.pet.breed) rows.push(`Rasse: ${d.pet.breed}`);
  if (d.pet.coat_color) rows.push(`Fellfarbe/Zeichnung: ${d.pet.coat_color}`);
  return rows;
}

/**
 * QR-Payload: strukturierter deutscher Klartext.
 * Bewusst KEIN Link und KEIN proprietaeres Format – jede Handy-Kamera
 * zeigt den Text direkt an, komplett offline (Notfall in Klinik ohne Empfang).
 * Kompakt gehalten, damit der QR-Code gut scanbar bleibt.
 */
export function buildQrPayload(d: PassData): string {
  const lines: string[] = [];
  lines.push('NOTFALL-PASS (simplyPet)');
  lines.push(`Tier: ${d.pet.name} – ${d.speciesLabel}${d.pet.breed ? `, ${d.pet.breed}` : ''}`);
  if (d.pet.birth_date) lines.push(`Geboren: ${formatDate(d.pet.birth_date)}`);
  if (d.pet.chip_number) lines.push(`Chip: ${d.pet.chip_number}`);
  lines.push(
    `Merkmale: ${d.pet.special_features?.trim() || 'Keine besonderen Merkmale erfasst'}`
  );
  lines.push(
    `Allergien: ${d.allergies.length ? d.allergies.map((a) => a.name).join(', ') : 'Keine erfasst'}`
  );
  lines.push(
    `Medikation: ${
      d.medications.length
        ? d.medications.map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join(', ')
        : 'Keine erfasst'
    }`
  );
  lines.push(
    `Vorerkrankungen: ${
      d.conditions.length ? d.conditions.map((c) => c.name).join(', ') : 'Keine erfasst'
    }`
  );
  if (d.ownerName || d.ownerPhone) {
    lines.push(`Halter: ${d.ownerName ?? ''}${d.ownerPhone ? ` – Tel. ${d.ownerPhone}` : ''}`.trim());
  }
  if (d.pet.vet_practice_name || d.pet.vet_practice_phone) {
    lines.push(
      `${d.vetTerm}: ${d.pet.vet_practice_name ?? ''}${
        d.pet.vet_practice_phone ? ` – Tel. ${d.pet.vet_practice_phone}` : ''
      }`.trim()
    );
  }
  if (d.needsSpecialist && d.pet.specialist_vet_name) {
    lines.push(
      `Spezialist: ${d.pet.specialist_vet_name}${
        d.pet.specialist_vet_phone ? ` – Tel. ${d.pet.specialist_vet_phone}` : ''
      }`
    );
  }
  lines.push(`Stand: ${formatDate(d.lastUpdated)}`);
  return lines.join('\n');
}

/** HTML-Escaping fuer den PDF-Export (Nutzereingaben sicher einbetten). */
function esc(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * PDF-Export: einseitiges Dokument im Pass-Layout (Design-Spez Abschnitt 3.3).
 * Foto oben links, Signalement daneben, Notfall-Bloecke darunter.
 * Graustufen-tauglich: klare Kontraste, keine farbabhaengigen Informationen.
 */
export function buildPassHtml(d: PassData, photoDataUri: string | null): string {
  const sig = buildSignalement(d)
    .map((row) => `<div class="sig">${esc(row)}</div>`)
    .join('');
  const vacc = d.vaccinations.length
    ? d.vaccinations
        .map(
          (v) =>
            `<div>${esc(v.disease ?? v.product_name ?? 'Impfung')} – ${formatDate(v.date_given)}${
              v.valid_until ? ` (gültig bis ${formatDate(v.valid_until)})` : ''
            }</div>`
        )
        .join('')
    : '<div class="muted">Keine Impfungen erfasst</div>';
  const meds = d.medications.length
    ? d.medications
        .map(
          (m) =>
            `<div>${esc(m.name)}${m.dosage ? ` – ${esc(m.dosage)}` : ''}${
              m.active_since ? ` (seit ${formatDate(m.active_since)})` : ''
            }</div>`
        )
        .join('')
    : '<div class="muted">Keine Dauermedikation erfasst</div>';
  const allergies = d.allergies.length
    ? d.allergies.map((a) => `<div>${esc(a.name)}</div>`).join('')
    : '<div class="muted">Keine Allergien erfasst</div>';
  const conditions = d.conditions.length
    ? d.conditions.map((c) => `<div>${esc(c.name)}</div>`).join('')
    : '<div class="muted">Keine Vorerkrankungen erfasst</div>';
  const weight = d.lastWeight
    ? `${String(d.lastWeight.value).replace('.', ',')} ${esc(d.lastWeight.unit)} (${formatDate(
        d.lastWeight.date
      )})`
    : 'Kein Gewicht erfasst';

  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 18mm; }
  body { font-family: -apple-system, Roboto, 'Segoe UI', sans-serif; color: #1A1A1A; font-size: 12pt; }
  .card { border: 2px solid #2F6B4F; border-radius: 12px; padding: 14pt; }
  .head { display: flex; gap: 14pt; align-items: flex-start; }
  .photo { width: 90pt; height: 90pt; border-radius: 10pt; object-fit: cover; border: 1px solid #999; }
  .photo-placeholder { width: 90pt; height: 90pt; border-radius: 10pt; border: 1px dashed #999;
    display: flex; align-items: center; justify-content: center; color: #777; font-size: 9pt; text-align: center; }
  h1 { font-size: 18pt; margin: 0 0 2pt; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.5pt; color: #444;
    border-bottom: 1px solid #CCC; padding-bottom: 2pt; margin: 12pt 0 4pt; }
  .meta { color: #444; margin-bottom: 6pt; }
  .sig { margin: 1pt 0; }
  .chip { font-size: 13pt; font-weight: bold; letter-spacing: 1pt; margin-top: 6pt; }
  .muted { color: #777; }
  .status { color: #666; font-size: 9pt; margin-top: 4pt; }
  .footer { margin-top: 14pt; font-size: 9pt; color: #555; border-top: 1px solid #CCC; padding-top: 6pt; }
</style></head><body>
  <div class="card">
    <div class="head">
      ${
        photoDataUri
          ? `<img class="photo" src="${photoDataUri}" />`
          : `<div class="photo-placeholder">Kein Foto<br/>hinterlegt</div>`
      }
      <div>
        <h1>${esc(d.pet.name)}</h1>
        <div class="meta">${esc(d.speciesLabel)}${d.pet.breed ? ` · ${esc(d.pet.breed)}` : ''}</div>
        ${sig}
        ${d.pet.chip_number ? `<div class="chip">Chip: ${esc(d.pet.chip_number)}</div>` : ''}
        <div class="status">Zuletzt aktualisiert: ${formatDate(d.lastUpdated)}</div>
      </div>
    </div>
    <h2>Besondere Erkennungsmerkmale</h2>
    <div>${
      d.pet.special_features?.trim()
        ? esc(d.pet.special_features)
        : '<span class="muted">Keine besonderen Merkmale erfasst</span>'
    }</div>
    <h2>Allergien und Unverträglichkeiten</h2>${allergies}
    <h2>Dauermedikation</h2>${meds}
    <h2>Vorerkrankungen</h2>${conditions}
    <h2>Impfstatus</h2>${vacc}
    <h2>Letzte bekannte Werte</h2><div>Gewicht: ${weight}</div>
    <h2>Kontakt</h2>
    <div>Halter: ${
      d.ownerName ? esc(d.ownerName) : '<span class="muted">Nicht erfasst</span>'
    }${d.ownerPhone ? ` – Tel. ${esc(d.ownerPhone)}` : ''}</div>
    <div>${esc(d.vetTerm)}: ${
      d.pet.vet_practice_name
        ? esc(d.pet.vet_practice_name)
        : '<span class="muted">Nicht erfasst</span>'
    }${d.pet.vet_practice_phone ? ` – Tel. ${esc(d.pet.vet_practice_phone)}` : ''}</div>
    ${
      d.needsSpecialist && d.pet.specialist_vet_name
        ? `<div>Fachkundiger ${esc(d.vetTerm)}: ${esc(d.pet.specialist_vet_name)}${
            d.pet.specialist_vet_phone ? ` – Tel. ${esc(d.pet.specialist_vet_phone)}` : ''
          }</div>`
        : ''
    }
  </div>
  <div class="footer">
    Dieser Notfall-Pass ist ein privates Dokument des Halters, erstellt mit simplyPet.
    Er ersetzt keine amtlichen Dokumente – insbesondere nicht den EU-Heimtierausweis (Reisen),
    den Equidenpass (Pflichtdokument beim Pferd) oder eine amtliche Registrierung (z.&nbsp;B. TASSO, FINDEFIX).
  </div>
</body></html>`;
}
