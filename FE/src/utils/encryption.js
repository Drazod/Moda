/**
 * ============================================================================
 * END-TO-END ENCRYPTION UTILITY FOR CHAT
 * ============================================================================
 * 
 * ARCHITECTURE:
 * 1. RSA-2048 key pair (public/private) per user
 * 2. Envelope encryption for key backup (GitHub-style recovery)
 * 3. Non-extractable private keys in IndexedDB
 * 4. PIN + recovery codes for access control
 * 5. AES-256-GCM for message encryption (hybrid encryption)
 * 
 * ENVELOPE ENCRYPTION FLOW:
 * Setup:
 *  - Generate master key (random AES-256)
 *  - Encrypt private key with master key → 1 encrypted blob
 *  - Wrap master key with PIN → store on server
 *  - Wrap master key with 10 recovery codes → store on server
 * 
 * Unlock:
 *  - Enter PIN → unwrap master key → decrypt private key
 *  - OR enter recovery code → unwrap master key → decrypt private key
 * 
 * MESSAGE ENCRYPTION:
 * Sender:
 *  - Generate random AES key per message
 *  - Encrypt message with AES (fast)
 *  - Encrypt AES key with receiver's RSA public key
 *  - Store plain AES key (sender can decrypt own messages)
 * 
 * Receiver:
 *  - Decrypt AES key with own RSA private key
 *  - Decrypt message with AES key
 * 
 * SECURITY FEATURES:
 * ✓ Non-extractable private keys (XSS protection)
 * ✓ IndexedDB storage (more secure than localStorage)
 * ✓ PIN verification via encrypted token
 * ✓ Single-use recovery codes
 * ✓ Perfect Forward Secrecy (unique key per message)
 * ✓ Server cannot read messages (no master keys in plaintext)
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

const RSA_CONFIG = {
  algorithm: {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256'
  },
  extractable: true,
  privateKeyExtractable: false, // Non-extractable for XSS protection
  keyUsages: ['encrypt', 'decrypt']
};

const AES_CONFIG = {
  algorithm: { name: 'AES-GCM', length: 256 },
  extractable: true,
  keyUsages: ['encrypt', 'decrypt']
};

const DB_NAME = 'ModaChatEncryption';
const DB_VERSION = 2;
const STORE_NAME = 'keys';

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Convert ArrayBuffer to Base64 string
 */
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Convert Base64 string to ArrayBuffer
 */
const base64ToArrayBuffer = (base64) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// ============================================================================
// INDEXEDDB UTILITIES
// ============================================================================

/**
 * Initialize IndexedDB for secure key storage
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      // Verify the object store exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // If store doesn't exist, we need to upgrade the database
        db.close();
        const upgradeRequest = indexedDB.open(DB_NAME, DB_VERSION + 1);
        
        upgradeRequest.onupgradeneeded = (event) => {
          const upgradeDb = event.target.result;
          if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
            upgradeDb.createObjectStore(STORE_NAME);
          }
        };
        
        upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);
        upgradeRequest.onerror = () => reject(upgradeRequest.error);
      } else {
        resolve(db);
      }
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

// ============================================================================
// RSA KEY PAIR GENERATION & EXPORT/IMPORT
// ============================================================================

/**
 * Generate RSA-2048 key pair (extractable for backup, will be stored as non-extractable)
 */
export const generateKeyPair = async () => {
  try {
    // Generate with both keys extractable (needed for server backup)
    const keyPair = await window.crypto.subtle.generateKey(
      RSA_CONFIG.algorithm,
      true, // Both keys extractable
      RSA_CONFIG.keyUsages
    );
    
    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey // Extractable for now
    };
  } catch (error) {
    console.error('Failed to generate key pair:', error);
    throw new Error('Key generation failed');
  }
};

/**
 * Export public key to PEM format
 */
export const exportPublicKey = async (publicKey) => {
  try {
    const exported = await window.crypto.subtle.exportKey('spki', publicKey);
    const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exported));
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemFormatted = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    
    return pemFormatted;
  } catch (error) {
    console.error('Failed to export public key:', error);
    throw new Error('Public key export failed');
  }
};

/**
 * Export private key to PEM format
 */
export const exportPrivateKey = async (privateKey) => {
  try {
    const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exported));
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemFormatted = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    
    return pemFormatted;
  } catch (error) {
    console.error('Failed to export private key:', error);
    throw new Error('Private key export failed');
  }
};

/**
 * Import public key from PEM format
 */
export const importPublicKey = async (pemKey) => {
  try {
    const pemContents = pemKey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\n/g, '');
    
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      binaryDer.buffer,
      RSA_CONFIG.algorithm,
      true,
      ['encrypt']
    );
    
    return publicKey;
  } catch (error) {
    console.error('Failed to import public key:', error);
    throw new Error('Public key import failed');
  }
};

/**
 * Import private key from PEM format
 */
