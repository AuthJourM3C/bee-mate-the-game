import { Router } from 'express';
import identifyRoutes from './identify.js';
import passcodeRoutes from './passcode.js';
import factsRoutes from './facts.js';
import configRoutes from './config.js';

const router = Router();

router.use('/identify', identifyRoutes);
router.use('/passcode', passcodeRoutes);
router.use('/facts', factsRoutes);
router.use('/config', configRoutes);

export default router;