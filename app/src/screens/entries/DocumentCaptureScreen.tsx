/**
 * simplyPet: Dokument fotografieren (Teilauftrag 4.2)
 * Quelle: Screen-Flow 2.4 (MVP-Flow "Dokument scannen") + Berechtigungs-Konzept.
 *
 * Verbindlicher Ablauf:
 * 1. EHRLICHE Berechtigungs-Erklaerung VOR dem System-Dialog
 *    ("Wir brauchen die Kamera für das Foto.") – keine stille Abfrage.
 * 2. System-Dialog zur Kamera-Freigabe -> Kamera-Sucher -> Ausloesen.
 * 3. Tier-Zuordnung (bei einem Tier automatisch).
 * 4. Bestaetigung mit dem ehrlichen Hinweis: "Foto gespeichert.
 *    Automatisches Auslesen kommt in einer späteren Version."
 *
 * Das Foto wird in der Dokumenten-Ablage des Tieres gespeichert (documents).
 */
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getDb, uuid } from '../../db/database';
import { colors, typography, spacing, minTouchTarget } from '../../theme/theme';
import { PetPicker, FieldLabel, Hint, SaveButton, ChoiceChips } from '../../components/FormParts';
import { usePets, useEntryForm } from '../../forms/useEntryForm';
import { nowUtcIso } from '../../time/timeModule';

const DOC_TYPES = ['Impfpass', 'Befund', 'Rechnung', 'Amtlich', 'Sonstiges'];

interface DocumentDraft {
  petId: string | null;
  photoUri: string | null;
  title: string;
  docType: string;
}

