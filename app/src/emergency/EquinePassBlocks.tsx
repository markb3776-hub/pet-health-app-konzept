/**
 * simplyPet: Pferde-spezifische Notfallpass-Bloecke (E-80)
 *
 * Wird NUR gerendert wenn species === 'pferd'.
 * Ersetzt/ergaenzt die generischen Bloecke mit pferdespezifischen Informationen:
 * - Erkennungsmerkmale: + Equidenpass-Nr., Abzeichen, Brand
 * - Vorerkrankungen: + Kolik-Vorgeschichte
 * - Parasitenschutz: + letzte Kotprobe (EpG)
 * - Letzte bekannte Werte: geschaetztes Gewicht (Massband) statt Waage
 * - Kontakt: + Stallkontakt, Hufschmied
 * - NEU: Haltung (Box/Offenstall/Weide)
 */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { PassData } from './passData';
import { formatDate } from '../time/timeModule';
import { colors, typography, spacing } from '../theme/theme';

interface Props {
  data: PassData;
  /** Die generische Section-Komponente aus EmergencyPassScreen (fuer einheitliches Layout). */
  Section: React.FC<{
    title: string;
    helpKey?: string;
    onHelp?: (key: string) => void;
    children: React.ReactNode;
  }>;
  setHelpVisible: (key: string) => void;
}

/**
 * Pferde-spezifische Erkennungsmerkmale-Section.
 * Ergaenzt die generische um Equidenpass-Nr., Abzeichen, Brand.
 */
function EquineIdentSection({ data, Section, setHelpVisible }: Props) {
  const pet = data.pet;
  const eq = data.equineData;
  return (
    <Section
      title="Besondere Erkennungsmerkmale"
      helpKey="erkennungsmerkmale"
      onHelp={setHelpVisible}
    >
      {eq?.passNumber ? (
        <Text style={styles.body}>Equidenpass-Nr.: {eq.passNumber}</Text>
      ) : (
        <Text style={styles.bodyMuted}>Keine Equidenpass-Nr. erfasst</Text>
      )}
      {pet.chip_number ? (
        <Text style={styles.body}>Chip: {pet.chip_number}</Text>
      ) : (
        <Text style={styles.bodyMuted}>Keine Chip-Nummer erfasst</Text>
      )}
      {eq?.brand ? <Text style={styles.body}>Brand: {eq.brand}</Text> : null}
      {eq?.markings ? (
        <Text style={styles.body}>Abzeichen: {eq.markings}</Text>
      ) : null}
      {pet.coat_color ? (
        <Text style={styles.body}>Farbe: {pet.coat_color}</Text>
      ) : null}
      {pet.special_features?.trim() ? (
        <Text style={styles.body}>{pet.special_features}</Text>
      ) : (
        <Text style={styles.bodyMuted}>Keine weiteren Merkmale erfasst</Text>
      )}
    </Section>
  );
}

/**
 * Pferde-spezifische Vorerkrankungen-Section.
 * Ergaenzt um Kolik-Vorgeschichte (im Notfall kritisch!).
 */
function EquineConditionsSection({ data, Section, setHelpVisible }: Props) {
  const eq = data.equineData;
  return (
    <Section title="Vorerkrankungen" helpKey="vorerkrankungen" onHelp={setHelpVisible}>
      {eq?.colicHistory ? (
        <View style={styles.colicBlock}>
          <Text style={styles.colicLabel}>Kolik-Vorgeschichte:</Text>
          <Text style={styles.body}>{eq.colicHistory}</Text>
        </View>
      ) : (
        <Text style={styles.bodyMuted}>Keine Kolik-Vorgeschichte bekannt</Text>
      )}
      {data.conditions.length ? (
        data.conditions.map((c, i) => (
          <Text key={i} style={styles.body}>
            {c.name}
          </Text>
        ))
      ) : (
        <Text style={styles.bodyMuted}>Keine weiteren Vorerkrankungen erfasst</Text>
      )}
    </Section>
  );
}

/**
 * Pferde-spezifischer Parasitenschutz-Block.
 * Zeigt letzte Kotprobe (EpG) + regulaere Parasitenschutz-Eintraege.
 */
