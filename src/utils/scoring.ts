import type { LeaderboardEntry } from '../types/game.ts';

export interface RatingCalculationResult {
  newRating: number;
  newCount: number;
}

/**
 * Calculates updated average rating when a user adds or updates their rating.
 * @param currentRating Current game rating (e.g. 4.8)
 * @param currentCount Current number of ratings
 * @param newRating Value between 1 and 5
 * @param previousRating Previous rating from this user, if updating
 */
export function calculateNewRating(
  currentRating: number,
  currentCount: number,
  newRating: number,
  previousRating?: number
): RatingCalculationResult {
  const boundedNew = Math.min(5, Math.max(1, Math.round(newRating)));

  if (previousRating !== undefined && previousRating >= 1 && previousRating <= 5) {
    // User is updating an existing rating: total count doesn't change
    if (currentCount <= 0) {
      return { newRating: boundedNew, newCount: 1 };
    }
    const currentSum = currentRating * currentCount;
    const updatedSum = currentSum - previousRating + boundedNew;
    const updatedRating = Math.round((updatedSum / currentCount) * 10) / 10;
    return {
      newRating: Math.min(5, Math.max(1, updatedRating)),
      newCount: currentCount,
    };
  }

  // Brand new rating from this user
  const currentSum = (currentCount > 0 ? currentRating : 0) * currentCount;
  const updatedCount = currentCount + 1;
  const updatedSum = currentSum + boundedNew;
  const updatedRating = Math.round((updatedSum / updatedCount) * 10) / 10;

  return {
    newRating: Math.min(5, Math.max(1, updatedRating)),
    newCount: updatedCount,
  };
}

/**
 * Format large play counts cleanly for gaming cards (e.g. 1200 -> 1.2K, 1500000 -> 1.5M)
 */
export function formatPlayCount(count: number): string {
  if (count < 0) return '0';
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toLocaleString();
}

/**
 * Validates a submitted score against reasonable thresholds and game rules.
 * Foundation for anti-tamper leaderboard system.
 */
export function validateGameScore(
  gameId: string,
  score: number,
  durationSeconds: number
): { valid: boolean; reason?: string } {
  if (typeof score !== 'number' || isNaN(score) || score < 0) {
    return { valid: false, reason: 'Score must be a positive number' };
  }
  if (!Number.isFinite(score)) {
    return { valid: false, reason: 'Score cannot be infinite' };
  }
  if (score > 10_000_000) {
    return { valid: false, reason: 'Score exceeds maximum allowed threshold' };
  }
  // Sanity check: cannot score impossibly high within a few seconds
  if (durationSeconds < 2 && score > 500) {
    return { valid: false, reason: 'Score rate exceeds human gameplay limits' };
  }
  return { valid: true };
}

/**
 * Sorts and ranks leaderboard entries by score descending
 */
export function rankLeaderboard(entries: LeaderboardEntry[], limit = 10): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
