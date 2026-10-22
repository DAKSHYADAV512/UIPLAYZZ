import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNewRating, formatPlayCount, validateGameScore, rankLeaderboard } from './scoring.ts';
import type { LeaderboardEntry } from '../types/game.ts';

test('calculateNewRating increments count and recalculates average for new rating', () => {
  // Current 4.0 with 1 rating -> new 5.0 -> (4 + 5) / 2 = 4.5
  const res = calculateNewRating(4.0, 1, 5);
  assert.equal(res.newCount, 2);
  assert.equal(res.newRating, 4.5);
});

test('calculateNewRating handles first rating on game', () => {
  const res = calculateNewRating(0, 0, 5);
  assert.equal(res.newCount, 1);
  assert.equal(res.newRating, 5);
});

test('calculateNewRating adjusts existing rating without incrementing count', () => {
  // User previously gave 3, now changes to 5. Current avg 4.0, count 2 (sum 8) -> new sum 8 - 3 + 5 = 10 / 2 = 5.0
  const res = calculateNewRating(4.0, 2, 5, 3);
  assert.equal(res.newCount, 2);
  assert.equal(res.newRating, 5.0);
});

test('formatPlayCount formats integers, thousands, and millions', () => {
  assert.equal(formatPlayCount(250), '250');
  assert.equal(formatPlayCount(1200), '1.2K');
  assert.equal(formatPlayCount(15000), '15K');
  assert.equal(formatPlayCount(2400000), '2.4M');
});

test('validateGameScore rejects negative, NaN, and impossible rapid scores', () => {
  assert.equal(validateGameScore('game1', -10, 30).valid, false);
  assert.equal(validateGameScore('game1', NaN, 30).valid, false);
  assert.equal(validateGameScore('game1', 9999999999, 30).valid, false);
  assert.equal(validateGameScore('game1', 1000, 1).valid, false); // impossible in 1s
  assert.equal(validateGameScore('game1', 450, 45).valid, true);
});

test('rankLeaderboard orders highest scores first and limits', () => {
  const entries: LeaderboardEntry[] = [
    { id: '1', gameId: 'g1', playerName: 'Alex', score: 1200, achievedAt: '', verified: true },
    { id: '2', gameId: 'g1', playerName: 'Sam', score: 3400, achievedAt: '', verified: true },
    { id: '3', gameId: 'g1', playerName: 'Kai', score: 2100, achievedAt: '', verified: true },
  ];
  const ranked = rankLeaderboard(entries, 2);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].playerName, 'Sam');
  assert.equal(ranked[1].playerName, 'Kai');
});
