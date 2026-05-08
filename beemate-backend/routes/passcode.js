import { Router } from 'express';
import { generatePasscode, restorePasscode } from '../controllers/passcodeController.js';

const router = Router();

/**
 * POST /api/passcode/generate
 * Generate a passcode from current game state
 */
router.post('/generate', generatePasscode);

/**
 * POST /api/passcode/restore
 * Restore game state from a passcode
 */
router.post('/restore', restorePasscode);

export default router;