function EquineParasiteSection({ data, Section, setHelpVisible }: Props) {
  const eq = data.equineData;
  const fecal = eq?.lastFecalSample;
  return (
    <Section title="Parasitenschutz" helpKey="parasitenschutz" onHelp={setHelpVisible}>
      {fecal ? (
        <View style={styles.fecalBlock}>
          <Text style={styles.body}>
            Letzte Kotprobe: {formatDate(fecal.date)}
            {fecal.epg_value != null ? ` – ${fecal.epg_value} EpG` : ''}
          </Text>
          {fecal.epg_value != null && fecal.epg_value >= 200 ? (
            <Text style={styles.bodyWarn}>Entwurmung empfohlen (ab 200 EpG)</Text>
          ) : fecal.epg_value != null ? (
            <Text style={styles.bodyGood}>Unter Schwellenwert – keine Entwurmung noetig</Text>
          ) : null}
        </View>
      ) : (
        <Text style={styles.bodyMuted}>Keine Kotprobe erfasst</Text>
      )}
      {data.parasiteProtection.length ? (
        data.parasiteProtection.map((p, i) => (
          <Text key={i} style={styles.body}>
            {p.name}
            {p.sub_type ? ` (${p.sub_type})` : ''}
            {p.active_since ? ` – seit ${formatDate(p.active_since)}` : ''}
          </Text>
        ))
      ) : null}
    </Section>
  );
}

/**
 * Pferde-spezifische "Letzte bekannte Werte"-Section.
 * Geschaetztes Gewicht (Massband) statt Waagen-Gewicht.
 */
function EquineValuesSection({ data, Section, setHelpVisible }: Props) {
  const eq = data.equineData;
  return (
    <Section title="Letzte bekannte Werte" helpKey="werte" onHelp={setHelpVisible}>
      {eq?.estimatedWeightKg ? (
        <Text style={styles.body}>
          Geschaetztes Gewicht: ca. {String(eq.estimatedWeightKg).replace('.', ',')} kg
          {eq.weightDate ? ` (${formatDate(eq.weightDate)})` : ''}
        </Text>
      ) : (
        <Text style={styles.bodyMuted}>Kein geschaetztes Gewicht erfasst</Text>
      )}
      {data.lastWeight ? (
        <Text style={styles.body}>
          Gewogen: {String(data.lastWeight.value).replace('.', ',')} {data.lastWeight.unit} (
          {formatDate(data.lastWeight.date)})
        </Text>
      ) : null}
    </Section>
  );
}

/**
 * Pferde-spezifischer Kontakt-Block.
 * Ergaenzt um Stallkontakt und Hufschmied.
 */
function EquineContactSection({ data, Section }: Props) {
  const eq = data.equineData;
  return (
    <Section title="Kontakt">
      <Text style={data.ownerName ? styles.body : styles.bodyMuted}>
        Halter: {data.ownerName ?? 'Nicht erfasst'}
        {data.ownerPhone ? ` · Tel. ${data.ownerPhone}` : ''}
      </Text>
      <Text style={data.pet.vet_practice_name ? styles.body : styles.bodyMuted}>
        Tierarzt: {data.pet.vet_practice_name ?? 'Nicht erfasst'}
        {data.pet.vet_practice_phone ? ` · Tel. ${data.pet.vet_practice_phone}` : ''}
      </Text>
      {eq?.stableName ? (
        <Text style={styles.body}>
          Stall: {eq.stableName}
          {eq.boxNumber ? ` (Box ${eq.boxNumber})` : ''}
          {eq.stablePhone ? ` · Tel. ${eq.stablePhone}` : ''}
        </Text>
      ) : (
        <Text style={styles.bodyMuted}>Kein Stallkontakt erfasst</Text>
      )}
      {eq?.farrierName ? (
        <Text style={styles.body}>
          Hufschmied: {eq.farrierName}
          {eq.farrierPhone ? ` · Tel. ${eq.farrierPhone}` : ''}
        </Text>
      ) : (
        <Text style={styles.bodyMuted}>Kein Hufschmied erfasst</Text>
      )}
    </Section>
  );
}

