/**
 * simplyPet: Stammdaten bearbeiten (Teilauftrag 4.2)
 * Quelle: Screen-Flow 2.3 (Tierakte, Stift-Symbol auf der Passkarte).
 *
 * Alle Stammdaten des Tieres bearbeiten: Name, Rasse, Geschlecht,
 * Geburtsdatum, Kastration, Chip-Nummer (15-stellig, mit ehrlichem Hinweis
 * statt harter Sperre), Besonderheiten, Spezialisten-Tierarzt, Foto, Farbe.
 * Die Tierart selbst ist NICHT aenderbar (sie bestimmt die Aktenstruktur;
 * ehrlicher Hinweis im Formular).
 *
 * Eingabe-Stabilitaet: Draft-Schutz pro Tier (edit_pet_<id>), Zurueck-Geste
 * fragt nach, UPDATE ist atomar mit sichtbarer Bestaetigung, updated_at und
 * is_synced=0 werden gesetzt (Sync-Vorbereitung).
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
// ImagePicker jetzt via shared Helper (./utils/imagePicker)
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { colors, typography, spacing, minTouchTarget, petColorPalette } from '../theme/theme';
import DateField from '../components/DateField';
import { FieldLabel, Hint, SaveButton, ChoiceChips } from '../components/FormParts';
import { nowUtcIso } from '../time/timeModule';
import {
  loadDraft,
  clearDraft,
  useDraftAutosave,
  useUnsavedChangesGuard,
  offerDraftResume,
} from '../drafts/draftStore';

interface PetRow {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  castration_status: string | null;
  castration_date: string | null;
  chip_number: string | null;
  color_theme: string | null;
  photo_uri: string | null;
  special_features: string | null;
  specialist_vet_name: string | null;
  specialist_vet_phone: string | null;
  coat_color: string | null;
  vet_practice_name: string | null;
  vet_practice_phone: string | null;
  allergies: string | null;
  pre_conditions: string | null;
  // E-80: Pferde-spezifische Felder (Migration 005)
  equine_pass_number: string | null;
  equine_housing_type: string | null;
  equine_colic_history: string | null;
  equine_estimated_weight_kg: number | null;
  equine_stable_name: string | null;
  equine_stable_phone: string | null;
  equine_box_number: string | null;
  equine_farrier_name: string | null;
  equine_farrier_phone: string | null;
}

interface EditPetDraft {
  name: string;
  breed: string;
  gender: string | null;
  birthDate: string | null;
  castration: string | null;
  castrationDate: string | null;
  chipNumber: string;
  colorHex: string;
  photoUri: string | null;
  specialFeatures: string;
  allergies: string;
  preConditions: string;
  vetName: string;
  vetPhone: string;
  coatColor: string;
  practiceName: string;
  practicePhone: string;
  // E-86: Aquarium-spezifisch
  aquariumType: string | null;
  aquariumVolume: string;
  setupDate: string | null;
  // E-80: Pferde-spezifisch
  equinePassNumber: string;
  equineHousingType: string | null;
  equineColicHistory: string;
  equineEstimatedWeight: string;
  equineStableName: string;
  equineStablePhone: string;
  equineBoxNumber: string;
  equineFarrierName: string;
  equineFarrierPhone: string;
}

const GENDER_OPTIONS = ['Männlich', 'Weiblich', 'Unbekannt'];
const CASTRATION_OPTIONS = ['Kastriert', 'Sterilisiert', 'Nein', 'Unbekannt'];
const EQUINE_HOUSING_OPTIONS = ['Box', 'Offenstall', 'Weide', 'Paddock'];

/** E-84: Artspezifisches Label für Fellfarbe/Zeichnung */
function getCoatLabel(species: string): string {
  switch (species) {
    case 'reptil': return 'Hautfarbe / Musterung (optional)';
    case 'ziervogel': return 'Gefiederfarbe / Zeichnung (optional)';
    case 'pferd': return 'Fellfarbe / Abzeichen (optional)';
    default: return 'Fellfarbe / Zeichnung (optional)';
  }
}

