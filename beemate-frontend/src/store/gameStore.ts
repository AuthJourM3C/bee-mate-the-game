import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Contribution, EvolutionPath, UserFeedback, PointsBreakdown } from '../types';
import { EVOLUTION_THRESHOLDS, PATH_DOMINANCE_THRESHOLD, POINTS } from '../config/points';
import { getCharacter, EVOLUTION_TREE } from '../config/evolutionTree';

/** Actions available on the game store */
interface GameActions {
  /** Set the player's name */
  setPlayerName: (name: string) => void;
  /** Reset all game state */
  resetGame: () => void;
  /** Restore game state from passcode data */
  restoreState: (state: Partial<GameState>) => void;
  /** Add a new contribution and update points */
  addContribution: (contribution: Contribution) => void;
  /** Set user feedback for a contribution */
  setContributionFeedback: (contributionId: string, feedback: UserFeedback) => void;
  /** Mark onboarding as complete */
  completeOnboarding: () => void;
  /** Set the current passcode */
  setPasscode: (passcode: string) => void;
  /** Evolve the character to next level */
  evolveCharacter: (newCharacterId: string) => void;
  /** Calculate current evolution path */
  calculatePath: () => EvolutionPath;
  /** Check if evolution threshold is reached */
  checkEvolution: () => { shouldEvolve: boolean; nextCharacterId: string | null };
  /** Get current character data */
  getCurrentCharacter: () => ReturnType<typeof getCharacter>;
  /** Get points remaining to next evolution */
  getPointsToNextLevel: () => number;
  /** Get current evolution threshold */
  getCurrentThreshold: () => number;
}

const initialState: GameState = {
  playerName: '',
  level: 1,
  characterId: 'pollini',
  totalPoints: 0,
  audioPoints: 0,
  imagePoints: 0,
  audioCount: 0,
  imageCount: 0,
  evolutionPath: 'none',
  contributions: [],
  passcode: null,
  isOnboarded: false
};

/**
 * Main game state store using Zustand with localStorage persistence
 */
export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayerName: (name: string) => set({ playerName: name }),

      resetGame: () => set({ ...initialState }),

      restoreState: (restored: Partial<GameState>) => {
        set({
          playerName: restored.playerName || '',
          level: restored.level || 1,
          characterId: restored.characterId || 'pollini',
          totalPoints: restored.totalPoints || 0,
          audioPoints: restored.audioPoints || 0,
          imagePoints: restored.imagePoints || 0,
          audioCount: restored.audioCount || 0,
          imageCount: restored.imageCount || 0,
          evolutionPath: (restored.evolutionPath as EvolutionPath) || 'none',
          contributions: [],
          passcode: null,
          isOnboarded: true
        });
      },

      addContribution: (contribution: Contribution) => {
        const state = get();
        const pointsTotal = contribution.points.total;
        const isAudio = contribution.mediaType === 'audio';

        set({
          contributions: [...state.contributions, contribution],
          totalPoints: state.totalPoints + pointsTotal,
          audioPoints: state.audioPoints + (isAudio ? pointsTotal : 0),
          imagePoints: state.imagePoints + (isAudio ? 0 : pointsTotal),
          audioCount: state.audioCount + (isAudio ? 1 : 0),
          imageCount: state.imageCount + (isAudio ? 0 : 1)
        });
      },

      setContributionFeedback: (contributionId: string, feedback: UserFeedback) => {
        const state = get();
        const updatedContributions = state.contributions.map(c =>
          c.id === contributionId ? { ...c, userFeedback: feedback } : c
        );

        set({
          contributions: updatedContributions,
          totalPoints: state.totalPoints + feedback.feedbackPoints,
          audioPoints: state.audioPoints + (
            updatedContributions.find(c => c.id === contributionId)?.mediaType === 'audio'
              ? feedback.feedbackPoints : 0
          ),
          imagePoints: state.imagePoints + (
            updatedContributions.find(c => c.id === contributionId)?.mediaType === 'image'
              ? feedback.feedbackPoints : 0
          )
        });
      },

      completeOnboarding: () => set({ isOnboarded: true }),

      setPasscode: (passcode: string) => set({ passcode }),

      evolveCharacter: (newCharacterId: string) => {
        const state = get();
        const path = get().calculatePath();
        set({
          characterId: newCharacterId,
          level: state.level + 1,
          evolutionPath: path
        });
      },

      calculatePath: (): EvolutionPath => {
        const { audioPoints, imagePoints, totalPoints } = get();
        if (totalPoints === 0) return 'none';
        const audioRatio = audioPoints / totalPoints;
        const imageRatio = imagePoints / totalPoints;
        if (audioRatio >= PATH_DOMINANCE_THRESHOLD) return 'audio';
        if (imageRatio >= PATH_DOMINANCE_THRESHOLD) return 'image';
        return 'balanced';
      },

      checkEvolution: () => {
        const state = get();
        const character = getCharacter(state.characterId);
        const threshold = character.evolutionThreshold;

        if (state.totalPoints >= threshold && character.evolvesTo) {
          const path = get().calculatePath();
          const nextId = character.evolvesTo[path === 'none' ? 'balanced' : path];
          if (nextId && EVOLUTION_TREE[nextId]) {
            return { shouldEvolve: true, nextCharacterId: nextId };
          }
        }
        return { shouldEvolve: false, nextCharacterId: null };
      },

      getCurrentCharacter: () => getCharacter(get().characterId),

      getPointsToNextLevel: () => {
        const state = get();
        const character = getCharacter(state.characterId);
        return Math.max(0, character.evolutionThreshold - state.totalPoints);
      },

      getCurrentThreshold: () => {
        const character = getCharacter(get().characterId);
        return character.evolutionThreshold;
      }
    }),
    {
      name: 'beemate-game-state',
      version: 1
    }
  )
);