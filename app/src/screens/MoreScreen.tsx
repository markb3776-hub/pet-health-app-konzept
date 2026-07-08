/**
 * simplyPet: Mehr-Bereich (Grundgeruest)
 * Quelle: technische_spezifikation_screen_flow.md
 *
 * Einstellungen, Tiere verwalten (inkl. Archiv), Datenschutz, Ueber die App.
 * Nur Eintraege, die im MVP tatsaechlich funktionieren (kein toter Knopf).
 */
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

const MENU: { key: string; label: string; hint: string }[] = [
  {
    key: 'tiere',
    label: 'Tiere verwalten',
    hint: 'Tiere bearbeiten oder ins Archiv verschieben.',
  },
  {
    key: 'erinnerungen',
    label: 'Erinnerungen',
    hint: 'Wann und wie die App dich erinnern darf.',
  },
  {
    key: 'datenschutz',
    label: 'Deine Daten',
    hint: 'Wo deine Daten liegen und wie du sie exportierst oder löschst.',
  },
  {
    key: 'ueber',
    label: 'Über simplyPet',
    hint: 'Version, Quellen der Fachinformationen, Kontakt.',
  },
];

export default function MoreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.headline}>Mehr</Text>
      {MENU.map((item) => (
        <Pressable
          key={item.key}
          style={styles.item}
          accessibilityLabel={item.label}
          onPress={() => {
            /* Unterseiten folgen in Roadmap Schritt 4 (Entwicklung) */
          }}
        >
          <Text style={styles.itemLabel}>{item.label}</Text>
          <Text style={styles.itemHint}>{item.hint}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m },
  headline: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.l,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    minHeight: minTouchTarget,
  },
  itemLabel: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  itemHint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
});
