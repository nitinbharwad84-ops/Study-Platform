/**
 * Timer Engine — MCQ Module
 * Handles full-exam and per-question timer state.
 */

export type TimerMode = "per_question" | "full_exam" | "none";

export interface TimerConfig {
  mode: TimerMode;
  value: number; // seconds
}

export interface FullExamTimerState {
  expiresAt: string; // ISO timestamp
  secondsRemaining: number;
  isExpired: boolean;
}

/**
 * Calculate the expiry timestamp for a full-exam timer.
 * @param startedAt - ISO timestamp when exam started
 * @param durationSeconds - total duration of the exam in seconds
 */
export function computeExpiresAt(
  startedAt: string,
  durationSeconds: number
): string {
  const start = new Date(startedAt).getTime();
  return new Date(start + durationSeconds * 1000).toISOString();
}

/**
 * Compute remaining seconds for a full-exam timer, based on server-stored expiry.
 * @param expiresAt - ISO timestamp stored in mcq_attempts.expires_at
 */
export function computeTimeRemaining(expiresAt: string): FullExamTimerState {
  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  const diff = Math.floor((expiry - now) / 1000);

  return {
    expiresAt,
    secondsRemaining: Math.max(0, diff),
    isExpired: diff <= 0,
  };
}

/**
 * Format seconds into MM:SS string.
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Default timer values for exam configuration UI.
 */
export const DEFAULT_TIMER_CONFIGS: Record<TimerMode, number> = {
  full_exam: 30 * 60,    // 30 minutes
  per_question: 90,       // 90 seconds per question
  none: 0,
};
