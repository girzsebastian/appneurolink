// BrainLink Data Types
export interface BrainWaveData {
  delta: number;
  theta: number;
  loAlpha: number;
  hiAlpha: number;
  loBeta: number;
  hiBeta: number;
  loGamma: number;
  hiGamma: number;
}

export interface MentalState {
  attention: number; // 0-100
  relaxation: number; // 0-100
}

export interface BrainLinkDevice {
  id: string;
  name: string;
  isConnected: boolean;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  rememberUser: boolean;
}

// Game Types
export interface MiniGame {
  id: string;
  title: string;
  image: any; // require() image
  description: string;
}

export interface GameSettings {
  threshold: number; // 30-100
  isDynamic: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Neurofeedback: undefined;
  GameOptions: undefined;
  MiniGames: undefined;
  VideoGames: undefined;
  GameDetail: { game: MiniGame };
};

// App Update Types
export interface AppUpdate {
  isAvailable: boolean;
  currentVersion: string;
  availableVersion?: string;
  manifest?: any;
}

