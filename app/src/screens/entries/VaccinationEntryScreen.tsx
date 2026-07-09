/**
 * simplyPet: Impfung / Prophylaxe eintragen (Teilauftrag 4.2)
 * Quelle: Datenmodell 2.4 (vaccinations) + 2.7 (reminders).
 *
 * Artgerecht: Das Impf-Modul erscheint nur bei Tierarten mit Impfempfehlung
 * (species.modules enthaelt 'vaccinations') – Doktrin: keine sachlich
 * falschen Funktionen. Fuer andere Arten stehen Entwurmung/Zeckenschutz
 * dennoch zur Verfuegung, wo sinnvoll; die Tier-Auswahl blendet Arten ohne
 * Impf-Modul mit ehrlichem Hinweis aus.
 *
 * Erinnerung entsteht automatisch: Ist ein Faelligkeitsdatum (valid_until)
 * gesetzt, legt das Speichern IN DERSELBEN TRANSAKTION eine Erinnerung an
 * (atomar: beides oder nichts – Eingabe-Stabilitaets-Doktrin, Baupflicht 3).
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getDb, uuid } from '../../db/database';
import { getSpeciesConfig } from '../../config/species';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import DateField from '../../components/DateField';
import { PetPicker, FieldLabel, Hint, SaveButton, ChoiceChips } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { todayKey, nowUtcIso, formatDate } from '../../time/timeModule';

const VACC_TYPES = ['Impfung', 'Entwurmung', 'Zeckenschutz'];

interface VaccinationDraft {
  petId: string | null;
  vaccType: string;
  disease: string;
  productName: string;
  dateGiven: string;
  validUntil: string | null;
}

export default function VaccinationEntryScreen() {
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();

  // Nur Tiere mit Impf-/Prophylaxe-Modul anbieten (artgerecht, keine falschen Funktionen).
  const eligiblePets = useMemo(
    () => pets.filter((p) => getSpeciesConfig(p.species)?.modules.includes('vaccinations')),
    [pets]
  );

  const emptyForm = useMemo<VaccinationDraft>(
    () => ({
      petId: presetPetId,
      vaccType: 'Impfung',
      disease: '',
      productName: '',
      dateGiven: todayKey(),
      validUntil: null,
    }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<VaccinationDraft>({
    draftKey: 'entry_vaccination',
    emptyForm,
    resumeDescription: 'Du hattest einen Impf-Eintrag begonnen',
    isDirty: (f) => f.disease.trim().length > 0 || f.productName.trim().length > 0 || f.validUntil !== null,
  });

  const effectivePetId =
    (form.petId && eligiblePets.some((p) => p.id === form.petId) ? form.petId : null) ??
    (eligiblePets.length === 1 ? eligiblePets[0].id : null);
  const pet = eligiblePets.find((p) => p.id === effectivePetId);

  const canSave = effectivePetId !== null && form.disease.trim().length > 0 && !saving && !saved;

  async function save() {
    if (!canSave || !effectivePetId) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        const vaccId = uuid();
        // ATOMAR: Impfung + automatische Erinnerung in EINER Transaktion.
        await db.withTransactionAsync(async () => {
          await db.runAsync(
            `INSERT INTO vaccinations (id, pet_id, type, disease, product_name, date_given, valid_until, created_at, updated_at, is_synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [
              vaccId,
              effectivePetId,
              form.vaccType,
              form.disease.trim(),
              form.productName.trim() || null,
              form.dateGiven,
              form.validUntil,
              ts,
              ts,
            ]
          );
          if (form.validUntil) {
            await db.runAsync(
              `INSERT INTO reminders (id, pet_id, title, due_date, status, source_type, source_id, created_at, updated_at, is_synced)
               VALUES (?, ?, ?, ?, 'Offen', 'impfung', ?, ?, ?, 0)`,
              [
                uuid(),
                effectivePetId,
                `${form.vaccType} auffrischen: ${form.disease.trim()}`,
                form.validUntil,
                vaccId,
                ts,
                ts,
              ]
            );
          }
        });
      },
      {
        title: 'Eintrag gespeichert',
        message: form.validUntil
          ? `${form.vaccType} für ${pet?.name ?? 'dein Tier'} ist festgehalten. Die Erinnerung zum ${formatDate(form.validUntil)} ist automatisch angelegt.`
          : `${form.vaccType} für ${pet?.name ?? 'dein Tier'} ist festgehalten.`,
      }
    );
  }

  if (loaded && eligiblePets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>
          {pets.length === 0
            ? 'Lege zuerst ein Tier an – danach kannst du Impfungen festhalten.'
            : 'Für deine Tierarten gibt es keine Impfempfehlung – deshalb bietet simplyPet hier bewusst kein Impf-Modul an. Beobachtungen und Vorfälle kannst du jederzeit festhalten.'}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <PetPicker pets={eligiblePets} selectedId={effectivePetId} onSelect={(id) => update('petId', id)} />

        <FieldLabel>Was wurde gemacht?</FieldLabel>
        <ChoiceChips
          options={VACC_TYPES}
          value={form.vaccType}
          onChange={(v) => update('vaccType', v ?? 'Impfung')}
          allowDeselect={false}
        />

        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>{form.vaccType === 'Impfung' ? 'Wogegen? (z. B. Tollwut, RHD)' : 'Wogegen / womit?'}</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.disease}
              onChangeText={(t) => update('disease', t)}
              placeholder={form.vaccType === 'Impfung' ? 'z. B. Tollwut' : 'z. B. Bandwurm'}
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Krankheit oder Zweck"
            />

            <FieldLabel>Präparat (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.productName}
              onChangeText={(t) => update('productName', t)}
              placeholder="Name aus dem Impfpass"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Name des Präparats"
            />
            <Hint>Du findest den Namen im Impfpass oder auf der Rechnung – er ist aber keine Pflicht.</Hint>
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Wann verabreicht?</FieldLabel>
            <DateField
              label="Datum der Verabreichung"
              value={form.dateGiven}
              onChange={(key) => update('dateGiven', key)}
              hint="Auch alte Einträge aus dem Impfpass kannst du hier übertragen."
            />

            <FieldLabel>Gültig bis / nächste Fälligkeit (optional)</FieldLabel>
            <DateField
              label="Fälligkeitsdatum"
              value={form.validUntil}
              onChange={(key) => update('validUntil', key)}
              allowFuture
              hint="Wenn du ein Datum setzt, entsteht die Erinnerung automatisch – du musst an nichts mehr denken."
            />
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} />
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
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
