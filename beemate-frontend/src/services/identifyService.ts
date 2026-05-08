import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse, IdentificationResult } from '../types';

/**
 * Submit an image for pollution identification
 * @param file - Image file blob
 * @param contextType - Optional pollution context tag
 * @param description - Optional free-text description
 */
export const identifyImage = async (
  file: Blob,
  contextType?: string,
  description?: string
): Promise<IdentificationResult> => {
  const formData = new FormData();
  formData.append('file', file, 'capture.jpg');
  if (contextType) formData.append('contextType', contextType);
  if (description) formData.append('description', description);

  const response = await apiClient.post<ApiResponse<IdentificationResult>>(
    API_ENDPOINTS.IDENTIFY_IMAGE,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    }
  );

  return response.data.data;
};

/**
 * Submit audio for pollution identification
 * @param file - Audio file blob (WAV)
 * @param contextType - Optional pollution context tag
 * @param description - Optional free-text description
 */
export const identifyAudio = async (
  file: Blob,
  contextType?: string,
  description?: string
): Promise<IdentificationResult> => {
  const formData = new FormData();
  formData.append('file', file, 'recording.wav');
  if (contextType) formData.append('contextType', contextType);
  if (description) formData.append('description', description);

  const response = await apiClient.post<ApiResponse<IdentificationResult>>(
    API_ENDPOINTS.IDENTIFY_AUDIO,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    }
  );

  return response.data.data;
};