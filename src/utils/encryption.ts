import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recommended for GCM
const AUTH_TAG_LENGTH = 16;
const ENCODING = 'hex';

/**
 * Gets the encryption key from environment variables.
 * Falls back to a default (ONLY FOR DEVELOPMENT) if not provided.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.PII_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('PII_SECRET_KEY is mandatory in production');
    }
    // Fixed key for development consistency
    return crypto.scryptSync('dev-secret-key', 'salt', 32);
  }

  // Hash the secret to ensure it's 32 bytes
  return crypto.scryptSync(secret, 'salt', 32);
}

/**
 * Encrypts a plain-text string using AES-256-GCM.
 * Format: iv:authTag:encryptedData
 */
export function encrypt(text: string): string {
  if (!text) return text;

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag().toString(ENCODING);

  return `${iv.toString(ENCODING)}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a ciphertext string created by the encrypt function.
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext || !ciphertext.includes(':')) return ciphertext;

  try {
    const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('Invalid ciphertext format');
    }

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, ENCODING);
    const authTag = Buffer.from(authTagHex, ENCODING);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Could not decrypt data. It may be corrupted or the key is incorrect.');
  }
}
