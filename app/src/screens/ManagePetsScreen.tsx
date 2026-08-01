/**
 * simplyPet: Tiere verwalten (Teilauftrag 4.2)
 * Quelle: Screen-Flow 2.6 (Mehr-Bereich, "Tiere verwalten"), Datenmodell 2.1
 * (pets.archived – verstorbene oder abgegebene Tiere verschwinden nicht,
 * ihre Geschichte bleibt erhalten).
 *
 * - Aktive Tiere: bearbeiten (-> Stammdaten) oder ins Archiv verschieben.
 * - Archiv: eigene Sektion, reaktivierbar. EHRLICHER Hinweis: Alle Daten
 *   bleiben vollstaendig erhalten, das Tier wird nur ausgeblendet.
 * - Kein Loeschen im Prototyp: bewusste Entscheidung gegen versehentlichen
 *   Datenverlust (Doktrin) – ehrlich kommuniziert.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MoreStackParamList } from '../navigation/AppNavigator';
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';
import { nowUtcIso } from '../time/timeModule';
import ScreenBackground from '../components/ScreenBackground';

interface PetRow {
  id: string;
  name: string;
  species: string;
  color_theme: string | null;
  photo_uri: string | null;
  archived: number;
}

export default function ManagePetsScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MoreStackParamList>>();
  const [active, setActive] = useState<PetRow[]>([]);
  const [archived, setArchived] = useState<PetRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    try {
      const db = await getDb();
      const rows = await db.getAllAsync<PetRow>(
        `SELECT id, name, species, color_theme, photo_uri, archived
         FROM pets WHERE deleted_at IS NULL ORDER BY created_at ASC`
      );
      setActive(rows.filter((r) => r.archived === 0));
      setArchived(rows.filter((r) => r.archived === 1));
    } catch {
      // Anzeige bleibt beim letzten Stand.
    } finally {
      setLoaded(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  function confirmArchive(pet: PetRow) {
    Alert.alert(
      `${pet.name} ins Archiv verschieben?`,
      'Alle Einträge, Dokumente und Erinnerungen bleiben vollständig erhalten. Das Tier wird nur von der Startseite ausgeblendet und du kannst es hier jederzeit zurückholen.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Ins Archiv',
          onPress: async () => {
            try {
              const db = await getDb();
              await db.runAsync(
                `UPDATE pets SET archived = 1, updated_at = ?, is_synced = 0 WHERE id = ?`,
                [nowUtcIso(), pet.id]
              );
              // E-93: Auto-Backup nach jeder Datenaenderung
              try { const { autoBackup } = require('../backup/backupService'); autoBackup(); } catch {}
              await reload();
            } catch {
              Alert.alert('Nicht möglich', 'Das Archivieren hat nicht geklappt. Bitte versuche es erneut.');
            }
          },
        },
      ]
    );
  }

  async function reactivate(pet: PetRow) {
    try {
      const db = await getDb();
      await db.runAsync(
        `UPDATE pets SET archived = 0, updated_at = ?, is_synced = 0 WHERE id = ?`,
        [nowUtcIso(), pet.id]
      );
      // E-93: Auto-Backup nach jeder Datenaenderung
      try { const { autoBackup } = require('../backup/backupService'); autoBackup(); } catch {}
      await reload();
      Alert.alert('Zurückgeholt', `${pet.name} ist wieder auf deiner Startseite.`);
    } catch {
      Alert.alert('Nicht möglich', 'Das Zurückholen hat nicht geklappt. Bitte versuche es erneut.');
    }
  }

  function renderPet(pet: PetRow, isArchived: boolean) {
    const speciesLabel = getSpeciesConfig(pet.species)?.label ?? pet.species;
    return (
      <View key={pet.id} style={[styles.petCard, { borderLeftColor: pet.color_theme ?? colors.border }]}>
        {pet.photo_uri ? (
          <Image source={{ uri: pet.photo_uri }} style={styles.petPhoto} />
        ) : (
          <View style={[styles.petPhoto, styles.petPhotoEmpty]}>
            <Text style={styles.petPhotoLetter}>{pet.name.slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petSpecies}>{speciesLabel}</Text>
        </View>
        <View style={styles.petActions}>
          {isArchived ? (
            <Pressable style={styles.actionButton} onPress={() => reactivate(pet)} accessibilityLabel={`${pet.name} zurückholen`}>
              <Text style={styles.actionText}>Zurückholen</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={styles.actionButton}
                onPress={() => navigation.navigate('StammdatenBearbeiten', { petId: pet.id })}
                accessibilityLabel={`Stammdaten von ${pet.name} bearbeiten`}
              >
                <Text style={styles.actionText}>Bearbeiten</Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => confirmArchive(pet)} accessibilityLabel={`${pet.name} archivieren`}>
                <Text style={[styles.actionText, styles.archiveText]}>Archiv</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <ScreenBackground>
    <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}>
      <Text style={styles.sectionTitle}>Deine Tiere</Text>
      {loaded && active.length === 0 ? (
        <Text style={styles.emptyText}>Kein aktives Tier. Lege auf der Startseite eines an – oder hole eines aus dem Archiv zurück.</Text>
      ) : (
        active.map((p) => renderPet(p, false))
      )}

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('TierAnlegen', undefined)}
        accessibilityLabel="Neues Tier anlegen"
      >
        <Text style={styles.addButtonText}>+ Neues Tier anlegen</Text>
      </Pressable>

      {archived.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Archiv</Text>
          <Text style={styles.archiveHint}>
            Archivierte Tiere sind ausgeblendet, aber nichts ist verloren: Alle Einträge, Dokumente
            und Erinnerungen bleiben vollständig erhalten.
          </Text>
          {archived.map((p) => renderPet(p, true))}
        </>
      ) : null}

      <Text style={styles.footnote}>
        Ein endgültiges Löschen gibt es bewusst nicht – so kann keine Tiergeschichte versehentlich
        verloren gehen.
      </Text>
    </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
    marginTop: spacing.l,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderLeftWidth: 6,
    padding: spacing.m,
    marginBottom: spacing.s,
    gap: spacing.m,
  },
  petPhoto: { width: 52, height: 52, borderRadius: 26 },
  petPhotoEmpty: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  petPhotoLetter: { fontSize: typography.title, fontWeight: '700', color: colors.textPrimary },
  petInfo: { flex: 1 },
  petName: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  petSpecies: { fontSize: typography.bodySmall, color: colors.textSecondary },
  petActions: { flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-end' },
  actionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.m,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  actionText: { fontSize: typography.bodySmall, color: colors.primary, fontWeight: '600' },
  archiveText: { color: colors.textSecondary },
  addButton: {
    marginTop: spacing.s,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 14,
    minHeight: minTouchTarget + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { fontSize: typography.body, color: '#000000', fontWeight: '600' },
  archiveHint: {
    fontSize: typography.bodySmall,
    color: '#000000',
    lineHeight: 22,
    marginBottom: spacing.m,
  },
  emptyText: { fontSize: typography.body, color: '#000000', lineHeight: 26 },
  footnote: {
    fontSize: typography.bodySmall,
    color: '#000000',
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 22,
  },
});
