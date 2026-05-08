import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { getRandomFact as getLocalFact } from '../config/pollutionFacts';
import type { ApiResponse } from '../types';

/**
 * Get a random pollution fact - falls back to local if API unavailable
 */
export const getRandomFact = async (): Promise<string> => {
  try {
    const response = await apiClient.get<ApiResponse<{ fact: string }>>(
      API_ENDPOINTS.FACTS_RANDOM
    );
    return response.data.data.fact;
  } catch {
    return getLocalFact();
  }
};