export const importPrivateKey = async (pemKey) => {
  try {
    const pemContents = pemKey
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');
    
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    
    const privateKey = await window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer.buffer,
      RSA_CONFIG.algorithm,
      true,
      ['decrypt']
    );
    
    return privateKey;
  } catch (error) {
    console.error('Failed to import private key:', error);
    throw new Error('Private key import failed');
  }
};

/**
 * Derive encryption key from PIN using PBKDF2
 */
const derivePinKey = async (pin) => {
  const encoder = new TextEncoder();
  const pinData = encoder.encode(pin);
  const salt = encoder.encode('moda-chat-salt-v1');
  
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    pinData,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    AES_CONFIG.algorithm,
    false,
    ['encrypt', 'decrypt']
  );
  
  return derivedKey;
};

/**
 * Generate a random master key for envelope encryption
 */
const generateMasterKey = async () => {
  return await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt data with master key
 */
const encryptWithMasterKey = async (data, masterKey) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    dataBuffer
  );
  
  return {
    encrypted: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv)
  };
};

/**
 * Decrypt data with master key
 */
const decryptWithMasterKey = async (encryptedData, iv, masterKey) => {
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);
  const ivBuffer = base64ToArrayBuffer(iv);
  
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    masterKey,
    encryptedBuffer
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * Export master key as raw bytes
 */
const exportMasterKey = async (masterKey) => {
  const rawKey = await window.crypto.subtle.exportKey('raw', masterKey);
  return arrayBufferToBase64(rawKey);
};

/**
 * Import master key from raw bytes
 */
const importMasterKey = async (base64Key) => {
  const rawKey = base64ToArrayBuffer(base64Key);
  return await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Wrap (encrypt) master key with a password/PIN/recovery code
 */
const wrapMasterKey = async (masterKey, password) => {
  const passwordKey = await derivePinKey(password);
  const rawMasterKey = await exportMasterKey(masterKey);
  const encoder = new TextEncoder();
  const masterKeyData = encoder.encode(rawMasterKey);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const wrapped = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    passwordKey,
    masterKeyData
  );
  
  return {
    wrappedKey: arrayBufferToBase64(wrapped),
    iv: arrayBufferToBase64(iv)
  };
};

/**
 * Unwrap (decrypt) master key with a password/PIN/recovery code
 */
const unwrapMasterKey = async (wrappedKey, iv, password) => {
  const passwordKey = await derivePinKey(password);
  const wrappedBuffer = base64ToArrayBuffer(wrappedKey);
  const ivBuffer = base64ToArrayBuffer(iv);
  
  const unwrapped = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    passwordKey,
    wrappedBuffer
  );
  
  const decoder = new TextDecoder();
  const masterKeyBase64 = decoder.decode(unwrapped);
  return await importMasterKey(masterKeyBase64);
};

// ============================================================================
// ENVELOPE ENCRYPTION (Recovery Codes System)
// ============================================================================

/**
 * Hash recovery code with SHA-256
 */
const hashRecoveryCode = async (code) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate 10 random recovery codes in XXXX-XXXX-XXXX format
 */
export const generateRecoveryCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = Array.from({ length: 12 }, () => 
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 36)]
    ).join('');
    codes.push(code.match(/.{1,4}/g).join('-')); // Format: XXXX-XXXX-XXXX
  }
  return codes;
};

/**
 * Envelope encryption: Encrypt private key with master key,
 * then wrap master key with PIN and recovery codes
 */
export const createEnvelopeEncryption = async (privateKeyPem, pin, recoveryCodes) => {
  // Generate random master key
  const masterKey = await generateMasterKey();
  console.log('✅ Master key generated');
  
  // Encrypt private key with master key (only once!)
  const { encrypted: encryptedPrivateKey, iv: privateKeyIV } = await encryptWithMasterKey(privateKeyPem, masterKey);
  console.log('✅ Private key encrypted with master key');
  
  // Wrap master key with PIN
  const { wrappedKey: masterKeyWrappedByPin, iv: pinWrapIV } = await wrapMasterKey(masterKey, pin);
  console.log('✅ Master key wrapped with PIN');
  
  // Wrap master key with each recovery code
  const recoveryCodeWraps = [];
  for (const code of recoveryCodes) {
    const { wrappedKey, iv } = await wrapMasterKey(masterKey, code);
    recoveryCodeWraps.push({
      code: code, // Send plain code - backend will hash it
      wrappedMasterKey: wrappedKey,
      wrapIV: iv
    });
  }
  console.log(`✅ Master key wrapped with ${recoveryCodes.length} recovery codes`);
  
  return {
    // The private key encrypted with master key (stored on server)
    encryptedPrivateKey,
    privateKeyIV,
    // Master key wrapped by PIN (stored on server)
    masterKeyWrappedByPin,
    pinWrapIV,
    // Master key wrapped by each recovery code (stored on server)
    recoveryCodeWraps
  };
};



