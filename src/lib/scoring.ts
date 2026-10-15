/**
 * Scoring engine for HACK//BREAK.
 * Calculates scores based on time remaining, hints, wrong answers, and bonuses.
 */

export interface ScoreBreakdown {
  base: number;
  timeBonus: number;
  accuracyBonus: number;
  hintPenalty: number;
  wrongAnswerPenalty: number;
  total: number;
}

const WRONG_ANSWER_PENALTY = 50;
const HINT_PENALTY = 75;
const NO_HINT_BONUS = 200;
const PERFECT_BONUS = 300;

export function calculateScore(
  baseScore: number,
  timeLimit: number,
  timeRemaining: number,
  wrongAnswers: number,
  hintsUsed: number
): ScoreBreakdown {
  const timeFraction = Math.max(0, timeRemaining / timeLimit);
  const timeBonus = Math.round(baseScore * 0.5 * timeFraction);
  const accuracyBonus = wrongAnswers === 0 && hintsUsed === 0 ? PERFECT_BONUS : 0;
  const noHintBonus = hintsUsed === 0 && wrongAnswers > 0 ? NO_HINT_BONUS : 0;
  const hintPenalty = hintsUsed * HINT_PENALTY;
  const wrongAnswerPenalty = wrongAnswers * WRONG_ANSWER_PENALTY;

  const raw =
    baseScore +
    timeBonus +
    accuracyBonus +
    noHintBonus -
    hintPenalty -
    wrongAnswerPenalty;

  const total = Math.max(0, raw);

  return {
    base: baseScore,
    timeBonus,
    accuracyBonus: accuracyBonus + noHintBonus,
    hintPenalty,
    wrongAnswerPenalty,
    total,
  };
}

export function calculateXP(score: number, levelId: number): number {
  return Math.round(score * 0.1 + levelId * 10);
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function getRemainingTime(
  deadline: string,
  remainingAtPause?: number,
  pausedAt?: string,
  isPaused?: boolean
): number {
  if (isPaused && remainingAtPause !== undefined) {
    return remainingAtPause;
  }
  const deadlineMs = new Date(deadline).getTime();
  const nowMs = Date.now();
  const remaining = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));
  return remaining;
}

export function makeDeadline(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function makeDeadlineFromRemaining(remainingSeconds: number): string {
  return new Date(Date.now() + remainingSeconds * 1000).toISOString();
}

/** Validate a player's answer against the correct answer */
export function validateAnswer(input: string, correct: string): boolean {
  const normalise = (s: string) =>
    s.trim().toUpperCase().replace(/\s+/g, ' ');
  return normalise(input) === normalise(correct);
}
