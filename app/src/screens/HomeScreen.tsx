/**
 * simplyPet: Startbildschirm ("Mein Zuhause")
 * Quelle: technische_spezifikation_screen_flow.md (2.2)
 *
 * Zone 1: Status-Karten ("Heute fällig: …") – Tap oeffnet die Terminliste.
 * Zone 2: Tier-Kacheln (Foto, Name, Status) + Plus-Kachel am Ende.
 * Zone 3: fester Notfallpass-Knopf (Zwei-Tap-Regel).
 * Leerer Zustand: freundliche Anleitungskarte statt leerer Kacheln.
 *
 * Querformat (Screen-Flow 1.1): Tier-Kacheln mehrspaltig, kein
 * Zustandsverlust beim Drehen. Zeit-Modul: "Heute fällig" nutzt
 * useTodayKey (kein stiller Drift nach Mitternacht/Hintergrund).
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getDb } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { getOwnerName } from '../profile/profileStore';
import { useTodayKey } from '../time/timeModule';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

interface PetRow {
  id: string;
  name: string;
  species: string;
  color_theme: string | null;
  photo_uri: string | null;
}

interface ReminderRow {
  id: string;
  pet_id: string;
  title: string;
  due_date: string;
  pet_name: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const todayKey = useTodayKey();

  const [pets, setPets] = useState<PetRow[]>([]);
  const [dueToday, setDueToday] = useState<ReminderRow[]>([]);
  const [overdue, setOverdue] = useState<number>(0);
  const [ownerName, setOwnerNameState] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const rows = await db.getAllAsync<PetRow>(
          'SELECT id, name, species, color_theme, photo_uri FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at'
        );
        // "Heute fällig" ueber das zentrale Zeit-Modul (todayKey), nie mit eigenem Datum.
        // Saisonfenster (season_start/end): Erinnerungen ausserhalb ihrer Monate zaehlen
        // nicht mit – gleiche Logik wie im Termine-Tab (inkl. Jahreswechsel-Fenster).
        const currentMonth = parseInt(todayKey.slice(5, 7), 10);
        const seasonFilter = `(
          r.season_start IS NULL OR r.season_end IS NULL OR (
            CASE WHEN r.season_start <= r.season_end
              THEN ? BETWEEN r.season_start AND r.season_end
              ELSE (? >= r.season_start OR ? <= r.season_end)
            END
          )
        )`;
        const due = await db.getAllAsync<ReminderRow>(
          `SELECT r.id, r.pet_id, r.title, r.due_date, p.name AS pet_name
           FROM reminders r JOIN pets p ON p.id = r.pet_id
           WHERE r.status = 'Offen' AND r.deleted_at IS NULL
             AND p.archived = 0 AND p.deleted_at IS NULL
             AND substr(r.due_date, 1, 10) = ? AND ${seasonFilter}
           ORDER BY r.due_date`,
          [todayKey, currentMonth, currentMonth, currentMonth]
        );
        const over = await db.getFirstAsync<{ n: number }>(
          `SELECT COUNT(*) AS n FROM reminders r JOIN pets p ON p.id = r.pet_id
           WHERE r.status = 'Offen' AND r.deleted_at IS NULL
             AND p.archived = 0 AND p.deleted_at IS NULL
             AND substr(r.due_date, 1, 10) < ? AND ${seasonFilter}`,
          [todayKey, currentMonth, currentMonth, currentMonth]
        );
        const owner = await getOwnerName();
        if (active) {
          setPets(rows);
          setDueToday(due);
          setOverdue(over?.n ?? 0);
          setOwnerNameState(owner);
        }
      })();
      return () => {
        active = false;
      };
    }, [todayKey])
  );

  const hasPets = pets.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>
          {ownerName ? `Hallo ${ownerName}!` : 'Hallo!'}
        </Text>

        {/* Zone 1: Was jetzt wichtig ist */}
        {!hasPets ? (
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>Schön, dass du da bist!</Text>
            <Text style={styles.guideText}>
              Lege dein erstes Tier an – damit beginnt seine Akte. Danach kannst du Gewicht,
              Beobachtungen und Dokumente festhalten und den Notfall-Pass nutzen.
            </Text>
            <Pressable
              style={styles.guideButton}
              onPress={() => navigation.navigate('TierAnlegen', { firstPet: true })}
              accessibilityLabel="Erstes Tier anlegen"
            >
              <Text style={styles.guideButtonText}>＋ Erstes Tier anlegen</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {overdue > 0 ? (
              <Pressable
                style={[styles.statusCard, styles.statusCardOverdue]}
                onPress={() => navigation.navigate('Tabs' as never)}
                accessibilityLabel={`${overdue} überfällige Aufgaben ansehen`}
              >
                <Text style={styles.statusCardTitleOverdue}>
                  {overdue === 1 ? '1 Aufgabe ist überfällig' : `${overdue} Aufgaben sind überfällig`}
                </Text>
                <Text style={styles.statusCardHint}>Im Bereich „Termine" ansehen</Text>
              </Pressable>
            ) : null}
            {dueToday.length > 0 ? (
              dueToday.map((r) => (
                <View key={r.id} style={styles.statusCard}>
                  <Text style={styles.statusCardTitle}>
                    Heute fällig: {r.pet_name} – {r.title}
                  </Text>
                </View>
              ))
            ) : overdue === 0 ? (
              <View style={styles.statusCard}>
                <Text style={styles.statusCardTitle}>Alles versorgt – heute ist nichts fällig.</Text>
              </View>
            ) : null}
          </>
        )}

        {/* Zone 2: Meine Tiere */}
        {hasPets ? (
          <>
            <Text style={styles.sectionTitle}>Meine Tiere</Text>
            <View style={[styles.tileGrid, isLandscape && styles.tileGridLandscape]}>
              {pets.map((pet) => {
                const cfg = getSpeciesConfig(pet.species);
                return (
                  <Pressable
                    key={pet.id}
                    style={[
                      styles.petTile,
                      isLandscape ? styles.petTileLandscape : styles.petTilePortrait,
                      { borderLeftColor: pet.color_theme ?? colors.border },
                    ]}
                    onPress={() => navigation.navigate('Tierakte', { petId: pet.id })}
                    accessibilityLabel={`Tierakte von ${pet.name} öffnen`}
                  >
                    {pet.photo_uri ? (
                      <Image source={{ uri: pet.photo_uri }} style={styles.petPhoto} />
                    ) : (
                      <View style={[styles.petPhoto, styles.petPhotoPlaceholder]}>
                        <Text style={styles.petPhotoInitial}>
                          {pet.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.petTileBody}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petSpecies}>{cfg?.label ?? pet.species}</Text>
                    </View>
                  </Pressable>
                );
              })}
              <Pressable
                style={[
                  styles.addTile,
                  isLandscape ? styles.petTileLandscape : styles.petTilePortrait,
                ]}
                onPress={() => navigation.navigate('TierAnlegen')}
                accessibilityLabel="Weiteres Tier hinzufügen"
              >
                <Text style={styles.addTileText}>＋ Tier hinzufügen</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Zone 3: Notfall-Knopf, fest verankert (Zwei-Tap-Regel, beide Ausrichtungen) */}
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
  greeting: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  guideCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  guideTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  guideText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: spacing.l,
  },
  guideButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideButtonText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  statusCardOverdue: {
    borderWidth: 1,
    borderColor: colors.signalRed,
  },
  statusCardTitle: { fontSize: typography.body, color: colors.textPrimary },
  statusCardTitleOverdue: {
    fontSize: typography.body,
    color: colors.signalRed,
    fontWeight: '700',
  },
  statusCardHint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.title,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.m,
    marginBottom: spacing.m,
  },
  tileGrid: {},
  tileGridLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  petTilePortrait: { marginBottom: spacing.m },
  petTileLandscape: { flexBasis: '47%', flexGrow: 1, marginBottom: 0 },
  petTile: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: spacing.m,
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  petPhoto: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.border },
  petPhotoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  petPhotoInitial: { fontSize: typography.title, fontWeight: '700', color: colors.textSecondary },
  petTileBody: { flex: 1 },
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
