// Is file mein SevaConnect ke cryptographic security functions hain.
// Starting Code aur Ending Code ka generation, HMAC-SHA256 hashing, timing-safe verification,
// aur AES-256-GCM envelope encryption yahan implement kiya gaya hai.

import crypto from 'crypto';
import ENV from '../config/env.js';

// Secret key se 32-byte encryption key derive karte hain
const getEncryptionKey = () => {
  return crypto.createHash('sha256').update(ENV.CODE_ENCRYPTION_KEY).digest();
};

/**
 * 6-digit numeric secure OTP generate karta hai (Starting Code ya Ending Code).
 * Math.random ke bajay crypto.randomInt use hota hai taaki code unpredictable ho.
 */
export const generateSecureCode = (digits = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits);
  const num = crypto.randomInt(min, max);
  return num.toString();
};

/**
 * Code ko HMAC-SHA256 se hash karta hai.
 * Database mein plaintext code kabhi nahi rakha jaata, sirf ye hash store hota hai.
 */
export const hashCode = (code) => {
  const hmac = crypto.createHmac('sha256', ENV.JWT_ACCESS_SECRET);
  hmac.update(String(code).trim());
  return hmac.digest('hex');
};

/**
 * User dwara enter kiye gaye code ko stored hash ke saath verify karta hai.
 * crypto.timingSafeEqual use hota hai taaki timing attack se code guess na kiya ja sake.
 */
export const verifyCodeHash = (providedCode, storedHash) => {
  if (!providedCode || !storedHash) return false;
  const providedHash = hashCode(providedCode);
  const bufA = Buffer.from(providedHash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Code ko AES-256-GCM se encrypt karta hai (Customer envelope).
 * Isse customer apni authorized booking screen par code dekh sakta hai,
 * lekin provider ya unauthorized users code ko directly database se nahi padh sakte.
 */
export const encryptCodeEnvelope = (plaintextCode) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  let encrypted = cipher.update(String(plaintextCode), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

/**
 * Encrypted envelope ko decrypt karta hai (Sirf authorized booking customer ke liye).
 */
export const decryptCodeEnvelope = (envelope) => {
  if (!envelope) return null;
  try {
    const [ivHex, tagHex, encryptedHex] = envelope.split(':');
    if (!ivHex || !tagHex || !encryptedHex) return null;

    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
};
