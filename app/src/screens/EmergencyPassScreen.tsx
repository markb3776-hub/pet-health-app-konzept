/**
 * simplyPet: Notfall-Pass (Grundgeruest)
 * Quelle: notfallpass_design_spezifikation.md / technische_spezifikation_offline_strategie.md
 *
 * MUSS zu 100 % offline funktionieren: liest ausschliesslich lokale Daten.
 * Zwei-Tap-Regel: von jedem Bildschirm in maximal zwei Beruehrungen erreichbar.
 * Freigabe-Link (online-only) folgt in Schritt 4 — mit ehrlicher Meldung bei Offline.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { colors, typography, spacing } from '../theme/theme';

interface PetRow {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  chip_number: string | null;
  special_features: string | null;
  specialist_vet_name: string | null;
  specialist_vet_phone: string | null;
}

interface MedRow {
  type: string;
  name: string;
  dosage: string | null;
}

export default function EmergencyPassScreen() {
  const route = useRoute();
  const petId = (route.params as { petId?: string } | undefined)?.petId;
  const [pet, setPet] = useState<PetRow | null>(null);
  const [meds, setMeds] = useState<MedRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const row = petId
          ? await db.getFirstAsync<PetRow>(
              'SELECT * FROM pets WHERE id = ? AND deleted_at IS NULL',
              [petId]
            )
          : await db.getFirstAsync<PetRow>(
              'SELECT * FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at LIMIT 1'
            );
        if (!active) return;
        setPet(row ?? null);
        if (row) {
          const m = await db.getAllAsync<MedRow>(
            'SELECT type, name, dosage FROM medications WHERE pet_id = ? AND is_active = 1 AND deleted_at IS NULL',
            [row.id]
          );
          if (active) setMeds(m);
        }
      })();
      return () => {
        active = false;
      };
    }, [petId])
  );

  if (!pet) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.empty}>
          Noch kein Tier angelegt. Der Notfall-Pass füllt sich automatisch aus der Tierakte.
        </Text>
      </View>
    );
  }

  const cfg = getSpeciesConfig(pet.species);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petMeta}>
        {cfg?.label ?? pet.species}
        {pet.breed ? ` · ${pet.breed}` : ''}
        {pet.birth_date ? ` · geb. ${new Date(pet.birth_date).toLocaleDateString('de-DE')}` : ''}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wichtig im Notfall</Text>
        {meds.length === 0 && !pet.special_features ? (
          <Text style={styles.body}>Keine bekannten Allergien, Vorerkrankungen oder Medikamente eingetragen.</Text>
        ) : (
          <>
            {pet.special_features ? <Text style={styles.body}>{pet.special_features}</Text> : null}
            {meds.map((m, i) => (
              <Text key={i} style={styles.body}>
                {m.type}: {m.name}
                {m.dosage ? ` (${m.dosage})` : ''}
              </Text>
            ))}
          </>
        )}
      </View>

      {pet.chip_number ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chip-Nummer</Text>
          <Text style={styles.body}>{pet.chip_number}</Text>
        </View>
      ) : null}

      {pet.specialist_vet_name ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{cfg?.terminology.vet ?? 'Tierarzt'}</Text>
          <Text style={styles.body}>
            {pet.specialist_vet_name}
            {pet.specialist_vet_phone ? ` · ${pet.specialist_vet_phone}` : ''}
          </Text>
        </View>
      ) : null}

      <Text style={styles.footnote}>
        Dieser Pass funktioniert vollständig ohne Internet – alle Angaben liegen auf deinem Gerät.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  containerCentered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.l,
  },
  scroll: { padding: spacing.m },
  petName: { fontSize: typography.headline, fontWeight: '700', color: colors.textPrimary },
  petMeta: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.l,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.s,
  },
  body: { fontSize: typography.body, color: colors.textPrimary, lineHeight: 26 },
  empty: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.m,
    lineHeight: 22,
  },
});
