/**
 * simplyPet: Design-Grundlagen
 * Quelle: app_struktur_konzept.md (Abschnitt 5: Farbsystem)
 *
 * Regeln:
 * - Grundton neutral und ruhig, Farben nur als Akzente
 * - Ein reserviertes Signalrot NUR fuer Warnhinweise (nie als Tierfarbe waehlbar)
 * - Kuratierte Palette: unterscheidbar auch in Helligkeit (Rot-Gruen-Schwaeche)
 * - Grosse Schrift als Standard (Zielgruppe 50+)
 */

export const colors = {
  background: '#F7F5F0',
  surface: '#FFFFFF',
  textPrimary: '#2B2B2B',
  textSecondary: '#6B6B6B',
  border: '#E2DFD8',
  primary: '#3E6B4F', // ruhiges Gruen
  /** RESERVIERT: nur fuer Warnhinweise, niemals als Tierfarbe vergeben */
  signalRed: '#C62828',
  emergency: '#B4532A', // Notfallpass-Knopf: ruhig aber unuebersehbar
};

/**
 * Kuratierte Tierfarben-Palette (frei waehlbar pro Tier).
 * Bewusst OHNE das reservierte Signalrot. Farben unterscheiden sich
 * auch in der Helligkeit (Graustufen-Test ist Release-Kriterium).
 */
export const petColorPalette: { key: string; hex: string; label: string }[] = [
  { key: 'blau', hex: '#3D6B9E', label: 'Blau' },
  { key: 'gruen', hex: '#4E7C4E', label: 'Grün' },
  { key: 'gold', hex: '#B98A2F', label: 'Gold' },
  { key: 'violett', hex: '#6D5B93', label: 'Violett' },
  { key: 'petrol', hex: '#2E7D7B', label: 'Petrol' },
  { key: 'braun', hex: '#8A5A3B', label: 'Braun' },
  { key: 'rosa', hex: '#B06A8C', label: 'Altrosa' },
  { key: 'grau', hex: '#5F6B6D', label: 'Steingrau' },
  { key: 'oliv', hex: '#7A7C39', label: 'Oliv' },
  { key: 'nachtblau', hex: '#2F3D5C', label: 'Nachtblau' },
];

export const typography = {
  /** Grosse Grundschrift fuer Zielgruppe 50+ */
  body: 18,
  bodySmall: 16,
  title: 24,
  headline: 30,
  button: 20,
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

/** Mindest-Touchflaeche (Bedienbarkeit, Zielgruppe 50+) */
export const minTouchTarget = 48;
