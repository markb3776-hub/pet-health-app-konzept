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
 * Bewusst OHNE das reservierte Signalrot.
 *
 * KORRIGIERT in Teilauftrag 4.4 (interne Pruefung, 09.07.2026):
 * Die urspruengliche Palette fiel im Graustufen-Test (Violett/Braun
 * quasi-identische Helligkeit) und im Deuteranopie-Test (Blau/Violett
 * verschmolzen). Die neue Palette besteht alle vier Release-Kriterien
 * aus dem Strukturkonzept Abschnitt 7:
 * 1. Graustufen: paarweiser Luminanz-Abstand > 0.015
 * 2. Rot-Gruen-Schwaeche: Distanz nach Deuteranopie-Simulation > 25
 * 3. Weisser Text auf Kennfarbe: WCAG-Kontrast >= 3:1
 * 4. Abstand zum Signalrot #C62828 > 60 (nie verwechselbar)
 * Nachweis: pruefprotokoll_teilauftrag_4_4.md im Konzept-Repo.
 */
export const petColorPalette: { key: string; hex: string; label: string }[] = [
  { key: 'blau', hex: '#2F6495', label: 'Blau' },
  { key: 'gruen', hex: '#365233', label: 'Grün' },
  { key: 'gold', hex: '#B98A2F', label: 'Gold' },
  { key: 'violett', hex: '#61517A', label: 'Violett' },
  { key: 'petrol', hex: '#225A5A', label: 'Petrol' },
  { key: 'braun', hex: '#A7795E', label: 'Braun' },
  { key: 'rosa', hex: '#B06A8C', label: 'Altrosa' },
  { key: 'grau', hex: '#5F6B6D', label: 'Steingrau' },
  { key: 'oliv', hex: '#7A7C39', label: 'Oliv' },
  { key: 'nachtblau', hex: '#242D4E', label: 'Nachtblau' },
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