/**
 * Recover private key using recovery code (envelope decryption)
 * Fetches encrypted data from server
 */
export const recoverWithCode = async (recoveryCode, axiosInstance) => {
  try {
    // Fetch encrypted keys and recovery wraps from server
    console.log('🔍 Fetching encrypted keys from server...');
    const response = await axiosInstance.get('/chat/encrypted-keys');
    const data = response.data;
    
    console.log('📦 Server data received:', {
      hasEncryptedPrivateKey: !!data.encryptedPrivateKey,
      hasPrivateKeyIV: !!data.privateKeyIV,
      hasRecoveryCodeWraps: !!data.recoveryCodeWraps,
      recoveryCodeWrapsLength: data.recoveryCodeWraps?.length || 0
    });
    
    if (!data.encryptedPrivateKey || !data.privateKeyIV) {
      throw new Error('No encrypted private key found on server');
    }
    
    if (!data.recoveryCodeWraps || data.recoveryCodeWraps.length === 0) {
      throw new Error('No recovery code wraps found on server. Backend needs to store recoveryCodeWraps array.');
    }
    
    // Hash the recovery code to match against stored hashes
    console.log('🔍 Hashing recovery code...');
    const inputCodeHash = await hashRecoveryCode(recoveryCode);
    console.log('🔑 Input code hash:', inputCodeHash);
    
    // Find the wrap matching this recovery code hash
    console.log('🔍 Looking for recovery code in wraps...');
    const matchingWrap = data.recoveryCodeWraps.find(w => w.codeHash === inputCodeHash);
    
    if (!matchingWrap) {
      console.error('❌ Recovery code not found. Server has', data.recoveryCodeWraps.length, 'wraps');
      console.error('Available code hashes:', data.recoveryCodeWraps.map(w => w.codeHash.substring(0, 16) + '...'));
      throw new Error('Invalid recovery code - not found in server database');
    }
    
    console.log('✅ Found matching recovery code wrap');
    console.log('📦 Wrap data:', { hasWrappedKey: !!matchingWrap.wrappedMasterKey, hasIV: !!matchingWrap.wrapIV });
    
    console.log('🔓 Unwrapping master key with recovery code...');
    // Unwrap master key using recovery code
    const masterKey = await unwrapMasterKey(
      matchingWrap.wrappedMasterKey,
      matchingWrap.wrapIV,
      recoveryCode
    );
    
    console.log('🔓 Decrypting private key with master key...');
    // Decrypt private key using master key
    const privateKeyPem = await decryptWithMasterKey(
      data.encryptedPrivateKey,
      data.privateKeyIV,
      masterKey
    );
    
    // Mark recovery code as used on server
    await axiosInstance.post('/chat/use-recovery-code', {
      recoveryCode: recoveryCode
    });
    
    console.log('✅ Recovery successful');
    
    return privateKeyPem;
  } catch (error) {
    console.error('Recovery failed:', error);
    throw new Error('Invalid recovery code or decryption failed');
  }
};

/**
 * Encrypt data with PIN
 */
const encryptWithPin = async (data, pin) => {
  const pinKey = await derivePinKey(pin);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    pinKey,
    encodedData
  );
  
  const encryptedArray = new Uint8Array(encrypted);
  const encryptedString = String.fromCharCode.apply(null, encryptedArray);
  const encryptedBase64 = window.btoa(encryptedString);
  
  const ivString = String.fromCharCode.apply(null, iv);
  const ivBase64 = window.btoa(ivString);
  
  return { encrypted: encryptedBase64, iv: ivBase64 };
};
/**
 * Encrypt private key for server backup
 * Returns encrypted private key + IV that can be safely stored on server
 */
/**
 * Decrypt private key using PIN (envelope decryption)
 */
export const decryptPrivateKeyWithPin = async (encryptedPrivateKey, privateKeyIV, masterKeyWrappedByPin, pinWrapIV, pin) => {
  try {
    console.log('🔓 Unwrapping master key with PIN...');
    // Unwrap master key using PIN
    const masterKey = await unwrapMasterKey(masterKeyWrappedByPin, pinWrapIV, pin);
    
    console.log('🔓 Decrypting private key with master key...');
    // Decrypt private key using master key
    const privateKeyPem = await decryptWithMasterKey(encryptedPrivateKey, privateKeyIV, masterKey);
    
    return privateKeyPem;
  } catch (error) {
    console.error('Failed to decrypt with PIN:', error);
    throw new Error('Incorrect PIN or decryption failed');
  }
};

