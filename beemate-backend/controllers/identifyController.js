import { identifyImageService, identifyAudioService } from '../services/identifyService.js';
import { calculatePoints } from '../services/pointsService.js';
import { log } from '../config/logger.js';

/**
 * Handle image identification request
 * Forwards image to M3C imageIdentification service or uses mock
 */
export const identifyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file provided' }
      });
    }

    log.info(`Image identification request: ${req.file.originalname}, size: ${req.file.size}`);

    const contextType = req.body.contextType || null;
    const description = req.body.description || null;

    const result = await identifyImageService(req.file);

    const points = calculatePoints({
      mediaType: 'image',
      classification: result.classification,
      qualityScore: result.qualityScore,
      hasContextTag: !!contextType,
      isMultimodal: false
    });

    res.json({
      success: true,
      data: {
        classification: result.classification,
        qualityScore: result.qualityScore,
        sources: result.sources,
        caption: result.caption,
        confidence: result.confidence,
        points,
        contextType,
        description,
        processedAt: new Date().toISOString()
      },
      message: result.classification === 'R'
        ? 'Pollution source identified!'
        : 'No pollution source detected in this image.'
    });
  } catch (error) {
    log.error('Image identification error:', error.message);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: 'Failed to process image. Please try again.'
      }
    });
  }
};

/**
 * Handle audio identification request
 * Forwards audio to M3C audioIdentification service or uses mock
 */
export const identifyAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No audio file provided' }
      });
    }

    log.info(`Audio identification request: ${req.file.originalname}, size: ${req.file.size}`);

    const contextType = req.body.contextType || null;
    const description = req.body.description || null;

    const result = await identifyAudioService(req.file);

    const points = calculatePoints({
      mediaType: 'audio',
      classification: result.classification,
      qualityScore: result.qualityScore,
      hasContextTag: !!contextType,
      isMultimodal: false
    });

    res.json({
      success: true,
      data: {
        classification: result.classification,
        qualityScore: result.qualityScore,
        sources: result.sources,
        caption: result.caption,
        confidence: result.confidence,
        points,
        contextType,
        description,
        processedAt: new Date().toISOString()
      },
      message: result.classification === 'R'
        ? 'Pollution source identified in audio!'
        : 'No pollution source detected in this recording.'
    });
  } catch (error) {
    log.error('Audio identification error:', error.message);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: 'Failed to process audio. Please try again.'
      }
    });
  }
};