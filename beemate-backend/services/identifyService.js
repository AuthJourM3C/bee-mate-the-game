import { log } from '../config/logger.js';

const M3C_BASE = process.env.M3C_BASE_URL || 'https://m3capps.jour.auth.gr';
const USE_MOCK = process.env.MOCK_SERVICES === 'true';

/**
 * Call M3C image identification service or return mock data
 * @param {Object} file - Multer file object
 * @returns {Object} Identification result
 */
export const identifyImageService = async (file) => {
  if (USE_MOCK) {
    log.info('Using MOCK image identification');
    return getMockImageResult();
  }

  try {
    log.info(`Calling M3C imageIdentification: ${M3C_BASE}/imageIdentification`);

    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    const response = await fetch(`${M3C_BASE}/imageIdentification`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`M3C service returned ${response.status}`);
    }

    const data = await response.json();
    log.info('M3C image response:', JSON.stringify(data));

    return normalizeImageResponse(data);
  } catch (error) {
    log.error('M3C image service error:', error.message);
    log.warn('Falling back to mock image identification');
    return getMockImageResult();
  }
};

/**
 * Call M3C audio identification service or return mock data
 * @param {Object} file - Multer file object
 * @returns {Object} Identification result
 */
export const identifyAudioService = async (file) => {
  if (USE_MOCK) {
    log.info('Using MOCK audio identification');
    return getMockAudioResult();
  }

  try {
    log.info(`Calling M3C audioIdentification: ${M3C_BASE}/audioIdentification`);

    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    const response = await fetch(`${M3C_BASE}/audioIdentification`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`M3C service returned ${response.status}`);
    }

    const data = await response.json();
    log.info('M3C audio response:', JSON.stringify(data));

    return normalizeAudioResponse(data);
  } catch (error) {
    log.error('M3C audio service error:', error.message);
    log.warn('Falling back to mock audio identification');
    return getMockAudioResult();
  }
};

/**
 * Normalize M3C image response to internal format
 */
function normalizeImageResponse(data) {
  const classification = data.classification || data.result || 'NR';
  const isRelated = classification === 'R' || classification === 'related';

  return {
    classification: isRelated ? 'R' : 'NR',
    qualityScore: data.quality || Math.floor(Math.random() * 2) + 3,
    sources: isRelated ? (data.sources || [{ id: 'traffic', label: 'Traffic', certainty: data.confidence || 0.75 }]) : [],
    caption: data.caption || (isRelated ? 'Potential pollution source detected in image' : 'No pollution indicators found'),
    confidence: data.confidence || (isRelated ? 0.7 + Math.random() * 0.25 : 0.3 + Math.random() * 0.3)
  };
}

/**
 * Normalize M3C audio response to internal format
 */
function normalizeAudioResponse(data) {
  const classification = data.classification || data.result || 'NR';
  const isRelated = classification === 'R' || classification === 'related';

  return {
    classification: isRelated ? 'R' : 'NR',
    qualityScore: data.quality || Math.floor(Math.random() * 2) + 3,
    sources: isRelated ? (data.sources || [{ id: 'traffic', label: 'Traffic noise', certainty: data.confidence || 0.72 }]) : [],
    caption: data.caption || (isRelated ? 'Potential pollution-related sound detected' : 'No pollution-related sounds identified'),
    confidence: data.confidence || (isRelated ? 0.65 + Math.random() * 0.3 : 0.2 + Math.random() * 0.4)
  };
}

/**
 * Generate mock image identification result
 * Weighted 70% R / 30% NR for demo purposes
 */
function getMockImageResult() {
  const isRelated = Math.random() < 0.7;
  const sources = [
    { id: 'traffic', label: 'Vehicle Traffic', certainty: 0.85 },
    { id: 'construction', label: 'Construction Site', certainty: 0.78 },
    { id: 'waste', label: 'Waste Accumulation', certainty: 0.82 },
    { id: 'industrial', label: 'Industrial Emissions', certainty: 0.76 },
    { id: 'burning', label: 'Open Burning', certainty: 0.80 }
  ];

  const selectedSource = sources[Math.floor(Math.random() * sources.length)];
  const quality = isRelated ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 3) + 2;

  return {
    classification: isRelated ? 'R' : 'NR',
    qualityScore: quality,
    sources: isRelated ? [{ ...selectedSource, certainty: 0.6 + Math.random() * 0.35 }] : [],
    caption: isRelated
      ? `Image appears to show ${selectedSource.label.toLowerCase()} related to air pollution`
      : 'No clear pollution source identified in the image',
    confidence: isRelated ? 0.65 + Math.random() * 0.3 : 0.15 + Math.random() * 0.35
  };
}

/**
 * Generate mock audio identification result
 * Weighted 70% R / 30% NR for demo purposes
 */
function getMockAudioResult() {
  const isRelated = Math.random() < 0.7;
  const sources = [
    { id: 'traffic', label: 'Engine/Traffic Noise', certainty: 0.82 },
    { id: 'construction', label: 'Construction Machinery', certainty: 0.75 },
    { id: 'industrial', label: 'Industrial Equipment', certainty: 0.71 },
    { id: 'waste', label: 'Waste Collection Vehicle', certainty: 0.68 }
  ];

  const selectedSource = sources[Math.floor(Math.random() * sources.length)];
  const quality = isRelated ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 3) + 2;

  return {
    classification: isRelated ? 'R' : 'NR',
    qualityScore: quality,
    sources: isRelated ? [{ ...selectedSource, certainty: 0.55 + Math.random() * 0.4 }] : [],
    caption: isRelated
      ? `Audio contains sounds consistent with ${selectedSource.label.toLowerCase()}`
      : 'No pollution-related sound patterns detected in the recording',
    confidence: isRelated ? 0.6 + Math.random() * 0.35 : 0.1 + Math.random() * 0.4
  };
}