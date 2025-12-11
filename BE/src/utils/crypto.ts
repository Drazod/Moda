import crypto from 'crypto';

/**
 * Hash a recovery code using SHA-256
 * Never store plain recovery codes in the database!
 */
export function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Verify a recovery code against its hash
 */
export function verifyRecoveryCode(code: string, hash: string): boolean {
  const codeHash = hashRecoveryCode(code);
  return crypto.timingSafeEqual(
    Buffer.from(codeHash),
    Buffer.from(hash)
  );
}
