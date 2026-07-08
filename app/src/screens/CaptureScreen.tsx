/**
 * simplyPet: Erfassen-Dialog (Grundgeruest)
 * Quelle: technische_spezifikation_screen_flow.md
 *
 * Gefuehrter Dialog: Was moechtest du festhalten?
 * Doktrin-Regel: Foto-Ablage ist ehrlich beschriftet — die App legt das
 * Foto ab, liest es aber NICHT automatisch aus (kein toter Knopf,
 * kein falsches Versprechen). Automatisches Auslesen kommt spaeter.
 */
import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

const CAPTURE_OPTIONS: { key: string; label: string; hint: string }[] = [
  {
    key: 'impfung',
    label: 'Impfung eintragen',
    hint: 'Impfstoff, Datum und Gültigkeit festhalten – die Erinnerung entsteht automatisch.',
  },
  {
    key: 'gewicht',
    label: 'Gewicht festhalten',
    hint: 'Ein Wert genügt – die Verlaufskurve entsteht von selbst.',
  },
  {
    key: 'foto',
    label: 'Dokument fotografieren',
    hint: 'Das Foto wird sicher in der Akte abgelegt. Automatisches Auslesen kommt in einer späteren Version.',
  },
  {
    key: 'notiz',
    label: 'Beobachtung notieren',
    hint: 'Symptome oder Auffälligkeiten – hilfreich für den nächsten Tierarztbesuch.',
  },
];

export default function CaptureScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.headline}>Was möchtest du festhalten?</Text>
      {CAPTURE_OPTIONS.map((opt) => (
        <Pressable
          key={opt.key}
          style={styles.option}
          accessibilityLabel={opt.label}
          onPress={() => {
            /* Detail-Dialoge folgen in Roadmap Schritt 4 (Entwicklung) */
          }}
        >
          <Text style={styles.optionLabel}>{opt.label}</Text>
          <Text style={styles.optionHint}>{opt.hint}</Text>
        </Pressable>
      ))}
      <Text style={styles.footnote}>
        Alles wird zuerst auf deinem Gerät gespeichert und funktioniert auch ohne Internet.
      </Text>
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
  option: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    minHeight: minTouchTarget,
  },
  optionLabel: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  optionHint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.l,
    lineHeight: 22,
  },
});
