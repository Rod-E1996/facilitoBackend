const crypto = require('crypto');

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(plainPassword, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString('hex');

  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

function verifyPassword(plainPassword, storedPassword) {
  if (!storedPassword || typeof storedPassword !== 'string') return false;

  // Backward compatibility: if a legacy plain password exists, compare as-is.
  if (!storedPassword.startsWith('pbkdf2$')) {
    return plainPassword === storedPassword;
  }

  const parts = storedPassword.split('$');
  if (parts.length !== 4) return false;

  const iterations = Number(parts[1]);
  const salt = parts[2];
  const expectedHash = parts[3];

  const calculatedHash = crypto
    .pbkdf2Sync(plainPassword, salt, iterations, KEYLEN, DIGEST)
    .toString('hex');

  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

  if (expectedBuffer.length !== calculatedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, calculatedBuffer);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
