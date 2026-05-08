/**
 * Core type definitions for BeeMate game
 */

/** Media type for contributions */
export type MediaType = 'image' | 'audio';

/** Classification result from backend services */
export type Classification = 'R' | 'NR';

/** Evolution path based on contribution ratio */
export type EvolutionPath = 'audio' | 'image' | 'balanced' | 'none';

/** Pollution source context tag */
export interface PollutionSource {
  id: string;
  label: string;
  icon: string;
  certainty?: number;
}

/** GPS coordinates with accuracy */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

/** A single contribution (image or audio submission) */
export interface Contribution {
  id: string;
  mediaType: MediaType;
  classification: Classification;
  qualityScore: number;
  sources: PollutionSource[];
  caption: string;
  confidence: number;
  contextType: string | null;
  description: string | null;
  location: GeoLocation | null;
  points: PointsBreakdown;
  userFeedback: UserFeedback | null;
  timestamp: string;
}

/** Points breakdown for a contribution */
export interface PointsBreakdown {
  total: number;
  breakdown: { reason: string; points: number }[];
  mediaType: MediaType;
  classification: Classification;
}

/** User feedback on identification results */
export interface UserFeedback {
  action: 'confirm' | 'reject';
  rejectReason?: 'no_source' | 'wrong_id' | 'more_sources';
  correctedSource?: string;
  additionalNote?: string;
  feedbackPoints: number;
}

/** Character definition in the evolution tree */
export interface Character {
  id: string;
  name: string;
  level: number;
  tier: string;
  type: string;
  title: string;
  description: string;
  flavorText: string;
  rarity: string;
  habitat: string;
  stats: Record<string, number>;
  statLabels: Record<string, string>;
  evolutionThreshold: number;
  evolvesTo: {
    audio: string;
    balanced: string;
    image: string;
  };
  powerUpMessages: string[];
  avatarUrl: string;
  cardUrl: string;
}

/** Complete player game state */
export interface GameState {
  playerName: string;
  level: number;
  characterId: string;
  totalPoints: number;
  audioPoints: number;
  imagePoints: number;
  audioCount: number;
  imageCount: number;
  evolutionPath: EvolutionPath;
  contributions: Contribution[];
  passcode: string | null;
  isOnboarded: boolean;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface IdentificationResult {
  classification: Classification;
  qualityScore: number;
  sources: PollutionSource[];
  caption: string;
  confidence: number;
  points: PointsBreakdown;
  contextType: string | null;
  description: string | null;
  location?: GeoLocation;
  processedAt: string;
}

/** Toast notification */
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}