/**
 * simplyPet: Datensicherung (v0.1.5 – E-93)
 * Entscheidung E-31/E-32/E-33: Automatisches lokales Backup + manueller Export/Import.
 * E-74: Dateiname mit fortlaufender Nummer + Datum (Backup_001_2026-07-11.simplypet)
 * E-93: autoBackup bei JEDER Datenänderung, AsyncStorage-Status (überlebt Updates),
 *        SAF lokales Speichern, Import erkennt lokale Backups.
 *
 * Doktrin:
 * - Kein Internet, kein Server, kein Account.
 * - Die App erstellt die Backup-Datei, der Nutzer entscheidet wohin.
 * - Datei ist eigenstaendig (Daten + Fotos), geraeteunabhaengig, versionsunabhaengig.
 *
 * Format: JSON mit Base64-kodierten Fotos, Dateiendung .simplypet
 * Komprimierung: keine (JSON ist bereits kompakt genug fuer typische Datenmengen)
 */
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getDb } from '../db/database';
import { encryptBackup, decryptBackup, isEncryptedBackup } from './cryptoService';

const BACKUP_VERSION = 1;
const KEY_BACKUP_COUNTER = 'simplypet.backup_counter';
const KEY_LAST_BACKUP_DATE = 'simplypet.last_backup_date';

/**
 * Fortlaufende Backup-Nummer holen und um 1 erhoehen.
 */
async function getNextBackupNumber(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(KEY_BACKUP_COUNTER);
    const current = stored ? parseInt(stored, 10) : 0;
    const next = current + 1;
    await AsyncStorage.setItem(KEY_BACKUP_COUNTER, String(next));
    return next;
  } catch {
    return 1;
  }
}

/**
 * Generiert den Dateinamen: Backup_001_2026-07-11.simplypet
 */
function generateBackupFilename(number: number): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const numStr = String(number).padStart(3, '0');
  return `Backup_${numStr}_${yyyy}-${mm}-${dd}.simplypet`;
}

export interface BackupData {
  version: number;
  created_at: string;
  app_version: string;
  backup_number: number;
  pets: any[];
  vaccinations: any[];
  medications: any[];
  health_records: any[];
  documents: any[];
  reminders: any[];
  photos: { uri: string; base64: string }[];
  // Legacy-Felder fuer Rueckwaertskompatibilitaet mit alten Backups
  weights?: any[];
  observations?: any[];
  incidents?: any[];
}

/**
 * Erstellt ein vollstaendiges Backup aller Daten inkl. Fotos.
 * Gibt den lokalen Dateipfad zurueck.
 * isAutoBackup: true = stilles Auto-Backup (Nummer nicht erhoehen, fester Dateiname)
 */
export async function createBackup(isAutoBackup = false): Promise<string | null> {
  try {
    const db = await getDb();

    // Alle Tabellen auslesen (nur nicht-geloeschte Eintraege)
    const pets = await db.getAllAsync('SELECT * FROM pets WHERE deleted_at IS NULL');
    const vaccinations = await db.getAllAsync('SELECT * FROM vaccinations WHERE deleted_at IS NULL');
    const medications = await db.getAllAsync('SELECT * FROM medications WHERE deleted_at IS NULL');
    const health_records = await db.getAllAsync('SELECT * FROM health_records WHERE deleted_at IS NULL');
    const documents = await db.getAllAsync('SELECT * FROM documents WHERE deleted_at IS NULL');
    const reminders = await db.getAllAsync('SELECT * FROM reminders WHERE deleted_at IS NULL');

    // Fotos sammeln und als Base64 einbetten
    const photoUris: string[] = [];
    (pets as any[]).forEach((p) => {
      if (p.photo_uri) photoUris.push(p.photo_uri);
    });
    (documents as any[]).forEach((d) => {
      if (d.file_uri) photoUris.push(d.file_uri);
    });

    const photos: { uri: string; base64: string }[] = [];
    for (const uri of photoUris) {
      try {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists && !info.isDirectory) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          photos.push({ uri, base64 });
        }
      } catch {
        // Foto nicht mehr vorhanden – ueberspringen, kein Crash
      }
    }

    // Backup-Nummer: Nur beim manuellen Export erhoehen
    const backupNumber = isAutoBackup ? 0 : await getNextBackupNumber();

    const backup: BackupData = {
      version: BACKUP_VERSION,
      created_at: new Date().toISOString(),
      app_version: Constants.expoConfig?.version ?? '0.0.0',
      backup_number: backupNumber,
      pets: pets as any[],
      vaccinations: vaccinations as any[],
      medications: medications as any[],
      health_records: health_records as any[],
      documents: documents as any[],
      reminders: reminders as any[],
      photos,
    };

    // Speicherplatz pruefen (Praevention Nr. 32)
    const freeSpace = await FileSystem.getFreeDiskStorageAsync();
    const jsonStr = JSON.stringify(backup);
    const estimatedSize = jsonStr.length * 2; // UTF-16 worst case
    if (freeSpace < estimatedSize + 10 * 1024 * 1024) {
      if (!isAutoBackup) {
        Alert.alert(
          'Nicht genug Speicherplatz',
          'Bitte schaffe etwas Platz auf deinem Gerät, bevor du ein Backup erstellst.'
        );
      }
      return null;
    }

    // Dateiname: Auto-Backup nutzt festen Namen, manueller Export nutzt Nummer+Datum
    const filename = isAutoBackup
      ? 'simplypet_auto_backup.simplypet'
      : generateBackupFilename(backupNumber);

    const backupPath = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(backupPath, jsonStr, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // E-93: Backup-Datum in AsyncStorage speichern (ueberlebt App-Updates)
    await AsyncStorage.setItem(KEY_LAST_BACKUP_DATE, new Date().toISOString());

    return backupPath;
  } catch (error) {
    if (!isAutoBackup) {
      Alert.alert('Backup fehlgeschlagen', 'Es gab ein Problem beim Erstellen der Sicherung. Bitte versuche es erneut.');
    }
    return null;
  }
}