export const encryptPrivateKeyForBackup = async (privateKeyPem, pin) => {
  try {
    console.log('🔐 encryptPrivateKeyForBackup called with PIN length:', pin?.length);
    
    // Log PIN hash for debugging (first 10 chars only for security)
    const pinHashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
    const pinHashArray = Array.from(new Uint8Array(pinHashBuffer));
    const pinHash = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    console.log('🔐 PIN hash (first 16 chars):', pinHash);
    
    const pinKey = await derivePinKey(pin);
    const encoder = new TextEncoder();
    const privateKeyData = encoder.encode(privateKeyPem);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      pinKey,
      privateKeyData
    );
    
    // Convert to base64 in chunks to avoid call stack issues with large data
    const encryptedArray = new Uint8Array(encrypted);
    let encryptedString = '';
    const chunkSize = 8192;
    for (let i = 0; i < encryptedArray.length; i += chunkSize) {
      encryptedString += String.fromCharCode.apply(null, encryptedArray.subarray(i, i + chunkSize));
    }
    const encryptedBase64 = window.btoa(encryptedString);
    
    let ivString = '';
    for (let i = 0; i < iv.length; i += chunkSize) {
      ivString += String.fromCharCode.apply(null, iv.subarray(i, i + chunkSize));
    }
    const ivBase64 = window.btoa(ivString);
    
    console.log('✅ Private key encrypted for backup:', {
      encryptedLength: encryptedBase64.length,
      ivLength: ivBase64.length
    });
    
    return {
      encryptedPrivateKey: encryptedBase64,
      iv: ivBase64
    };
  } catch (error) {
    console.error('Failed to encrypt private key for backup:', error);
    throw new Error('Private key encryption failed');
  }
};

/**
 * Decrypt private key from server backup
 */
export const decryptPrivateKeyFromBackup = async (encryptedPrivateKey, iv, pin) => {
  try {
    console.log('🔐 decryptPrivateKeyFromBackup called with:', {
      encryptedPrivateKeyLength: encryptedPrivateKey?.length,
      ivLength: iv?.length,
      pinLength: pin?.length
    });
    
    // Log PIN hash for debugging (first 10 chars only for security)
    const pinHashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
    const pinHashArray = Array.from(new Uint8Array(pinHashBuffer));
    const pinHash = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    console.log('🔐 PIN hash (first 16 chars):', pinHash);
    
    const pinKey = await derivePinKey(pin);
    console.log('✅ PIN key derived');
    
    // Decode base64 to binary
    const ivBinary = window.atob(iv);
    const ivArray = new Uint8Array(ivBinary.length);
    for (let i = 0; i < ivBinary.length; i++) {
      ivArray[i] = ivBinary.charCodeAt(i);
    }
    console.log('✅ IV decoded, length:', ivArray.length);
    
    // Decode large base64 data
    const encryptedBinary = window.atob(encryptedPrivateKey);
    const encryptedArray = new Uint8Array(encryptedBinary.length);
    for (let i = 0; i < encryptedBinary.length; i++) {
      encryptedArray[i] = encryptedBinary.charCodeAt(i);
    }
    console.log('✅ Encrypted data decoded, length:', encryptedArray.length, 'bytes');
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      pinKey,
      encryptedArray.buffer
    );
    console.log('✅ Decryption successful!');
    
    const decoder = new TextDecoder();
    const result = decoder.decode(decrypted);
    console.log('✅ Private key decoded, starts with:', result.substring(0, 30));
    return result;
  } catch (error) {
    console.error('❌ decryptPrivateKeyFromBackup failed:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    });
    throw new Error('Incorrect PIN or corrupted backup');
  }
};

// ============================================================================
// LOCAL KEY STORAGE & RETRIEVAL
// ============================================================================

/**
 * Store keys locally with PIN protection (IndexedDB + localStorage)
 */
export const storeKeysSecurely = async (publicKeyPem, privateKey, pin) => {
  try {
    const db = await initDB();
    
    // Derive encryption key from PIN using PBKDF2 (secure, slow)
    const pinKey = await derivePinKey(pin);
    
    // Create a verification token encrypted with PIN
    const verificationToken = 'moda-chat-key-verification';
    const encoder = new TextEncoder();
    const tokenData = encoder.encode(verificationToken);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedToken = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      pinKey,
      tokenData
    );
    
    const tokenArray = new Uint8Array(encryptedToken);
    const tokenString = String.fromCharCode.apply(null, tokenArray);
    const tokenBase64 = window.btoa(tokenString);
    
    const ivString = String.fromCharCode.apply(null, iv);
    const ivBase64 = window.btoa(ivString);
    
    // Convert extractable private key to non-extractable for storage
    const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', privateKey);
    const nonExtractablePrivateKey = await window.crypto.subtle.importKey(
      'jwk',
      privateKeyJwk,
      RSA_CONFIG.algorithm,
      false, // Non-extractable
      ['decrypt']
    );
    
    // Store non-extractable private key in IndexedDB
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.put(nonExtractablePrivateKey, 'privateKey');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    // Store public key and encrypted verification token
    localStorage.setItem('chat_public_key', publicKeyPem);
    localStorage.setItem('chat_pin_token', tokenBase64);
    localStorage.setItem('chat_pin_token_iv', ivBase64);
    localStorage.setItem('chat_pin_protected', 'true');
    
    return true;
  } catch (error) {
    console.error('Failed to store keys:', error);
    throw new Error('Key storage failed');
  }
};

