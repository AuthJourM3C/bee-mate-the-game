import { encode, decode } from '../services/passcodeService.js';
import { log } from '../config/logger.js';

/**
 * Generate a passcode from game state
 */
export const generatePasscode = (req, res) => {
  try {
    const { playerName, level, characterId, totalPoints, audioPoints, imagePoints, audioCount, imageCount, evolutionPath } = req.body;

    if (!playerName || level === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATE', message: 'Player name and level are required' }
      });
    }

    const passcode = encode({
      playerName,
      level,
      characterId,
      totalPoints,
      audioPoints,
      imagePoints,
      audioCount,
      imageCount,
      evolutionPath
    });

    log.info(`Passcode generated for player: ${playerName}, level: ${level}`);

    res.json({
      success: true,
      data: { passcode },
      message: 'Passcode generated successfully'
    });
  } catch (error) {
    log.error('Passcode generation error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'GENERATION_ERROR', message: 'Failed to generate passcode' }
    });
  }
};

/**
 * Restore game state from a passcode
 */
export const restorePasscode = (req, res) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_PASSCODE', message: 'Passcode is required' }
      });
    }

    const state = decode(passcode);

    if (!state) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PASSCODE', message: 'Invalid passcode. Please check and try again.' }
      });
    }

    log.info(`Passcode restored for player: ${state.playerName}, level: ${state.level}`);

    res.json({
      success: true,
      data: state,
      message: `Welcome back, ${state.playerName}!`
    });
  } catch (error) {
    log.error('Passcode restore error:', error.message);
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_PASSCODE', message: 'Invalid passcode. Please check and try again.' }
    });
  }
};