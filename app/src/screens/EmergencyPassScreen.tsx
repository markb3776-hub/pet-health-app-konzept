/**
 * simplyPet: Notfall-Pass (Teilauftrag 4.3 – vollstaendiges Pass-Design)
 * Quelle: notfallpass_design_spezifikation.md, technische_spezifikation_offline_strategie.md
 *
 * Herzstueck der App. Pass-Charakteristik: Passkarte mit Foto (Tap -> Vollbild,
 * ohne Foto Tierart-Silhouette, NIE ein Fremdbild), Signalement, besondere
 * Erkennungsmerkmale (IMMER sichtbar, leer = ehrlicher Hinweis), Chipnummer
 * mit Kopieren, Notfall-Block in fester Reihenfolge, Halter- und Tierarzt-
 * Kontakt sowie QR-Code und PDF-Teilen.
 *
 * 100 % OFFLINE: Alle Daten kommen aus der lokalen Datenbank. Der QR-Code
 * enthaelt die Notfalldaten als Klartext – jede Handy-Kamera liest ihn ohne
 * Server und ohne App. Die Browser-Freigabe fuer Praxen folgt nach dem
 * Prototyp (ehrlich gekennzeichnet, kein toter Knopf).
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File } from 'expo-file-system';
import { getDb } from '../db/database';
import {
  loadPassData,
  buildSignalement,
  buildQrPayload,
  buildPassHtml,
  PassData,
} from '../emergency/passData';
import { formatDate } from '../time/timeModule';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

export default function EmergencyPassScreen() {
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Systemleiste unten freihalten.
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const routePetId = (route.params as { petId?: string } | undefined)?.petId;

  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(routePetId);
  const [allPets, setAllPets] = useState<{ id: string; name: string }[]>([]);
  const [data, setData] = useState<PassData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [photoFull, setPhotoFull] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [sharing, setSharing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const pets = await db.getAllAsync<{ id: string; name: string }>(
          'SELECT id, name FROM pets WHERE archived = 0 AND deleted_at IS NULL ORDER BY created_at'
        );
        const targetId =
          selectedPetId ?? routePetId ?? (pets.length > 0 ? pets[0].id : undefined);
        const passData = targetId ? await loadPassData(targetId) : null;
        if (!active) return;
        setAllPets(pets);
        setData(passData);
        setLoaded(true);
      })();
      return () => {
        active = false;
      };
    }, [selectedPetId, routePetId])
  );

  async function copyChip() {
    if (!data?.pet.chip_number) return;
    await Clipboard.setStringAsync(data.pet.chip_number);
    Alert.alert('Kopiert', 'Die Chip-Nummer ist in der Zwischenablage.');
  }

  /**
   * PDF-Export im Pass-Layout (Design-Spez Abschnitt 3.3).
   * Das Tierfoto wird als Data-URI eingebettet, damit das PDF auch ohne
   * Zugriff auf den App-Speicher vollstaendig bleibt (E-Mail an Praxis).
   */
  async function sharePdf() {
    if (!data || sharing) return;
    setSharing(true);
    try {
      let photoDataUri: string | null = null;
      if (data.pet.photo_uri) {
        try {
          const file = new File(data.pet.photo_uri);
          const base64 = await file.base64();
          photoDataUri = `data:image/jpeg;base64,${base64}`;
        } catch {
          photoDataUri = null; // Foto nicht lesbar: PDF ehrlich ohne Foto.
        }
      }
      const { uri } = await Print.printToFileAsync({
        html: buildPassHtml(data, photoDataUri),
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Notfall-Pass ${data.pet.name}`,
        });
      } else {
        Alert.alert(
          'Teilen nicht verfügbar',
          'Auf diesem Gerät steht kein Teilen-Dialog zur Verfügung. Das PDF wurde erzeugt, konnte aber nicht geteilt werden.'
        );
      }
    } catch {
      Alert.alert(
        'PDF konnte nicht erstellt werden',
        'Beim Erzeugen des PDFs ist ein Fehler aufgetreten. Deine Daten sind davon nicht betroffen – bitte versuche es erneut.'
      );
    } finally {
      setSharing(false);
    }
  }

  if (!loaded) {
    return <View style={styles.containerCentered} />;
  }

  if (!data) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.empty}>
          Noch kein Tier angelegt. Der Notfall-Pass füllt sich automatisch aus der Tierakte.
        </Text>
      </View>
    );
  }

  const pet = data.pet;
  const signalement = buildSignalement(data);

  /* Passkarte: Kopfbereich im Ausweis-Stil */
  const passCard = (
    <View style={styles.passCard}>
      <View style={styles.headerRow}>
        {pet.photo_uri ? (
          <Pressable
            onPress={() => setPhotoFull(true)}
            accessibilityLabel={`Foto von ${pet.name} bildschirmfüllend anzeigen`}
          >
            <Image source={{ uri: pet.photo_uri }} style={styles.petPhoto} />
          </Pressable>
        ) : (
          /* Ohne Foto: neutraler Tierart-Platzhalter – NIE ein fremdes Beispielbild. */
          <View style={[styles.petPhoto, styles.petPhotoPlaceholder]}>
            <Text style={styles.petPhotoInitial}>{pet.name.charAt(0).toUpperCase()}</Text>
            <Text style={styles.petPhotoSpecies}>{data.speciesLabel}</Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petMeta}>
            {data.speciesLabel}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </Text>
          {signalement.map((row) => (
            <Text key={row} style={styles.sigRow}>
              {row}
            </Text>
          ))}
        </View>
      </View>

      {/* Besondere Erkennungsmerkmale: fester Abschnitt, IMMER sichtbar. */}
      <View style={styles.featureBlock}>
        <Text style={styles.featureTitle}>Besondere Erkennungsmerkmale</Text>
        <Text style={pet.special_features?.trim() ? styles.body : styles.bodyMuted}>
          {pet.special_features?.trim() || 'Keine besonderen Merkmale erfasst'}
        </Text>
      </View>

      {/* Chipnummer: wichtigstes Identifikationsmerkmal neben dem Foto. */}
      {pet.chip_number ? (
        <Pressable
          style={styles.chipRow}
          onPress={copyChip}
          accessibilityLabel="Chip-Nummer kopieren"
        >
          <View style={styles.chipTextWrap}>
            <Text style={styles.chipLabel}>Chip-Nummer</Text>
            <Text style={styles.chipNumber}>{pet.chip_number}</Text>
          </View>
          <Text style={styles.chipCopy}>⧉ Kopieren</Text>
        </Pressable>
      ) : (
        <Text style={styles.bodyMuted}>Keine Chip-Nummer erfasst</Text>
      )}

      <Text style={styles.statusLine}>Zuletzt aktualisiert: {formatDate(data.lastUpdated)}</Text>
    </View>
  );

  /* Medizinischer Kernteil: feste Reihenfolge laut Design-Spez. */
  const medicalBlocks = (
    <>
      <Section title="Allergien und Unverträglichkeiten">
        {data.allergies.length ? (
          data.allergies.map((a, i) => (
            <Text key={i} style={styles.body}>
              {a.name}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Allergien erfasst</Text>
        )}
      </Section>

      <Section title="Dauermedikation">
        {data.medications.length ? (
          data.medications.map((m, i) => (
            <Text key={i} style={styles.body}>
              {m.name}
              {m.dosage ? ` – ${m.dosage}` : ''}
              {m.active_since ? ` (seit ${formatDate(m.active_since)})` : ''}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Dauermedikation erfasst</Text>
        )}
      </Section>

      <Section title="Vorerkrankungen">
        {data.conditions.length ? (
          data.conditions.map((c, i) => (
            <Text key={i} style={styles.body}>
              {c.name}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Vorerkrankungen erfasst</Text>
        )}
      </Section>

      <Section title="Impfstatus">
        {data.vaccinations.length ? (
          data.vaccinations.map((v, i) => (
            <Text key={i} style={styles.body}>
              {v.disease ?? v.product_name ?? 'Impfung'} – {formatDate(v.date_given)}
              {v.valid_until ? ` (gültig bis ${formatDate(v.valid_until)})` : ''}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyMuted}>Keine Impfungen erfasst</Text>
        )}
      </Section>

      <Section title="Letzte bekannte Werte">
        {data.lastWeight ? (
          <Text style={styles.body}>
            Gewicht: {String(data.lastWeight.value).replace('.', ',')} {data.lastWeight.unit} (
            {formatDate(data.lastWeight.date)})
          </Text>
        ) : (
          <Text style={styles.bodyMuted}>Kein Gewicht erfasst</Text>
        )}
      </Section>

      {/* Spezialisten-Arten: fachkundiger Tierarzt gehoert in den Notfall-Block. */}
      {data.needsSpecialist ? (
        <Section title={`Fachkundiger ${data.vetTerm}`}>
          {pet.specialist_vet_name ? (
            <Text style={styles.body}>
              {pet.specialist_vet_name}
              {pet.specialist_vet_phone ? ` · Tel. ${pet.specialist_vet_phone}` : ''}
            </Text>
          ) : (
            <Text style={styles.bodyMuted}>
              Noch kein fachkundiger {data.vetTerm} hinterlegt – ergänzbar unter Tierakte →
              Stammdaten bearbeiten.
            </Text>
          )}
        </Section>
      ) : null}

      {/* Fussbereich: Kontakt (Halter, Stammtierarzt) + Aktionen. */}
      <Section title="Kontakt">
        <Text style={data.ownerName ? styles.body : styles.bodyMuted}>
          Halter: {data.ownerName ?? 'Nicht erfasst'}
          {data.ownerPhone ? ` · Tel. ${data.ownerPhone}` : ''}
        </Text>
        {!data.ownerPhone ? (
          <Text style={styles.hintSmall}>
            Tipp: Hinterlege deine Telefonnummer unter „Mehr“ – im Notfall kann dich die Praxis
            dann direkt erreichen.
          </Text>
        ) : null}
        <Text style={pet.vet_practice_name ? styles.body : styles.bodyMuted}>
          {data.vetTerm}: {pet.vet_practice_name ?? 'Nicht erfasst'}
          {pet.vet_practice_phone ? ` · Tel. ${pet.vet_practice_phone}` : ''}
        </Text>
      </Section>

      {/* Aktionen: QR anzeigen + PDF teilen (Design-Spez Fussbereich). */}
      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionButton}
          onPress={() => setQrVisible(true)}
          accessibilityLabel="QR-Code für die Praxis anzeigen"
        >
          <Text style={styles.actionButtonText}>QR-Code zeigen</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.actionButtonSecondary, sharing && styles.actionDisabled]}
          onPress={sharePdf}
          disabled={sharing}
          accessibilityLabel="Notfall-Pass als PDF teilen"
        >
          <Text style={styles.actionButtonSecondaryText}>
            {sharing ? 'PDF wird erstellt …' : 'Als PDF teilen'}
          </Text>
        </Pressable>
      </View>

      {/* Doktrin: ehrliche Abgrenzung zu amtlichen Dokumenten. */}
      <Text style={styles.footnote}>
        Dieser Pass funktioniert vollständig ohne Internet – alle Angaben liegen auf deinem Gerät.
        Er ist ein privates Dokument und ersetzt keine amtlichen Dokumente wie den
        EU-Heimtierausweis, den Equidenpass oder eine Registrierung bei TASSO/FINDEFIX.
      </Text>
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}>
      {/* Mehrtier-Haushalt: Pass pro Tier umschaltbar (eindeutige Zuordnung). */}
      {allPets.length > 1 ? (
        <View style={styles.petSwitchRow}>
          {allPets.map((p) => (
            <Pressable
              key={p.id}
              style={[styles.petSwitchChip, p.id === pet.id && styles.petSwitchChipActive]}
              onPress={() => setSelectedPetId(p.id)}
              accessibilityLabel={`Notfall-Pass von ${p.name} anzeigen`}
            >
              <Text style={[styles.petSwitchText, p.id === pet.id && styles.petSwitchTextActive]}>
                {p.name}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Querformat: Passkarte links, medizinische Bloecke rechts (Screen-Flow 1.x). */}
      {isLandscape ? (
        <View style={styles.landscapeRow}>
          <View style={styles.landscapeCol}>{passCard}</View>
          <View style={styles.landscapeCol}>{medicalBlocks}</View>
        </View>
      ) : (
        <>
          {passCard}
          {medicalBlocks}
        </>
      )}

      {/* Foto-Vollbild (Design-Spez: Tap auf Foto zeigt es bildschirmfuellend). */}
      <Modal visible={photoFull} transparent animationType="fade">
        <Pressable
          style={styles.fullscreenBackdrop}
          onPress={() => setPhotoFull(false)}
          accessibilityLabel="Vollbild schließen"
        >
          {pet.photo_uri ? (
            <Image source={{ uri: pet.photo_uri }} style={styles.fullscreenImage} resizeMode="contain" />
          ) : null}
          <Text style={styles.fullscreenHint}>Tippen zum Schließen</Text>
        </Pressable>
      </Modal>

      {/* QR-Ansicht: gross, hell, mit ehrlicher Erklaerung. */}
      <Modal visible={qrVisible} transparent animationType="fade">
        <View style={styles.qrBackdrop}>
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Notfall-Pass von {pet.name}</Text>
            <View style={styles.qrBox}>
              <QRCode value={buildQrPayload(data)} size={Math.min(width, height) * 0.6} quietZone={12} />
            </View>
            <Text style={styles.qrHint}>
              Dieser Code enthält die Notfalldaten als Text – jede Handy-Kamera kann ihn direkt
              lesen, ganz ohne Internet. Die Browser-Freigabe für Praxen kommt nach dem Prototyp.
            </Text>
            <Pressable
              style={styles.qrClose}
              onPress={() => setQrVisible(false)}
              accessibilityLabel="QR-Ansicht schließen"
            >
              <Text style={styles.qrCloseText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  containerCentered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.l,
  },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  landscapeRow: { flexDirection: 'row', gap: spacing.m, alignItems: 'flex-start' },
  landscapeCol: { flex: 1 },
  petSwitchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginBottom: spacing.m },
  petSwitchChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: minTouchTarget - 8,
    justifyContent: 'center',
  },
  petSwitchChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  petSwitchText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  petSwitchTextActive: { color: '#FFFFFF', fontWeight: '600' },

  /* Passkarte im Ausweis-Stil: klarer Rahmen, vertraute Anmutung. */
  passCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  headerRow: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.m },
  headerText: { flex: 1 },
  petPhoto: { width: 88, height: 88, borderRadius: 14, backgroundColor: colors.border },
  petPhotoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  petPhotoInitial: { fontSize: 30, fontWeight: '700', color: colors.textSecondary },
  petPhotoSpecies: { fontSize: 11, color: colors.textSecondary },
  petName: { fontSize: typography.headline, fontWeight: '700', color: colors.textPrimary },
  petMeta: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.xs },
  sigRow: { fontSize: typography.bodySmall, color: colors.textPrimary, lineHeight: 22 },
  featureBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.s,
    marginBottom: spacing.s,
  },
  featureTitle: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.s,
    minHeight: minTouchTarget,
  },
  chipTextWrap: { flex: 1 },
  chipLabel: { fontSize: typography.bodySmall - 2, color: colors.textSecondary },
  chipNumber: {
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  chipCopy: { fontSize: typography.bodySmall, color: colors.primary, fontWeight: '600' },
  statusLine: {
    fontSize: typography.bodySmall - 2,
    color: colors.textSecondary,
    marginTop: spacing.s,
    textAlign: 'right',
  },

  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.s,
  },
  body: { fontSize: typography.body, color: colors.textPrimary, lineHeight: 26 },
  bodyMuted: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 26 },
  hintSmall: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  actionRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.m },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.s,
  },
  actionButtonText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
  actionButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonSecondaryText: { color: colors.primary, fontSize: typography.button, fontWeight: '700' },
  actionDisabled: { opacity: 0.6 },
  empty: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.l,
  },

  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: { width: '100%', height: '80%' },
  fullscreenHint: { color: '#FFFFFF', fontSize: typography.bodySmall, marginTop: spacing.m },

  qrBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.l,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
  },
  qrTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  qrBox: { backgroundColor: '#FFFFFF', padding: spacing.s },
  qrHint: {
    fontSize: typography.bodySmall,
    color: '#555555',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.m,
  },
  qrClose: {
    marginTop: spacing.m,
    minHeight: minTouchTarget,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  qrCloseText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
});
