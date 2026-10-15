/**
 * HACK//BREAK — Central Game Store (Zustand)
 * Single source of truth for all game state.
 * Automatically persists after every meaningful state change.
 */

import { create } from 'zustand';
import type {
  GameSave,
  Screen,
  Rank,
  Achievement,
  LevelResult,
  ActiveRun,
} from '../types/game';
import {
  saveGame,
  loadGame,
  clearSave,
  createDefaultSave,
  defaultSettings,
} from '../lib/persistence';
import type { SaveStatus } from '../lib/persistence';
import {
  calculateScore,
  calculateXP,
  makeDeadline,
  makeDeadlineFromRemaining,
  validateAnswer,
  getRemainingTime,
} from '../lib/scoring';
import { getLevelById, LEVELS } from '../data/levels';
import { ALL_ACHIEVEMENTS } from '../data/achievements';

const MAX_HINTS_PER_LEVEL = 3;
const WRONG_ANSWER_TIME_PENALTY = 10; // seconds

// ─── State Interface ──────────────────────────────────────────────────────

interface GameState extends GameSave {
  // UI state (not persisted)
  screen: Screen;
  saveStatus: SaveStatus;
  newAchievement: Achievement | null;
  showRankUp: Rank | null;
  levelCompletionResult: LevelResult | null;
  failureReason: string | null;

  // Actions
  initGame: () => void;
  startNewGame: (playerName: string) => void;
  resetGame: () => void;
  navigateTo: (screen: Screen) => void;

  startLevel: (levelId: number) => void;
  submitAnswer: (input: string, timeRemaining: number) => 'correct' | 'wrong' | 'already-complete';
  useHint: (hintIndex: number, timeRemaining: number) => void;
  pauseLevel: (timeRemaining: number) => void;
  resumeLevel: () => void;
  failLevel: (reason: string) => void;
  retryLevel: () => void;
  continueToNext: () => void;

  dismissRankUp: () => void;
  dismissAchievement: () => void;

  updateSettings: (partial: Partial<GameSave['settings']>) => void;

  _persist: () => SaveStatus;
}

// ─── Rank Helper ─────────────────────────────────────────────────────────

function rankForCompletedLevel(completedLevelId: number, currentRank: Rank): Rank {
  if (completedLevelId >= 10) return 'MASTER HACKER';
  if (completedLevelId >= 8 && currentRank !== 'MASTER HACKER') return 'ELITE HACKER';
  if (completedLevelId >= 4 && currentRank === 'ROOKIE HACKER') return 'PRO HACKER';
  return currentRank;
}

