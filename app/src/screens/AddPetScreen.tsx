/**
 * simplyPet: Tier hinzufuegen (Grundgeruest, funktionsfaehig)
 * Quelle: technische_spezifikation_screen_flow.md (Onboarding Schritt 3)
 *
 * Minimalprinzip: Nur Tierart und Name sind Pflicht. Alles andere
 * kann spaeter ergaenzt werden ("Du kannst alles später ergänzen").
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getDb, uuid } from '../db/database';
import { SPECIES_LIST } from '../config/species';
import { colors, typography, spacing, minTouchTarget, petColorPalette } from '../theme/theme';

export default function AddPetScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [species, setSpecies] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [colorKey, setColorKey] = useState(petColorPalette[0].key);
  const [saving, setSaving] = useState(false);

  const selectedSpecies = SPECIES_LIST.find((s) => s.key === species);
  const nameLabel = selectedSpecies?.terminology.nameField ?? 'Name';
  const canSave = species !== null && name.trim().length > 0 && !saving;

  async function save() {
    if (!canSave || !species) return;
    setSaving(true);
    try {
      const db = await getDb();
      const hex = petColorPalette.find((c) => c.key === colorKey)?.hex ?? petColorPalette[0].hex;
      await db.runAsync(
        'INSERT INTO pets (id, name, species, color_theme) VALUES (?, ?, ?, ?)',
        [uuid(), name.trim(), species, hex]
      );
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>Welches Tier möchtest du anlegen?</Text>
      <View style={styles.speciesGrid}>
        {SPECIES_LIST.map((s) => (
          <Pressable
            key={s.key}
            style={[styles.speciesChip, species === s.key && styles.speciesChipActive]}
            onPress={() => setSpecies(s.key)}
            accessibilityLabel={s.label}
          >
            <Text
              style={[styles.speciesChipText, species === s.key && styles.speciesChipTextActive]}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{nameLabel}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={selectedSpecies?.isHabitat ? 'z. B. Wohnzimmer-Becken' : 'z. B. Benno'}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.sectionTitle}>Farbe für dieses Tier</Text>
      <View style={styles.colorRow}>
        {petColorPalette.map((c) => (
          <Pressable
            key={c.key}
            accessibilityLabel={`Farbe ${c.label}`}
            style={[
              styles.colorDot,
              { backgroundColor: c.hex },
              colorKey === c.key && styles.colorDotActive,
            ]}
            onPress={() => setColorKey(c.key)}
          />
        ))}
      </View>

      <Text style={styles.footnote}>
        Nur Tierart und {nameLabel.toLowerCase()} sind nötig – alles andere kannst du später in
        Ruhe ergänzen.
      </Text>

      <Pressable
        style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        disabled={!canSave}
        onPress={save}
        accessibilityLabel="Tier speichern"
      >
        <Text style={styles.saveButtonText}>{saving ? 'Speichert …' : 'Speichern'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
    marginTop: spacing.l,
  },
  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  speciesChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  speciesChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  speciesChipText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  speciesChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    fontSize: typography.body,
    color: colors.textPrimary,
    minHeight: minTouchTarget,
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  colorDot: { width: 40, height: 40, borderRadius: 20 },
  colorDotActive: { borderWidth: 3, borderColor: colors.textPrimary },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.l,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.l,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
});
