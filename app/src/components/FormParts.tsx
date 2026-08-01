/**
 * simplyPet: Gemeinsame Formular-Bausteine (Teilauftrag 4.2)
 *
 * Wiederverwendbare Teile fuer alle Eintrags-Formulare:
 * - PetPicker: Tier-Auswahl mit Foto, Name und Kennfarbe (Mehrtier-Haushalte,
 *   eindeutige Zuordnung gemaess Mehrtier-Konzept). Bei genau einem Tier wird
 *   es automatisch vorgewaehlt.
 * - FieldLabel / Hint / SaveButton / ChoiceChips: einheitliche Optik,
 *   grosse Touchflaechen (Zielgruppe 50+).
 */
import React, { useRef } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';
import { getSpeciesConfig } from '../config/species';

export interface PetOption {
  id: string;
  name: string;
  species: string;
  color_theme: string | null;
  photo_uri: string | null;
}

export function PetPicker({
  pets,
  selectedId,
  onSelect,
  label = 'Für welches Tier?',
}: {
  pets: PetOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label?: string;
}) {
  if (pets.length <= 1) return null; // ein Tier: automatisch zugeordnet, kein Extra-Schritt
  return (
    <View style={styles.pickerWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.petRow}>
        {pets.map((p) => {
          const active = p.id === selectedId;
          const speciesLabel = getSpeciesConfig(p.species)?.label ?? p.species;
          return (
            <Pressable
              key={p.id}
              style={[
                styles.petChip,
                { borderColor: p.color_theme ?? colors.border },
                active && { backgroundColor: p.color_theme ?? colors.primary },
              ]}
              onPress={() => onSelect(p.id)}
              accessibilityLabel={`Tier ${p.name} (${speciesLabel}) wählen`}
            >
              {p.photo_uri ? (
                <Image source={{ uri: p.photo_uri }} style={styles.petPhoto} />
              ) : (
                <View style={[styles.petPhoto, styles.petPhotoEmpty]}>
                  <Text style={styles.petPhotoLetter}>{p.name.slice(0, 1).toUpperCase()}</Text>
                </View>
              )}
              <View style={styles.petTextWrap}>
                <Text style={[styles.petName, active && styles.petNameActive]} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={[styles.petSpecies, active && styles.petSpeciesActive]}>
                  {speciesLabel}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Hint({ children }: { children: React.ReactNode }) {
  return <Text style={styles.hint}>{children}</Text>;
}

/** Einzeilige Auswahl-Chips (z. B. Vorfallart, Dokument-Typ, Geschlecht). */
export function ChoiceChips({
  options,
  value,
  onChange,
  allowDeselect = true,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  allowDeselect?: boolean;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <Pressable
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(active && allowDeselect ? null : opt)}
            accessibilityLabel={opt}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SaveButton({
  onPress,
  disabled,
  saving,
  label = 'Speichern',
}: {
  onPress: () => void;
  disabled: boolean;
  saving: boolean;
  label?: string;
}) {
  // Doppelklick-Schutz (Praevention Nr. 7): 1 Sekunde Cooldown nach Tap
  const lastTap = useRef(0);
  function handlePress() {
    const now = Date.now();
    if (now - lastTap.current < 1000) return; // Doppelklick ignorieren
    lastTap.current = now;
    onPress();
  }
  return (
    <Pressable
      style={[styles.saveButton, disabled && styles.saveButtonDisabled]}
      disabled={disabled || saving}
      onPress={handlePress}
      accessibilityLabel={label}
    >
      <Text style={styles.saveButtonText}>{saving ? 'Speichert …' : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pickerWrap: { marginBottom: spacing.s },
  label: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
    marginTop: spacing.l,
  },
  hint: {
    fontSize: typography.bodySmall,
    color: '#000000',
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  petRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.s,
    paddingRight: spacing.m,
    minHeight: minTouchTarget,
    gap: spacing.s,
  },
  petPhoto: { width: 40, height: 40, borderRadius: 20 },
  petPhotoEmpty: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petPhotoLetter: { fontSize: typography.body, fontWeight: '700', color: colors.textPrimary },
  petTextWrap: { maxWidth: 140 },
  petName: { fontSize: typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  petNameActive: { color: '#FFFFFF' },
  petSpecies: { fontSize: typography.bodySmall - 2, color: colors.textSecondary },
  petSpeciesActive: { color: '#FFFFFF' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  saveButton: {
    marginTop: spacing.l,
    minHeight: minTouchTarget + 8,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { fontSize: typography.button, color: '#FFFFFF', fontWeight: '700' },
});
