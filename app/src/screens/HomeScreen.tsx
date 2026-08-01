/**
 * simplyPet: Startbildschirm ("Mein Zuhause") – v0.1.8
 * Quelle: technische_spezifikation_screen_flow.md (2.2)
 *
 * Zone 1: Status-Karten ("Heute fällig: …") – Tap oeffnet die Terminliste.
 * Zone 2: Gruppen-Accordion (E-103) mit Gruppen-Farben (E-101) und Icons (E-102).
 * Zone 3: fester Notfallpass-Knopf (Zwei-Tap-Regel, jetzt 5. Tab).
 *
 * v0.1.8 Aenderungen:
 * - E-101: Farben pro Tiergruppe statt pro Tier
 * - E-102: Gruppen-Icons im Accordion-Header
 * - E-103: Gruppen-Accordion statt flacher Liste
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
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
import ScreenBackground from '../components/ScreenBackground';

// LayoutAnimation fuer Android aktivieren
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

// ─── E-101: Gruppen-Farben ───
const GROUP_COLORS: Record<string, string> = {
  hund: '#008080',
  katze: '#E67E22',
  reptil: '#27AE60',
  aquarium: '#D4AC0D',
  pferd: '#8B4513',
  vogel: '#2980B9',
  frettchen: '#008080',
  // Kleintiere (Nager)
  kaninchen: '#8E44AD',
  meerschweinchen: '#8E44AD',
  chinchilla: '#8E44AD',
  ratte: '#8E44AD',
  maus: '#8E44AD',
  degu: '#8E44AD',
  hamster: '#8E44AD',
};

function getGroupColor(species: string): string {
  return GROUP_COLORS[species] ?? colors.primary;
}

// ─── E-102: Gruppen-Icons ───
const GROUP_ICONS: Record<string, string> = {
  Hunde: '🐕',
  Katzen: '🐈',
  Kleintiere: '🐇',
  Reptilien: '🦎',
  Aquarien: '🐟',
  Pferde: '🐴',
  'Vögel': '🐦',
  Frettchen: '🐾',
};

// ─── E-103: Species → Gruppenname Mapping ───
function getGroupName(species: string): string {
  switch (species) {
    case 'hund': return 'Hunde';
    case 'katze': return 'Katzen';
    case 'kaninchen':
    case 'meerschweinchen':
    case 'chinchilla':
    case 'ratte':
    case 'maus':
    case 'degu':
    case 'hamster':
      return 'Kleintiere';
    case 'frettchen': return 'Frettchen';
    case 'vogel': return 'Vögel';
    case 'reptil': return 'Reptilien';
    case 'pferd': return 'Pferde';
    case 'aquarium': return 'Aquarien';
    default: return 'Sonstige';
  }
}

// Gruppen-Reihenfolge (feste Sortierung)
const GROUP_ORDER = ['Hunde', 'Katzen', 'Kleintiere', 'Frettchen', 'Vögel', 'Reptilien', 'Pferde', 'Aquarien', 'Sonstige'];

interface PetGroup {
  name: string;
  color: string;
  icon: string;
  pets: PetRow[];
}

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const todayKey = useTodayKey();
  const insets = useSafeAreaInsets();

  const [pets, setPets] = useState<PetRow[]>([]);
  const [dueToday, setDueToday] = useState<ReminderRow[]>([]);
  const [overdue, setOverdue] = useState<number>(0);
  const [ownerName, setOwnerNameState] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

  // E-103: Tiere in Gruppen aufteilen
  const groups: PetGroup[] = useMemo(() => {
    const groupMap: Record<string, PetRow[]> = {};
    for (const pet of pets) {
      const gName = getGroupName(pet.species);
      if (!groupMap[gName]) groupMap[gName] = [];
      groupMap[gName].push(pet);
    }
    // Alphabetisch innerhalb jeder Gruppe sortieren
    for (const key of Object.keys(groupMap)) {
      groupMap[key].sort((a, b) => a.name.localeCompare(b.name, 'de'));
    }
    // Gruppen in fester Reihenfolge
    return GROUP_ORDER
      .filter((name) => groupMap[name] && groupMap[name].length > 0)
      .map((name) => ({
        name,
        color: getGroupColor(groupMap[name][0].species),
        icon: GROUP_ICONS[name] ?? '🐾',
        pets: groupMap[name],
      }));
  }, [pets]);

  function toggleGroup(groupName: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  }

  return (
    <ScreenBackground>
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
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
            {/* Status-Karten */}
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

            {/* Meine Tiere Header */}
            <Text style={styles.sectionTitle}>Meine Tiere</Text>

            {/* E-103: Gruppen-Accordion */}
            {groups.map((group) => {
              const isCollapsed = collapsed[group.name] ?? false;
              return (
                <View key={group.name} style={styles.groupContainer}>
                  {/* Gruppen-Header */}
                  <Pressable
                    style={[styles.groupHeader, { backgroundColor: group.color }]}
                    onPress={() => toggleGroup(group.name)}
                    accessibilityLabel={`${group.name} ${isCollapsed ? 'aufklappen' : 'zuklappen'}`}
                  >
                    <Text style={styles.groupIcon}>{group.icon}</Text>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupChevron}>{isCollapsed ? '▼' : '▲'}</Text>
                  </Pressable>

                  {/* Tier-Zeilen (wenn nicht eingeklappt) */}
                  {!isCollapsed && (
                    <View style={[styles.groupBody, { borderColor: group.color }]}>
                      {group.pets.map((pet) => {
                        const cfg = getSpeciesConfig(pet.species);
                        return (
                          <Pressable
                            key={pet.id}
                            style={styles.petRow}
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
                            <Text style={styles.petName} numberOfLines={1} ellipsizeMode="tail">
                              {pet.name}
                            </Text>
                            <Text style={styles.petBreed} numberOfLines={1} ellipsizeMode="tail">
                              {pet.breed || cfg?.label || pet.species}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}

            {/* + Tier hinzufügen */}
            <Pressable
              style={styles.addTile}
              onPress={() => navigation.navigate('TierAnlegen')}
              accessibilityLabel="Weiteres Tier hinzufügen"
            >
              <Text style={styles.addTileText}>＋ Tier hinzufügen</Text>
            </Pressable>
          </>
        )}
            </ScrollView>
    </View>
    </ScreenBackground>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
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
  sectionTitle: {
    fontSize: typography.title,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  // ─── Gruppen-Accordion ───
  groupContainer: {
    marginBottom: spacing.m,
    borderRadius: 12,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.m,
    borderRadius: 12,
    minHeight: minTouchTarget,
  },
  groupIcon: {
    fontSize: 20,
    marginRight: spacing.s,
  },
  groupName: {
    flex: 1,
    fontSize: typography.title,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  groupChevron: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  groupBody: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colors.surface,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.m,
    minHeight: minTouchTarget,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.s,
  },
  petPhoto: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border },
  petPhotoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  petPhotoInitial: { fontSize: typography.body, fontWeight: '700', color: colors.textSecondary },
  petName: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flexShrink: 0,
  },
  petBreed: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    flexShrink: 1,
    marginLeft: spacing.s,
  },
  addTile: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: spacing.m,
    alignItems: 'center',
    minHeight: minTouchTarget,
    justifyContent: 'center',
    marginTop: spacing.s,
  },
  addTileText: { fontSize: typography.body, color: '#000000' },
});
