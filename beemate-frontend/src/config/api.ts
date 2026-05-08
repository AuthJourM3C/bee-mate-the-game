/** API configuration */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ENDPOINTS = {
  IDENTIFY_IMAGE: '/identify/image',
  IDENTIFY_AUDIO: '/identify/audio',
  PASSCODE_GENERATE: '/passcode/generate',
  PASSCODE_RESTORE: '/passcode/restore',
  FACTS_RANDOM: '/facts/random',
  FACTS_ALL: '/facts',
  CONFIG: '/config'
} as const;

export const API_TIMEOUT = 30000;