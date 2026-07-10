/**
 * simplyPet: Notfallpass-Schnellzugriff (FAB)
 * Quelle: technische_spezifikation_screen_flow.md (Abschnitt 1):
 * "Der Notfallpass-Knopf ist auf JEDEM Hauptbildschirm als schwebender
 * Button (FAB) oder in der Tab-Bar verankert (Zwei-Tap-Regel)."
 *
 * Der Startbildschirm hat zusaetzlich seinen grossen festen Knopf (Zone 3);
 * dieser FAB sichert die Zwei-Tap-Regel auf Termine und Mehr –
 * in beiden Ausrichtungen (Querformat-Regel 4).
 */
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing } from '../theme/theme';

export default function EmergencyFab({ petId }: { petId?: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable
      style={styles.fab}
      onPress={() => navigation.navigate('Notfallpass', petId ? { petId } : undefined)}
      accessibilityLabel="Notfall-Pass öffnen"
      accessibilityRole="button"
    >
      <Text style={styles.fabIcon}>✚</Text>
      <Text style={styles.fabText}>Notfall</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.m,
    bottom: spacing.m,
    backgroundColor: colors.emergency,
    borderRadius: 32,
    minHeight: 56,
    minWidth: 56,
    paddingHorizontal: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabIcon: { color: '#FFFFFF', fontSize: typography.body, fontWeight: '700' },
  fabText: { color: '#FFFFFF', fontSize: typography.body, fontWeight: '700' },
});
