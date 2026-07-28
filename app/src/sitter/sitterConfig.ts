/**
 * simplyPet: Sitter-Modus – Tierartspezifische Checklisten (E-105)
 * Quelle: SITTER_MODUS_SPEZIFIKATION.md
 *
 * Jede Tiergruppe hat eine Liste von Kategorien mit Checkpunkten,
 * die der Halter fuer den Sitter ausfuellen/anpassen kann.
 */

export interface ChecklistCategory {
  title: string;
  items: string[];
}

/** Grundlegende Kategorien die fuer ALLE Tierarten gelten. */
export const BASE_CHECKLIST: ChecklistCategory[] = [
  {
    title: 'Fütterung',
    items: [
      'Futterzeiten',
      'Futtermenge / Portionsgröße',
      'Standort des Futters',
      'Erlaubte Leckerlis',
      'Verbotene Lebensmittel',
    ],
  },
  {
    title: 'Medizinisches',
    items: [
      'Aktuelle Medikamente (Name, Dosierung, Uhrzeit)',
      'Lagerort der Medikamente',
      'Bekannte Allergien',
      'Vorerkrankungen',
    ],
  },
  {
    title: 'Notfallkontakte',
    items: [
      'Tierarzt (Name, Adresse, Telefon)',
      'Nächste Tierklinik (24/7)',
      'Giftnotruf',
      'Erreichbarkeit des Halters im Urlaub',
      'Alternativkontakt (Nachbar/Verwandter)',
    ],
  },
];