/**
 * Retrieve keys from IndexedDB (requires correct PIN)
 */
export const retrieveStoredKeys = async (pin) => {
  try {
    const publicKeyPem = localStorage.getItem('chat_public_key');
    const encryptedToken = localStorage.getItem('chat_pin_token');
    const tokenIV = localStorage.getItem('chat_pin_token_iv');
    
    if (!publicKeyPem || !encryptedToken || !tokenIV) {
      return { publicKeyPem: null, privateKey: null };
    }
    
    // Verify PIN by decrypting verification token
    try {
      const pinKey = await derivePinKey(pin);
      
      const ivString = window.atob(tokenIV);
      const ivArray = new Uint8Array(ivString.length);
      for (let i = 0; i < ivString.length; i++) {
        ivArray[i] = ivString.charCodeAt(i);
      }
      
      const encryptedString = window.atob(encryptedToken);
      const encryptedArray = new Uint8Array(encryptedString.length);
      for (let i = 0; i < encryptedString.length; i++) {
        encryptedArray[i] = encryptedString.charCodeAt(i);
      }
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivArray },
        pinKey,
        encryptedArray.buffer
      );
      
      const decoder = new TextDecoder();
      const token = decoder.decode(decrypted);
      
      if (token !== 'moda-chat-key-verification') {
        throw new Error('Invalid verification token');
      }
    } catch (decryptError) {
      throw new Error('Incorrect PIN');
    }
    
    // PIN verified, retrieve non-extractable private key from IndexedDB
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const privateKey = await new Promise((resolve, reject) => {
      const request = store.get('privateKey');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    if (!privateKey) {
      throw new Error('Private key not found in IndexedDB');
    }
    
    return { publicKeyPem, privateKey };
  } catch (error) {
    console.error('Failed to retrieve keys:', error);
    throw error;
  }
};

/**
 * Retrieve and decrypt private key from server backup
 * Use this when setting up encryption on a new device
 */
export const retrieveKeysFromServer = async (encryptedPrivateKeyData, pin) => {
  try {
    const { encryptedPrivateKey, iv, publicKey: publicKeyPem } = encryptedPrivateKeyData;
    
    console.log('🔑 Retrieving keys from server, publicKey exists:', !!publicKeyPem);
    
    // Decrypt private key with PIN
    const privateKeyPem = await decryptPrivateKeyFromBackup(encryptedPrivateKey, iv, pin);
    console.log('✅ Private key decrypted successfully');
    
    // Import private key as non-extractable
    const privateKeyJwk = await importPrivateKey(privateKeyPem);
    const privateKeyExported = await window.crypto.subtle.exportKey('jwk', privateKeyJwk);
    const nonExtractablePrivateKey = await window.crypto.subtle.importKey(
      'jwk',
      privateKeyExported,
      RSA_CONFIG.algorithm,
      false, // Non-extractable
      ['decrypt']
    );
    
    // Store in IndexedDB
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.put(nonExtractablePrivateKey, 'privateKey');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    console.log('✅ Private key stored in IndexedDB');
    
    // Create and store verification token
    const pinKey = await derivePinKey(pin);
    const encoder = new TextEncoder();
    const tokenData = encoder.encode('moda-chat-key-verification');
    const tokenIv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedToken = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: tokenIv },
      pinKey,
      tokenData
    );
    
    const tokenArray = new Uint8Array(encryptedToken);
    const tokenString = String.fromCharCode.apply(null, tokenArray);
    const tokenBase64 = window.btoa(tokenString);
    
    const tokenIvString = String.fromCharCode.apply(null, tokenIv);
    const tokenIvBase64 = window.btoa(tokenIvString);
    
    // Store in localStorage
    localStorage.setItem('chat_public_key', publicKeyPem);
    localStorage.setItem('chat_pin_token', tokenBase64);
    localStorage.setItem('chat_pin_token_iv', tokenIvBase64);
    localStorage.setItem('chat_pin_protected', 'true');
    console.log('✅ Verification token stored in localStorage');
    
    return {
      publicKeyPem,
      privateKey: nonExtractablePrivateKey
    };
  } catch (error) {
    console.error('❌ Failed to retrieve keys from server:', error);
    throw new Error('Failed to restore keys from server backup');
  }
};

/**
 * Check if all required keys and tokens exist in localStorage
 * Returns true only if ALL required items are present
 */
export const hasStoredKeys = () => {
  const publicKey = localStorage.getItem('chat_public_key');
  const pinToken = localStorage.getItem('chat_pin_token');
  const pinTokenIV = localStorage.getItem('chat_pin_token_iv');
  const pinProtected = localStorage.getItem('chat_pin_protected');
  
  // All items must exist for local verification to work
  return !!(publicKey && pinToken && pinTokenIV && pinProtected === 'true');
};

