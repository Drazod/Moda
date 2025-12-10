import crypto from 'crypto';

/**
 * Generate RSA key pair for a user
 */
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { publicKey, privateKey };
}

/**
 * Encrypt message with recipient's public key
 * Used by sender (frontend) before sending
 */
export function encryptMessage(message: string, recipientPublicKey: string): string {
  const buffer = Buffer.from(message, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: recipientPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return encrypted.toString('base64');
}

/**
 * Decrypt message with own private key
 * Used by recipient (frontend) after receiving
 */
export function decryptMessage(encryptedMessage: string, privateKey: string): string {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return decrypted.toString('utf8');
}

/**
 * Generate AES key for symmetric encryption (faster for large messages)
 */
export function generateAESKey(): string {
  return crypto.randomBytes(32).toString('base64');
}

/**
 * Encrypt with AES (faster, for large messages)
 */
export function encryptAES(message: string, key: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const keyBuffer = Buffer.from(key, 'base64');
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return {
    encrypted,
    iv: iv.toString('base64')
  };
}

/**
 * Decrypt with AES
 */
export function decryptAES(encrypted: string, key: string, iv: string): string {
  const keyBuffer = Buffer.from(key, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash data (for verification)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
