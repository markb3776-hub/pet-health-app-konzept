/**
 * simplyPet: Startbildschirm ("Mein Zuhause")
 * Quelle: app_struktur_konzept.md (3 Zonen) / technische_spezifikation_screen_flow.md
 *
 * Zone 1: Was jetzt wichtig ist (Status/Aufgaben)
 * Zone 2: Meine Tiere (Kacheln)
 * Zone 3: Notfall-Knopf (fest verankert, Zwei-Tap-Regel)
 */
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

interface PetRow {
  id: string;
  name: string;
  species: string;
  color_theme: string | null;
  photo_uri: string | null;
}

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pets, setPets] = useState<PetRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const rows = await db.getAllAsync<PetRow>(
          'SELECT id, name, species, color_theme, photo_uri FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at'
        );
        if (active) setPets(rows);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Zone 1: Was jetzt wichtig ist */}
        <Text style={styles.statusLine}>
          {pets.length === 0
            ? 'Willkommen! Lege dein erstes Tier an – so beginnt deine Tierakte.'
            : 'Alles versorgt – keine offenen Aufgaben.'}
        </Text>

        {/* Zone 2: Meine Tiere */}
        <Text style={styles.sectionTitle}>Meine Tiere</Text>
        {pets.map((pet) => {
          const cfg = getSpeciesConfig(pet.species);
          return (
            <Pressable
              key={pet.id}
              style={[styles.petTile, { borderLeftColor: pet.color_theme ?? colors.border }]}
              onPress={() => navigation.navigate('Tierakte', { petId: pet.id })}
            >
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petSpecies}>{cfg?.label ?? pet.species}</Text>
            </Pressable>
          );
        })}
        <Pressable style={styles.addTile} onPress={() => navigation.navigate('TierAnlegen')}>
          <Text style={styles.addTileText}>＋ Tier hinzufügen</Text>
        </Pressable>
      </ScrollView>

      {/* Zone 3: Notfall-Knopf, fest verankert */}
      <Pressable
        style={styles.emergencyButton}
        onPress={() => navigation.navigate('Notfallpass')}
        accessibilityLabel="Notfall-Pass öffnen"
      >
        <Text style={styles.emergencyText}>Notfall-Pass</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m, paddingBottom: 96 },
  statusLine: {
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.title,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.m,
  },
  petTile: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: spacing.m,
    marginBottom: spacing.m,
    minHeight: minTouchTarget,
  },
  petName: { fontSize: typography.title, color: colors.textPrimary, fontWeight: '600' },
  petSpecies: { fontSize: typography.bodySmall, color: colors.textSecondary },
  addTile: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: spacing.m,
    alignItems: 'center',
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  addTileText: { fontSize: typography.body, color: colors.textSecondary },
  emergencyButton: {
    position: 'absolute',
    bottom: spacing.m,
    left: spacing.m,
    right: spacing.m,
    backgroundColor: colors.emergency,
    borderRadius: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
});
