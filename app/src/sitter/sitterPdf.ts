/**
 * simplyPet: Sitter-Modus – Info-Paket PDF (E-105)
 *
 * Generiert ein mehrseitiges HTML-Dokument fuer expo-print, das als PDF
 * exportiert wird. Enthält: Tier-Stammdaten, Sitter-Infos (Freitextfelder),
 * aktive Medikamente, Allergien/Vorerkrankungen, Notfallkontakte,
 * tierartspezifische Checkliste.
 */

import { getChecklistForSpecies } from './sitterConfig';

/** HTML-Escaping fuer Nutzereingaben. */
function esc(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Mehrzeiligen Text in HTML-Absaetze umwandeln. */
function nl2br(text: string | null | undefined): string {
  if (!text || !text.trim()) return '<span style="color:#999;">Nicht hinterlegt</span>';
  return esc(text).replace(/\n/g, '<br/>');
}

export interface SitterPetData {
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
  specialFeatures: string | null;
  photoDataUri: string | null;
  // Sitter-Freitextfelder
  sitterFeeding: string | null;
  sitterRoutine: string | null;
  sitterBehavior: string | null;
  sitterEquipment: string | null;
  sitterClimate: string | null;
  sitterNotes: string | null;
  // Medizinisches
  allergies: string | null;
  preConditions: string | null;
  medications: { name: string; dosage: string | null; hint: string | null }[];
  // Kontakte
  vetName: string | null;
  vetPhone: string | null;
  practiceName: string | null;
  practicePhone: string | null;
  ownerName: string;
  ownerPhone: string;
}

export interface SitterContext {
  sitterName: string;
  sitterPhone: string;
  periodFrom: string;
  periodTo: string;
}

/** Vollstaendiges HTML fuer das Info-Paket. */
export function buildSitterInfoHtml(pet: SitterPetData, ctx: SitterContext): string {
  const checklist = getChecklistForSpecies(pet.species);

  const medRows = pet.medications.length
    ? pet.medications
        .map(
          (m) =>
            `<tr><td>${esc(m.name)}</td><td>${esc(m.dosage)}</td><td>${esc(m.hint)}</td></tr>`
        )
        .join('')
    : '<tr><td colspan="3" style="color:#999;">Keine aktiven Medikamente</td></tr>';

  const checklistHtml = checklist
    .map(
      (cat) =>
        `<div class="checklist-cat">
          <h3>${esc(cat.title)}</h3>
          ${cat.items.map((item) => `<div class="check-item">☐ ${esc(item)}</div>`).join('')}
        </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<style>
  body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 32px; color: #1a1a1a; font-size: 13px; line-height: 1.6; }
  h1 { font-size: 20px; margin-bottom: 4px; color: #2E7D32; }
  h2 { font-size: 16px; margin-top: 20px; margin-bottom: 8px; border-bottom: 2px solid #2E7D32; padding-bottom: 4px; }
  h3 { font-size: 14px; margin: 12px 0 4px; color: #333; }
  .subtitle { color: #555; margin-bottom: 16px; font-size: 12px; }
  .header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
  .pet-photo { width: 100px; height: 100px; border-radius: 12px; object-fit: cover; }
  .pet-info { flex: 1; }
  .pet-info div { margin-bottom: 2px; }
  .label { font-weight: 600; color: #333; }
  .section { margin-bottom: 16px; }
  .info-block { background: #f5f5f5; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
  .info-block-title { font-weight: 700; margin-bottom: 4px; color: #2E7D32; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { text-align: left; background: #e8f5e9; padding: 6px 8px; font-size: 12px; }
  td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
  .checklist-cat { margin-bottom: 12px; }
  .check-item { padding: 3px 0; font-size: 12px; }
  .emergency { background: #fff3e0; border: 1px solid #ff9800; border-radius: 8px; padding: 12px; margin-top: 16px; }
  .emergency-title { font-weight: 700; color: #e65100; margin-bottom: 6px; }
  .footer { margin-top: 24px; font-size: 11px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 8px; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>

<h1>Sitter-Info: ${esc(pet.name)}</h1>
<p class="subtitle">Zeitraum: ${esc(ctx.periodFrom)} bis ${esc(ctx.periodTo)} · Sitter: ${esc(ctx.sitterName)} (${esc(ctx.sitterPhone)})</p>

<div class="header">
  ${pet.photoDataUri ? `<img class="pet-photo" src="${pet.photoDataUri}" alt="Foto"/>` : ''}
  <div class="pet-info">
    <div><span class="label">Art:</span> ${esc(pet.species)}${pet.breed ? ' / ' + esc(pet.breed) : ''}</div>
    <div><span class="label">Geschlecht:</span> ${esc(pet.gender) || 'Nicht angegeben'}</div>
    ${pet.birthDate ? `<div><span class="label">Geburtsdatum:</span> ${esc(pet.birthDate)}</div>` : ''}
    ${pet.specialFeatures ? `<div><span class="label">Besonderheiten:</span> ${esc(pet.specialFeatures)}</div>` : ''}
  </div>
</div>

<h2>Fütterung</h2>
<div class="info-block">${nl2br(pet.sitterFeeding)}</div>

<h2>${pet.species === 'hund' ? 'Gassi-Routine' : pet.species === 'katze' ? 'Freigang & Katzenklo' : 'Routine & Pflege'}</h2>
<div class="info-block">${nl2br(pet.sitterRoutine)}</div>

<h2>Verhalten & Eigenheiten</h2>
<div class="info-block">${nl2br(pet.sitterBehavior)}</div>

<h2>Ausstattung & Standorte</h2>
<div class="info-block">${nl2br(pet.sitterEquipment)}</div>

${pet.sitterClimate ? `<h2>Klima & Technik</h2><div class="info-block">${nl2br(pet.sitterClimate)}</div>` : ''}

${pet.sitterNotes ? `<h2>Sonstige Hinweise</h2><div class="info-block">${nl2br(pet.sitterNotes)}</div>` : ''}

<h2>Medikamente</h2>
<table>
  <tr><th>Medikament</th><th>Dosierung</th><th>Hinweis</th></tr>
  ${medRows}
</table>

${pet.allergies || pet.preConditions ? `
<h2>Allergien & Vorerkrankungen</h2>
<div class="info-block">
  ${pet.allergies ? `<div><span class="label">Allergien:</span> ${esc(pet.allergies)}</div>` : ''}
  ${pet.preConditions ? `<div><span class="label">Vorerkrankungen:</span> ${esc(pet.preConditions)}</div>` : ''}
</div>
` : ''}

<div class="emergency">
  <div class="emergency-title">Notfallkontakte</div>
  <div><span class="label">Halter:</span> ${esc(pet.ownerName)} – ${esc(pet.ownerPhone)}</div>
  ${pet.vetName ? `<div><span class="label">Tierarzt:</span> ${esc(pet.vetName)} – ${esc(pet.vetPhone)}</div>` : ''}
  ${pet.practiceName ? `<div><span class="label">Stammpraxis:</span> ${esc(pet.practiceName)} – ${esc(pet.practicePhone)}</div>` : ''}
</div>

<div style="page-break-before: always;"></div>
<h2>Checkliste für den Sitter</h2>
<p style="font-size:11px;color:#555;">Zum Abhaken – bitte vor Abreise gemeinsam durchgehen:</p>
${checklistHtml}

<div class="footer">
  Erstellt mit simplyPet · ${new Date().toLocaleDateString('de-DE')}
</div>

</body>
</html>`;
}
