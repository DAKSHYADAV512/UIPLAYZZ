import test from 'node:test';
import assert from 'node:assert/strict';
import { filterGames, paginateGames, getFeaturedGame } from './gameFilters.ts';
import type { Game } from '../types/game.ts';

const mockGames: Game[] = [
  {
    id: '1',
    title: 'Space Runner',
    slug: 'space-runner',
    description: 'Neon starship runner',
    thumbnailUrl: '/thumb1.jpg',
    gameUrl: '/games/space-runner',
    developer: 'Uniplayzz Studio',
    category: 'Arcade',
    tags: ['space', 'sci-fi', 'fast'],
    controls: [{ key: 'Arrows', action: 'Move' }],
    rating: 4.8,
    ratingsCount: 120,
    playCount: 15400,
    releaseDate: '2026-02-15',
    featured: true,
    published: true,
    licenseType: 'Original Platform License',
    distributionPermission: 'Official original title',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-15',
  },
  {
    id: '2',
    title: 'Cyber Maze',
    slug: 'cyber-maze',
    description: 'Solve neon grid puzzles',
    thumbnailUrl: '/thumb2.jpg',
    gameUrl: '/games/cyber-maze',
    developer: 'Hexagon Labs',
    category: 'Puzzle',
    tags: ['puzzle', 'logic', 'cyber'],
    controls: [{ key: 'WASD', action: 'Navigate' }],
    rating: 4.5,
    ratingsCount: 45,
    playCount: 8200,
    releaseDate: '2026-03-01',
    featured: false,
    published: true,
    licenseType: 'MIT',
    distributionPermission: 'MIT Open Source License verified',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '3',
    title: 'Draft Racer',
    slug: 'draft-racer',
    description: 'Unpublished prototype',
    thumbnailUrl: '/thumb3.jpg',
    gameUrl: '/games/draft-racer',
    developer: 'Indie Dev',
    category: 'Racing',
    tags: ['speed'],
    controls: [],
    rating: 3.0,
    ratingsCount: 1,
    playCount: 10,
    releaseDate: '2026-03-10',
    featured: false,
    published: false,
    licenseType: 'MIT',
    distributionPermission: 'Pending approval',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
  },
];

test('filterGames excludes unpublished games by default', () => {
  const result = filterGames(mockGames);
  assert.equal(result.length, 2);
  assert.ok(!result.some((g) => g.id === '3'));
});

test('filterGames includes unpublished games when onlyPublished is false', () => {
  const result = filterGames(mockGames, { onlyPublished: false });
  assert.equal(result.length, 3);
});

test('filterGames filters by category', () => {
  const arcade = filterGames(mockGames, { category: 'Arcade' });
  assert.equal(arcade.length, 1);
  assert.equal(arcade[0].title, 'Space Runner');

  const puzzle = filterGames(mockGames, { category: 'Puzzle' });
  assert.equal(puzzle.length, 1);
  assert.equal(puzzle[0].title, 'Cyber Maze');
});

test('filterGames searches by title, dev, and tags', () => {
  const searchTag = filterGames(mockGames, { query: 'sci-fi' });
  assert.equal(searchTag.length, 1);
  assert.equal(searchTag[0].title, 'Space Runner');

  const searchDev = filterGames(mockGames, { query: 'Hexagon' });
  assert.equal(searchDev.length, 1);
  assert.equal(searchDev[0].title, 'Cyber Maze');
});

test('filterGames sorts correctly by play count and newest', () => {
  const byPlays = filterGames(mockGames, { sortBy: 'popular' });
  assert.equal(byPlays[0].id, '1'); // 15400 > 8200

  const byNewest = filterGames(mockGames, { sortBy: 'newest' });
  assert.equal(byNewest[0].id, '2'); // 2026-03-01 > 2026-02-15
});

test('paginateGames splits array into correct page slices', () => {
  const page1 = paginateGames(mockGames, 1, 2);
  assert.equal(page1.items.length, 2);
  assert.equal(page1.totalPages, 2);
  assert.equal(page1.currentPage, 1);

  const page2 = paginateGames(mockGames, 2, 2);
  assert.equal(page2.items.length, 1);
  assert.equal(page2.currentPage, 2);
});

test('getFeaturedGame returns the featured game', () => {
  const featured = getFeaturedGame(mockGames);
  assert.ok(featured);
  assert.equal(featured?.id, '1');
});
