/**
 * simplyPet: Design-Grundlagen
 * Quelle: FARBPALETTE.md (verbindliche UI-Regeln)
 *
 * Regeln:
 * - Primary = Teal #2E9E83 (fixe App-Farbe, E-70)
 * - Grundton neutral und ruhig, Farben nur als Akzente
 * - Ein reserviertes Signalrot NUR fuer Warnhinweise (nie als Tierfarbe waehlbar)
 * - Kuratierte Palette: unterscheidbar auch in Helligkeit (Rot-Gruen-Schwaeche)
 * - Grosse Schrift als Standard (Zielgruppe 50+)
 *
 * VERBINDLICHE REGEL E-69:
 * Kreuz/Plus (+) in Verbindung mit JEDER Farbe des Gruenspektrums
 * (inkl. Teal, Mint, Lime, Olive, Smaragd, ISO-Gruen) ist STRIKT
 * UNTERSAGT – ausser fuer den Notfallpass.
 * Plus-Zeichen fuer "Hinzufuegen" etc. nur in Schwarz, Grau, Blau etc.
 */

export const colors = {
  background: '#F7F5F0',
  surface: '#FFFFFF',
  textPrimary: '#2B2B2B',
  textSecondary: '#6B6B6B',
  border: '#E2DFD8',
  /** Fixe App-Farbe (E-70). Fuer Buttons, aktive Tabs, Akzente, Header. */
  primary: '#2E9E83',
  primaryLight: '#4DB89A',
  primaryDark: '#1F7A64',
  /** RESERVIERT: nur fuer Warnhinweise, niemals als Tierfarbe vergeben */
  signalRed: '#C62828',
  /**
   * Notfallpass: ISO 7010 E003 (RAL 6032).
   * EINZIGE Stelle in der App wo ein Kreuz/Plus mit Gruen kombiniert wird.
   * Verwendung: Notfall-Tab-Icon, Notfallpass-Notification, Notfallpass-Header.
   */
  emergency: '#237F52',
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
  { key: 'orange', hex: '#C96A2B', label: 'Orange' },
  { key: 'gelb', hex: '#C4A820', label: 'Gelb' },
  { key: 'violett', hex: '#61517A', label: 'Violett' },
  { key: 'petrol', hex: '#225A5A', label: 'Petrol' },
  { key: 'braun', hex: '#A7795E', label: 'Braun' },
  { key: 'rosa', hex: '#B06A8C', label: 'Altrosa' },
  { key: 'grau', hex: '#5F6B6D', label: 'Steingrau' },
  { key: 'nachtblau', hex: '#242D4E', label: 'Nachtblau' },
  { key: 'weiss', hex: '#F0EDE8', label: 'Weiß' },
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