/** E-84: Artspezifischer Platzhalter */
function getCoatPlaceholder(species: string): string {
  switch (species) {
    case 'reptil': return 'z. B. grün, gestreift, gefleckt';
    case 'ziervogel': return 'z. B. grün-gelb, blau, gescheckt';
    case 'pferd': return 'z. B. Fuchs, Blesse, Socken';
    default: return 'z. B. schwarz-weiß, getigert, dreifarbig';
  }
}

/** E-87: Artspezifisches Label für Chip-/Ring-Nummer */
function getChipLabel(species: string): string {
  switch (species) {
    case 'ziervogel': return 'Ring-/Chip-Nummer (optional)';
    default: return 'Chip-Nummer (optional)';
  }
}

/** E-87: Artspezifischer Platzhalter für Chip-/Ring-Nummer */
function getChipPlaceholder(species: string): string {
  switch (species) {
    case 'ziervogel': return 'Ringnummer oder Transponder-Nummer';
    case 'reptil': return 'Optional – bei Meldepflicht empfohlen';
    case 'pferd': return '15-stellig, steht im Equidenpass';
    default: return '15-stellige Transponder-Nummer';
  }
}

/** E-87: Chip-Feld bei Kleinnagern ausblenden */
const CHIP_HIDDEN_SPECIES = ['meerschweinchen', 'chinchilla', 'ratte', 'maus', 'degu', 'hamster'];

function petToDraft(p: PetRow): EditPetDraft {
  return {
    name: p.name,
    breed: p.breed ?? '',
    gender: p.gender,
    birthDate: p.birth_date,
    castration: p.castration_status,
    castrationDate: p.castration_date,
    chipNumber: p.chip_number ?? '',
    colorHex: p.color_theme ?? petColorPalette[0].hex,
    photoUri: p.photo_uri,
    specialFeatures: p.special_features ?? '',
    allergies: p.allergies ?? '',
    preConditions: p.pre_conditions ?? '',
    vetName: p.specialist_vet_name ?? '',
    vetPhone: p.specialist_vet_phone ?? '',
    coatColor: p.coat_color ?? '',
    practiceName: p.vet_practice_name ?? '',
    practicePhone: p.vet_practice_phone ?? '',
    // E-86: Aquarium
    aquariumType: (p as any).aquarium_type ?? null,
    aquariumVolume: (p as any).aquarium_volume_liters?.toString() ?? '',
    setupDate: (p as any).setup_date ?? null,
    // E-80: Pferde
    equinePassNumber: p.equine_pass_number ?? '',
    equineHousingType: p.equine_housing_type ?? null,
    equineColicHistory: p.equine_colic_history ?? '',
    equineEstimatedWeight: p.equine_estimated_weight_kg?.toString() ?? '',
    equineStableName: p.equine_stable_name ?? '',
    equineStablePhone: p.equine_stable_phone ?? '',
    equineBoxNumber: p.equine_box_number ?? '',
    equineFarrierName: p.equine_farrier_name ?? '',
    equineFarrierPhone: p.equine_farrier_phone ?? '',
  };
}

