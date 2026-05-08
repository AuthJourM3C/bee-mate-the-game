import { Router } from 'express';
import { getGameConfig } from '../controllers/configController.js';

const router = Router();

/**
 * GET /api/config
 * Get game configuration (points, sources, thresholds)
 */
router.get('/', getGameConfig);

export default router;