// ─── Store ───────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
  // Initial UI state
  screen: 'title',
  saveStatus: 'idle',
  newAchievement: null,
  showRankUp: null,
  levelCompletionResult: null,
  failureReason: null,

  // Default GameSave fields (overwritten by initGame)
  version: 1,
  profile: { name: '', createdAt: '' },
  rank: 'ROOKIE HACKER',
  currentLevel: 1,
  highestUnlockedLevel: 1,
  completedLevels: [],
  levelResults: {},
  stats: {
    totalScore: 0,
    bestScore: 0,
    totalXP: 0,
    totalAttempts: 0,
    totalWrongAnswers: 0,
    totalHintsUsed: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalTimePlayed: 0,
  },
  achievements: [],
  activeRun: null,
  settings: defaultSettings(),
  savedAt: '',

  // ── Init ──────────────────────────────────────────────────────────────
  initGame: () => {
    const existing = loadGame();
    if (existing) {
      set({
        ...existing,
        screen: existing.profile.name ? 'title' : 'profile-setup',
        saveStatus: 'idle',
        newAchievement: null,
        showRankUp: null,
        levelCompletionResult: null,
        failureReason: null,
      });
    } else {
      set({ screen: 'title' });
    }
  },

  startNewGame: (playerName: string) => {
    const save = createDefaultSave(playerName);
    set({
      ...save,
      screen: 'tutorial',
      saveStatus: 'idle',
      newAchievement: null,
      showRankUp: null,
      levelCompletionResult: null,
      failureReason: null,
    });
    get()._persist();
  },

  resetGame: () => {
    clearSave();
    set({
      screen: 'title',
      ...createDefaultSave(''),
      saveStatus: 'idle',
      newAchievement: null,
      showRankUp: null,
      levelCompletionResult: null,
      failureReason: null,
    });
  },

  navigateTo: (screen: Screen) => set({ screen }),

  // ── Level Start ───────────────────────────────────────────────────────
  startLevel: (levelId: number) => {
    const level = getLevelById(levelId);
    if (!level) return;

    const state = get();

    // Restore paused run if same level
    let activeRun: ActiveRun;
    if (
      state.activeRun &&
      state.activeRun.levelId === levelId
    ) {
      if (state.activeRun.isPaused && state.activeRun.remainingAtPause !== undefined) {
        activeRun = {
          ...state.activeRun,
          isPaused: false,
          deadline: makeDeadlineFromRemaining(state.activeRun.remainingAtPause),
        };
      } else {
        activeRun = { ...state.activeRun, isPaused: false };
      }
    } else {
      // Fresh run
      activeRun = {
        levelId,
        startedAt: new Date().toISOString(),
        deadline: makeDeadline(level.timeLimit),
        hintsUsed: 0,
        wrongAnswers: 0,
        isPaused: false,
      };
    }

    set({
      currentLevel: levelId,
      activeRun,
      screen: 'puzzle',
      failureReason: null,
      levelCompletionResult: null,
    });
    get()._persist();
  },

  // ── Submit Answer ─────────────────────────────────────────────────────
  submitAnswer: (input: string, timeRemaining: number) => {
    const state = get();
    const { activeRun, completedLevels } = state;
    if (!activeRun) return 'wrong';

    const levelId = activeRun.levelId;
    const level = getLevelById(levelId);
    if (!level) return 'wrong';

    // Prevent re-awarding
    if (completedLevels.includes(levelId)) {
      return 'already-complete';
    }

    const isCorrect = validateAnswer(input, level.answer);

    if (!isCorrect) {
      // Wrong answer: deduct time penalty (stored as reduced deadline)
      const newDeadline = makeDeadlineFromRemaining(
        Math.max(0, timeRemaining - WRONG_ANSWER_TIME_PENALTY)
      );
      const updatedRun = {
        ...activeRun,
        wrongAnswers: activeRun.wrongAnswers + 1,
        deadline: newDeadline,
      };
      const updatedStats = {
        ...state.stats,
        totalWrongAnswers: state.stats.totalWrongAnswers + 1,
        totalAttempts: state.stats.totalAttempts + 1,
      };
      set({ activeRun: updatedRun, stats: updatedStats });
      get()._persist();
      return 'wrong';
    }

    // ── CORRECT ──────────────────────────────────────────────────────
    const timeUsed = level.timeLimit - timeRemaining;
    const scoreBreakdown = calculateScore(
      level.baseScore,
      level.timeLimit,
      timeRemaining,
      activeRun.wrongAnswers,
      activeRun.hintsUsed
    );
    const xpEarned = calculateXP(scoreBreakdown.total, levelId);

    const result: LevelResult = {
      levelId,
      completed: true,
      score: scoreBreakdown.total,
      timeRemaining,
      timeTaken: timeUsed,
      hintsUsed: activeRun.hintsUsed,
      wrongAnswers: activeRun.wrongAnswers,
      completedAt: new Date().toISOString(),
    };

    // Save best per-level
    const prevResult = state.levelResults[levelId];
    const bestResult =
      prevResult && prevResult.score >= result.score ? prevResult : result;

    const newCompletedLevels = completedLevels.includes(levelId)
      ? completedLevels
      : [...completedLevels, levelId];

    const newHighest = Math.max(
      state.highestUnlockedLevel,
      levelId + 1 <= LEVELS.length ? levelId + 1 : levelId
    );

    const newRank = rankForCompletedLevel(levelId, state.rank);
    const rankChanged = newRank !== state.rank;

    const newTotalScore = state.stats.totalScore + scoreBreakdown.total;
    const newStreak = state.stats.currentStreak + 1;

    const newStats = {
      ...state.stats,
      totalScore: newTotalScore,
      bestScore: Math.max(state.stats.bestScore, newTotalScore),
      totalXP: state.stats.totalXP + xpEarned,
      totalAttempts: state.stats.totalAttempts + 1,
      totalWrongAnswers: state.stats.totalWrongAnswers + activeRun.wrongAnswers,
      totalHintsUsed: state.stats.totalHintsUsed + activeRun.hintsUsed,
      currentStreak: newStreak,
      bestStreak: Math.max(state.stats.bestStreak, newStreak),
      totalTimePlayed: state.stats.totalTimePlayed + timeUsed,
    };

    // Check achievements
    const newAchievements = [...state.achievements];
    const unlockAchievement = (id: string) => {
      if (!newAchievements.find((a) => a.id === id)) {
        const def = ALL_ACHIEVEMENTS.find((a) => a.id === id);
        if (def) newAchievements.push({ ...def, unlockedAt: new Date().toISOString() });
      }
    };

    if (newCompletedLevels.length === 1) unlockAchievement('first_blood');
    if (activeRun.hintsUsed === 0) unlockAchievement('no_hints_level');
    if (timeRemaining / level.timeLimit > 0.8) unlockAchievement('speed_demon');
    if (activeRun.hintsUsed === 0 && activeRun.wrongAnswers === 0) unlockAchievement('perfect_run');
    if (levelId >= 4) unlockAchievement('pro_hacker');
    if (levelId >= 8) unlockAchievement('elite_hacker');
    if (levelId >= 10) {
      unlockAchievement('master_hacker');
      unlockAchievement('ten_complete');
    }
    if (newStreak >= 3) unlockAchievement('streak_3');
    if (newCompletedLevels.length === LEVELS.length && state.stats.totalHintsUsed + activeRun.hintsUsed === 0) {
      unlockAchievement('no_hints_game');
    }

    // Find newly unlocked achievement to show notification
    const newlyUnlocked = newAchievements.find(
      (a) => !state.achievements.find((old) => old.id === a.id)
    );

    set({
      completedLevels: newCompletedLevels,
      levelResults: { ...state.levelResults, [levelId]: bestResult },
      highestUnlockedLevel: newHighest,
      rank: newRank,
      stats: newStats,
      achievements: newAchievements,
      activeRun: null,
      levelCompletionResult: result,
      screen: levelId === 10 ? 'victory' : 'success',
      showRankUp: rankChanged ? newRank : null,
      newAchievement: newlyUnlocked ?? null,
    });
    get()._persist();
    return 'correct';
  },

  // ── Use Hint ──────────────────────────────────────────────────────────
  useHint: (hintIndex: number, timeRemaining: number) => {
    const state = get();
    const { activeRun } = state;
    if (!activeRun) return;
    if (activeRun.hintsUsed >= MAX_HINTS_PER_LEVEL) return;

    const level = getLevelById(activeRun.levelId);
    if (!level) return;

    const hint = level.hints[hintIndex];
    if (!hint) return;

    const newDeadline = makeDeadlineFromRemaining(
      Math.max(0, timeRemaining - hint.penaltySeconds)
    );
    const updatedRun = {
      ...activeRun,
      hintsUsed: activeRun.hintsUsed + 1,
      deadline: newDeadline,
    };

    // Check hint achievement
    const newAchievements = [...state.achievements];
    if (updatedRun.hintsUsed >= MAX_HINTS_PER_LEVEL) {
      if (!newAchievements.find((a) => a.id === 'collector')) {
        const def = ALL_ACHIEVEMENTS.find((a) => a.id === 'collector');
        if (def) newAchievements.push({ ...def, unlockedAt: new Date().toISOString() });
      }
    }

    set({
      activeRun: updatedRun,
      achievements: newAchievements,
      stats: {
        ...state.stats,
        totalHintsUsed: state.stats.totalHintsUsed + 1,
      },
    });
    get()._persist();
  },

  // ── Pause / Resume ────────────────────────────────────────────────────
  pauseLevel: (timeRemaining: number) => {
    const state = get();
    if (!state.activeRun) return;
    set({
      activeRun: {
        ...state.activeRun,
        isPaused: true,
        pausedAt: new Date().toISOString(),
        remainingAtPause: timeRemaining,
      },
    });
    get()._persist();
  },

  resumeLevel: () => {
    const state = get();
    if (!state.activeRun) return;
    const remaining = state.activeRun.remainingAtPause ?? 0;
    set({
      activeRun: {
        ...state.activeRun,
        isPaused: false,
        pausedAt: undefined,
        deadline: makeDeadlineFromRemaining(remaining),
      },
    });
    get()._persist();
  },

  // ── Fail Level ────────────────────────────────────────────────────────
  failLevel: (reason: string) => {
    const state = get();
    const activeRun = state.activeRun;
    if (!activeRun) return;

    // Track comeback kid
    const hasFailed = !state.completedLevels.includes(activeRun.levelId);
    if (hasFailed) {
      // We'll mark it by checking on retry if the level was previously failed
    }

    const newStats = {
      ...state.stats,
      totalAttempts: state.stats.totalAttempts + 1,
      currentStreak: 0, // reset streak on fail
    };

    set({
      activeRun: null,
      failureReason: reason,
      screen: 'failure',
      stats: newStats,
    });
    get()._persist();
  },

  retryLevel: () => {
    const state = get();
    // The level should already be in the state via currentLevel
    const levelId = state.currentLevel;
    const level = getLevelById(levelId);
    if (!level) return;

    const newRun: ActiveRun = {
      levelId,
      startedAt: new Date().toISOString(),
      deadline: makeDeadline(level.timeLimit),
      hintsUsed: 0,
      wrongAnswers: 0,
      isPaused: false,
    };

    // Achievement: comeback kid
    const alreadyCompletedLevel = state.completedLevels.includes(levelId);
    const newAchievements = [...state.achievements];
    if (!alreadyCompletedLevel && state.failureReason) {
      if (!newAchievements.find((a) => a.id === 'comeback_kid')) {
        // Will be awarded when they actually complete it — store a flag
      }
    }

    set({
      activeRun: newRun,
      screen: 'puzzle',
      failureReason: null,
      levelCompletionResult: null,
    });
    get()._persist();
  },

  continueToNext: () => {
    const state = get();
    const nextId = state.currentLevel + 1;
    if (nextId > LEVELS.length) {
      set({ screen: 'level-select' });
      return;
    }
    set({ currentLevel: nextId, screen: 'level-select' });
  },

  dismissRankUp: () => set({ showRankUp: null }),
  dismissAchievement: () => set({ newAchievement: null }),

  updateSettings: (partial) => {
    const state = get();
    set({ settings: { ...state.settings, ...partial } });
    get()._persist();
  },

  // ── Internal persist helper ───────────────────────────────────────────
  _persist: () => {
    const state = get();
    const save: GameSave = {
      version: state.version,
      profile: state.profile,
      rank: state.rank,
      currentLevel: state.currentLevel,
      highestUnlockedLevel: state.highestUnlockedLevel,
      completedLevels: state.completedLevels,
      levelResults: state.levelResults,
      stats: state.stats,
      achievements: state.achievements,
      activeRun: state.activeRun,
      settings: state.settings,
      savedAt: new Date().toISOString(),
    };
    const status = saveGame(save);
    set({ saveStatus: status });
    // Auto-reset status after 3s
    setTimeout(() => {
      if (get().saveStatus === status) {
        set({ saveStatus: 'idle' });
      }
    }, 3000);
    return status;
  },
}));
