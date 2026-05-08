/** Points configuration - mirrors backend constants */
export const POINTS = {
  IMAGE_R: 5,
  AUDIO_R: 5,
  IMAGE_NR: 1,
  AUDIO_NR: 1,
  QUALITY_BONUS_THRESHOLD: 4,
  QUALITY_BONUS: 2,
  MULTIMODAL_BONUS: 3,
  CONTEXT_TAG_BONUS: 1,
  CONFIRM_BONUS: 1,
  CORRECTION_BONUS: 2,
  REJECT_NO_SOURCE: 0
} as const;

/** Evolution level thresholds */
export const EVOLUTION_THRESHOLDS = {
  LEVEL_2: 20,
  LEVEL_3: 50,
  LEVEL_4: 100
} as const;

/** Threshold for path dominance (75%) */
export const PATH_DOMINANCE_THRESHOLD = 0.75;