/**
 * Automatisches Backup: Wird nach jeder Datenaenderung aufgerufen.
 * Schreibt still im Hintergrund – kein Alert bei Erfolg.
 * Nutzt festen Dateinamen (ueberschreibt sich selbst).
 */
export async function autoBackup(): Promise<void> {
  try {
    await createBackup(true);
  } catch {
    // Stilles Scheitern – Auto-Backup darf die App nicht blockieren
  }
}

/**
 * Export: Erstellt Backup, fragt Passwort ab, verschlüsselt, bietet Speicher-Optionen.
 */
export async function exportBackup(): Promise<void> {
  // Schritt 1: Passwort abfragen
  const password = await promptPassword(
    'Backup verschlüsseln',
    'Wähle ein Passwort zum Schutz deiner Sicherung.\n\n⚠️ Ohne dieses Passwort kannst du die Sicherung NICHT wiederherstellen!'
  );
  if (password === null) return; // Abgebrochen

  // Schritt 2: Passwort bestätigen
  const confirm = await promptPassword(
    'Passwort bestätigen',
    'Bitte gib das Passwort erneut ein.'
  );
  if (confirm === null) return;
  if (confirm !== password) {
    Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein. Bitte versuche es erneut.');
    return;
  }

  // Schritt 3: Backup erstellen
  const backupPath = await createBackup(false);
  if (!backupPath) return;

  // Schritt 4: Verschlüsseln
  try {
    const plainJson = await FileSystem.readAsStringAsync(backupPath, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const encryptedJson = await encryptBackup(plainJson, password);
    await FileSystem.writeAsStringAsync(backupPath, encryptedJson, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch {
    Alert.alert('Verschlüsselung fehlgeschlagen', 'Die Sicherung konnte nicht verschlüsselt werden.');
    return;
  }

  // Schritt 5: Speicher-Auswahl
  return new Promise<void>((resolve) => {
    Alert.alert(
      'Verschlüsselte Sicherung erstellt',
      'Wo möchtest du die Sicherung speichern?',
      [
        {
          text: 'Lokal speichern',
          onPress: async () => {
            await saveLocally(backupPath);
            resolve();
          },
        },
        {
          text: 'Teilen (Drive, WhatsApp…)',
          onPress: async () => {
            await shareBackup(backupPath);
            resolve();
          },
        },
        {
          text: 'Abbrechen',
          style: 'cancel',
          onPress: () => resolve(),
        },
      ]
    );
  });
}

/**
 * Zeigt einen Passwort-Eingabe-Dialog.
 * Gibt das Passwort zurück oder null bei Abbruch.
 * Hinweis: React Native Alert unterstützt kein TextInput.
 * Wir verwenden prompt() nicht (nicht verfügbar in RN).
 * Stattdessen exportieren wir eine Callback-basierte Lösung
 * die vom MoreScreen aufgerufen wird.
 *
 * WORKAROUND: Da Alert.prompt nur auf iOS existiert, verwenden wir
 * eine Promise-basierte Lösung mit einem globalen Callback.
 */
let _passwordResolver: ((value: string | null) => void) | null = null;
let _passwordTitle = '';
let _passwordMessage = '';
let _passwordVisible = false;

export function getPasswordPromptState() {
  return {
    visible: _passwordVisible,
    title: _passwordTitle,
    message: _passwordMessage,
  };
}

export function resolvePasswordPrompt(value: string | null) {
  _passwordVisible = false;
  if (_passwordResolver) {
    _passwordResolver(value);
    _passwordResolver = null;
  }
}

function promptPassword(title: string, message: string): Promise<string | null> {
  return new Promise((resolve) => {
    _passwordTitle = title;
    _passwordMessage = message;
    _passwordVisible = true;
    _passwordResolver = resolve;
    // Der MoreScreen muss auf _passwordVisible reagieren
    // Wir triggern ein Event über den passwordPromptListeners
    notifyPasswordListeners();
  });
}

type PasswordListener = () => void;
const passwordListeners: PasswordListener[] = [];

export function addPasswordListener(listener: PasswordListener): () => void {
  passwordListeners.push(listener);
  return () => {
    const idx = passwordListeners.indexOf(listener);
    if (idx >= 0) passwordListeners.splice(idx, 1);
  };
}

function notifyPasswordListeners() {
  passwordListeners.forEach((l) => l());
}

/**
 * E-93: Lokal speichern via Storage Access Framework (SAF).
 * Oeffnet den nativen Android "Speichern unter..."-Dialog.
 */
async function saveLocally(backupPath: string): Promise<void> {
  try {
    if (Platform.OS !== 'android') {
      // Fallback fuer nicht-Android: Share-Dialog
      await shareBackup(backupPath);
      return;
    }

    const SAF = FileSystem.StorageAccessFramework;

    // Nutzer waehlt Zielordner
    const permissions = await SAF.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      // Nutzer hat abgebrochen – kein Fehler
      return;
    }

    // Dateiname aus Pfad extrahieren
    const filename = backupPath.split('/').pop() ?? 'backup.simplypet';

    // Datei im gewaehlten Ordner erstellen
    const newFileUri = await SAF.createFileAsync(
      permissions.directoryUri,
      filename,
      'application/octet-stream'
    );

    // Inhalt der Backup-Datei lesen und in die SAF-Datei schreiben
    const content = await FileSystem.readAsStringAsync(backupPath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await FileSystem.writeAsStringAsync(newFileUri, content, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Alert.alert(
      'Gespeichert',
      `Die Sicherung "${filename}" wurde im gewählten Ordner gespeichert.`
    );
  } catch (error) {
    Alert.alert(
      'Speichern fehlgeschlagen',
      'Die Datei konnte nicht lokal gespeichert werden. Versuche es über "Teilen".'
    );
  }
}

/**
 * Teilen via Share-Intent (WhatsApp, Drive, E-Mail etc.)
 */
async function shareBackup(backupPath: string): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    Alert.alert(
      'Teilen nicht verfügbar',
      `Die Sicherungsdatei liegt unter:\n${backupPath}\n\nDu kannst sie mit einem Dateimanager manuell kopieren.`
    );
    return;
  }

  await Sharing.shareAsync(backupPath, {
    mimeType: 'application/octet-stream',
    dialogTitle: 'simplyPet-Sicherung speichern',
    UTI: 'public.data',
  });
}

/**
 * Import: Nutzer waehlt eine .simplypet-Datei, Daten werden wiederhergestellt.
 * Auto-Detect: Verschlüsselte Backups werden erkannt und Passwort abgefragt.
 * Abwärtskompatibel: Alte unverschlüsselte Backups werden direkt importiert.
 */
export async function importBackup(): Promise<boolean> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return false;
    }

    const fileUri = result.assets[0].uri;
    let content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Auto-Detect: Verschlüsseltes Backup?
    if (isEncryptedBackup(content)) {
      const password = await promptPassword(
        'Passwort eingeben',
        'Diese Sicherung ist verschlüsselt. Bitte gib das Passwort ein.'
      );
      if (password === null) return false; // Abgebrochen

      try {
        content = await decryptBackup(content, password);
      } catch {
        Alert.alert(
          'Entschlüsselung fehlgeschlagen',
          'Das Passwort ist falsch oder die Datei ist beschädigt.'
        );
        return false;
      }
    }

    let backup: BackupData;
    try {
      backup = JSON.parse(content);
    } catch {
      Alert.alert('Ungültige Datei', 'Die gewählte Datei ist keine gültige simplyPet-Sicherung.');
      return false;
    }

    if (!backup.version || !backup.pets) {
      Alert.alert('Ungültige Datei', 'Die gewählte Datei ist keine gültige simplyPet-Sicherung.');
      return false;
    }

    // Vorwaertskompatibilitaet: aeltere Backup-Versionen akzeptieren
    if (backup.version > BACKUP_VERSION) {
      Alert.alert(
        'Neuere Version',
        'Diese Sicherung wurde mit einer neueren App-Version erstellt. Bitte aktualisiere simplyPet.'
      );
      return false;
    }

    return new Promise((resolve) => {
      const d = new Date(backup.created_at);
      const dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
      const numStr = backup.backup_number
        ? ` (Nr. ${backup.backup_number})`
        : '';

      Alert.alert(
        'Sicherung wiederherstellen',
        `Diese Sicherung enthält ${backup.pets.length} Tier(e) vom ${dateStr}${numStr}.\n\nVorhandene Daten werden ersetzt.`,
        [
          { text: 'Abbrechen', style: 'cancel', onPress: () => resolve(false) },
          {
            text: 'Wiederherstellen',
            style: 'destructive',
            onPress: async () => {
              try {
                await restoreBackup(backup);
                // E-93: Nach Import auch den Backup-Status aktualisieren
                await AsyncStorage.setItem(KEY_LAST_BACKUP_DATE, new Date().toISOString());
                Alert.alert('Wiederhergestellt', 'Alle Daten wurden erfolgreich importiert.');
                resolve(true);
              } catch {
                Alert.alert('Fehler', 'Beim Wiederherstellen ist ein Fehler aufgetreten.');
                resolve(false);
              }
            },
          },
        ]
      );
    });
  } catch {
    Alert.alert('Import fehlgeschlagen', 'Die Datei konnte nicht gelesen werden.');
    return false;
  }
}

