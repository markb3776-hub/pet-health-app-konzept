/**
 * simplyPet: Erfassen-Overlay (BottomSheet)
 * Quelle: technische_spezifikation_screen_flow.md (2.4)
 * Korrektur aus Zwischenanalyse (09.07.2026): Erfassen ist KEIN eigener
 * Tab-Bildschirm, sondern ein Overlay ueber dem aktuellen Bildschirm.
 *
 * Optionen (Teilauftrag 4.2, alle verdrahtet): Dokument fotografieren /
 * Gewicht / Beobachtung (Symptom-Notiz-Wasserwert) / Vorfall (Freitext-first)
 * / Impfung / Medikament-Pflege. Jede Option oeffnet ihr Eintrags-Formular
 * (Doktrin: kein toter Knopf).
 *
 * Querformat: Das Sheet begrenzt seine Hoehe und scrollt; im Querformat
 * werden die Optionen zweispaltig angezeigt. Ein geoeffnetes Overlay
 * uebersteht die Rotation ohne Zustandsverlust (State liegt im Parent).
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

export type CaptureAction = 'foto' | 'gewicht' | 'notiz' | 'vorfall' | 'impfung' | 'medikament' | 'kotprobe' | 'untersuchung';

const CAPTURE_OPTIONS: { key: CaptureAction; label: string; hint: string }[] = [
  {
    key: 'foto',
    label: 'Dokument fotografieren',
    hint: 'Das Foto wird sicher in der Akte abgelegt. Automatisches Auslesen kommt in einer späteren Version.',
  },
  {
    key: 'gewicht',
    label: 'Gewicht festhalten',
    hint: 'Ein Wert genügt – die Verlaufskurve entsteht von selbst.',
  },
  {
    key: 'notiz',
    label: 'Beobachtung notieren',
    hint: 'Symptome, Auffälligkeiten oder Wasserwerte – hilfreich für den nächsten Tierarztbesuch.',
  },
  {
    key: 'vorfall',
    label: 'Vorfall festhalten',
    hint: 'Biss, Sturz, Giftverdacht oder etwas ganz anderes – beschreibe es einfach in deinen Worten.',
  },
  {
    key: 'impfung',
    label: 'Impfung eintragen',
    hint: 'Impfstoff, Datum und Gültigkeit festhalten – die Erinnerung entsteht automatisch.',
  },
  {
    key: 'medikament',
    label: 'Medikament oder Pflege anlegen',
    hint: 'Dauermedikation, Pflege-Aufgaben, Vorerkrankungen und Allergien – mit Erinnerung, wenn du magst.',
  },
  {
    key: 'kotprobe',
    label: 'Kotprobe (Pferd)',
    hint: 'EpG-Wert aus dem Laborbefund eintragen – für die selektive Entwurmung.',
  },
  {
    key: 'untersuchung',
    label: 'Untersuchungsergebnis',
    hint: 'Blutbild, Ultraschall, Röntgen – Befund und Ergebnis festhalten.',
  },
];

interface CaptureSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Wird aufgerufen, wenn der Nutzer eine Aktion waehlt (seit 4.2 Pflicht). */
  onAction: (action: CaptureAction) => void;
}

export default function CaptureSheet({ visible, onClose, onAction }: CaptureSheetProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  // Edge-to-Edge-Korrektur (Nutzertest 10.07.2026): Das Sheet liegt am unteren
  // Rand – der Schliessen-Knopf braucht Abstand zur System-Navigationsleiste.
  const insets = useSafeAreaInsets();

  function handlePress(action: CaptureAction) {
    onAction(action);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Abdunkelung: Tap ausserhalb schliesst das Sheet */}
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Erfassen schließen" />
      <View style={[styles.sheet, { maxHeight: height * 0.8, paddingBottom: spacing.l + insets.bottom }]}>
        <View style={styles.grabber} />
        <Text style={styles.headline}>Was möchtest du festhalten?</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={[styles.optionList, isLandscape && styles.optionListLandscape]}>
            {CAPTURE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={[styles.option, isLandscape && styles.optionLandscape]}
                accessibilityLabel={opt.label}
                onPress={() => handlePress(opt.key)}
              >
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionHint}>{opt.hint}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.footnote}>
            Alles wird zuerst auf deinem Gerät gespeichert und funktioniert auch ohne Internet.
          </Text>
        </ScrollView>
        <Pressable style={styles.closeButton} onPress={onClose} accessibilityLabel="Schließen">
          <Text style={styles.closeButtonText}>Schließen</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.m,
    paddingBottom: spacing.l,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.m,
  },
  headline: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  optionList: {},
  optionListLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  option: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    minHeight: minTouchTarget,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionLandscape: {
    flexBasis: '47%',
    flexGrow: 1,
    marginBottom: 0,
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
    marginTop: spacing.m,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: spacing.m,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  closeButtonText: { fontSize: typography.body, color: colors.textPrimary, fontWeight: '600' },
});
