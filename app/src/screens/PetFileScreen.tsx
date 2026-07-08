/**
 * simplyPet: Tierakte (Grundgeruest)
 * Quelle: technische_spezifikation_screen_flow.md
 *
 * Module werden abhaengig von der Tierart eingeblendet (species.ts).
 * Detail-Reiter (Verlauf, Impfungen, Dokumente) folgen in Schritt 4.
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
}

const MODULE_LABELS: Record<string, string> = {
  vaccinations: 'Impfungen & Prophylaxe',
  weight: 'Gewichtsverlauf',
  teeth: 'Zahn-Check',
  vitamin_c: 'Vitamin-C-Versorgung',
  diabetes_watch: 'Diabetes-Vorsorge',
  annual_check: 'Jährlicher Routine-Check',
  cites_docs: 'Herkunfts- und CITES-Nachweise',
  hibernation: 'Winterstarre-Zyklus',
  equine_pass: 'Equidenpass',
  water_values: 'Wasserwerte-Tagebuch',
  stock_list: 'Besatz-Liste',
  maintenance: 'Wartungs-Erinnerungen',
  documents: 'Dokumenten-Safe',
  diary: 'Symptom-Tagebuch',
};

export default function PetFileScreen() {
  const route = useRoute();
  const petId = (route.params as { petId: string }).petId;
  const [pet, setPet] = useState<PetRow | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const row = await db.getFirstAsync<PetRow>(
          'SELECT id, name, species, breed, birth_date FROM pets WHERE id = ?',
          [petId]
        );
        if (active) setPet(row ?? null);
      })();
      return () => {
        active = false;
      };
    }, [petId])
  );

  if (!pet) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.empty}>Tierakte wird geladen …</Text>
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
      </Text>

      <Text style={styles.sectionTitle}>Bereiche dieser Akte</Text>
      {(cfg?.modules ?? []).map((m) => (
        <View key={m} style={styles.moduleCard}>
          <Text style={styles.moduleLabel}>{MODULE_LABELS[m] ?? m}</Text>
        </View>
      ))}
      <Text style={styles.footnote}>
        Die Inhalte dieser Bereiche werden im nächsten Entwicklungsschritt gefüllt.
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
  },
  scroll: { padding: spacing.m },
  petName: { fontSize: typography.headline, fontWeight: '700', color: colors.textPrimary },
  petMeta: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.l },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  moduleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  moduleLabel: { fontSize: typography.body, color: colors.textPrimary },
  empty: { fontSize: typography.body, color: colors.textSecondary },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.m,
    lineHeight: 22,
  },
});
