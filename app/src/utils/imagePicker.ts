/**
 * simplyPet: Gemeinsamer Image-Picker-Helper (v0.1.2)
 *
 * Loest:
 * - Praevention Nr. 24: Android 13+ READ_MEDIA_IMAGES korrekt anfragen
 * - Praevention Nr. 26: Foto-Komprimierung sicherstellen (max 800px, quality 0.7)
 * - Tester-Bug: "Fotos aus Galerie/Favoriten nicht aufrufbar"
 *
 * Expo ImagePicker ab v15 nutzt intern den Android Photo Picker (API 33+),
 * der KEINE Permission braucht. Auf aelteren Geraeten wird READ_MEDIA_IMAGES
 * oder READ_EXTERNAL_STORAGE angefragt.
 *
 * Dieser Helper zentralisiert die Logik, damit jeder Screen sie einheitlich nutzt.
 */
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';

const MAX_DIMENSION = 800; // px – reicht fuer Tierfotos und Dokument-Thumbnails
const JPEG_QUALITY = 0.7; // Komprimierung: ~50-150 KB pro Bild

export interface PickResult {
  uri: string;
  cancelled: boolean;
}

/**
 * Foto mit Kamera aufnehmen.
 * Gibt komprimiertes Bild zurueck oder { cancelled: true }.
 */
export async function takePhoto(): Promise<PickResult> {
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Kamera nicht freigegeben',
        'Ohne Kamera-Freigabe kann kein Foto aufgenommen werden. Du kannst die Freigabe in den Android-Einstellungen erteilen.'
      );
      return { uri: '', cancelled: true };
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 1, // Volle Qualitaet, Komprimierung machen wir selbst
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.[0]) {
      return { uri: '', cancelled: true };
    }
    const compressed = await compressImage(result.assets[0].uri);
    return { uri: compressed, cancelled: false };
  } catch {
    Alert.alert('Foto nicht möglich', 'Das Foto konnte nicht aufgenommen werden.');
    return { uri: '', cancelled: true };
  }
}

/**
 * Bild aus Galerie waehlen.
 * Nutzt auf Android 13+ den System-Photo-Picker (keine Permission noetig).
 * Auf aelteren Versionen wird READ_MEDIA_IMAGES angefragt.
 */
export async function pickFromGallery(): Promise<PickResult> {
  try {
    // Auf Android 13+ (API 33) nutzt Expo den System-Photo-Picker,
    // der KEINE runtime Permission braucht. Trotzdem requestMediaLibraryPermissionsAsync
    // aufrufen – Expo handhabt die Fallback-Logik intern.
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      // Auf manchen Geraeten (Samsung One UI) wird der System-Picker trotzdem
      // funktionieren. Wir versuchen es trotzdem:
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        // Android 13+: System-Picker braucht keine Permission, Expo kann trotzdem
        // "not granted" melden. Wir versuchen es einfach.
      } else {
        Alert.alert(
          'Galerie nicht freigegeben',
          'Ohne Freigabe kann kein Bild aus der Galerie gewählt werden. Du kannst die Freigabe in den Android-Einstellungen erteilen.'
        );
        return { uri: '', cancelled: true };
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: false,
      mediaTypes: ['images'],
    });
    if (result.canceled || !result.assets?.[0]) {
      return { uri: '', cancelled: true };
    }
    const compressed = await compressImage(result.assets[0].uri);
    return { uri: compressed, cancelled: false };
  } catch (error) {
    Alert.alert(
      'Bild nicht möglich',
      'Das Bild konnte nicht aus der Galerie übernommen werden. Bitte versuche es erneut.'
    );
    return { uri: '', cancelled: true };
  }
}

/**
 * Komprimiert ein Bild auf max MAX_DIMENSION px und JPEG_QUALITY.
 * Praevention Nr. 26: Verhindert 10+ MB Bilder im RAM auf Low-End-Geraeten.
 */
async function compressImage(uri: string): Promise<string> {
  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: MAX_DIMENSION } }],
      { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulated.uri;
  } catch {
    // Komprimierung fehlgeschlagen – Original zurueckgeben (besser als gar kein Bild)
    return uri;
  }
}

/**
 * Prueft ob genuegend Speicherplatz fuer ein Foto vorhanden ist.
 * Praevention Nr. 32.
 */
export async function hasEnoughStorage(minMB: number = 50): Promise<boolean> {
  try {
    const free = await FileSystem.getFreeDiskStorageAsync();
    return free > minMB * 1024 * 1024;
  } catch {
    return true; // Im Zweifel erlauben
  }
}
