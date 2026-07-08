/**
 * simplyPet: Tierarten-Konfiguration (14 Arten)
 * Quelle: tierarten_abdeckungskonzept.md (Tierarten-Matrix, belegt via StIKo Vet u.a.)
 *
 * Die Tierart steuert die Fachlogik: Welche Module aktiv sind,
 * welche Begriffe verwendet werden. Kein Impf-Modul fuer Tiere ohne
 * Impfempfehlung (Doktrin: keine sachlich falschen Funktionen).
 */

export type ModuleKey =
  | 'vaccinations' // Impfplan & Erinnerung
  | 'weight' // Gewichtstracking
  | 'teeth' // Zahn-Check
  | 'vitamin_c' // Vitamin-C-Tracking (Meerschweinchen)
  | 'diabetes_watch' // Diabetes-Vorsorge (Degu)
  | 'annual_check' // Jaehrlicher Routine-Check (Voegel)
  | 'cites_docs' // CITES-Nachweise (Reptilien)
  | 'hibernation' // Winterstarre-Zyklus (Reptilien)
  | 'equine_pass' // Equidenpass (Pferd)
  | 'water_values' // Wasserwerte-Tagebuch (Aquaristik)
  | 'stock_list' // Besatz-Liste (Aquaristik)
  | 'maintenance' // Wartungs-Erinnerungen (Aquaristik)
  | 'documents' // Dokumenten-Safe (alle)
  | 'diary'; // Symptom-Tagebuch (alle Landtiere)

export interface SpeciesConfig {
  /** Interner Schluessel, wird in pets.species gespeichert */
  key: string;
  /** Anzeigename (deutsch) */
  label: string;
  /** Aktive Module gemaess Tierarten-Matrix */
  modules: ModuleKey[];
  /** Tierartspezifische Begriffe (z. B. "Vogelkundiger Tierarzt") */
  terminology: { vet: string; nameField?: string };
  /** Plausibler Gewichtsbereich in kg (fuer Warnhinweise, null = kein Tracking) */
  weightRangeKg: [number, number] | null;
  /** Ist die Entitaet ein Behaeltnis statt eines Einzeltiers? */
  isHabitat: boolean;
}

const BASE_MODULES: ModuleKey[] = ['documents', 'diary'];

export const SPECIES_CONFIG: Record<string, SpeciesConfig> = {
  hund: {
    key: 'hund',
    label: 'Hund',
    modules: [...BASE_MODULES, 'vaccinations', 'weight'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.5, 100],
    isHabitat: false,
  },
  katze: {
    key: 'katze',
    label: 'Katze',
    modules: [...BASE_MODULES, 'vaccinations', 'weight'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.5, 15],
    isHabitat: false,
  },
  kaninchen: {
    key: 'kaninchen',
    label: 'Kaninchen',
    modules: [...BASE_MODULES, 'vaccinations', 'weight', 'teeth'],
    terminology: { vet: 'Kaninchenkundiger Tierarzt' },
    weightRangeKg: [0.5, 10],
    isHabitat: false,
  },
  frettchen: {
    key: 'frettchen',
    label: 'Frettchen',
    modules: [...BASE_MODULES, 'vaccinations', 'weight'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.4, 3],
    isHabitat: false,
  },
  meerschweinchen: {
    key: 'meerschweinchen',
    label: 'Meerschweinchen',
    modules: [...BASE_MODULES, 'weight', 'teeth', 'vitamin_c'],
    terminology: { vet: 'Meerschweinchenkundiger Tierarzt' },
    weightRangeKg: [0.3, 2],
    isHabitat: false,
  },
  chinchilla: {
    key: 'chinchilla',
    label: 'Chinchilla',
    modules: [...BASE_MODULES, 'weight', 'teeth'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.3, 1],
    isHabitat: false,
  },
  ratte: {
    key: 'ratte',
    label: 'Ratte',
    modules: [...BASE_MODULES, 'weight', 'teeth'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.15, 0.8],
    isHabitat: false,
  },
  maus: {
    key: 'maus',
    label: 'Maus',
    modules: [...BASE_MODULES, 'weight', 'teeth'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.01, 0.1],
    isHabitat: false,
  },
  degu: {
    key: 'degu',
    label: 'Degu',
    modules: [...BASE_MODULES, 'weight', 'teeth', 'diabetes_watch'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.1, 0.4],
    isHabitat: false,
  },
  hamster: {
    key: 'hamster',
    label: 'Hamster',
    modules: [...BASE_MODULES, 'weight', 'teeth'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: [0.02, 0.25],
    isHabitat: false,
  },
  vogel: {
    key: 'vogel',
    label: 'Ziervogel',
    modules: [...BASE_MODULES, 'weight', 'annual_check'],
    terminology: { vet: 'Vogelkundiger Tierarzt' },
    weightRangeKg: [0.01, 2],
    isHabitat: false,
  },
  reptil: {
    key: 'reptil',
    label: 'Reptil',
    modules: [...BASE_MODULES, 'weight', 'cites_docs', 'hibernation'],
    terminology: { vet: 'Reptilienkundiger Tierarzt' },
    weightRangeKg: [0.01, 100],
    isHabitat: false,
  },
  pferd: {
    key: 'pferd',
    label: 'Pferd',
    modules: [...BASE_MODULES, 'vaccinations', 'teeth', 'equine_pass'],
    terminology: { vet: 'Tierarzt' },
    weightRangeKg: null, // kaum wiegbar, kein Standard-Tracking
    isHabitat: false,
  },
  aquarium: {
    key: 'aquarium',
    label: 'Aquarium',
    modules: ['documents', 'water_values', 'stock_list', 'maintenance'],
    terminology: { vet: 'Fischtierarzt', nameField: 'Becken-Bezeichnung' },
    weightRangeKg: null,
    isHabitat: true, // Das Behaeltnis ist die Entitaet, nicht der Fisch
  },
};

export const SPECIES_LIST = Object.values(SPECIES_CONFIG);

export function getSpeciesConfig(key: string): SpeciesConfig | undefined {
  return SPECIES_CONFIG[key];
}
