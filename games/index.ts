// Game configurations and utilities
import { GameSettings } from '../types';
import { FOCUS_RACER_CONFIG } from './focus-racer/config';
import { MINDFUL_MAZE_CONFIG } from './mindful-maze/config';
import { CONCENTRATION_CATCH_CONFIG } from './concentration-catch/config';
import { BRAIN_BALANCE_CONFIG } from './brain-balance/config';
import { FOCUS_FLIGHT_CONFIG } from './focus-flight/config';
import { ZEN_GARDEN_CONFIG } from './zen-garden/config';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  score: 0,
  scoreStreak: 0,
  time: 150, // 2.5 minutes in seconds
  baseAttention: 50,
  isDynamic: false,
  threshold: 65,
};

export const GAME_IDS = {
  FOCUS_RACER: '1',
  MINDFUL_MAZE: '2',
  CONCENTRATION_CATCH: '3',
  BRAIN_BALANCE: '4',
  FOCUS_FLIGHT: '5',
  ZEN_GARDEN: '6',
} as const;

// Game configuration map
export const GAME_CONFIGS: Record<string, GameSettings> = {
  [GAME_IDS.FOCUS_RACER]: FOCUS_RACER_CONFIG,
  [GAME_IDS.MINDFUL_MAZE]: MINDFUL_MAZE_CONFIG,
  [GAME_IDS.CONCENTRATION_CATCH]: CONCENTRATION_CATCH_CONFIG,
  [GAME_IDS.BRAIN_BALANCE]: BRAIN_BALANCE_CONFIG,
  [GAME_IDS.FOCUS_FLIGHT]: FOCUS_FLIGHT_CONFIG,
  [GAME_IDS.ZEN_GARDEN]: ZEN_GARDEN_CONFIG,
};

// Helper function to get game config by ID
export const getGameConfig = (gameId: string): GameSettings => {
  return GAME_CONFIGS[gameId] || DEFAULT_GAME_SETTINGS;
};