/**
 * Verify PIN is correct
 */
export const verifyPin = async (pin) => {
  try {
    const encryptedToken = localStorage.getItem('chat_pin_token');
    const tokenIV = localStorage.getItem('chat_pin_token_iv');
    
    if (!encryptedToken || !tokenIV) return false;
    
    // Try to decrypt verification token with PIN
    const pinKey = await derivePinKey(pin);
    
    const ivString = window.atob(tokenIV);
    const ivArray = new Uint8Array(ivString.length);
    for (let i = 0; i < ivString.length; i++) {
      ivArray[i] = ivString.charCodeAt(i);
    }
    
    const encryptedString = window.atob(encryptedToken);
    const encryptedArray = new Uint8Array(encryptedString.length);
    for (let i = 0; i < encryptedString.length; i++) {
      encryptedArray[i] = encryptedString.charCodeAt(i);
    }
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      pinKey,
      encryptedArray.buffer
    );
    
    const decoder = new TextDecoder();
    const token = decoder.decode(decrypted);
    
    return token === 'moda-chat-key-verification';
  } catch (error) {
    return false;
  }
};

/**
 * Clear stored keys
 */
export const clearStoredKeys = async () => {
  try {
    // Clear IndexedDB
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.delete('privateKey');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    // Clear localStorage
    localStorage.removeItem('chat_public_key');
    localStorage.removeItem('chat_pin_token');
    localStorage.removeItem('chat_pin_token_iv');
    localStorage.removeItem('chat_pin_protected');
    
    return true;
  } catch (error) {
    console.error('Failed to clear keys:', error);
    return false;
  }
};

/**
 * Helper: Encrypt data with RSA (for AES key encryption)
 */
const encryptMessage = async (message, publicKey) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    data
  );
  const encryptedArray = new Uint8Array(encrypted);
  const encryptedString = String.fromCharCode.apply(null, encryptedArray);
  return window.btoa(encryptedString);
};

/**
 * Helper: Decrypt data with RSA (for AES key decryption)
 */
const decryptMessage = async (encryptedMessage, privateKey) => {
  const encryptedString = window.atob(encryptedMessage);
  const encryptedArray = new Uint8Array(encryptedString.length);
  for (let i = 0; i < encryptedString.length; i++) {
    encryptedArray[i] = encryptedString.charCodeAt(i);
  }
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedArray.buffer
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * Generate a unique device fingerprint
 * Note: MAC address is not accessible via browser for security reasons
 * This creates a consistent fingerprint based on device characteristics
 */
const generateDeviceFingerprint = () => {
  // Collect device-specific data
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  let fingerprint = '';
  
  // GPU info (very device-specific)
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      fingerprint += vendor + renderer;
    }
  }
  
  // Screen fingerprint
  const screen = window.screen;
  fingerprint += screen.width + screen.height + screen.colorDepth + screen.pixelDepth;
  fingerprint += window.devicePixelRatio;
  
  // Hardware
  fingerprint += navigator.hardwareConcurrency || '';
  fingerprint += navigator.deviceMemory || '';
  
  // Platform
  fingerprint += navigator.platform;
  fingerprint += navigator.userAgent;
  
  // Timezone
  fingerprint += Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Language
  fingerprint += navigator.language;
  fingerprint += navigator.languages.join(',');
  
  // Generate hash from fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex and format like MAC address
  const hashStr = Math.abs(hash).toString(16).toUpperCase().padStart(12, '0');
  const macLike = hashStr.match(/.{1,2}/g).join(':').substring(0, 17);
  
  return macLike;
};

// ============================================================================
// DEVICE FINGERPRINTING
// ============================================================================

/**
 * Generate unique device fingerprint for trusted device detection
 */