/**
 * Interne Wiederherstellung: Loescht alle Daten und fuegt Backup-Daten ein.
 */
async function restoreBackup(backup: BackupData): Promise<void> {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    // Alle Tabellen leeren
    await db.runAsync('DELETE FROM reminders');
    await db.runAsync('DELETE FROM documents');
    await db.runAsync('DELETE FROM health_records');
    await db.runAsync('DELETE FROM medications');
    await db.runAsync('DELETE FROM vaccinations');
    await db.runAsync('DELETE FROM pets');

    // Daten einfuegen (einfache INSERT-Schleifen, da Backup typischerweise klein)
    for (const pet of backup.pets) {
      const cols = Object.keys(pet);
      const placeholders = cols.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT OR REPLACE INTO pets (${cols.join(', ')}) VALUES (${placeholders})`,
        cols.map((c) => pet[c] ?? null)
      );
    }
    for (const row of backup.vaccinations ?? []) {
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT OR REPLACE INTO vaccinations (${cols.join(', ')}) VALUES (${placeholders})`,
        cols.map((c) => row[c] ?? null)
      );
    }
    for (const row of backup.medications ?? []) {
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT OR REPLACE INTO medications (${cols.join(', ')}) VALUES (${placeholders})`,
        cols.map((c) => row[c] ?? null)
      );
    }
    for (const row of backup.health_records ?? []) {
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT OR REPLACE INTO health_records (${cols.join(', ')}) VALUES (${placeholders})`,
        cols.map((c) => row[c] ?? null)
      );
    }
    for (const row of backup.documents ?? []) {
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT OR REPLACE INTO documents (${cols.join(', ')}) VALUES (${placeholders})`,
        cols.map((c) => row[c] ?? null)
      );
    }
    for (const row of backup.reminders ?? []) {
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT OR REPLACE INTO reminders (${cols.join(', ')}) VALUES (${placeholders})`,
        cols.map((c) => row[c] ?? null)
      );
    }
  });

  // Fotos wiederherstellen
  for (const photo of backup.photos ?? []) {
    try {
      // Verzeichnis sicherstellen
      const dir = photo.uri.substring(0, photo.uri.lastIndexOf('/'));
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      await FileSystem.writeAsStringAsync(photo.uri, photo.base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch {
      // Einzelnes Foto fehlgeschlagen – kein Abbruch
    }
  }
}

/**
 * E-93: Gibt das Datum des letzten Backups zurueck.
 * Primaer aus AsyncStorage (ueberlebt App-Updates), Fallback auf Datei-Existenz.
 */
export async function getLastBackupDate(): Promise<string | null> {
  try {
    // Primaer: AsyncStorage (ueberlebt App-Updates)
    const storedDate = await AsyncStorage.getItem(KEY_LAST_BACKUP_DATE);
    if (storedDate) {
      return storedDate;
    }
  } catch {
    // Fallthrough zu Datei-Check
  }

  // Fallback: Auto-Backup-Datei pruefen
  try {
    const backupPath = `${FileSystem.documentDirectory}simplypet_auto_backup.simplypet`;
    const info = await FileSystem.getInfoAsync(backupPath);
    if (info.exists && !info.isDirectory) {
      const date = new Date(info.modificationTime! * 1000).toISOString();
      // Datum auch in AsyncStorage nachholen fuer Zukunft
      await AsyncStorage.setItem(KEY_LAST_BACKUP_DATE, date);
      return date;
    }
  } catch {
    // Kein Backup vorhanden
  }
  return null;
}
