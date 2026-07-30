/**
 * simplyPet: Vorfall erfassen (Teilauftrag 4.2)
 * Quelle: Datenmodell 2.3 (Eintragstyp 'Vorfall') + tierarten_abdeckung_festlegungen.md §1.
 *
 * FREITEXT-FIRST (verbindliche Korrektur des Projektinhabers, 09.07.2026):
 * Das Freitextfeld "Was ist passiert?" ist das Herzstueck – immer sichtbar,
 * immer ausreichend, ohne Zeichenbegrenzung. Die Auswahllisten (Vorfallart,
 * Verursacher) sind reine Komfort-Abkuerzungen: nie Pflicht, nie blockierend.
 * "Sonstiges" + Freitext ist ein vollwertiger Eintrag.
 *
 * Artneutral: Auswahllisten gelten fuer alle 14 Arten; die Platzhalter-
 * Beispiele passen sich der Tierart an (Anflugtrauma beim Ziervogel,
 * Waermelampen-Verbrennung beim Reptil, Greifvogelangriff beim Kaninchen ...).
 *
 * Speicherung: health_records mit record_type='Vorfall'; strukturierte
 * Angaben als JSON im notes-Feld (Datenmodell-Vorgabe), Wundfoto in photo_uri.
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
// ImagePicker jetzt via shared Helper (../utils/imagePicker)
import { getDb, uuid } from '../../db/database';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import DateField from '../../components/DateField';
import { PetPicker, FieldLabel, Hint, SaveButton, ChoiceChips } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { todayKey, nowUtcIso } from '../../time/timeModule';
import ScreenBackground from '../../components/ScreenBackground';

/** Artneutrale Vorfallarten (tierarten_abdeckung_festlegungen.md §1). */
const INCIDENT_TYPES = [
  'Biss',
  'Kratzer',
  'Sturz',
  'Giftverdacht',
  'Verbrennung/Verbrühung',
  'Hitzschlag',
  'Fremdkörper',
  'Flucht/Entweichen',
  'Angriff durch anderes Tier',
  'Sonstiges',
];

/** Artneutrale Verursacher-Liste. */
const CAUSERS = [
  'Anderes eigenes Tier',
  'Fremdes Tier',
  'Wildtier',
  'Mensch/Unfall',
  'Unbekannt',
  'Entfällt',
];

/** Artgerechte Freitext-Beispiele pro Haltungs-Cluster (nie Hund/Katze-lastig). */
const EXAMPLE_BY_SPECIES: Record<string, string> = {
  hund: 'z. B. „beim Spaziergang von fremdem Hund gebissen“',
  katze: 'z. B. „von fremder Katze gebissen, kleine Wunde am Ohr“',
  kaninchen: 'z. B. „Greifvogel hat das Außengehege attackiert“',
  meerschweinchen: 'z. B. „aus der Hand gesprungen, kurz benommen“',
  frettchen: 'z. B. „hat ein Stück Gummi verschluckt“',
  chinchilla: 'z. B. „ist beim Freilauf gegen das Regal gesprungen“',
  ratte: 'z. B. „hat sich am Käfiggitter eingeklemmt“',
  maus: 'z. B. „beim Herausnehmen aus der Hand gefallen“',
  degu: 'z. B. „Schwanzverletzung beim Fangen“',
  hamster: 'z. B. „aus der Hand gefallen, humpelt leicht“',
  vogel: 'z. B. „gegen die Fensterscheibe geflogen (Anflugtrauma)“',
  reptil: 'z. B. „hat sich an der Wärmelampe verbrannt“',
  pferd: 'z. B. „Tritt auf der Weide, Schwellung am Bein“',
  aquarium: 'z. B. „Fisch aus dem Becken gesprungen“ oder „Besatz wirkt apathisch – Vergiftungsverdacht“',
};

interface IncidentDraft {
  petId: string | null;
  freeText: string;
  incidentType: string | null;
  causer: string | null;
  causerDetail: string;
  bodyPart: string;
  vetVisited: boolean | null;
  dateKey: string;
  photoUri: string | null;
}

