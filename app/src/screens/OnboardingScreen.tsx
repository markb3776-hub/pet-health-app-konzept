/**
 * simplyPet: Onboarding (KONTOLOS – Freigabe des Projektinhabers 09.07.2026)
 * Quelle: technische_spezifikation_screen_flow.md (2.1), angepasst:
 * KEINE Konto-Erstellung (kein E-Mail, kein Passwort) – nur der Name des
 * Halters wird erfasst (wichtig fuer den Notfallpass).
 *
 * Ablauf: Begruessung ("Deine Daten gehören dir.") -> Name des Halters ->
 * erstes Tier anlegen -> Startbildschirm.
 *
 * Eingabe-Stabilitaet: Der Name wird fortlaufend als Entwurf gesichert
 * (Null-Datenverlust-Regel) – auch ein Abbruch mitten im Onboarding
 * verliert kein eingegebenes Zeichen.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setOwnerName, markOnboardingDone } from '../profile/profileStore';
import { loadDraft, saveDraft, clearDraft, useDraftAutosave } from '../drafts/draftStore';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';
import ScreenBackground from '../components/ScreenBackground';

const DRAFT_KEY = 'onboarding_owner';

interface OnboardingScreenProps {
  /** Wird nach Abschluss aufgerufen – die App wechselt dann zur Hauptnavigation. */
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [step, setStep] = useState<'welcome' | 'name'>('welcome');
  const [name, setName] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  // Entwurf beim Start wiederherstellen (Null-Datenverlust-Regel).
  // Im Onboarding wird still fortgesetzt statt per Dialog gefragt:
  // Es gibt nur ein Feld, und ein vorhandener Entwurf ist immer die
  // eigene, soeben getippte Eingabe.
  useEffect(() => {
    let active = true;
    (async () => {
      const draft = await loadDraft<{ name: string; step: string }>(DRAFT_KEY);
      if (active && draft?.data) {
        if (draft.data.name) setName(draft.data.name);
        if (draft.data.step === 'name') setStep('name');
      }
      if (active) setHydrated(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useDraftAutosave(DRAFT_KEY, { name, step }, hydrated);

  async function finish() {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      await setOwnerName(trimmed);
      await markOnboardingDone();
      await clearDraft(DRAFT_KEY);
      // Weiter zum Startbildschirm: Dort fuehrt die Anleitungskarte
      // ("Erstes Tier anlegen") direkt in Schritt 3 des Onboardings.
      // Das Tier-Formular selbst hat vollstaendigen Draft-Schutz.
      onDone();
    } finally {
      setSaving(false);
    }
  }

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.center, isLandscape && styles.centerLandscape]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>simplyPet</Text>
          <Text style={styles.welcomeTitle}>Willkommen bei simplyPet.</Text>
          <Text style={styles.welcomeDoctrine}>Deine Daten gehören dir.</Text>
          <Text style={styles.welcomeBody}>
            Alles, was du hier einträgst, bleibt auf deinem Gerät – ohne Konto, ohne Anmeldung.
            Die App funktioniert auch komplett ohne Internet.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              setStep('name');
              void saveDraft(DRAFT_KEY, { name, step: 'name' });
            }}
            accessibilityLabel="Los geht's"
          >
            <Text style={styles.primaryButtonText}>Los geht's</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ScreenBackground>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.center, isLandscape && styles.centerLandscape]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.stepTitle}>Wie heißt du?</Text>
          <Text style={styles.stepBody}>
            Dein Name erscheint später auf dem Notfall-Pass deiner Tiere – mehr brauchen wir
            nicht. Kein E-Mail, kein Passwort.
          </Text>
          <TextInput
            style={[styles.input, isLandscape && styles.inputLandscape]}
            value={name}
            onChangeText={setName}
            placeholder="z. B. Marion Berger"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            accessibilityLabel="Name des Halters"
          />
          <Pressable
            style={[styles.primaryButton, (!name.trim() || saving) && styles.buttonDisabled]}
            disabled={!name.trim() || saving}
            onPress={finish}
            accessibilityLabel="Weiter zum ersten Tier"
          >
            <Text style={styles.primaryButtonText}>{saving ? 'Speichert …' : 'Weiter'}</Text>
          </Pressable>
          <Pressable
            style={styles.backLink}
            onPress={() => setStep('welcome')}
            accessibilityLabel="Zurück zur Begrüßung"
          >
            <Text style={styles.backLinkText}>Zurück</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  centerLandscape: {
    paddingHorizontal: spacing.xl * 3, // Querformat: Inhalt lesbar zentriert statt bildschirmbreit
  },
  logo: {
    fontSize: typography.headline + 6,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  welcomeDoctrine: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.l,
  },
  welcomeBody: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: typography.headline,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  stepBody: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: spacing.l,
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
    marginBottom: spacing.l,
  },
  inputLandscape: { minHeight: minTouchTarget + 8 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  primaryButtonText: { color: '#FFFFFF', fontSize: typography.button, fontWeight: '700' },
  backLink: {
    marginTop: spacing.m,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLinkText: { fontSize: typography.body, color: colors.textSecondary },
});
