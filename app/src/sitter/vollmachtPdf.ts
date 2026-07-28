/**
 * simplyPet: Sitter-Modus – Tierarzt-Vollmacht PDF (E-105)
 *
 * Generiert ein HTML-Dokument fuer expo-print, das als PDF exportiert wird.
 * Enthält: Halter-Daten, Sitter-Daten, Tier, Zeitraum, Berechtigung,
 * Unterschrift (Base64-PNG), QR-Code mit Klartext-Daten.
 */

/** HTML-Escaping fuer Nutzereingaben. */
function esc(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface VollmachtData {
  ownerName: string;
  ownerPhone: string;
  sitterName: string;
  sitterPhone: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  periodFrom: string;
  periodTo: string;
  vetName: string;
  vetPhone: string;
  signatureBase64: string | null;
  qrDataUri: string | null;
}

/** Klartext-Payload fuer den QR-Code auf der Vollmacht. */
export function buildVollmachtQrPayload(d: VollmachtData): string {
  const lines = [
    `TIERARZT-VOLLMACHT`,
    `Halter: ${d.ownerName} (${d.ownerPhone})`,
    `Sitter: ${d.sitterName} (${d.sitterPhone})`,
    `Tier: ${d.petName} (${d.petSpecies}${d.petBreed ? ', ' + d.petBreed : ''})`,
    `Zeitraum: ${d.periodFrom} bis ${d.periodTo}`,
    `Tierarzt: ${d.vetName} (${d.vetPhone})`,
    `Berechtigung: Notfallbehandlung + Kostenübernahme`,
  ];
  return lines.join('\n');
}

/** Vollstaendiges HTML fuer die Vollmacht (A4-tauglich). */
export function buildVollmachtHtml(d: VollmachtData): string {
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<style>
  body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #1a1a1a; font-size: 14px; line-height: 1.6; }
  h1 { text-align: center; font-size: 22px; margin-bottom: 4px; }
  .subtitle { text-align: center; color: #555; margin-bottom: 24px; font-size: 13px; }
  .section { margin-bottom: 16px; }
  .section-title { font-weight: 700; font-size: 15px; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  td { padding: 4px 8px; vertical-align: top; }
  td.label { font-weight: 600; width: 160px; color: #333; }
  .auth-box { border: 2px solid #333; padding: 16px; border-radius: 8px; margin: 20px 0; background: #f9f9f9; }
  .auth-text { font-size: 13px; line-height: 1.7; }
  .sig-area { margin-top: 24px; display: flex; align-items: flex-end; gap: 24px; }
  .sig-img { max-width: 240px; max-height: 80px; }
  .sig-line { border-bottom: 1px solid #333; width: 240px; margin-top: 60px; }
  .sig-label { font-size: 11px; color: #555; margin-top: 4px; }
  .footer { margin-top: 32px; display: flex; justify-content: space-between; align-items: flex-end; }
  .qr { text-align: right; }
  .qr img { width: 100px; height: 100px; }
  .date { font-size: 12px; color: #555; }
</style>
</head>
<body>
<h1>Tierarzt-Vollmacht</h1>
<p class="subtitle">Berechtigung zur tierärztlichen Notfallbehandlung</p>

<div class="section">
  <div class="section-title">Tierhalter/in</div>
  <table>
    <tr><td class="label">Name:</td><td>${esc(d.ownerName)}</td></tr>
    <tr><td class="label">Telefon:</td><td>${esc(d.ownerPhone)}</td></tr>
  </table>
</div>

<div class="section">
  <div class="section-title">Bevollmächtigte/r (Tiersitter)</div>
  <table>
    <tr><td class="label">Name:</td><td>${esc(d.sitterName)}</td></tr>
    <tr><td class="label">Telefon:</td><td>${esc(d.sitterPhone)}</td></tr>
  </table>
</div>

<div class="section">
  <div class="section-title">Tier</div>
  <table>
    <tr><td class="label">Name:</td><td>${esc(d.petName)}</td></tr>
    <tr><td class="label">Art / Rasse:</td><td>${esc(d.petSpecies)}${d.petBreed ? ' / ' + esc(d.petBreed) : ''}</td></tr>
  </table>
</div>

<div class="section">
  <div class="section-title">Zeitraum</div>
  <table>
    <tr><td class="label">Von:</td><td>${esc(d.periodFrom)}</td></tr>
    <tr><td class="label">Bis:</td><td>${esc(d.periodTo)}</td></tr>
  </table>
</div>

<div class="section">
  <div class="section-title">Tierarztpraxis</div>
  <table>
    <tr><td class="label">Praxis:</td><td>${esc(d.vetName)}</td></tr>
    <tr><td class="label">Telefon:</td><td>${esc(d.vetPhone)}</td></tr>
  </table>
</div>

<div class="auth-box">
  <p class="auth-text">
    Hiermit bevollmächtige ich, <strong>${esc(d.ownerName)}</strong>, die oben genannte Person
    (<strong>${esc(d.sitterName)}</strong>), im oben genannten Zeitraum alle notwendigen
    tierärztlichen Behandlungen für mein Tier <strong>${esc(d.petName)}</strong> zu veranlassen
    und in meinem Namen zu genehmigen. Die anfallenden Kosten übernehme ich als Tierhalter/in.
  </p>
</div>

<div class="footer">
  <div>
    ${d.signatureBase64 ? `<img class="sig-img" src="${d.signatureBase64}" alt="Unterschrift"/>` : '<div class="sig-line"></div>'}
    <div class="sig-label">Unterschrift Tierhalter/in</div>
    <div class="date">Datum: ${dateStr}</div>
  </div>
  ${d.qrDataUri ? `<div class="qr"><img src="${d.qrDataUri}" alt="QR"/><div class="sig-label">QR-Code (Vollmacht-Daten)</div></div>` : ''}
</div>

</body>
</html>`;
}