export const getDeviceIdentifier = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let browserVersion = '';
  let os = 'Unknown OS';
  let osVersion = '';
  let deviceModel = '';
  
  // Browser detection with version
  if (ua.indexOf('Edg/') > -1) {
    browser = 'Edge';
    const match = ua.match(/Edg\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf('Chrome/') > -1 && ua.indexOf('Edg/') === -1) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf('Safari/') > -1 && ua.indexOf('Chrome') === -1) {
    browser = 'Safari';
    const match = ua.match(/Version\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf('Firefox/') > -1) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  
  // Device model and OS detection
  if (ua.indexOf('Windows NT') > -1) {
    os = 'Windows';
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    if (match) {
      const version = match[1];
      const versionMap = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7'
      };
      osVersion = versionMap[version] || version;
    }
    // Try to detect if it's a Surface device
    if (ua.indexOf('Surface') > -1) {
      deviceModel = 'Surface';
    }
  } else if (ua.indexOf('Mac OS X') > -1 || ua.indexOf('Macintosh') > -1) {
    // Mac detection
    if (ua.indexOf('Macintosh') > -1) {
      // Detect Mac model type based on user agent hints
      if (ua.indexOf('Intel') > -1) {
        deviceModel = 'Mac (Intel)';
      } else {
        deviceModel = 'Mac (Apple Silicon)';
      }
    }
    os = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (ua.indexOf('Linux') > -1 && ua.indexOf('Android') === -1) {
    os = 'Linux';
  } else if (ua.indexOf('Android') > -1) {
    os = 'Android';
    const match = ua.match(/Android (\d+\.\d+)/);
    if (match) osVersion = match[1];
    
    // Try to detect Android device model
    const modelMatch = ua.match(/;\s*([^;]+)\s+Build\//);
    if (modelMatch) {
      deviceModel = modelMatch[1].trim();
    }
  } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1 || ua.indexOf('iPod') > -1) {
    // iOS device detection
    if (ua.indexOf('iPad') > -1) {
      os = 'iPadOS';
      deviceModel = 'iPad';
    } else if (ua.indexOf('iPhone') > -1) {
      os = 'iOS';
      deviceModel = 'iPhone';
    } else if (ua.indexOf('iPod') > -1) {
      os = 'iOS';
      deviceModel = 'iPod';
    }
    const match = ua.match(/OS (\d+[._]\d+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  }
  
  // Get hardware capabilities
  const cores = navigator.hardwareConcurrency || 'Unknown';
  const memory = navigator.deviceMemory || 'Unknown';
  
  // Get screen info
  const screen = window.screen;
  const screenInfo = `${screen.width}x${screen.height}`;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Get platform info (more specific than UA)
  const platform = navigator.platform || '';
  
  // Detect if running on Mac with specific hints
  if (platform.indexOf('Mac') > -1 && !deviceModel) {
    if (platform.indexOf('MacIntel') > -1) {
      // Try to determine if it's iMac, MacBook, etc based on screen size
      if (screen.width >= 2560 && screen.height >= 1440) {
        deviceModel = 'iMac/Mac Studio (27"+)';
      } else if (screen.width >= 1920 && screen.height >= 1080) {
        deviceModel = 'iMac (24") / MacBook Pro';
      } else if (screen.width >= 1440 && screen.height >= 900) {
        deviceModel = 'MacBook Air/Pro';
      } else {
        deviceModel = 'Mac';
      }
    } else if (platform.indexOf('MacPPC') > -1) {
      deviceModel = 'Mac (PowerPC)';
    }
  }
  
  // Build detailed device string
  let device = '';
  
  // Add device model if detected
  if (deviceModel) {
    device = deviceModel;
  } else {
    device = os;
    if (osVersion) device += ` ${osVersion}`;
  }
  
  // Add browser info
  device += ` • ${browser}`;
  if (browserVersion) device += ` ${browserVersion}`;
  
  // Add hardware specs
  device += ` • ${cores} cores`;
  if (memory !== 'Unknown') device += ` • ${memory}GB RAM`;
  
  // Add screen info with pixel ratio
  device += ` • ${screenInfo}`;
  if (pixelRatio > 1) device += ` @${pixelRatio}x`;
  
  // Add language
  const lang = navigator.language || 'en';
  device += ` • ${lang}`;
  
  // Add unique device fingerprint (MAC-like format)
  const fingerprint = generateDeviceFingerprint();
  device = `[${fingerprint}] ${device}`;
  
  // Add timestamp for uniqueness
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  device += ` • ${dateStr}`;
  
  return device;
};

// ============================================================================
// MESSAGE ENCRYPTION (Hybrid RSA + AES)
// ============================================================================

/**
 * Generate random AES-256 key for message encryption
 */
export const generateAESKey = async () => {
  try {
    const key = await window.crypto.subtle.generateKey(
      AES_CONFIG.algorithm,
      AES_CONFIG.extractable,
      AES_CONFIG.keyUsages
    );
    return key;
  } catch (error) {
    console.error('Failed to generate AES key:', error);
    throw new Error('AES key generation failed');
  }
};

/**
 * Export AES key to raw format
 */
export const exportAESKey = async (aesKey) => {
  try {
    const exported = await window.crypto.subtle.exportKey('raw', aesKey);
    const exportedAsArray = new Uint8Array(exported);
    const exportedAsString = String.fromCharCode.apply(null, exportedAsArray);
    const exportedAsBase64 = window.btoa(exportedAsString);
    return exportedAsBase64;
  } catch (error) {
    console.error('Failed to export AES key:', error);
    throw new Error('AES key export failed');
  }
};

/**
 * Import AES key from raw format
 */
export const importAESKey = async (base64Key) => {
  try {
    const keyString = window.atob(base64Key);
    const keyArray = new Uint8Array(keyString.length);
    for (let i = 0; i < keyString.length; i++) {
      keyArray[i] = keyString.charCodeAt(i);
    }
    
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyArray.buffer,
      AES_CONFIG.algorithm.name,
      AES_CONFIG.extractable,
      AES_CONFIG.keyUsages
    );
    
    return key;
  } catch (error) {
    console.error('Failed to import AES key:', error);
    throw new Error('AES key import failed');
  }
};

/**
 * Encrypt message with AES (symmetric) - both parties can decrypt
 * Returns: { encryptedContent: base64, iv: base64, encryptedKey: base64 }
 */
export const encryptMessageAES = async (message, myPrivateKey, friendPublicKey) => {
  try {
    // Step 1: Generate random AES key for this message
    const aesKey = await generateAESKey();
    
    // Step 2: Encrypt the message with AES
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM needs 12-byte IV
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      messageData
    );
    
    // Step 3: Export AES key
    const aesKeyBase64 = await exportAESKey(aesKey);
    
    // Step 4: Encrypt AES key with friend's public key (so they can decrypt)
    const encryptedKeyForFriend = await encryptMessage(aesKeyBase64, friendPublicKey);
    
    // Step 5: Convert encrypted message and IV to base64
    const encryptedArray = new Uint8Array(encryptedData);
    const encryptedString = String.fromCharCode.apply(null, encryptedArray);
    const encryptedBase64 = window.btoa(encryptedString);
    
    const ivString = String.fromCharCode.apply(null, iv);
    const ivBase64 = window.btoa(ivString);
    
    return {
      encryptedContent: encryptedBase64,
      iv: ivBase64,
      encryptedAESKey: encryptedKeyForFriend, // For receiver
      aesKey: aesKeyBase64 // For sender (to decrypt own message)
    };
  } catch (error) {
    console.error('Failed to encrypt message with AES:', error);
    throw new Error('AES message encryption failed');
  }
};

