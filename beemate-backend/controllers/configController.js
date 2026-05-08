import { POLLUTION_SOURCES, POINTS, EVOLUTION_THRESHOLDS, PATH_DOMINANCE_THRESHOLD, MAX_AUDIO_DURATION } from '../config/constants.js';

/**
 * Get game configuration
 */
export const getGameConfig = (req, res) => {
  res.json({
    success: true,
    data: {
      pollutionSources: POLLUTION_SOURCES,
      points: POINTS,
      evolutionThresholds: EVOLUTION_THRESHOLDS,
      pathDominanceThreshold: PATH_DOMINANCE_THRESHOLD,
      maxAudioDuration: MAX_AUDIO_DURATION
    },
    message: 'Game configuration retrieved'
  });
};