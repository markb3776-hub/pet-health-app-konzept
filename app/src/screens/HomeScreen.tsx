/**
 * simplyPet: Startbildschirm ("Mein Zuhause") – v0.1.2
 * Quelle: technische_spezifikation_screen_flow.md (2.2)
 *
 * Zone 1: Status-Karten ("Heute fällig: …") – Tap oeffnet die Terminliste.
 * Zone 2: Tier-Kacheln (Foto, Name, Status) + Plus-Kachel am Ende.
 * Zone 3: fester Notfallpass-Knopf (Zwei-Tap-Regel).
 * Leerer Zustand: freundliche Anleitungskarte statt leerer Kacheln.
 *
 * v0.1.2 Aenderungen:
 * - FlatList statt ScrollView+map fuer Tier-Kacheln (RAM-Schutz Nr. 25)
 * - Kleine Foto-Dimensionen (Thumbnail-Effekt, Nr. 26)
 * - flexShrink auf Texte (Nr. 18)
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  breed: string | null;
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

// Spezieller Eintrag fuer die "+Tier hinzufuegen"-Kachel am Ende der FlatList
const ADD_TILE_ID = '__add_tile__';
type TileItem = PetRow | { id: typeof ADD_TILE_ID };

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const todayKey = useTodayKey();
  const insets = useSafeAreaInsets();

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
          'SELECT id, name, species, breed, color_theme, photo_uri FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at'
        );
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

  // E-98: Sortierung (alphabetisch oder nach Tierart gruppiert)
  const [sortMode, setSortMode] = useState<'alpha' | 'group'>('alpha');
  const sortedPets = useMemo(() => {
    const sorted = [...pets];
    if (sortMode === 'alpha') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'de'));
    } else {
      // Gruppiert: erst nach Tierart, dann innerhalb alphabetisch
      sorted.sort((a, b) => {
        const speciesCompare = a.species.localeCompare(b.species, 'de');
        if (speciesCompare !== 0) return speciesCompare;
        return a.name.localeCompare(b.name, 'de');
      });
    }
    return sorted;
  }, [pets, sortMode]);

  // FlatList-Daten: Tiere + Add-Kachel am Ende
  const tileData: TileItem[] = hasPets
    ? [...sortedPets, { id: ADD_TILE_ID }]
    : [];

  const renderTile = useCallback(
    ({ item }: ListRenderItemInfo<TileItem>) => {
      if (item.id === ADD_TILE_ID) {
        return (
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
        );
      }
      const pet = item as PetRow;
      const cfg = getSpeciesConfig(pet.species);
      return (
        <Pressable
          style={[
            styles.petTile,
            isLandscape ? styles.petTileLandscape : styles.petTilePortrait,
            { borderLeftColor: pet.color_theme ?? colors.border },
          ]}
          onPress={() => navigation.navigate('Tierakte', { petId: pet.id })}
          accessibilityLabel={`Tierakte von ${pet.name} öffnen`}
        >
          {pet.photo_uri ? (
            <Image
              source={{ uri: pet.photo_uri }}
              style={styles.petPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.petPhoto, styles.petPhotoPlaceholder]}>
              <Text style={styles.petPhotoInitial}>
                {pet.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.petTileBody}>
            <Text style={styles.petName} numberOfLines={1} ellipsizeMode="tail">
              {pet.name}
            </Text>
            {/* E-83: Rasse anzeigen wenn vorhanden, sonst Tierart */}
            <Text style={styles.petSpecies} numberOfLines={1} ellipsizeMode="tail">
              {pet.breed || cfg?.label || pet.species}
            </Text>
          </View>
        </Pressable>
      );
    },
    [isLandscape, navigation]
  );

  const keyExtractor = useCallback((item: TileItem) => item.id, []);

  // Header-Komponente fuer FlatList (Greeting + Status-Karten + Sectiontitle)
  const ListHeader = useCallback(
    () => (
      <View>
        <Text style={styles.greeting}>
          {ownerName ? `Hallo ${ownerName}!` : 'Hallo!'}
        </Text>

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
              <Text style={styles.guideButtonText}>Erstes Tier anlegen</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {overdue > 0 ? (
              <Pressable
                style={[styles.statusCard, styles.statusCardOverdue]}
                onPress={() => (navigation as any).navigate('Tabs', { screen: 'Termine' })}
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
                  <Text style={styles.statusCardTitle} numberOfLines={2} ellipsizeMode="tail">
                    Heute fällig: {r.pet_name} – {r.title}
                  </Text>
                </View>
              ))
            ) : overdue === 0 ? (
              <View style={styles.statusCard}>
                <Text style={styles.statusCardTitle}>Alles versorgt – heute ist nichts fällig.</Text>
              </View>
            ) : null}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meine Tiere</Text>
              {pets.length > 1 ? (
                <Pressable
                  style={styles.sortToggle}
                  onPress={() => setSortMode((m) => m === 'alpha' ? 'group' : 'alpha')}
                  accessibilityLabel={sortMode === 'alpha' ? 'Nach Tierart gruppieren' : 'Alphabetisch sortieren'}
                >
                  <Text style={styles.sortToggleText}>{sortMode === 'alpha' ? 'A-Z' : '▤'}</Text>
                </Pressable>
              ) : null}
            </View>
          </>
        )}
      </View>
    ),
    [ownerName, hasPets, overdue, dueToday, navigation, pets.length, sortMode]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={tileData}
        renderItem={renderTile}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
      />

      {/* Zone 3 entfernt: Notfall ist jetzt 5. Tab (E-58). Zwei-Tap-Regel
          weiterhin erfuellt: Tab 1x antippen = Notfallpass. */}
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
  statusCardTitle: { fontSize: typography.body, color: colors.textPrimary, flexShrink: 1 },
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.m,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.title,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sortToggle: {
    minWidth: 36,
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  petTilePortrait: { marginBottom: spacing.m },
  petTileLandscape: { flexBasis: '47%', flexGrow: 1, marginBottom: spacing.m },
  petTile: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: spacing.s,
    paddingHorizontal: spacing.m,
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  petPhoto: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.border },
  petPhotoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  petPhotoInitial: { fontSize: typography.title, fontWeight: '700', color: colors.textSecondary },
  petTileBody: { flex: 1, flexShrink: 1 },
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

});
