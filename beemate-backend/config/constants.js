export const POLLUTION_SOURCES = [
  { id: 'traffic', label: 'Traffic', icon: '🚗' },
  { id: 'construction', label: 'Construction', icon: '🏗️' },
  { id: 'waste', label: 'Waste / Bins', icon: '🗑️' },
  { id: 'industrial', label: 'Industrial', icon: '🏭' },
  { id: 'burning', label: 'Burning', icon: '🔥' },
  { id: 'other', label: 'Other', icon: '❓' }
];

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
};

export const EVOLUTION_THRESHOLDS = {
  LEVEL_2: 20,
  LEVEL_3: 50,
  LEVEL_4: 100
};

export const PATH_DOMINANCE_THRESHOLD = 0.75;

export const MAX_AUDIO_DURATION = 30;

export const DUPLICATE_THRESHOLDS = {
  DISTANCE_METERS: 5,
  TIME_SECONDS: 60
};