export default function DocumentCaptureScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const presetPetId = (route.params as { petId?: string } | undefined)?.petId ?? null;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { pets, loaded } = usePets();
  const [asking, setAsking] = useState(false);

  const emptyForm = useMemo<DocumentDraft>(
    () => ({ petId: presetPetId, photoUri: null, title: '', docType: 'Sonstiges' }),
    [presetPetId]
  );

  const { form, update, saving, saved, runSave } = useEntryForm<DocumentDraft>({
    draftKey: 'entry_document',
    emptyForm,
    resumeDescription: 'Du hattest begonnen, ein Dokument abzulegen',
    isDirty: (f) => f.photoUri !== null || f.title.trim().length > 0,
  });

  const effectivePetId = form.petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === effectivePetId);
  const canSave = effectivePetId !== null && form.photoUri !== null && !saving && !saved;

  /**
   * Schritt 1+2 des Spez-Flows: Ehrliche Erklaerung VOR dem System-Dialog.
   * Erst wenn der Nutzer sie gelesen und bestaetigt hat, erscheint die
   * Android-Berechtigungsabfrage – kein Ueberrumpeln (Berechtigungs-Konzept).
   */
  function explainThenCapture() {
    if (asking) return;
    Alert.alert(
      'Kamera-Freigabe',
      'Wir brauchen die Kamera für das Foto deines Dokuments. Das Bild bleibt auf deinem Gerät und wird nur in der Akte deines Tieres abgelegt.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Weiter', onPress: () => void capturePhoto() },
      ]
    );
  }

  async function capturePhoto() {
    setAsking(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Kamera nicht freigegeben',
          'Ohne Kamera-Freigabe kann kein Foto aufgenommen werden. Du kannst das Dokument stattdessen aus der Galerie wählen – oder die Freigabe in den Android-Einstellungen erteilen.'
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
      if (!result.canceled && result.assets[0]) update('photoUri', result.assets[0].uri);
    } catch {
      Alert.alert('Foto nicht möglich', 'Das Foto konnte nicht aufgenommen werden. Bitte versuche es erneut.');
    } finally {
      setAsking(false);
    }
  }

  async function pickFromGallery() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Galerie nicht freigegeben', 'Ohne Freigabe kann kein Bild aus der Galerie gewählt werden.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
      if (!result.canceled && result.assets[0]) update('photoUri', result.assets[0].uri);
    } catch {
      Alert.alert('Foto nicht möglich', 'Das Bild konnte nicht übernommen werden. Bitte versuche es erneut.');
    }
  }

  async function save() {
    if (!canSave || !effectivePetId || !form.photoUri) return;
    await runSave(
      async () => {
        const db = await getDb();
        const ts = nowUtcIso();
        await db.runAsync(
          `INSERT INTO documents (id, pet_id, title, doc_type, file_uri, upload_date, created_at, updated_at, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
          [
            uuid(),
            effectivePetId,
            form.title.trim() || form.docType,
            form.docType,
            form.photoUri,
            ts,
            ts,
            ts,
          ]
        );
      },
      {
        // Ehrliche Bestaetigung exakt gemaess Screen-Flow 2.4.
        title: 'Foto gespeichert',
        message: `Das Dokument liegt sicher in der Akte von ${pet?.name ?? 'deinem Tier'}. Automatisches Auslesen kommt in einer späteren Version.`,
      }
    );
  }

  if (loaded && pets.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Lege zuerst ein Tier an – danach kannst du Dokumente ablegen.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <View style={isLandscape ? styles.landscapeColumns : undefined}>
          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <FieldLabel>Das Dokument</FieldLabel>
            {form.photoUri ? (
              <View>
                <Image source={{ uri: form.photoUri }} style={styles.photo} resizeMode="cover" />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => update('photoUri', null)}
                  accessibilityLabel="Foto verwerfen und neu aufnehmen"
                >
                  <Text style={styles.photoRemoveText}>Foto verwerfen und neu aufnehmen</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable
                  style={styles.captureButton}
                  onPress={explainThenCapture}
                  accessibilityLabel="Dokument fotografieren"
                >
                  <Text style={styles.captureButtonText}>📷 Dokument fotografieren</Text>
                </Pressable>
                <Pressable
                  style={styles.galleryButton}
                  onPress={pickFromGallery}
                  accessibilityLabel="Aus Galerie wählen"
                >
                  <Text style={styles.galleryButtonText}>🖼 Aus der Galerie wählen</Text>
                </Pressable>
                <Hint>
                  Tipp: Lege das Dokument flach hin und nutze gutes Licht – so bleibt alles gut lesbar.
                </Hint>
              </>
            )}
          </View>

          <View style={isLandscape ? styles.landscapeColumn : undefined}>
            <PetPicker
              pets={pets}
              selectedId={effectivePetId}
              onSelect={(id) => update('petId', id)}
              label="Zu welchem Tier gehört es?"
            />

            <FieldLabel>Art des Dokuments</FieldLabel>
            <ChoiceChips
              options={DOC_TYPES}
              value={form.docType}
              onChange={(v) => update('docType', v ?? 'Sonstiges')}
              allowDeselect={false}
            />

            <FieldLabel>Titel (optional)</FieldLabel>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(t) => update('title', t)}
              placeholder="z. B. Rechnung Zahn-OP"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Titel des Dokuments"
            />
          </View>
        </View>

        <SaveButton onPress={save} disabled={!canSave} saving={saving} label="In der Akte ablegen" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  landscapeColumns: { flexDirection: 'row', gap: spacing.xl },
  landscapeColumn: { flex: 1 },
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
  captureButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: minTouchTarget + 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonText: { fontSize: typography.button, color: '#FFFFFF', fontWeight: '700' },
  galleryButton: {
    marginTop: spacing.s,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: { fontSize: typography.body, color: colors.textPrimary },
  photo: { width: '100%', height: 280, borderRadius: 12, backgroundColor: colors.border },
  photoRemove: { marginTop: spacing.s, minHeight: minTouchTarget - 8, justifyContent: 'center' },
  photoRemoveText: { fontSize: typography.bodySmall, color: colors.signalRed },
  emptyWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.l },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});
