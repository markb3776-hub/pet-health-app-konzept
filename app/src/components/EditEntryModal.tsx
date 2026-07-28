/**
 * simplyPet: EditEntryModal (E-29/E-76)
 *
 * Modal das alle Felder eines Tierakte-Eintrags anzeigt.
 * Jedes Feld ist einzeln antippbar und editierbar.
 * Nach Speichern: updated_at wird gesetzt + "Bearbeitet am"-Vermerk.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDate } from '../time/timeModule';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

export interface EditableField {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'multiline';
}

interface EditEntryModalProps {
  visible: boolean;
  title: string;
  fields: EditableField[];
  onSave: (updatedFields: Record<string, string>) => void;
  onCancel: () => void;
}

export default function EditEntryModal({
  visible,
  title,
  fields,
  onSave,
  onCancel,
}: EditEntryModalProps) {
  const insets = useSafeAreaInsets();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      const initial: Record<string, string> = {};
      fields.forEach((f) => {
        initial[f.key] = f.value;
      });
      setValues(initial);
      setEditingKey(null);
    }
  }, [visible, fields]);

  function handleFieldTap(key: string) {
    setEditingKey(key);
  }

  function handleValueChange(key: string, newValue: string) {
    setValues((prev) => ({ ...prev, [key]: newValue }));
  }

  function handleSave() {
    onSave(values);
  }

  /** Anzeigewert: Bei Datumsfeldern TT.MM.JJJJ statt YYYY-MM-DD. */
  function displayValue(field: EditableField, raw: string): string {
    if (!raw) return '(leer)';
    if (field.type === 'date') {
      const formatted = formatDate(raw);
      return formatted !== '\u2013' ? formatted : raw;
    }
    return raw;
  }

  const hasChanges = fields.some((f) => values[f.key] !== f.value);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { paddingBottom: spacing.l + insets.bottom }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.hint}>Tippe auf ein Feld um es zu bearbeiten.</Text>

          <ScrollView style={styles.fieldList} keyboardShouldPersistTaps="handled">
            {fields.map((field) => {
              const isEditing = editingKey === field.key;
              const currentValue = values[field.key] ?? '';
              const wasChanged = currentValue !== field.value;

              return (
                <Pressable
                  key={field.key}
                  style={[styles.fieldRow, isEditing && styles.fieldRowActive]}
                  onPress={() => handleFieldTap(field.key)}
                  accessibilityLabel={`${field.label} bearbeiten`}
                >
                  <Text style={styles.fieldLabel}>
                    {field.label}
                    {wasChanged ? ' ✎' : ''}
                  </Text>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.fieldInput,
                        field.type === 'multiline' && styles.fieldInputMultiline,
                      ]}
                      value={currentValue}
                      onChangeText={(t) => handleValueChange(field.key, t)}
                      autoFocus
                      multiline={field.type === 'multiline'}
                      keyboardType={field.type === 'number' ? 'decimal-pad' : 'default'}
                      placeholder={field.type === 'date' ? 'JJJJ-MM-TT' : field.label}
                      placeholderTextColor={colors.textSecondary}
                      onBlur={() => setEditingKey(null)}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, wasChanged && styles.fieldValueChanged]}>
                      {displayValue(field, currentValue)}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Abbrechen</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!hasChanges}
            >
              <Text style={[styles.saveText, !hasChanges && styles.saveTextDisabled]}>
                Speichern
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.l,
    maxHeight: '85%',
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  fieldList: {
    marginBottom: spacing.m,
  },
  fieldRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fieldRowActive: {
    borderColor: colors.primary,
  },
  fieldLabel: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    fontSize: typography.body,
    color: colors.textPrimary,
    minHeight: 24,
  },
  fieldValueChanged: {
    color: colors.primary,
    fontWeight: '600',
  },
  fieldInput: {
    fontSize: typography.body,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  fieldInputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  cancelButton: {
    flex: 1,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  saveButton: {
    flex: 1,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  saveText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveTextDisabled: {
    color: colors.textSecondary,
  },
});
