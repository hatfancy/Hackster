// ─── Game Types ────────────────────────────────────────────────────────────

export type Screen =
  | 'title'
  | 'profile-setup'
  | 'tutorial'
  | 'level-select'
  | 'puzzle'
  | 'success'
  | 'failure'
  | 'dashboard'
  | 'settings'
  | 'victory'
  | 'how-to-play';

export type Rank = 'ROOKIE HACKER' | 'PRO HACKER' | 'ELITE HACKER' | 'MASTER HACKER';

export type Difficulty = 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Expert' | 'Master';

export type PuzzleType =
  | 'caesar-cipher'
  | 'riddle'
  | 'binary'
  | 'logic-door'
  | 'morse-code'
  | 'pattern'
  | 'substitution-cipher'
  | 'multi-step'
  | 'sequence'
  | 'final-boss';

export interface PuzzleHint {
  id: number;
  text: string;
  penaltySeconds: number;
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  briefing: string;
  difficulty: Difficulty;
  type: PuzzleType;
  timeLimit: number; // seconds
  baseScore: number;
  objective: string;
  instructions: string;
  clues: string[];
  answer: string;
  hints: PuzzleHint[];
  solutionExplanation: string;
  rankUnlocked?: Rank;
  xpReward: number;
}

export interface LevelResult {
  levelId: number;
  completed: boolean;
  score: number;
  timeRemaining: number;
  timeTaken: number;
  hintsUsed: number;
  wrongAnswers: number;
  completedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface PlayerProfile {
  name: string;
  createdAt: string;
}

export interface PlayerStats {
  totalScore: number;
  bestScore: number;
  totalXP: number;
  totalAttempts: number;
  totalWrongAnswers: number;
  totalHintsUsed: number;
  currentStreak: number;
  bestStreak: number;
  totalTimePlayed: number; // seconds
}

export interface ActiveRun {
  levelId: number;
  startedAt: string;
  deadline: string; // ISO timestamp — to handle refresh correctly
  hintsUsed: number;
  wrongAnswers: number;
  isPaused: boolean;
  pausedAt?: string;
  remainingAtPause?: number; // seconds remaining when paused
}

export interface Settings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  showSaveIndicator: boolean;
}

export interface GameSave {
  version: number;
  profile: PlayerProfile;
  rank: Rank;
  currentLevel: number;
  highestUnlockedLevel: number;
  completedLevels: number[];
  levelResults: Record<number, LevelResult>;
  stats: PlayerStats;
  achievements: Achievement[];
  activeRun: ActiveRun | null;
  settings: Settings;
  savedAt: string;
}
