/**
 * simplyPet: Mehr-Bereich (Version dynamisch aus app.json)
 * Quelle: technische_spezifikation_screen_flow.md (2.7)
 *
 * Neu in v0.1.2:
 * - Datensicherung (Export/Import) – Entscheidung E-31/E-32/E-33
 * - Letztes Backup-Datum anzeigen
 * - Hinweis zur Eigenverantwortung
 *
 * Doktrin: Kein toter Knopf, kein falsches Versprechen.
 * Zwei-Tap-Regel: Notfall-FAB fest auf diesem Bildschirm.
 */
import React, { useCallback, useState } from 'react';
import Constants from 'expo-constants';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getOwnerName, setOwnerName, getOwnerPhone, setOwnerPhone } from '../profile/profileStore';
import { exportBackup, importBackup, getLastBackupDate } from '../backup/backupService';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupBusy, setBackupBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const owner = await getOwnerName();
        const ownerPhone = await getOwnerPhone();
        const backupDate = await getLastBackupDate();
        if (active) {
          setSavedName(owner);
          setName(owner ?? '');
          setSavedPhone(ownerPhone);
          setPhone(ownerPhone ?? '');
          setLastBackup(backupDate);
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
    const trimmedPhone = phone.trim();
    await setOwnerName(trimmed);
    await setOwnerPhone(trimmedPhone);
    setSavedName(trimmed);
    setSavedPhone(trimmedPhone || null);
    setEditing(false);
    Alert.alert('Gespeichert', 'Deine Kontaktdaten wurden aktualisiert.');
  }

  async function handleExport() {
    setBackupBusy(true);
    try {
      await exportBackup();
      const date = await getLastBackupDate();
      setLastBackup(date);
    } finally {
      setBackupBusy(false);
    }
  }

  async function handleImport() {
    Alert.alert(
      'Sicherung importieren',
      'Beim Wiederherstellen werden alle aktuellen Daten durch die Sicherung ersetzt. Fortfahren?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Datei wählen',
          onPress: async () => {
            setBackupBusy(true);
            try {
              await importBackup();
              const date = await getLastBackupDate();
              setLastBackup(date);
            } finally {
              setBackupBusy(false);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}>
        <Text style={styles.headline}>Mehr</Text>

        {/* Halter-Profil */}
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
                <Text style={styles.editLinkText}>Bearbeiten</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Tiere verwalten */}
        <Pressable
          style={styles.item}
          accessibilityLabel="Tiere verwalten"
          onPress={() => navigation.navigate('TiereVerwalten')}
        >
          <Text style={styles.itemLabel}>Tiere verwalten</Text>
          <Text style={styles.itemHint}>Tiere bearbeiten oder ins Archiv verschieben.</Text>
        </Pressable>

        {/* Datensicherung */}
        <View style={styles.backupCard}>
          <Text style={styles.backupTitle}>Datensicherung</Text>
          <Text style={styles.backupInfo}>
            Deine Daten werden automatisch als Sicherungsdatei auf diesem Gerät aktualisiert.
          </Text>
          <Text style={styles.backupWarning}>
            Diese Datei liegt NUR auf diesem Gerät. Geht das Gerät verloren, sind auch deine Daten weg.
            Speichere die Datei regelmäßig an einem zweiten Ort – z.B. USB-Stick, PC, SD-Karte oder ein anderes Gerät.
          </Text>

          {lastBackup ? (
            <Text style={styles.backupDate}>
              Letzte Sicherung: {(() => {
                const d = new Date(lastBackup);
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                const hh = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                return `${dd}.${mm}.${yyyy}, ${hh}:${min}`;
              })()}
            </Text>
          ) : (
            <Text style={styles.backupDate}>Noch keine Sicherung erstellt.</Text>
          )}

          {backupBusy ? (
            <ActivityIndicator style={styles.backupSpinner} color={colors.primary} />
          ) : (
            <View style={styles.backupButtons}>
              <Pressable style={styles.primaryButton} onPress={handleExport} accessibilityLabel="Sicherung exportieren">
                <Text style={styles.primaryButtonText}>Exportieren</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleImport} accessibilityLabel="Sicherung importieren">
                <Text style={styles.secondaryButtonText}>Importieren</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Datenschutz-Info */}
        <Pressable
          style={styles.item}
          accessibilityLabel="Deine Daten"
          onPress={() => {
            Alert.alert(
              'Deine Daten',
              'Alle Daten bleiben auf diesem Gerät.\n\n' +
                '• Kein Internet, kein Server, kein Konto.\n' +
                '• Keine Analyse, kein Tracking.\n' +
                '• Du hast die volle Kontrolle.\n\n' +
                'Nutze die Datensicherung oben, um deine Daten extern zu sichern.',
              [{ text: 'Verstanden' }]
            );
          }}
        >
          <Text style={styles.itemLabel}>Deine Daten</Text>
          <Text style={styles.itemHint}>Wo deine Daten liegen und wie du sie exportierst oder löschst.</Text>
        </Pressable>

        {/* Über simplyPet */}
        <Pressable
          style={styles.item}
          accessibilityLabel="Über simplyPet"
          onPress={() => {
            Alert.alert(
              'Über simplyPet',
              `Version ${Constants.expoConfig?.version ?? '?'} (Prototyp)\n\n` +
                'simplyPet ist eine unabhängige Tiergesundheits-App.\n' +
                'Keine Werbung, kein Abo, keine versteckten Kosten.\n\n' +
                'Einmal kaufen – für immer nutzen.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.itemLabel}>Über simplyPet</Text>
          <Text style={styles.itemHint}>Version, Kontakt, Datenschutz.</Text>
        </Pressable>

        <Text style={styles.footnote}>
          {`simplyPet v${Constants.expoConfig?.version ?? '?'} · Deine Daten bleiben auf diesem Gerät – ohne Konto, ohne Anmeldung.`}
        </Text>
      </ScrollView>
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
  backupCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backupTitle: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  backupInfo: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.s,
  },
  backupWarning: {
    fontSize: typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.m,
    fontWeight: '600',
  },
  backupDate: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    marginBottom: spacing.m,
    fontWeight: '600',
  },
  backupButtons: { flexDirection: 'row', gap: spacing.m },
  backupSpinner: { marginVertical: spacing.m },
  footnote: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.m,
    lineHeight: 22,
    textAlign: 'center',
  },
});
