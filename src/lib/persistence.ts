/**
 * Persistence layer for HACK//BREAK.
 * Uses versioned localStorage with automatic migration.
 * Clearly documented as device-local storage (not cloud).
 */

import type { GameSave, Settings } from '../types/game';

const SAVE_KEY = 'hackbreak_save_v1';
const SAVE_VERSION = 1;

export type SaveStatus = 'saved' | 'error' | 'idle';

export function defaultSettings(): Settings {
  return {
    soundEnabled: true,
    reducedMotion: false,
    showSaveIndicator: true,
  };
}

export function createDefaultSave(name: string): GameSave {
  return {
    version: SAVE_VERSION,
    profile: {
      name,
      createdAt: new Date().toISOString(),
    },
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
    savedAt: new Date().toISOString(),
  };
}

export function saveGame(save: GameSave): SaveStatus {
  try {
    const payload = { ...save, savedAt: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return 'saved';
  } catch (e) {
    console.error('[HACK//BREAK] Save failed:', e);
    return 'error';
  }
}

export function loadGame(): GameSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed: GameSave = JSON.parse(raw);

    // Basic version / integrity check
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.profile?.name) return null;

    // Ensure required fields exist (migration safety)
    parsed.stats = parsed.stats ?? {
      totalScore: 0,
      bestScore: 0,
      totalXP: 0,
      totalAttempts: 0,
      totalWrongAnswers: 0,
      totalHintsUsed: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalTimePlayed: 0,
    };
    parsed.achievements = parsed.achievements ?? [];
    parsed.completedLevels = parsed.completedLevels ?? [];
    parsed.levelResults = parsed.levelResults ?? {};
    parsed.activeRun = parsed.activeRun ?? null;
    parsed.settings = { ...defaultSettings(), ...(parsed.settings ?? {}) };
    parsed.rank = parsed.rank ?? 'ROOKIE HACKER';

    return parsed;
  } catch (e) {
    console.error('[HACK//BREAK] Load failed — save data corrupted:', e);
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function exportSave(): string {
  const raw = localStorage.getItem(SAVE_KEY);
  return raw ?? '{}';
}

export function importSave(jsonString: string): boolean {
  try {
    const parsed: GameSave = JSON.parse(jsonString);
    if (!parsed?.profile?.name) return false;
    localStorage.setItem(SAVE_KEY, jsonString);
    return true;
  } catch {
    return false;
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
