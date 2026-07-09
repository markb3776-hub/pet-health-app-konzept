/**
 * simplyPet: Notfall-Pass (Grundgeruest)
 * Quelle: notfallpass_design_spezifikation.md / technische_spezifikation_offline_strategie.md
 *
 * MUSS zu 100 % offline funktionieren: liest ausschliesslich lokale Daten.
 * Zwei-Tap-Regel: von jedem Bildschirm in maximal zwei Beruehrungen erreichbar.
 * Freigabe-Link (online-only) folgt in Schritt 4 — mit ehrlicher Meldung bei Offline.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { getOwnerName } from '../profile/profileStore';
import { formatDate } from '../time/timeModule';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

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
  photo_uri: string | null;
  color_theme: string | null;
}

interface MedRow {
  type: string;
  name: string;
  dosage: string | null;
}

export default function EmergencyPassScreen() {
  const route = useRoute();
  const routePetId = (route.params as { petId?: string } | undefined)?.petId;
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(routePetId);
  const [allPets, setAllPets] = useState<{ id: string; name: string }[]>([]);
  const [pet, setPet] = useState<PetRow | null>(null);
  const [meds, setMeds] = useState<MedRow[]>([]);
  const [owner, setOwner] = useState<string | null>(null);
  const petId = selectedPetId ?? routePetId;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const pets = await db.getAllAsync<{ id: string; name: string }>(
          'SELECT id, name FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at'
        );
        const row = petId
          ? await db.getFirstAsync<PetRow>(
              'SELECT * FROM pets WHERE id = ? AND deleted_at IS NULL',
              [petId]
            )
          : await db.getFirstAsync<PetRow>(
              'SELECT * FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at LIMIT 1'
            );
        const ownerName = await getOwnerName();
        if (!active) return;
        setAllPets(pets);
        setOwner(ownerName);
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
      {/* Mehrtier-Haushalt: Pass pro Tier umschaltbar (eindeutige Zuordnung) */}
      {allPets.length > 1 ? (
        <View style={styles.petSwitchRow}>
          {allPets.map((p) => (
            <Pressable
              key={p.id}
              style={[styles.petSwitchChip, p.id === pet.id && styles.petSwitchChipActive]}
              onPress={() => setSelectedPetId(p.id)}
              accessibilityLabel={`Notfall-Pass von ${p.name} anzeigen`}
            >
              <Text
                style={[styles.petSwitchText, p.id === pet.id && styles.petSwitchTextActive]}
              >
                {p.name}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.headerRow}>
        {pet.photo_uri ? (
          <Image source={{ uri: pet.photo_uri }} style={styles.petPhoto} />
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petMeta}>
            {cfg?.label ?? pet.species}
            {pet.breed ? ` · ${pet.breed}` : ''}
            {pet.birth_date ? ` · geb. ${formatDate(pet.birth_date)}` : ''}
          </Text>
        </View>
      </View>

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

      {owner ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Halter</Text>
          <Text style={styles.body}>{owner}</Text>
        </View>
      ) : null}

      <Text style={styles.footnote}>
        Dieser Pass funktioniert vollständig ohne Internet – alle Angaben liegen auf deinem Gerät.
        Die digitale Praxis-Freigabe (QR-Code) kommt im Entwicklungsschritt 4.3.
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
  petSwitchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginBottom: spacing.m },
  petSwitchChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  petSwitchChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  petSwitchText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  petSwitchTextActive: { color: '#FFFFFF', fontWeight: '600' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  headerText: { flex: 1 },
  petPhoto: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.border },
  petName: { fontSize: typography.headline, fontWeight: '700', color: colors.textPrimary },
  petMeta: {
    fontSize: typography.body,
    color: colors.textSecondary,
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
