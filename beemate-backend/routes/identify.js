import { Router } from 'express';
import multer from 'multer';
import { identifyImage, identifyAudio } from '../controllers/identifyController.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 }
});

/**
 * POST /api/identify/image
 * Submit an image for pollution source identification
 */
router.post('/image', upload.single('file'), identifyImage);

/**
 * POST /api/identify/audio
 * Submit audio for pollution source identification
 */
router.post('/audio', upload.single('file'), identifyAudio);

export default router;