import { log } from '../config/logger.js';

const PASSCODE_VERSION = 1;
const SEPARATOR = '|';
const CHECKSUM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Encode game state into a human-readable passcode
 * Format: XXXX-XXXX-XXXX where each group encodes different state
 * @param {Object} state - Game state to encode
 * @returns {string} Passcode string
 */
export const encode = (state) => {
  try {
    const payload = [
      PASSCODE_VERSION,
      state.playerName.substring(0, 20),
      state.level || 1,
      state.characterId || 'pollini',
      state.totalPoints || 0,
      state.audioPoints || 0,
      state.imagePoints || 0,
      state.audioCount || 0,
      state.imageCount || 0,
      state.evolutionPath || 'none'
    ].join(SEPARATOR);

    const encoded = Buffer.from(payload).toString('base64url');
    const checksum = generateChecksum(encoded);

    const parts = [];
    const fullCode = encoded + checksum;
    for (let i = 0; i < fullCode.length; i += 4) {
      parts.push(fullCode.substring(i, i + 4));
    }

    return parts.join('-').toUpperCase();
  } catch (error) {
    log.error('Passcode encode error:', error.message);
    throw new Error('Failed to generate passcode');
  }
};

/**
 * Decode a passcode back into game state
 * @param {string} passcode - Passcode to decode
 * @returns {Object|null} Game state or null if invalid
 */
export const decode = (passcode) => {
  try {
    const cleaned = passcode.replace(/-/g, '').replace(/\s/g, '').toLowerCase();

    const checksum = cleaned.slice(-2);
    const encoded = cleaned.slice(0, -2);

    const expectedChecksum = generateChecksum(encoded);
    if (checksum !== expectedChecksum.toLowerCase()) {
      log.warn('Passcode checksum mismatch');
      return null;
    }

    const payload = Buffer.from(encoded, 'base64url').toString('utf-8');
    const parts = payload.split(SEPARATOR);

    if (parts.length < 10 || parseInt(parts[0]) !== PASSCODE_VERSION) {
      log.warn('Passcode version or format mismatch');
      return null;
    }

    return {
      playerName: parts[1],
      level: parseInt(parts[2]) || 1,
      characterId: parts[3] || 'pollini',
      totalPoints: parseInt(parts[4]) || 0,
      audioPoints: parseInt(parts[5]) || 0,
      imagePoints: parseInt(parts[6]) || 0,
      audioCount: parseInt(parts[7]) || 0,
      imageCount: parseInt(parts[8]) || 0,
      evolutionPath: parts[9] || 'none'
    };
  } catch (error) {
    log.error('Passcode decode error:', error.message);
    return null;
  }
};

/**
 * Generate a 2-character checksum for integrity verification
 * @param {string} data - Data to checksum
 * @returns {string} 2-character checksum
 */
function generateChecksum(data) {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const idx1 = Math.abs(hash) % CHECKSUM_CHARS.length;
  const idx2 = Math.abs(hash >> 8) % CHECKSUM_CHARS.length;
  return CHECKSUM_CHARS[idx1] + CHECKSUM_CHARS[idx2];
}