export default function EditPetScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const petId = (route.params as { petId: string }).petId;
  const draftKey = `edit_pet_${petId}`;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [original, setOriginal] = useState<EditPetDraft | null>(null);
  const [species, setSpecies] = useState<string>('');
  const [form, setForm] = useState<EditPetDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const speciesCfg = getSpeciesConfig(species);
  const isHabitat = speciesCfg?.isHabitat === true;

  // Tier laden, dann ggf. Entwurf anbieten.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const db = await getDb();
        const row = await db.getFirstAsync<PetRow>(
          `SELECT * FROM pets WHERE id = ? AND deleted_at IS NULL`,
          [petId]
        );
        if (!active) return;
        if (!row) {
          setNotFound(true);
          return;
        }
        const base = petToDraft(row);
        setSpecies(row.species);
        setOriginal(base);
        const draft = await loadDraft<EditPetDraft>(draftKey);
        if (!active) return;
        if (draft?.data && JSON.stringify(draft.data) !== JSON.stringify(base)) {
          offerDraftResume(
            `Du hattest Änderungen an „${row.name}" begonnen`,
            () => setForm({ ...base, ...draft.data }),
            () => {
              void clearDraft(draftKey);
              setForm(base);
            }
          );
          // Bis zur Entscheidung die gespeicherten Daten zeigen.
          setForm(base);
        } else {
          setForm(base);
        }
      } catch {
        if (active) setNotFound(true);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const isDirty = useMemo(
    () => form !== null && original !== null && JSON.stringify(form) !== JSON.stringify(original),
    [form, original]
  );

  useDraftAutosave(draftKey, form, form !== null && isDirty && !saved);
  useUnsavedChangesGuard(isDirty && !saved, () => clearDraft(draftKey));

  function update<K extends keyof EditPetDraft>(key: K, value: EditPetDraft[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  // Chip-Nummer: ehrlicher HINWEIS statt harter Sperre (Transponder sind 15-stellig).
  const chipDigits = form?.chipNumber.replace(/\D/g, '') ?? '';
  const chipHint =
    form && form.chipNumber.trim().length > 0 && chipDigits.length !== 15
      ? `Hinweis: Transponder-Nummern haben üblicherweise 15 Ziffern (deine Eingabe: ${chipDigits.length}). Speichern kannst du trotzdem.`
      : null;

  const canSave = form !== null && form.name.trim().length > 0 && isDirty && !saving && !saved;

  async function pickPhoto(fromCamera: boolean) {
    const { takePhoto, pickFromGallery } = require('../utils/imagePicker');
    const result = fromCamera ? await takePhoto() : await pickFromGallery();
    if (!result.cancelled) update('photoUri', result.uri);
  }

  async function save() {
    if (!canSave || !form) return;
    setSaving(true);
    try {
      const db = await getDb();
      const ts = nowUtcIso();
      // Atomar: EIN Update – alle Felder in einem Statement.
      await db.runAsync(
        `UPDATE pets SET
           name = ?, breed = ?, gender = ?, birth_date = ?,
           castration_status = ?, castration_date = ?, chip_number = ?,
           color_theme = ?, photo_uri = ?, special_features = ?,
           allergies = ?, pre_conditions = ?,
           specialist_vet_name = ?, specialist_vet_phone = ?,
           coat_color = ?, vet_practice_name = ?, vet_practice_phone = ?,
           aquarium_type = ?, aquarium_volume_liters = ?, setup_date = ?,
           equine_pass_number = ?, equine_housing_type = ?,
           equine_colic_history = ?, equine_estimated_weight_kg = ?,
           equine_stable_name = ?, equine_stable_phone = ?,
           equine_box_number = ?, equine_farrier_name = ?, equine_farrier_phone = ?,
           updated_at = ?, is_synced = 0
         WHERE id = ?`,
        [
          form.name.trim(),
          form.breed.trim() || null,
          form.gender,
          form.birthDate,
          form.castration,
          form.castration === 'Kastriert' || form.castration === 'Sterilisiert'
            ? form.castrationDate
            : null,
          form.chipNumber.trim() || null,
          form.colorHex,
          form.photoUri,
          form.specialFeatures.trim() || null,
          form.allergies.trim() || null,
          form.preConditions.trim() || null,
          form.vetName.trim() || null,
          form.vetPhone.trim() || null,
          form.coatColor.trim() || null,
          form.practiceName.trim() || null,
          form.practicePhone.trim() || null,
          form.aquariumType || null,
          form.aquariumVolume ? parseInt(form.aquariumVolume, 10) || null : null,
          form.setupDate || null,
          form.equinePassNumber.trim() || null,
          form.equineHousingType || null,
          form.equineColicHistory.trim() || null,
          form.equineEstimatedWeight ? parseFloat(form.equineEstimatedWeight) || null : null,
          form.equineStableName.trim() || null,
          form.equineStablePhone.trim() || null,
          form.equineBoxNumber.trim() || null,
          form.equineFarrierName.trim() || null,
          form.equineFarrierPhone.trim() || null,
          ts,
          petId,
        ]
      );
      setSaved(true);
      setOriginal(form);
      await clearDraft(draftKey);
      // E-93: Auto-Backup nach jeder Datenaenderung
      try { const { autoBackup } = require('../backup/backupService'); autoBackup(); } catch {}
      Alert.alert('Gespeichert', `Die Stammdaten von ${form.name.trim()} sind aktualisiert.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      setSaved(false);
      Alert.alert(
        'Speichern fehlgeschlagen',
        'Die Änderungen konnten nicht gespeichert werden. Deine Eingaben bleiben erhalten – bitte versuche es erneut.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (notFound) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Dieses Tier wurde nicht gefunden.</Text>
      </View>
    );
  }
  if (!form) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lädt …</Text>
      </View>
    );
  }

  const showCastration = !isHabitat && (form.castration === 'Kastriert' || form.castration === 'Sterilisiert');

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.speciesNote}>
          Tierart: {speciesCfg?.label ?? species} – die Tierart bestimmt den Aufbau der Akte und
          lässt sich deshalb nicht ändern. Stimmt sie nicht, lege das Tier bitte neu an.
        </Text>

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>{speciesCfg?.terminology.nameField ?? 'Name'}</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(t) => update('name', t)}
              accessibilityLabel="Name"
            />

            {isHabitat ? (
              <>
                {/* E-86: Aquarium-spezifische Felder */}
                <FieldLabel>Beckentyp</FieldLabel>
                <ChoiceChips
                  options={['Süßwasser', 'Meerwasser', 'Brackwasser']}
                  value={form.aquariumType ?? ''}
                  onChange={(v) => update('aquariumType', v)}
                />

                <FieldLabel>Volumen (Liter)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.aquariumVolume ?? ''}
                  onChangeText={(t) => update('aquariumVolume', t)}
                  placeholder="z. B. 120"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  accessibilityLabel="Beckenvolumen in Liter"
                />

                <FieldLabel>Eingerichtet am</FieldLabel>
                <DateField
                  label="Datum des Beckenstarts"
                  value={form.setupDate}
                  onChange={(key) => update('setupDate', key)}
                />
              </>
            ) : null}

            {!isHabitat ? (
              <>
                <FieldLabel>Rasse / Art (optional)</FieldLabel>
                <TextInput
                  style={styles.input}
                  value={form.breed}
                  onChangeText={(t) => update('breed', t)}
                  placeholder="z. B. Maine Coon, Zwergwidder"
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Rasse"
                />
                {form.breed.trim().length > 0 ? (
                  <Text style={styles.vetTipText}>
                    Tipp: Frag deinen Tierarzt nach rassetypischen Vorsorge-Untersuchungen für deine Rasse.
                  </Text>
                ) : null}

                <FieldLabel>Geschlecht</FieldLabel>
                <ChoiceChips options={GENDER_OPTIONS} value={form.gender} onChange={(v) => update('gender', v)} />

                <FieldLabel>Geburtsdatum</FieldLabel>
                <DateField
                  label="Geburtstag oder ungefähres Datum"
                  value={form.birthDate}
                  onChange={(key) => update('birthDate', key)}
                />

                <FieldLabel>Kastriert / sterilisiert?</FieldLabel>
                <ChoiceChips
                  options={CASTRATION_OPTIONS}
                  value={form.castration}
                  onChange={(v) => update('castration', v)}
                />
                {showCastration ? (
                  <DateField
                    label="Datum des Eingriffs (optional)"
                    value={form.castrationDate}
                    onChange={(key) => update('castrationDate', key)}
                  />
                ) : null}

                {/* E-87: Chip/Ring nur bei relevanten Tierarten */}
                {!CHIP_HIDDEN_SPECIES.includes(species) ? (
                  <>
                    <FieldLabel>{getChipLabel(species)}</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={form.chipNumber}
                      onChangeText={(t) => update('chipNumber', t)}
                      placeholder={getChipPlaceholder(species)}
                      placeholderTextColor={colors.textSecondary}
                      keyboardType={species === 'ziervogel' ? 'default' : 'number-pad'}
                      accessibilityLabel={species === 'ziervogel' ? 'Ring- oder Chip-Nummer' : 'Chip-Nummer'}
                    />
                    {species === 'ziervogel' ? (
                      <Hint>Die Ringnummer steht auf dem geschlossenen Fußring. Bei großen Papageien ggf. auch Chip.</Hint>
                    ) : null}
                    {chipHint ? <Text style={styles.warnText}>{chipHint}</Text> : null}
                  </>
                ) : null}

                {/* E-84: Artspezifisches Label für Fellfarbe/Zeichnung; bei Aquarium ausblenden */}
                {species !== 'aquarium' ? (
                  <>
                    <FieldLabel>{getCoatLabel(species)}</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={form.coatColor}
                      onChangeText={(t) => update('coatColor', t)}
                      placeholder={getCoatPlaceholder(species)}
                      placeholderTextColor={colors.textSecondary}
                      accessibilityLabel={getCoatLabel(species)}
                    />
                    <Hint>Erscheint auf dem Notfall-Pass – hilft, dein Tier eindeutig zu erkennen.</Hint>
                  </>
                ) : null}

                {/* E-80: Pferde-spezifische Felder */}
                {species === 'pferd' ? (
                  <View style={styles.equineSection}>
                    <Text style={styles.healthSectionTitle}>Pferde-Daten</Text>

                    <FieldLabel>Equidenpass-Nr. (optional)</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={form.equinePassNumber}
                      onChangeText={(t) => update('equinePassNumber', t)}
                      placeholder="Nummer aus dem Equidenpass (EU-Pflichtdokument)"
                      placeholderTextColor={colors.textSecondary}
                      accessibilityLabel="Equidenpass-Nummer"
                    />
                    <Hint>Steht auf der ersten Seite des Equidenpasses (EU-Verordnung 2015/262).</Hint>

                    <FieldLabel>Haltungsform</FieldLabel>
                    <ChoiceChips
                      options={EQUINE_HOUSING_OPTIONS}
                      value={form.equineHousingType}
                      onChange={(v) => update('equineHousingType', v)}
                    />

                    <FieldLabel>Geschätztes Gewicht (kg, optional)</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={form.equineEstimatedWeight}
                      onChangeText={(t) => update('equineEstimatedWeight', t)}
                      placeholder="z. B. 520"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="number-pad"
                      accessibilityLabel="Geschätztes Gewicht in Kilogramm"
                    />
                    <Hint>Per Maßband geschätzt – wichtig für die Dosierung von Wurmkuren und Medikamenten.</Hint>

                    <FieldLabel>Kolik-Vorgeschichte (optional)</FieldLabel>
                    <TextInput
                      style={[styles.input, styles.multiline]}
                      value={form.equineColicHistory}
                      onChangeText={(t) => update('equineColicHistory', t)}
                      placeholder="z. B. Kolik 2023, OP nötig – oder „keine“"
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      accessibilityLabel="Kolik-Vorgeschichte"
                    />
                    <Hint>Erscheint auf dem Notfall-Pass – für den Tierarzt im Notfall entscheidend.</Hint>

                    <FieldLabel>Stallkontakt (optional)</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={form.equineStableName}
                      onChangeText={(t) => update('equineStableName', t)}
                      placeholder="Name des Stalls / Pensionsbetrieb"
                      placeholderTextColor={colors.textSecondary}
                      accessibilityLabel="Stallname"
                    />
                    <TextInput
                      style={[styles.input, { marginTop: spacing.s }]}
                      value={form.equineStablePhone}
                      onChangeText={(t) => update('equineStablePhone', t)}
                      placeholder="Telefonnummer Stall"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="phone-pad"
                      accessibilityLabel="Stall-Telefonnummer"
                    />
                    <TextInput
                      style={[styles.input, { marginTop: spacing.s }]}
                      value={form.equineBoxNumber}
                      onChangeText={(t) => update('equineBoxNumber', t)}
                      placeholder="Box-/Paddock-Nummer (optional)"
                      placeholderTextColor={colors.textSecondary}
                      accessibilityLabel="Box-Nummer"
                    />
                    <Hint>Erscheint auf dem Notfall-Pass – damit Helfer dein Pferd im Stall finden.</Hint>

                    <FieldLabel>Hufschmied (optional)</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={form.equineFarrierName}
                      onChangeText={(t) => update('equineFarrierName', t)}
                      placeholder="Name des Hufschmieds"
                      placeholderTextColor={colors.textSecondary}
                      accessibilityLabel="Hufschmied-Name"
                    />
                    <TextInput
                      style={[styles.input, { marginTop: spacing.s }]}
                      value={form.equineFarrierPhone}
                      onChangeText={(t) => update('equineFarrierPhone', t)}
                      placeholder="Telefonnummer Hufschmied"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="phone-pad"
                      accessibilityLabel="Hufschmied-Telefonnummer"
                    />
                    <Hint>Erscheint auf dem Notfall-Pass – bei Hufproblemen oder Verletzungen hilfreich.</Hint>
                  </View>
                ) : null}
              </>
            ) : null}
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Besonderheiten (optional)</FieldLabel>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.specialFeatures}
              onChangeText={(t) => update('specialFeatures', t)}
              placeholder="z. B. Ängste, Eigenheiten – wichtig für Sitter und Tierarzt"
              placeholderTextColor={colors.textSecondary}
              multiline
              accessibilityLabel="Besonderheiten"
            />

            {/* Vorerkrankungen & Allergien: zwei separate Titelfelder (Entscheidung E-02) */}
            <View style={styles.healthSection}>
              <Text style={styles.healthSectionTitle}>Vorerkrankungen & Allergien</Text>
              <FieldLabel>Allergien (optional)</FieldLabel>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={form.allergies}
                onChangeText={(t) => update('allergies', t)}
                placeholder="z. B. Hühnereiweiß, Gräser, Flohspeichel"
                placeholderTextColor={colors.textSecondary}
                multiline
                accessibilityLabel="Allergien"
              />
              <Hint>Erscheint auf dem Notfall-Pass – wichtig für den Tierarzt im Notfall.</Hint>

              <FieldLabel>Vorerkrankungen (optional)</FieldLabel>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={form.preConditions}
                onChangeText={(t) => update('preConditions', t)}
                placeholder="z. B. Epilepsie seit 2020, HD links"
                placeholderTextColor={colors.textSecondary}
                multiline
                accessibilityLabel="Vorerkrankungen"
              />
              <Hint>Erscheint auf dem Notfall-Pass – wichtig für den Tierarzt im Notfall.</Hint>
            </View>

            <FieldLabel>{speciesCfg?.terminology.vet ?? 'Tierarzt'} (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.vetName}
              onChangeText={(t) => update('vetName', t)}
              placeholder="Name der Praxis"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Tierarzt-Praxis"
            />
            <TextInput
              style={[styles.input, { marginTop: spacing.s }]}
              value={form.vetPhone}
              onChangeText={(t) => update('vetPhone', t)}
              placeholder="Telefonnummer"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              accessibilityLabel="Tierarzt-Telefonnummer"
            />
            <Hint>Die Nummer erscheint auch auf dem Notfall-Pass – im Ernstfall zählt jeder Griff.</Hint>

            <FieldLabel>Stamm-{speciesCfg?.terminology.vet ?? 'Tierarzt'} (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.practiceName}
              onChangeText={(t) => update('practiceName', t)}
              placeholder="Praxis, die dein Tier regelmäßig betreut"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Stammtierarzt-Praxis"
            />
            <TextInput
              style={[styles.input, { marginTop: spacing.s }]}
              value={form.practicePhone}
              onChangeText={(t) => update('practicePhone', t)}
              placeholder="Telefonnummer"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              accessibilityLabel="Stammtierarzt-Telefonnummer"
            />
            <Hint>
              Der Stamm-{speciesCfg?.terminology.vet ?? 'Tierarzt'} steht im Fußbereich des
              Notfall-Passes – zusätzlich zum Spezialisten oben.
            </Hint>

            <FieldLabel>Foto</FieldLabel>
            {form.photoUri ? (
              <View>
                <Image source={{ uri: form.photoUri }} style={styles.photo} />
                <View style={styles.photoActions}>
                  <Pressable style={styles.photoButton} onPress={() => pickPhoto(true)} accessibilityLabel="Neues Foto aufnehmen">
                    <Text style={styles.photoButtonText}>📷 Neues Foto</Text>
                  </Pressable>
                  <Pressable
                    style={styles.photoButton}
                    onPress={() => update('photoUri', null)}
                    accessibilityLabel="Foto entfernen"
                  >
                    <Text style={[styles.photoButtonText, { color: colors.signalRed }]}>Foto entfernen</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.photoActions}>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(true)} accessibilityLabel="Foto aufnehmen">
                  <Text style={styles.photoButtonText}>📷 Foto aufnehmen</Text>
                </Pressable>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(false)} accessibilityLabel="Aus Galerie wählen">
                  <Text style={styles.photoButtonText}>🖼 Aus Galerie</Text>
                </Pressable>
              </View>
            )}

            <FieldLabel>Kennfarbe in der App</FieldLabel>
            <Hint>Damit erkennst du dieses Tier auf einen Blick in der Übersicht.</Hint>
            <View style={styles.colorRow}>
              {petColorPalette.map((c) => (
                <Pressable
                  key={c.key}
                  accessibilityLabel={`Farbe ${c.label}`}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c.hex },
                    c.key === 'weiss' && styles.colorDotLight,
                    form.colorHex === c.hex && styles.colorDotActive,
                  ]}
                  onPress={() => update('colorHex', c.hex)}
                />
              ))}
            </View>
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} label="Änderungen speichern" />
        {!isDirty && !saved ? (
          <Text style={styles.footnote}>Noch keine Änderungen – bearbeite ein Feld, dann wird der Knopf aktiv.</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  landscapeColumns: { flexDirection: 'row', gap: spacing.xl },
  landscapeColumn: { flex: 1 },
  speciesNote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    lineHeight: 22,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    fontSize: typography.body,
    color: colors.textPrimary,
    minHeight: minTouchTarget,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  warnText: { fontSize: typography.bodySmall, color: colors.signalRed, marginTop: spacing.s, lineHeight: 22 },
  photo: { width: '100%', height: 180, borderRadius: 12, backgroundColor: colors.border },
  photoActions: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap', marginTop: spacing.s },
  photoButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  photoButtonText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  colorDot: { width: 44, height: 44, borderRadius: 22 },
  colorDotLight: { borderWidth: 1, borderColor: colors.border },
  colorDotActive: { borderWidth: 4, borderColor: colors.textPrimary },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.m,
  },
  vetTipText: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.s,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  healthSection: {
    marginTop: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  equineSection: {
    marginTop: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  healthSectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