/** Artspezifische Zusatz-Checklisten. */
export const SPECIES_CHECKLISTS: Record<string, ChecklistCategory[]> = {
  hund: [
    {
      title: 'Gassi-Routine',
      items: [
        'Häufigkeit und Dauer',
        'Bevorzugte Routen / Parks',
        'Leinenpflicht (ja/nein)',
        'Rückruf-Zuverlässigkeit',
        'Verhalten bei Begegnung mit anderen Hunden',
      ],
    },
    {
      title: 'Verhalten & Eigenheiten',
      items: [
        'Verträglichkeit mit anderen Hunden/Menschen/Kindern',
        'Ängste (z.B. Gewitter, Staubsauger, Feuerwerk)',
        'Verhalten beim Alleinbleiben',
        'Tabuzonen im Haus (Sofa, Bett etc.)',
      ],
    },
    {
      title: 'Ausstattung',
      items: [
        'Standort: Leine, Halsband/Geschirr',
        'Standort: Kotbeutel',
        'Handtücher (nasse Pfoten)',
        'Lieblingsspielzeug',
      ],
    },
  ],
  katze: [
    {
      title: 'Katzentoilette',
      items: [
        'Standort(e)',
        'Reinigungshäufigkeit',
        'Streu-Sorte und Entsorgung',
      ],
    },
    {
      title: 'Freigang',
      items: [
        'Wohnungskatze oder Freigänger?',
        'Zeiten für Freigang',
        'Bedienung der Katzenklappe',
        'Verhalten bei Rückkehr (Beute?)',
      ],
    },
    {
      title: 'Verhalten & Eigenheiten',
      items: [
        'Bevorzugte Verstecke',
        'Spielgewohnheiten',
        'Kratzgewohnheiten',
        'Trinkverhalten (Trinkbrunnen?)',
      ],
    },
  ],
  reptil: [
    {
      title: 'Klima-Management (KRITISCH)',
      items: [
        'Temperatur Tag/Nacht (Wärmespots)',
        'Luftfeuchtigkeit (Sollwert)',
        'Beleuchtungszeiten (UVB)',
        'Bedienung: Zeitschaltuhren / Thermostate',
        'Beregnungsanlage (falls vorhanden)',
      ],
    },
    {
      title: 'Fütterung (artspezifisch)',
      items: [
        'Fütterungsintervall (z.B. alle 3 Tage)',
        'Art des Futters (Lebendfutter/Frostfutter/Grünzeug)',
        'Supplementierung (Calcium/Vitamine)',
      ],
    },
    {
      title: 'Handling & Hygiene',
      items: [
        'Warnhinweise (z.B. nicht anfassen)',
        'Häutungsphasen erkennen',
        'Reinigung Wasserschale',
        'Entfernung Kot/Futterreste',
      ],
    },
  ],
  fisch: [
    {
      title: 'Fütterung (VORSICHT: Überfütterung!)',
      items: [
        'Genaue Dosierung (vorportioniert?)',
        'Fütterungshäufigkeit',
        'Futter-Standort',
      ],
    },
    {
      title: 'Technik-Check',
      items: [
        'Filter: Durchfluss prüfen',
        'Heizstab: Temperatur kontrollieren',
        'Beleuchtung: Zeitschaltuhr',
        'CO2-Anlage (falls vorhanden)',
      ],
    },
    {
      title: 'Wasserpflege & Beobachtung',
      items: [
        'Wasserwechsel (wann, wie viel)',
        'Wasseraufbereiter / Dünger',
        'Sichtkontrolle: tote Fische, Krankheitszeichen',
        'Algenwachstum beobachten',
      ],
    },
  ],
  vogel: [
    {
      title: 'Käfig & Freiflug',
      items: [
        'Reinigungsintervalle (Bodengrund, Sitzstangen)',
        'Freiflug: Dauer und Zeiten',
        'Fenstersicherung!',
        'Gefahrenquellen im Raum',
      ],
    },
    {
      title: 'Soziale Interaktion',
      items: [
        'Ansprache / Beschäftigung',
        'Bevorzugte Spielzeuge',
        'Radio/TV anlassen?',
        'Käfig nachts abdecken?',
      ],
    },
    {
      title: 'Sicherheit',
      items: [
        'Zugluft vermeiden',
        'KEIN Teflon / Duftkerzen (giftig!)',
        'Trinkwasser täglich wechseln',
      ],
    },
  ],
  pferd: [
    {
      title: 'Fütterung',
      items: [
        'Heurationen (Menge, Heunetz?)',
        'Kraftfutter (Sorte, Menge, Zeiten)',
        'Zusatzfutter / Medikamente',
      ],
    },
    {
      title: 'Haltung & Bewegung',
      items: [
        'Weide-/Paddockzeiten',
        'Wer bringt raus / holt rein?',
        'Eindecken: welche Decke bei welchem Wetter?',
        'Bewegungsprogramm (Longieren, Führmaschine)',
      ],
    },
    {
      title: 'Stallmanagement',
      items: [
        'Misten: Häufigkeit, Einstreuart',
        'Tränkenkontrolle (Frostschutz im Winter?)',
        'Kontakt Hufschmied',
        'Kolikanzeichen erkennen',
      ],
    },
  ],
  kaninchen: [
    {
      title: 'Gehege & Auslauf',
      items: [
        'Reinigungsintervalle (Kotecken täglich)',
        'Komplettreinigung (wann?)',
        'Freilauf: Dauer, gesicherte Bereiche',
      ],
    },
    {
      title: 'Sozialverhalten & Handling',
      items: [
        'Warnung: Richtiges Hochheben!',
        'Stressvermeidung',
        'Verträglichkeit mit anderen Tieren',
      ],
    },
    {
      title: 'Gesundheitsbeobachtung',
      items: [
        'Fressverhalten kontrollieren (Einstellung = NOTFALL!)',
        'Kotbeschaffenheit prüfen',
        'Heu muss IMMER verfügbar sein',
        'Täglicher Wasserwechsel',
      ],
    },
  ],
};

/** Mapping: species-Feld in DB → Checklist-Key */
export const SPECIES_TO_KEY: Record<string, string> = {
  hund: 'hund',
  katze: 'katze',
  reptil: 'reptil',
  schildkroete: 'reptil',
  schlange: 'reptil',
  gecko: 'reptil',
  leguan: 'reptil',
  fisch: 'fisch',
  vogel: 'vogel',
  wellensittich: 'vogel',
  papagei: 'vogel',
  kanarienvogel: 'vogel',
  pferd: 'pferd',
  pony: 'pferd',
  kaninchen: 'kaninchen',
  meerschweinchen: 'kaninchen',
  hamster: 'kaninchen',
  maus: 'kaninchen',
  ratte: 'kaninchen',
  chinchilla: 'kaninchen',
  degu: 'kaninchen',
};

/**
 * Liefert die vollstaendige Checkliste fuer eine Tierart:
 * Basis-Kategorien + artspezifische Kategorien.
 */
export function getChecklistForSpecies(species: string): ChecklistCategory[] {
  const key = SPECIES_TO_KEY[species.toLowerCase()] ?? null;
  const specific = key ? SPECIES_CHECKLISTS[key] ?? [] : [];
  return [...BASE_CHECKLIST, ...specific];
}
