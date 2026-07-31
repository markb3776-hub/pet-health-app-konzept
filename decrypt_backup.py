"""
Entschlüsselt ein simplyPet-Backup mit dem gleichen Algorithmus wie cryptoService.ts:
- Key-Derivation: Iteratives SHA-512 (10000 Runden)
- Verschlüsselung: AES-256-GCM
- Format: combined = IV (12 bytes) + Ciphertext + Tag (16 bytes)
"""
import json
import hashlib
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

BACKUP_FILE = "/home/ubuntu/upload/Backup_003_2026-07-31.simplypet"
PASSWORD = "Hanna"
KEY_DERIVATION_ROUNDS = 10_000

def derive_key(password: str, salt: bytes) -> bytes:
    """Gleiche Key-Derivation wie cryptoService.ts"""
    salt_hex = salt.hex()
    
    # Initiales Hash: SHA-512(password + saltHex + "0")
    h = hashlib.sha512((password + salt_hex + "0").encode()).hexdigest()
    
    for i in range(1, KEY_DERIVATION_ROUNDS):
        h = hashlib.sha512((h + str(i)).encode()).hexdigest()
    
    # Erste 32 Bytes (64 Hex-Zeichen) als Key
    key_hex = h[:64]
    return bytes.fromhex(key_hex)

def decrypt_backup(filepath: str, password: str) -> dict:
    with open(filepath, 'r') as f:
        envelope = json.load(f)
    
    assert envelope.get("encrypted") == True, "Nicht verschlüsselt"
    
    # Salt aus Base64
    salt = base64.b64decode(envelope["salt"])
    print(f"Salt ({len(salt)} bytes): {salt.hex()}")
    
    # Key ableiten
    key = derive_key(password, salt)
    print(f"Derived key ({len(key)} bytes): {key.hex()[:16]}...")
    
    # Combined data aus Base64
    combined = base64.b64decode(envelope["data"])
    print(f"Combined data: {len(combined)} bytes")
    
    # Format: IV (12 bytes) + Ciphertext + Tag (16 bytes)
    # In expo-crypto GCM: IV ist 12 bytes, Tag ist 16 bytes, Tag ist am ENDE
    iv_length = 12
    tag_length = 16
    
    iv = combined[:iv_length]
    ciphertext_with_tag = combined[iv_length:]
    # In GCM: ciphertext + tag sind zusammen
    ciphertext = ciphertext_with_tag[:-tag_length]
    tag = ciphertext_with_tag[-tag_length:]
    
    print(f"IV ({len(iv)} bytes): {iv.hex()}")
    print(f"Ciphertext: {len(ciphertext)} bytes")
    print(f"Tag ({len(tag)} bytes): {tag.hex()}")
    
    # Entschlüsseln mit AES-256-GCM
    aesgcm = AESGCM(key)
    # Python cryptography erwartet ciphertext+tag zusammen als "data"
    plaintext = aesgcm.decrypt(iv, ciphertext_with_tag, None)
    
    print(f"\nEntschlüsselung ERFOLGREICH! ({len(plaintext)} bytes)")
    
    # JSON parsen
    backup_data = json.loads(plaintext.decode('utf-8'))
    return backup_data

if __name__ == "__main__":
    try:
        data = decrypt_backup(BACKUP_FILE, PASSWORD)
        print(f"\n{'='*60}")
        print(f"BACKUP INHALT:")
        print(f"{'='*60}")
        print(f"Version: {data.get('version')}")
        print(f"Erstellt: {data.get('created_at')}")
        print(f"Backup-Nr: {data.get('backup_number')}")
        print(f"\nTiere: {len(data.get('pets', []))}")
        for p in data.get('pets', []):
            print(f"  - {p.get('name')} ({p.get('species')}) | Spalten: {list(p.keys())}")
        print(f"\nImpfungen: {len(data.get('vaccinations', []))}")
        for v in data.get('vaccinations', []):
            print(f"  - {v.get('disease', v.get('type', '?'))} | Spalten: {list(v.keys())}")
        print(f"\nMedikamente: {len(data.get('medications', []))}")
        for m in data.get('medications', []):
            print(f"  - {m.get('name')} | Spalten: {list(m.keys())}")
        print(f"\nGesundheitseinträge: {len(data.get('health_records', []))}")
        for h in data.get('health_records', []):
            print(f"  - {h.get('record_type')} ({h.get('date')}) | Spalten: {list(h.keys())}")
        print(f"\nDokumente: {len(data.get('documents', []))}")
        print(f"Erinnerungen: {len(data.get('reminders', []))}")
        print(f"Fotos: {len(data.get('photos', []))}")
        
        # Vollständigen JSON-Dump speichern
        with open("/home/ubuntu/simplypet_workspace/_backup_decrypted.json", "w") as f:
            # Fotos base64 kürzen für Lesbarkeit
            data_copy = json.loads(json.dumps(data))
            for photo in data_copy.get('photos', []):
                if 'base64' in photo:
                    photo['base64'] = photo['base64'][:50] + "...[TRUNCATED]"
            json.dump(data_copy, f, indent=2, ensure_ascii=False)
        print(f"\nVollständiger Dump: _backup_decrypted.json")
        
    except Exception as e:
        print(f"\nFEHLER: {type(e).__name__}: {e}")
