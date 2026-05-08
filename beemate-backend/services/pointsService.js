import { POINTS } from '../config/constants.js';

/**
 * Calculate points for a contribution
 * @param {Object} params
 * @param {string} params.mediaType - 'image' or 'audio'
 * @param {string} params.classification - 'R' or 'NR'
 * @param {number} params.qualityScore - 1-5 quality score
 * @param {boolean} params.hasContextTag - Whether context tag was provided
 * @param {boolean} params.isMultimodal - Whether both image and audio were submitted
 * @returns {Object} Points breakdown
 */
export const calculatePoints = ({ mediaType, classification, qualityScore, hasContextTag, isMultimodal }) => {
  const breakdown = [];
  let total = 0;

  if (classification === 'R') {
    const base = mediaType === 'image' ? POINTS.IMAGE_R : POINTS.AUDIO_R;
    breakdown.push({ reason: 'Pollution source detected', points: base });
    total += base;
  } else {
    const base = mediaType === 'image' ? POINTS.IMAGE_NR : POINTS.AUDIO_NR;
    breakdown.push({ reason: 'Participation', points: base });
    total += base;
  }

  if (qualityScore >= POINTS.QUALITY_BONUS_THRESHOLD) {
    breakdown.push({ reason: 'Quality bonus', points: POINTS.QUALITY_BONUS });
    total += POINTS.QUALITY_BONUS;
  }

  if (hasContextTag) {
    breakdown.push({ reason: 'Context tag provided', points: POINTS.CONTEXT_TAG_BONUS });
    total += POINTS.CONTEXT_TAG_BONUS;
  }

  if (isMultimodal) {
    breakdown.push({ reason: 'Multimodal bonus', points: POINTS.MULTIMODAL_BONUS });
    total += POINTS.MULTIMODAL_BONUS;
  }

  return {
    total,
    breakdown,
    mediaType,
    classification
  };
};

/**
 * Calculate additional points for user feedback actions
 * @param {string} action - 'confirm', 'reject_correction', 'reject_no_source'
 * @returns {Object} Points for the action
 */
export const calculateFeedbackPoints = (action) => {
  switch (action) {
    case 'confirm':
      return { points: POINTS.CONFIRM_BONUS, reason: 'Result confirmed' };
    case 'reject_correction':
      return { points: POINTS.CORRECTION_BONUS, reason: 'Correction submitted' };
    case 'reject_no_source':
      return { points: POINTS.REJECT_NO_SOURCE, reason: 'No source reported' };
    default:
      return { points: 0, reason: 'Unknown action' };
  }
};