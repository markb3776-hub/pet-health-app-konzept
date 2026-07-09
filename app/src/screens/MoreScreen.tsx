/**
 * simplyPet: Mehr-Bereich
 * Quelle: technische_spezifikation_screen_flow.md (2.7)
 *
 * Kontoloser Prototyp: Statt Konto-Verwaltung gibt es nur den Halter-Namen
 * (fuer den Notfallpass), direkt hier bearbeitbar – mit Draft-freier,
 * sofortiger Speicherung und sichtbarer Bestaetigung.
 * Alle noch nicht gebauten Unterseiten sind EHRLICH gekennzeichnet
 * (Doktrin: kein toter Knopf, kein falsches Versprechen).
 * Zwei-Tap-Regel: Notfall-FAB fest auf diesem Bildschirm.
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getOwnerName, setOwnerName, getOwnerPhone, setOwnerPhone } from '../profile/profileStore';
import EmergencyFab from '../components/EmergencyFab';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

const MENU: { key: string; label: string; hint: string; plannedIn: string | null }[] = [
  {
    key: 'tiere',
    label: 'Tiere verwalten',
    hint: 'Tiere bearbeiten oder ins Archiv verschieben.',
    plannedIn: null, // seit 4.2 verdrahtet
  },
  {
    key: 'datenschutz',
    label: 'Deine Daten',
    hint: 'Wo deine Daten liegen und wie du sie exportierst oder löschst.',
    plannedIn: '4.4 „Interne Prüfung & APK"',
  },
  {
    key: 'ueber',
    label: 'Über simplyPet',
    hint: 'Version, Quellen der Fachinformationen, Kontakt.',
    plannedIn: '4.4 „Interne Prüfung & APK"',
  },
];

export default function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedPhone, setSavedPhone] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const owner = await getOwnerName();
        const ownerPhone = await getOwnerPhone();
        if (active) {
          setSavedName(owner);
          setName(owner ?? '');
          setSavedPhone(ownerPhone);
          setPhone(ownerPhone ?? '');
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  async function saveProfile() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name fehlt', 'Bitte gib deinen Namen ein – er erscheint auf dem Notfall-Pass.');
      return;
    }
    // Telefon ist optional (kontoloser Prototyp) – aber wenn angegeben,
    // dann als sinnvolle Nummer (Hinweis, kein Blocker bei Leereingabe).
    const trimmedPhone = phone.trim();
    await setOwnerName(trimmed);
    await setOwnerPhone(trimmedPhone);
    setSavedName(trimmed);
    setSavedPhone(trimmedPhone || null);
    setEditing(false);
    Alert.alert('Gespeichert', 'Deine Kontaktdaten wurden aktualisiert.');
  }

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <Text style={styles.headline}>Mehr</Text>

        {/* Halter-Profil (kontolos: nur der Name) */}
        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>Halter-Kontakt (erscheint auf dem Notfall-Pass)</Text>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Dein Name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                accessibilityLabel="Name des Halters"
              />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Telefonnummer (für den Notfall, optional)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                accessibilityLabel="Telefonnummer des Halters"
              />
              <View style={styles.profileButtons}>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => {
                    setName(savedName ?? '');
                    setPhone(savedPhone ?? '');
                    setEditing(false);
                  }}
                  accessibilityLabel="Abbrechen"
                >
                  <Text style={styles.secondaryButtonText}>Abbrechen</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={saveProfile} accessibilityLabel="Kontaktdaten speichern">
                  <Text style={styles.primaryButtonText}>Speichern</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.profileRow}>
              <View style={styles.profileTextWrap}>
                <Text style={styles.profileName}>{savedName ?? 'Noch kein Name hinterlegt'}</Text>
                <Text style={savedPhone ? styles.profilePhone : styles.profilePhoneMissing}>
                  {savedPhone
                    ? `Tel. ${savedPhone}`
                    : 'Keine Telefonnummer – im Notfall kann dich die Praxis nicht erreichen.'}
                </Text>
              </View>
              <Pressable
                style={styles.editLink}
                onPress={() => setEditing(true)}
                accessibilityLabel="Kontaktdaten bearbeiten"
              >
                <Text style={styles.editLinkText}>✎ Bearbeiten</Text>
              </Pressable>
            </View>
          )}
        </View>

        {MENU.map((item) => (
          <Pressable
            key={item.key}
            style={styles.item}
            accessibilityLabel={item.label}
            onPress={() => {
              if (item.key === 'tiere') {
                navigation.navigate('TiereVerwalten');
                return;
              }
              // Ehrliche Kennzeichnung: noch nicht gebaute Unterseiten (Doktrin).
              Alert.alert(
                'Kommt im nächsten Schritt',
                `„${item.label}" wird im Entwicklungsschritt ${item.plannedIn} gebaut.`,
                [{ text: 'Verstanden' }]
              );
            }}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemHint}>{item.hint}</Text>
            {item.plannedIn ? (
              <Text style={styles.itemPlanned}>Kommt in {item.plannedIn}</Text>
            ) : null}
          </Pressable>
        ))}

        <Text style={styles.footnote}>
          simplyPet Prototyp · Deine Daten bleiben auf diesem Gerät – ohne Konto, ohne Anmeldung.
        </Text>
      </ScrollView>
      <EmergencyFab />
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
    marginBottom: spacing.l,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileLabel: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileTextWrap: { flex: 1 },
  profileName: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  profilePhone: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  profilePhoneMissing: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 20,
  },
  editLink: { minHeight: minTouchTarget, justifyContent: 'center', paddingLeft: spacing.m },
  editLinkText: { fontSize: typography.bodySmall, color: colors.primary, fontWeight: '600' },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.m,
    fontSize: typography.body,
    color: colors.textPrimary,
    minHeight: minTouchTarget,
    marginBottom: spacing.m,
  },
  profileButtons: { flexDirection: 'row', gap: spacing.m },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: typography.body, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  secondaryButtonText: { color: colors.textPrimary, fontSize: typography.body },
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
  itemPlanned: {
    fontSize: typography.bodySmall - 2,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.m,
    lineHeight: 22,
    textAlign: 'center',
  },
});
