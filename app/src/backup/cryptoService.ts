/**
 * simplyPet: Backup-Verschlüsselung (AES-256-GCM)
 *
 * Strategie:
 * - Passwort → PBKDF2-ähnliche Key-Derivation via SHA-512 + Salt
 * - AES-256-GCM Verschlüsselung via expo-crypto
 * - Format: JSON-Envelope { encrypted: true, salt, data (base64 combined) }
 * - Auto-Detect beim Import: Wenn JSON mit "encrypted: true" → Passwort abfragen
 * - Abwärtskompatibel: Alte unverschlüsselte Backups werden weiterhin erkannt
 */
import * as Crypto from 'expo-crypto';
import {
  AESEncryptionKey,
  AESSealedData,
  aesEncryptAsync,
  aesDecryptAsync,
  AESKeySize,
} from 'expo-crypto';

/**
 * Verschlüsseltes Backup-Format (Dateiinhalt)
 */
export interface EncryptedBackupEnvelope {
  encrypted: true;
  version: number;
  salt: string; // base64
  data: string; // base64 (IV + Ciphertext + Tag combined)
}

const CRYPTO_VERSION = 1;
const SALT_BYTES = 16;
const KEY_DERIVATION_ROUNDS = 10_000;

/**
 * Leitet einen AES-256-Schlüssel aus einem Passwort + Salt ab.
 * Verwendet iteratives SHA-512 Hashing (PBKDF2-ähnlich).
 * expo-crypto hat kein natives PBKDF2, daher manuelle Iteration.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<AESEncryptionKey> {
  // Initiales Material: password + salt zusammenführen
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  // Salt als Hex-String für digestStringAsync
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Iteratives Hashing: SHA-512(password + salt + counter)
  let hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    password + saltHex + '0',
    { encoding: Crypto.CryptoEncoding.HEX }
  );

  for (let i = 1; i < KEY_DERIVATION_ROUNDS; i++) {
    hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      hash + i.toString(),
      { encoding: Crypto.CryptoEncoding.HEX }
    );
  }

  // Erste 32 Bytes (64 Hex-Zeichen) als AES-256-Key verwenden
  const keyHex = hash.substring(0, 64);
  const key = await AESEncryptionKey.import(keyHex, 'hex');
  return key;
}

/**
 * Verschlüsselt einen JSON-String mit AES-256-GCM.
 * Gibt ein EncryptedBackupEnvelope zurück (als JSON-String).
 */
export async function encryptBackup(jsonContent: string, password: string): Promise<string> {
  // Zufälliges Salt generieren
  const salt = Crypto.getRandomBytes(SALT_BYTES);

  // Key ableiten
  const key = await deriveKey(password, salt);

  // Plaintext als Base64 kodieren (expo-crypto erwartet Base64 für String-Input)
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(jsonContent);

  // Verschlüsseln
  const sealed = await aesEncryptAsync(plaintextBytes, key);

  // Combined-Format: IV + Ciphertext + Tag als Base64
  const combinedBase64 = await sealed.combined('base64');

  // Salt als Base64
  const saltBase64 = uint8ToBase64(salt);

  const envelope: EncryptedBackupEnvelope = {
    encrypted: true,
    version: CRYPTO_VERSION,
    salt: saltBase64,
    data: combinedBase64,
  };

  return JSON.stringify(envelope);
}

/**
 * Entschlüsselt ein verschlüsseltes Backup.
 * Gibt den entschlüsselten JSON-String zurück.
 * Wirft einen Error bei falschem Passwort.
 */
export async function decryptBackup(envelopeJson: string, password: string): Promise<string> {
  const envelope: EncryptedBackupEnvelope = JSON.parse(envelopeJson);

  if (!envelope.encrypted || !envelope.salt || !envelope.data) {
    throw new Error('Ungültiges verschlüsseltes Backup-Format');
  }

  // Salt aus Base64 dekodieren
  const salt = base64ToUint8(envelope.salt);

  // Key ableiten
  const key = await deriveKey(password, salt);

  // SealedData aus Combined-Base64 rekonstruieren
  // Fix E-126: Android-Bug in expo-crypto 57.0.1 (Issue #47274)
  // fromCombined() ist auf Android kaputt (native Kotlin-Bridge übergibt ByteArray falsch).
  // Workaround: Combined-Bytes manuell in IV/Ciphertext/Tag aufteilen und fromParts() nutzen.
  const combinedBytes = base64ToUint8(envelope.data);
  // AES-256-GCM Combined-Format: IV (12 Bytes) + Ciphertext + AuthTag (16 Bytes)
  const iv = combinedBytes.slice(0, 12);
  const ciphertext = combinedBytes.slice(12, combinedBytes.length - 16);
  const tag = combinedBytes.slice(combinedBytes.length - 16);
  const sealed = AESSealedData.fromParts(iv, ciphertext, tag);

  // Entschlüsseln
  try {
    const decryptedBase64 = await aesDecryptAsync(sealed, key, { output: 'base64' });
    // Base64 → UTF-8 String
    const decryptedBytes = base64ToUint8(decryptedBase64);
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBytes);
  } catch {
    throw new Error('Falsches Passwort oder beschädigte Datei');
  }
}

/**
 * Prüft ob ein Dateiinhalt ein verschlüsseltes Backup ist.
 * Schnelle Prüfung ohne vollständiges Parsen.
 */
export function isEncryptedBackup(content: string): boolean {
  try {
    // Schneller Check: Beginnt mit {"encrypted":true
    if (!content.trimStart().startsWith('{')) return false;
    const parsed = JSON.parse(content);
    return parsed.encrypted === true && typeof parsed.salt === 'string' && typeof parsed.data === 'string';
  } catch {
    return false;
  }
}

// ─── Hilfsfunktionen ───

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