/**
 * Pferde-spezifischer Haltungs-Block (NEU).
 * Box/Offenstall/Weide-Info fuer den Notfall-Tierarzt.
 */
function EquineHousingSection({ data, Section }: Props) {
  const eq = data.equineData;
  if (!eq?.housingType && !eq?.boxNumber) return null;
  return (
    <Section title="Haltung">
      {eq.housingType ? (
        <Text style={styles.body}>Haltungsform: {eq.housingType}</Text>
      ) : null}
      {eq.boxNumber ? (
        <Text style={styles.body}>Box/Paddock: {eq.boxNumber}</Text>
      ) : null}
    </Section>
  );
}

/**
 * Haupt-Export: Alle pferdespezifischen Bloecke zusammen.
 * Wird im EmergencyPassScreen statt der generischen medicalBlocks gerendert.
 *
 * Reihenfolge:
 * 1. Erkennungsmerkmale (mit Equidenpass, Abzeichen, Brand)
 * 2. Allergien (generisch – bleibt gleich)
 * 3. Vorerkrankungen (+ Kolik-Vorgeschichte)
 * 4. Dauermedikation (generisch – bleibt gleich)
 * 5. Impfstatus (generisch – bleibt gleich)
 * 6. Parasitenschutz (+ Kotprobe/EpG)
 * 7. Letzte bekannte Werte (geschaetztes Gewicht)
 * 8. Haltung (Box/Offenstall/Weide)
 * 9. Kontakt (+ Stall, Hufschmied)
 */
export function EquinePassBlocks({ data, Section, setHelpVisible }: Props) {
  return (
    <>
      <EquineIdentSection data={data} Section={Section} setHelpVisible={setHelpVisible} />

      <Section title="Allergien und Unvertraeglichkeiten" helpKey="allergien" onHelp={setHelpVisible}>
        {data.allergies.length ? (
          data.allergies.map((a, i) => (
            <Text key={i} style={styles.body}>
              {a.name}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Allergien erfasst</Text>
        )}
      </Section>

      <EquineConditionsSection data={data} Section={Section} setHelpVisible={setHelpVisible} />

      <Section title="Dauermedikation" helpKey="dauermedikation" onHelp={setHelpVisible}>
        {data.medications.length ? (
          data.medications.map((m, i) => (
            <Text key={i} style={styles.body}>
              {m.name}
              {m.dosage ? ` – ${m.dosage}` : ''}
              {m.active_since ? ` (seit ${formatDate(m.active_since)})` : ''}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Dauermedikation erfasst</Text>
        )}
      </Section>

      <Section title="Impfstatus" helpKey="impfstatus" onHelp={setHelpVisible}>
        {data.vaccinations.length ? (
          data.vaccinations.map((v, i) => (
            <Text key={i} style={styles.body}>
              {v.disease ?? v.product_name ?? 'Impfung'} – {formatDate(v.date_given)}
              {v.valid_until ? ` (gueltig bis ${formatDate(v.valid_until)})` : ''}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Impfungen erfasst</Text>
        )}
      </Section>

      <EquineParasiteSection data={data} Section={Section} setHelpVisible={setHelpVisible} />
      <EquineValuesSection data={data} Section={Section} setHelpVisible={setHelpVisible} />
      <EquineHousingSection data={data} Section={Section} setHelpVisible={setHelpVisible} />
      <EquineContactSection data={data} Section={Section} setHelpVisible={setHelpVisible} />
    </>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: typography.body, color: colors.textPrimary, marginBottom: 2 },
  bodyMuted: { fontSize: typography.body, color: colors.textSecondary, fontStyle: 'italic' },
  bodyWarn: { fontSize: typography.bodySmall, color: '#B8860B', marginTop: 2 },
  bodyGood: { fontSize: typography.bodySmall, color: colors.primary, marginTop: 2 },
  colicBlock: { marginBottom: spacing.xs },
  colicLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fecalBlock: { marginBottom: spacing.xs },
});
