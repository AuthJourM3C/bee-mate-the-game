import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse, GameState } from '../types';

/**
 * Generate a passcode from current game state
 */
export const generatePasscode = async (state: {
  playerName: string;
  level: number;
  characterId: string;
  totalPoints: number;
  audioPoints: number;
  imagePoints: number;
  audioCount: number;
  imageCount: number;
  evolutionPath: string;
}): Promise<string> => {
  const response = await apiClient.post<ApiResponse<{ passcode: string }>>(
    API_ENDPOINTS.PASSCODE_GENERATE,
    state
  );
  return response.data.data.passcode;
};

/**
 * Restore game state from a passcode
 */
export const restorePasscode = async (passcode: string): Promise<{
  playerName: string;
  level: number;
  characterId: string;
  totalPoints: number;
  audioPoints: number;
  imagePoints: number;
  audioCount: number;
  imageCount: number;
  evolutionPath: string;
}> => {
  const response = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.PASSCODE_RESTORE,
    { passcode }
  );
  return response.data.data;
};