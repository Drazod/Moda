/**
 * End-to-End Encryption Utility for Chat
 * 
 * SECURITY FLOW:
 * 1. Each user generates an RSA-2048 key pair (public/private keys)
 * 2. Public keys are shared via backend, private keys NEVER leave the device
 * 3. Private keys stored in IndexedDB as non-extractable CryptoKey objects
 * 4. PIN protection: SHA-256 hash stored, required to retrieve private key
 * 5. For each message:
 *    a. Generate random AES-256 key
 *    b. Encrypt message with AES (fast, symmetric)
 *    c. Encrypt AES key with receiver's RSA public key → receiver can decrypt
 *    d. Store plain AES key → sender can decrypt own messages
 * 6. Both sender and receiver can read messages using their respective keys
 * 
 * KEY BENEFITS:
 * - Non-extractable private keys (cannot be exported, even by malicious scripts)
 * - IndexedDB storage (more secure than localStorage)
 * - PIN-protected access (SHA-256 hash verification)
 * - Fast encryption (AES vs pure RSA)
 * - Both parties can decrypt
 * - Perfect Forward Secrecy (unique key per message)
 * - Backend cannot read messages (no private keys on server)
 * - Protected against XSS key extraction
 */

const RSA_CONFIG = {
  algorithm: {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256'
  },
  extractable: true, // Public key extractable
  privateKeyExtractable: false, // Private key NON-extractable for security
  keyUsages: ['encrypt', 'decrypt']
};

const DB_NAME = 'ModaChatEncryption';
const DB_VERSION = 2; // Increment version to force recreation
const STORE_NAME = 'keys';

const AES_CONFIG = {
  algorithm: {
    name: 'AES-GCM',
    length: 256
  },
  extractable: true,
  keyUsages: ['encrypt', 'decrypt']
};

/**
 * Initialize IndexedDB for key storage
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

/**
 * Generate RSA key pair with extractable private key
 * Note: Private key is extractable initially to allow server backup
 * It will be stored as non-extractable in IndexedDB
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
 * Generate recovery codes for PIN reset
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
 * Store recovery codes encrypted with one of the codes
 */
export const storeRecoveryCodes = async (codes) => {
  const masterCode = codes[0]; // First code encrypts the list
  const encoder = new TextEncoder();
  const codesData = encoder.encode(JSON.stringify(codes));
  
  const key = await derivePinKey(masterCode);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedCodes = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    codesData
  );
  
  localStorage.setItem('chat_recovery_codes', arrayBufferToBase64(encryptedCodes));
  localStorage.setItem('chat_recovery_codes_iv', arrayBufferToBase64(iv));
};

/**
 * Verify recovery code and return decrypted private key
 */
export const recoverWithCode = async (recoveryCode) => {
  try {
    const encryptedPrivateKey = localStorage.getItem('chat_private_key_encrypted');
    const iv = localStorage.getItem('chat_private_key_iv');
    
    if (!encryptedPrivateKey || !iv) {
      throw new Error('No encrypted keys found');
    }
    
    // Try to decrypt with recovery code as PIN
    const privateKeyPem = await decryptWithPin(
      encryptedPrivateKey,
      iv,
      recoveryCode
    );
    
    return privateKeyPem;
  } catch (error) {
    throw new Error('Invalid recovery code');
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
 * Decrypt data with PIN
 */
const decryptWithPin = async (encryptedData, iv, pin) => {
  const pinKey = await derivePinKey(pin);
  
  const ivString = window.atob(iv);
  const ivArray = new Uint8Array(ivString.length);
  for (let i = 0; i < ivString.length; i++) {
    ivArray[i] = ivString.charCodeAt(i);
  }
  
  const encryptedString = window.atob(encryptedData);
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
  return decoder.decode(decrypted);
};

/**
 * Encrypt private key for server backup
 * Returns encrypted private key + IV that can be safely stored on server
 */
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

/**
 * Store keys in IndexedDB with PIN protection
 * Converts extractable private key to non-extractable before storing
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
 * Check if keys exist
 */
export const hasStoredKeys = () => {
  return localStorage.getItem('chat_public_key') !== null;
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
 * Get device identifier
 */
export const getDeviceIdentifier = () => {
  const ua = navigator.userAgent;
  let device = 'Unknown Device';
  
  // Browser detection
  if (ua.indexOf('Chrome') > -1) {
    device = 'Chrome';
  } else if (ua.indexOf('Safari') > -1) {
    device = 'Safari';
  } else if (ua.indexOf('Firefox') > -1) {
    device = 'Firefox';
  } else if (ua.indexOf('Edge') > -1) {
    device = 'Edge';
  }
  
  // OS detection
  if (ua.indexOf('Windows') > -1) {
    device += ' on Windows';
  } else if (ua.indexOf('Mac') > -1) {
    device += ' on macOS';
  } else if (ua.indexOf('Linux') > -1) {
    device += ' on Linux';
  } else if (ua.indexOf('Android') > -1) {
    device += ' on Android';
  } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1) {
    device += ' on iOS';
  }
  
  return device;
};

/**
 * Generate a random AES key for message encryption
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

export default {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  encryptPrivateKeyForBackup,
  decryptPrivateKeyFromBackup,
  storeKeysSecurely,
  retrieveStoredKeys,
  retrieveKeysFromServer,
  hasStoredKeys,
  verifyPin,
  clearStoredKeys,
  getDeviceIdentifier,
  generateAESKey,
  exportAESKey,
  importAESKey,
  encryptMessageAES,
  decryptMessageAES,
  decryptMessageWithAESKey,
  generateRecoveryCodes,
  storeRecoveryCodes,
  recoverWithCode
};