export default function IncidentEntryScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();

  const emptyForm = useMemo<IncidentDraft>(
    () => ({
      petId: presetPetId,
      freeText: '',
      incidentType: null,
      causer: null,
      causerDetail: '',
      bodyPart: '',
      vetVisited: null,
      dateKey: todayKey(),
      photoUri: null,
    }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<IncidentDraft>({
    draftKey: 'entry_incident',
    emptyForm,
    resumeDescription: 'Du hattest einen Vorfall-Eintrag begonnen',
    isDirty: (f) =>
      f.freeText.trim().length > 0 ||
      f.incidentType !== null ||
      f.causer !== null ||
      f.bodyPart.trim().length > 0 ||
      f.photoUri !== null,
  });

  const effectivePetId = form.petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === effectivePetId);
  const placeholder = (pet && EXAMPLE_BY_SPECIES[pet.species]) ?? 'Beschreibe frei, was passiert ist';

  // Freitext-first: NUR Tier + Freitext sind noetig. Kategorien sind Komfort.
  const canSave = effectivePetId !== null && form.freeText.trim().length > 0 && !saving && !saved;

  async function pickPhoto(fromCamera: boolean) {
    const { takePhoto, pickFromGallery } = require('../../utils/imagePicker');
    const result = fromCamera ? await takePhoto() : await pickFromGallery();
    if (!result.cancelled) update('photoUri', result.uri);
  }

  async function save() {
    if (!canSave || !effectivePetId) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        // Strukturierte Angaben als JSON im notes-Feld (Datenmodell 2.3).
        const structured = {
          text: form.freeText.trim(),
          art: form.incidentType, // null = bewusst keine Kategorie (vollwertig!)
          verursacher: form.causer,
          verursacher_detail: form.causerDetail.trim() || null,
          koerperstelle: form.bodyPart.trim() || null,
          tierarzt_aufgesucht: form.vetVisited,
        };
        await db.runAsync(
          `INSERT INTO health_records (id, pet_id, record_type, date, notes, photo_uri, created_at, updated_at, is_synced)
           VALUES (?, ?, 'Vorfall', ?, ?, ?, ?, ?, 0)`,
          [uuid(), effectivePetId, form.dateKey, JSON.stringify(structured), form.photoUri, ts, ts]
        );
      },
      {
        title: 'Vorfall gespeichert',
        message: `Der Vorfall ist im Verlauf von ${pet?.name ?? 'deinem Tier'} festgehalten. Tritt später eine Folge auf, zeigt die Timeline dem Tierarzt den Zusammenhang.`,
      }
    );
  }

  if (loaded && pets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lege zuerst ein Tier an – danach kannst du Vorfälle festhalten.</Text>
      </View>
    );
  }

  return (
    <ScreenBackground>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <PetPicker pets={pets} selectedId={effectivePetId} onSelect={(id) => update('petId', id)} />

        {/* HERZSTUECK: Freitext zuerst, immer sichtbar, ohne Limit. */}
        <FieldLabel>Was ist passiert?</FieldLabel>
        <TextInput
          style={[styles.input, styles.freeTextInput]}
          value={form.freeText}
          onChangeText={(t) => update('freeText', t)}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          accessibilityLabel="Was ist passiert? Freitext"
        />
        <Hint>
          Beschreibe es in deinen Worten – das genügt vollständig. Die Auswahl unten ist nur eine
          Abkürzung für häufige Fälle und keine Pflicht.
        </Hint>

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Vorfallart (optional)</FieldLabel>
            <ChoiceChips
              options={INCIDENT_TYPES}
              value={form.incidentType}
              onChange={(v) => update('incidentType', v)}
            />

            <FieldLabel>Verursacher (optional)</FieldLabel>
            <ChoiceChips options={CAUSERS} value={form.causer} onChange={(v) => update('causer', v)} />
            {form.causer === 'Fremdes Tier' || form.causer === 'Wildtier' ? (
              <TextInput
                style={[styles.input, { marginTop: spacing.s }]}
                value={form.causerDetail}
                onChangeText={(t) => update('causerDetail', t)}
                placeholder="Welches Tier? (z. B. Nachbarskatze, Greifvogel, Marder)"
                placeholderTextColor={colors.textSecondary}
                accessibilityLabel="Verursacher genauer beschreiben"
              />
            ) : null}

            <FieldLabel>Körperstelle (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.bodyPart}
              onChangeText={(t) => update('bodyPart', t)}
              placeholder="z. B. linkes Hinterbein, Ohr"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Betroffene Körperstelle"
            />
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Wann ist es passiert?</FieldLabel>
            <DateField
              label="Datum des Vorfalls"
              value={form.dateKey}
              onChange={(key) => update('dateKey', key)}
              hint="Auch rückwirkend – der Eintrag sortiert sich richtig in die Timeline ein."
            />

            <FieldLabel>Tierarzt aufgesucht?</FieldLabel>
            <ChoiceChips
              options={['Ja', 'Nein']}
              value={form.vetVisited === null ? null : form.vetVisited ? 'Ja' : 'Nein'}
              onChange={(v) => update('vetVisited', v === null ? null : v === 'Ja')}
            />

            <FieldLabel>Wundfoto (optional)</FieldLabel>
            {form.photoUri ? (
              <View>
                <Image source={{ uri: form.photoUri }} style={styles.photo} />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => update('photoUri', null)}
                  accessibilityLabel="Foto entfernen"
                >
                  <Text style={styles.photoRemoveText}>Foto entfernen</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(true)} accessibilityLabel="Foto aufnehmen">
                  <Text style={styles.photoButtonText}>📷 Foto aufnehmen</Text>
                </Pressable>
                <Pressable style={styles.photoButton} onPress={() => pickPhoto(false)} accessibilityLabel="Aus Galerie wählen">
                  <Text style={styles.photoButtonText}>🖼 Aus Galerie</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} label="Vorfall speichern" />
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  landscapeColumns: { flexDirection: 'row', gap: spacing.xl },
  landscapeColumn: { flex: 1 },
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
  freeTextInput: { minHeight: 140, textAlignVertical: 'top' },
  photo: { width: '100%', height: 180, borderRadius: 12, backgroundColor: colors.border },
  photoRemove: { marginTop: spacing.s, minHeight: minTouchTarget - 8, justifyContent: 'center' },
  photoRemoveText: { fontSize: typography.bodySmall, color: colors.signalRed },
  photoButtons: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
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
  emptyWrap: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