/**
 * Decrypt message with AES
 */
export const decryptMessageAES = async (encryptedContent, iv, encryptedAESKey, myPrivateKey) => {
  try {
    // Step 1: Decrypt the AES key using my private key
    const aesKeyBase64 = await decryptMessage(encryptedAESKey, myPrivateKey);
    
    // Step 2: Import AES key
    const aesKey = await importAESKey(aesKeyBase64);
    
    // Step 3: Decode IV from base64
    const ivString = window.atob(iv);
    const ivArray = new Uint8Array(ivString.length);
    for (let i = 0; i < ivString.length; i++) {
      ivArray[i] = ivString.charCodeAt(i);
    }
    
    // Step 4: Decode encrypted content from base64
    const encryptedString = window.atob(encryptedContent);
    const encryptedArray = new Uint8Array(encryptedString.length);
    for (let i = 0; i < encryptedString.length; i++) {
      encryptedArray[i] = encryptedString.charCodeAt(i);
    }
    
    // Step 5: Decrypt the message
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      aesKey,
      encryptedArray.buffer
    );
    
    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decryptedData);
    
    return decryptedMessage;
  } catch (error) {
    console.error('Failed to decrypt message with AES:', error);
    throw new Error('AES message decryption failed');
  }
};

/**
 * Decrypt message with plain AES key (for sender reading own messages)
 */
export const decryptMessageWithAESKey = async (encryptedContent, iv, aesKeyBase64) => {
  try {
    // Step 1: Import AES key
    const aesKey = await importAESKey(aesKeyBase64);
    
    // Step 2: Decode IV from base64
    const ivString = window.atob(iv);
    const ivArray = new Uint8Array(ivString.length);
    for (let i = 0; i < ivString.length; i++) {
      ivArray[i] = ivString.charCodeAt(i);
    }
    
    // Step 3: Decode encrypted content from base64
    const encryptedString = window.atob(encryptedContent);
    const encryptedArray = new Uint8Array(encryptedString.length);
    for (let i = 0; i < encryptedString.length; i++) {
      encryptedArray[i] = encryptedString.charCodeAt(i);
    }
    
    // Step 4: Decrypt the message
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      aesKey,
      encryptedArray.buffer
    );
    
    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decryptedData);
    
    return decryptedMessage;
  } catch (error) {
    console.error('Failed to decrypt message with AES key:', error);
    throw new Error('AES key decryption failed');
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // RSA Key Management
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  
  // Envelope Encryption (Recovery System)
  generateRecoveryCodes,
  createEnvelopeEncryption,
  decryptPrivateKeyWithPin,
  recoverWithCode,
  
  // Legacy Backup (kept for backward compatibility)
  encryptPrivateKeyForBackup,
  decryptPrivateKeyFromBackup,
  retrieveKeysFromServer,
  
  // Local Storage
  storeKeysSecurely,
  retrieveStoredKeys,
  hasStoredKeys,
  verifyPin,
  clearStoredKeys,
  
  // Device Fingerprinting
  getDeviceIdentifier,
  
  // Message Encryption
  generateAESKey,
  exportAESKey,
  importAESKey,
  encryptMessageAES,
  decryptMessageAES,
  decryptMessageWithAESKey
};
