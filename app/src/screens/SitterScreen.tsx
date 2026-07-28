/**
 * simplyPet: Sitter-Modus (E-105)
 * Quelle: SITTER_MODUS_SPEZIFIKATION.md + SCHLACHTPLAN_STORE_RELEASE.md
 *
 * Generiert ein Info-Paket und eine Tierarzt-Vollmacht als PDF.
 * Sitter-Daten (Name, Telefon, Zeitraum) werden hier eingegeben.
 * Tier-Daten werden aus der DB geladen (Stammdaten + Sitter-Felder).
 * Unterschrift wird einmalig erfasst und in AsyncStorage gespeichert.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Pressable,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import SignatureScreen from 'react-native-signature-canvas';
import { getDb } from '../db/database';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';
import DateField from '../components/DateField';
import { FieldLabel, Hint, SaveButton } from '../components/FormParts';
import { getOwnerName, getOwnerPhone } from '../profile/profileStore';
import { todayKey } from '../time/timeModule';
import { buildSitterInfoHtml, type SitterPetData, type SitterContext } from '../sitter/sitterPdf';
import { buildVollmachtHtml, buildVollmachtQrPayload, type VollmachtData } from '../sitter/vollmachtPdf';

const SIG_KEY = 'simplypet.owner_signature';

interface PetSitterRow {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  special_features: string | null;
  photo_uri: string | null;
  allergies: string | null;
  pre_conditions: string | null;
  sitter_feeding: string | null;
  sitter_routine: string | null;
  sitter_behavior: string | null;
  sitter_equipment: string | null;
  sitter_climate: string | null;
  sitter_notes: string | null;
  specialist_vet_name: string | null;
  specialist_vet_phone: string | null;
  vet_practice_name: string | null;
  vet_practice_phone: string | null;
}

interface MedRow {
  name: string;
  dosage: string | null;
  hint_text: string | null;
}

export default function SitterScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const petId = (route.params as { petId: string }).petId;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [pet, setPet] = useState<PetSitterRow | null>(null);
  const [meds, setMeds] = useState<MedRow[]>([]);
  const [sitterName, setSitterName] = useState('');
  const [sitterPhone, setSitterPhone] = useState('');
  const [periodFrom, setPeriodFrom] = useState<string | null>(null);
  const [periodTo, setPeriodTo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [sigModalOpen, setSigModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  const sigRef = useRef<any>(null);

  // Daten laden
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const db = await getDb();
        const row = await db.getFirstAsync<PetSitterRow>(
          `SELECT id, name, species, breed, gender, birth_date, special_features, photo_uri,
                  allergies, pre_conditions, sitter_feeding, sitter_routine, sitter_behavior,
                  sitter_equipment, sitter_climate, sitter_notes,
                  specialist_vet_name, specialist_vet_phone, vet_practice_name, vet_practice_phone
           FROM pets WHERE id = ?`,
          [petId]
        );
        if (!active) return;
        if (row) setPet(row);

        // Aktive Medikamente laden
        const medRows = await db.getAllAsync<MedRow>(
          `SELECT name, dosage, hint_text FROM medications
           WHERE pet_id = ? AND deleted_at IS NULL
             AND (end_date IS NULL OR end_date >= ?)
           ORDER BY name`,
          [petId, todayKey()]
        );
        if (active) setMeds(medRows);

        // Owner-Daten
        const on = await getOwnerName();
        const op = await getOwnerPhone();
        if (active) {
          setOwnerName(on ?? '');
          setOwnerPhone(op ?? '');
        }

        // Gespeicherte Unterschrift laden
        const storedSig = await AsyncStorage.getItem(SIG_KEY);
        if (active && storedSig) setSignature(storedSig);
      } catch {
        // Fehler ignorieren, Felder bleiben leer
      }
    })();
    return () => { active = false; };
  }, [petId]);

  // Unterschrift speichern
  const handleSignatureOK = useCallback((sig: string) => {
    setSignature(sig);
    AsyncStorage.setItem(SIG_KEY, sig).catch(() => {});
    setSigModalOpen(false);
  }, []);

  const handleSignatureClear = useCallback(() => {
    sigRef.current?.clearSignature();
  }, []);

  // PDF generieren und teilen
  async function generateAndShare(type: 'info' | 'vollmacht' | 'both') {
    if (!pet) return;
    if (!sitterName.trim()) {
      Alert.alert('Name fehlt', 'Bitte gib den Namen des Tiersitters ein.');
      return;
    }
    if (!periodFrom || !periodTo) {
      Alert.alert('Zeitraum fehlt', 'Bitte gib den Zeitraum (von–bis) an.');
      return;
    }
    setGenerating(true);
    try {
      let photoDataUri: string | null = null;
      if (pet.photo_uri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(pet.photo_uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          photoDataUri = `data:image/jpeg;base64,${base64}`;
        } catch {
          photoDataUri = null;
        }
      }

      const ctx: SitterContext = {
        sitterName: sitterName.trim(),
        sitterPhone: sitterPhone.trim(),
        periodFrom,
        periodTo,
      };

      const petData: SitterPetData = {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        birthDate: pet.birth_date,
        specialFeatures: pet.special_features,
        photoDataUri,
        sitterFeeding: pet.sitter_feeding,
        sitterRoutine: pet.sitter_routine,
        sitterBehavior: pet.sitter_behavior,
        sitterEquipment: pet.sitter_equipment,
        sitterClimate: pet.sitter_climate,
        sitterNotes: pet.sitter_notes,
        allergies: pet.allergies,
        preConditions: pet.pre_conditions,
        medications: meds.map((m) => ({ name: m.name, dosage: m.dosage ?? '', hint: m.hint_text ?? '' })),
        vetName: pet.specialist_vet_name,
        vetPhone: pet.specialist_vet_phone ?? '',
        practiceName: pet.vet_practice_name,
        practicePhone: pet.vet_practice_phone ?? '',
        ownerName,
        ownerPhone,
      };

      const uris: string[] = [];
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      const safeName = pet.name.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_');

      if (type === 'info' || type === 'both') {
        const html = buildSitterInfoHtml(petData, ctx);
        const { uri } = await Print.printToFileAsync({ html });
        const infoName = `Sitter_Info_${safeName}_${dateStr}.pdf`;
        const dir = uri.substring(0, uri.lastIndexOf('/'));
        const newUri = `${dir}/${infoName}`;
        await FileSystem.moveAsync({ from: uri, to: newUri });
        uris.push(newUri);
      }

      if (type === 'vollmacht' || type === 'both') {
        // QR-Code als SVG-DataURI (vereinfacht: wir nutzen keinen QR im PDF wenn kein QR-Lib fuer HTML)
        const vollmachtData: VollmachtData = {
          ownerName,
          ownerPhone,
          sitterName: sitterName.trim(),
          sitterPhone: sitterPhone.trim(),
          petName: pet.name,
          petSpecies: pet.species,
          petBreed: pet.breed ?? '',
          periodFrom,
          periodTo,
          vetName: pet.specialist_vet_name ?? pet.vet_practice_name ?? '',
          vetPhone: pet.specialist_vet_phone ?? pet.vet_practice_phone ?? '',
          signatureBase64: signature,
          qrDataUri: null, // QR wird im PDF nicht eingebettet (expo-print hat kein JS-Rendering)
        };
        const html = buildVollmachtHtml(vollmachtData);
        const { uri } = await Print.printToFileAsync({ html });
        const vmName = `Vollmacht_${safeName}_${dateStr}.pdf`;
        const dir = uri.substring(0, uri.lastIndexOf('/'));
        const newUri = `${dir}/${vmName}`;
        await FileSystem.moveAsync({ from: uri, to: newUri });
        uris.push(newUri);
      }

      // Teilen (erstes PDF; bei "both" nacheinander)
      if (uris.length > 0 && (await Sharing.isAvailableAsync())) {
        for (const u of uris) {
          await Sharing.shareAsync(u, {
            mimeType: 'application/pdf',
            dialogTitle: `Sitter-Modus: ${pet.name}`,
          });
        }
      } else {
        Alert.alert('Teilen nicht verfügbar', 'Das PDF wurde erstellt, konnte aber nicht geteilt werden.');
      }
    } catch {
      Alert.alert('Fehler', 'Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    } finally {
      setGenerating(false);
    }
  }

  if (!pet) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loading}>Lade Tierdaten…</Text>
      </View>
    );
  }

  const canGenerate = sitterName.trim().length > 0 && periodFrom && periodTo && !generating;

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <Text style={styles.headline}>Sitter-Modus: {pet.name}</Text>
        <Hint>
          Generiere ein Info-Paket und eine Tierarzt-Vollmacht für deinen Tiersitter.
          Die Tier-Infos werden aus den Stammdaten übernommen – pflege sie dort unter „Sitter-Infos".
        </Hint>

        {/* Sitter-Daten */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiersitter</Text>
          <FieldLabel>Name des Sitters *</FieldLabel>
          <TextInput
            style={styles.input}
            value={sitterName}
            onChangeText={setSitterName}
            placeholder="Vor- und Nachname"
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Sitter-Name"
          />
          <FieldLabel>Telefon des Sitters</FieldLabel>
          <TextInput
            style={styles.input}
            value={sitterPhone}
            onChangeText={setSitterPhone}
            placeholder="Mobilnummer"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            accessibilityLabel="Sitter-Telefon"
          />
        </View>

        {/* Zeitraum */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zeitraum *</Text>
          <FieldLabel>Von</FieldLabel>
          <DateField value={periodFrom} onChange={setPeriodFrom} label="Startdatum" allowFuture />
          <FieldLabel>Bis</FieldLabel>
          <DateField value={periodTo} onChange={setPeriodTo} label="Enddatum" allowFuture />
        </View>

        {/* Unterschrift */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unterschrift (für Vollmacht)</Text>
          {signature ? (
            <View>
              <Text style={styles.sigStatus}>✓ Unterschrift hinterlegt</Text>
              <Pressable style={styles.sigButton} onPress={() => setSigModalOpen(true)}>
                <Text style={styles.sigButtonText}>Unterschrift neu erfassen</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Hint>Deine Unterschrift wird einmalig gespeichert und auf allen Vollmachten verwendet.</Hint>
              <Pressable style={styles.sigButton} onPress={() => setSigModalOpen(true)}>
                <Text style={styles.sigButtonText}>Unterschrift erfassen</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Aktionen */}
        <View style={styles.actions}>
          <SaveButton
            onPress={() => generateAndShare('both')}
            disabled={!canGenerate}
            saving={generating}
            label="Info-Paket + Vollmacht erstellen"
          />
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.secondaryButton, !canGenerate && styles.buttonDisabled]}
              onPress={() => generateAndShare('info')}
              disabled={!canGenerate}
            >
              <Text style={styles.secondaryButtonText}>Nur Info-Paket</Text>
            </Pressable>
            <Pressable
              style={[styles.secondaryButton, !canGenerate && styles.buttonDisabled]}
              onPress={() => generateAndShare('vollmacht')}
              disabled={!canGenerate}
            >
              <Text style={styles.secondaryButtonText}>Nur Vollmacht</Text>
            </Pressable>
          </View>
        </View>

        {/* Hinweis zu fehlenden Infos */}
        {!pet.sitter_feeding && !pet.sitter_routine && !pet.sitter_behavior ? (
          <View style={styles.hintBox}>
            <Text style={styles.hintBoxText}>
              Du hast noch keine Sitter-Infos hinterlegt. Gehe in die Stammdaten
              und fülle den Abschnitt „Sitter-Infos" aus – dann wird das Info-Paket richtig informativ.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Unterschrift-Modal */}
      <Modal visible={sigModalOpen} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <View style={[styles.sigModal, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.sigModalTitle}>Unterschrift</Text>
          <Text style={styles.sigModalHint}>Mit dem Finger unterschreiben:</Text>
          <View style={[styles.sigPad, isLandscape && styles.sigPadLandscape]}>
            <SignatureScreen
              ref={sigRef}
              onOK={handleSignatureOK}
              onEmpty={() => Alert.alert('Leer', 'Bitte unterschreibe zuerst.')}
              descriptionText=""
              clearText="Löschen"
              confirmText="Übernehmen"
              webStyle={`.m-signature-pad { box-shadow: none; border: 1px solid #ccc; border-radius: 8px; }
                .m-signature-pad--footer { display: flex; justify-content: space-between; padding: 12px 16px; min-height: 56px; align-items: center; }
                .m-signature-pad--footer .button { font-size: 17px; padding: 10px 28px; border-radius: 10px; font-weight: 600; }
                .m-signature-pad--footer .button.clear { background: #f5f5f5; color: #333; border: 1px solid #ddd; }
                .m-signature-pad--footer .button.save { background: #2E7D32; color: white; }`}
              backgroundColor="white"
              penColor="#1a1a1a"
              dotSize={2}
              minWidth={1.5}
              maxWidth={3}
            />
          </View>
          <Pressable style={[styles.sigCancelButton, { paddingBottom: insets.bottom + 8 }]} onPress={() => setSigModalOpen(false)}>
            <Text style={styles.sigCancelText}>Abbrechen</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scroll: { padding: spacing.m, paddingBottom: 96 },
  headline: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  loading: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
  section: { marginTop: spacing.l },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
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
  actions: { marginTop: spacing.xl },
  actionRow: { flexDirection: 'row', gap: spacing.s, marginTop: spacing.m },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { fontSize: typography.body, color: colors.primary, fontWeight: '600' },
  buttonDisabled: { opacity: 0.4 },
  sigStatus: { fontSize: typography.body, color: colors.primary, fontWeight: '600', marginBottom: spacing.s },
  sigButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    minHeight: minTouchTarget,
    alignItems: 'center',
  },
  sigButtonText: { fontSize: typography.body, color: colors.textPrimary },
  sigModal: { flex: 1, backgroundColor: colors.background, padding: spacing.m },
  sigModalTitle: { fontSize: typography.headline, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs },
  sigModalHint: { fontSize: typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.m },
  sigPad: { flex: 1, maxHeight: 350, borderRadius: 12 },
  sigPadLandscape: { maxHeight: 220 },
  sigCancelButton: {
    marginTop: spacing.m,
    padding: spacing.m,
    alignItems: 'center',
  },
  sigCancelText: { fontSize: typography.body, color: colors.signalRed },
  hintBox: {
    marginTop: spacing.l,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: spacing.m,
  },
  hintBoxText: { fontSize: typography.bodySmall, color: colors.textSecondary, lineHeight: 22 },
});
