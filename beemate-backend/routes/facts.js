import { Router } from 'express';
import { getRandomFact, getAllFacts } from '../controllers/factsController.js';

const router = Router();

/**
 * GET /api/facts/random
 * Get a random pollution fact for the processing screen
 */
router.get('/random', getRandomFact);

/**
 * GET /api/facts
 * Get all pollution facts
 */
router.get('/', getAllFacts);

export default router;