import {
  Game,
  GameCategory,
  GameReport,
  GameSubmission,
  LeaderboardEntry,
  LicenseType,
  UserRating,
} from '../types/game.ts';
import { calculateNewRating } from '../utils/scoring.ts';

const STORAGE_KEYS = {
  GAMES: 'uniplayzz_games_v1',
  SUBMISSIONS: 'uniplayzz_submissions_v1',
  REPORTS: 'uniplayzz_reports_v1',
  RATINGS: 'uniplayzz_ratings_v1',
  LEADERBOARD: 'uniplayzz_leaderboard_v1',
  FAVORITES: 'uniplayzz_favorites_v1',
  USER_SESSION: 'uniplayzz_user_session_v1',
};

// Initial verified open-source / platform original seed games
const INITIAL_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Space Runner: Neon Odyssey',
    slug: 'space-runner',
    description: 'High-octane neon arcade runner. Pilot your interceptor through hyperspace, weave through asteroid fields, and collect quantum fuel cores to maximize your score multiplier.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    gameUrl: '/public/space-runner/index.html',
    developer: 'UNIPLAYZZ Studios',
    category: 'Arcade',
    tags: ['Sci-Fi', 'Fast-Paced', 'Retro', 'Neon', 'Arcade'],
    controls: [
      { key: '← / → or A / D', action: 'Steer Starship' },
      { key: 'Touch / Drag', action: 'Touch Steering' },
      { key: 'Space', action: 'Quick Start' },
    ],
    rating: 4.9,
    ratingsCount: 384,
    playCount: 42150,
    releaseDate: '2026-02-14',
    featured: true,
    published: true,
    licenseType: 'Original Platform License',
    distributionPermission: 'Official UNIPLAYZZ 1P Original Game. Worldwide web distribution granted.',
    attribution: 'Created by UNIPLAYZZ Core Interactive Team.',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-14T12:00:00Z',
    isOriginal: true,
  },
  {
    id: 'game-2',
    title: 'Cyber Pong: Overdrive',
    slug: 'cyber-pong',
    description: 'Neon kinetic paddle duel against adaptive Cyber AI. Master angled deflection curves, smash velocity boosts, and claim the cyber arena trophy.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gameUrl: '/public/cyber-pong/index.html',
    developer: 'Neon Pulse Lab',
    category: 'Sports',
    tags: ['Cyberpunk', '2 Player', 'Sports', 'Reflex', 'Synthwave'],
    controls: [
      { key: 'Mouse / Touch', action: 'Move Paddle' },
      { key: 'W / S or ↑ / ↓', action: 'Keyboard Steer' },
    ],
    rating: 4.8,
    ratingsCount: 219,
    playCount: 28940,
    releaseDate: '2026-02-28',
    featured: true,
    published: true,
    licenseType: 'MIT',
    distributionPermission: 'MIT Open Source License explicitly permits commercial and non-commercial redistribution.',
    attribution: 'Based on open source canvas kinetic mechanics with original neon overdrive design.',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
    isOriginal: false,
  },
  {
    id: 'game-3',
    title: 'Pixel Jump: Tower Ascent',
    slug: 'pixel-jump',
    description: 'Addictive vertical platform climber. Leap between kinetic, moving, and spring-loaded platforms while collecting quantum coins as you scale the infinite spire.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    gameUrl: '/public/pixel-jump/index.html',
    developer: 'Pixel Forge',
    category: 'Platformer',
    tags: ['Platformer', 'Endless', 'Casual', 'Bouncy', 'Pixel'],
    controls: [
      { key: '← / → or A / D', action: 'Steer Left / Right' },
      { key: 'Tap Left / Right', action: 'Mobile Steer' },
    ],
    rating: 4.7,
    ratingsCount: 178,
    playCount: 19800,
    releaseDate: '2026-03-05',
    featured: false,
    published: true,
    licenseType: 'CC-BY 4.0',
    distributionPermission: 'CC-BY 4.0 Verified with author attribution.',
    attribution: 'Physics engine adapted from open CC-BY platformer engine by Pixel Forge.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
    isOriginal: false,
  },
  {
    id: 'game-4',
    title: 'Retro Asteroids: Vector Pulse',
    slug: 'retro-asteroids',
    description: 'Authentic vector-space combat. Rotate your tactical fighter 360 degrees, burn inertia thrusters, and vaporize fractured asteroid clusters with high-frequency pulse lasers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    gameUrl: '/public/retro-asteroids/index.html',
    developer: 'Vector Heritage Works',
    category: 'Action',
    tags: ['Vector', 'Retro', 'Space', 'Action', 'Classic'],
    controls: [
      { key: 'A / D or ← / →', action: 'Rotate Ship' },
      { key: 'W or ↑', action: 'Fire Thruster' },
      { key: 'Spacebar', action: 'Laser Pulse' },
      { key: 'Shift', action: 'Hyperspace Jump' },
    ],
    rating: 4.9,
    ratingsCount: 412,
    playCount: 35620,
    releaseDate: '2026-03-12',
    featured: true,
    published: true,
    licenseType: 'MIT',
    distributionPermission: 'MIT License verified. Full redistribution terms satisfied.',
    attribution: 'Vector physics math under MIT license with enhanced glow render pipeline.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-12T12:00:00Z',
    isOriginal: false,
  },
  {
    id: 'game-5',
    title: 'Chroma Matrix: Color Pulse',
    slug: 'chroma-matrix',
    description: 'Challenging harmonic color matrix puzzle. Click cyber grid nodes to propagate color shifts into adjacent cells and harmonize the entire matrix before energy runs out.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    gameUrl: '/public/chroma-matrix/index.html',
    developer: 'UNIPLAYZZ Studios',
    category: 'Puzzle',
    tags: ['Puzzle', 'Logic', 'Minimal', 'Relaxing', 'Brain'],
    controls: [
      { key: 'Click / Tap', action: 'Trigger Color Pulse' },
    ],
    rating: 4.6,
    ratingsCount: 95,
    playCount: 14200,
    releaseDate: '2026-03-20',
    featured: false,
    published: true,
    licenseType: 'Original Platform License',
    distributionPermission: 'Official UNIPLAYZZ Original Game.',
    attribution: 'Designed and engineered exclusively for UNIPLAYZZ.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
    isOriginal: true,
  },
];

const INITIAL_SUBMISSIONS: GameSubmission[] = [
  {
    id: 'sub-1',
    developerName: 'Quantum Byte Games',
    developerEmail: 'developer@quantumbyte.io',
    gameTitle: 'Neon Drift 2088',
    description: 'Futuristic hovercar racing game with synthwave soundtrack and drift scoring.',
    category: 'Racing',
    tags: ['Racing', 'Cyberpunk', 'Drift'],
    gameUrl: 'https://cdn.example.org/public/neon-drift/index.html',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    controls: 'WASD / Arrows to steer, Space for drift boost',
    licenseType: 'Proprietary with Permission',
    distributionPermission: 'Direct permission agreement signed with UNIPLAYZZ platform.',
    attributionNote: 'Quantum Byte Games 2026',
    rightsConfirmed: true,
    status: 'pending',
    submittedAt: '2026-03-22T14:30:00Z',
  },
  {
    id: 'sub-2',
    developerName: 'Sarah Chen',
    developerEmail: 'schen@indiedev.net',
    gameTitle: 'Hexa Dungeon Crawler',
    description: 'Turn-based procedural dungeon crawler on a hexagonal grid with spellcraft.',
    category: 'Adventure',
    tags: ['Roguelike', 'Dungeon', 'Turn-Based'],
    gameUrl: 'https://cdn.example.org/games/hexa-crawler/index.html',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    controls: 'Mouse to select hex tiles, 1-4 for spells',
    licenseType: 'MIT',
    distributionPermission: 'Open source under MIT license with full redistribution permission.',
    rightsConfirmed: true,
    status: 'pending',
    submittedAt: '2026-03-24T09:15:00Z',
  },
];

const INITIAL_REPORTS: GameReport[] = [
  {
    id: 'rep-1',
    gameId: 'game-2',
    gameTitle: 'Cyber Pong: Overdrive',
    reason: 'Broken controls',
    details: 'On very narrow mobile screens, the paddle touched near the top boundary sometimes.',
    reporterEmail: 'tester@uniplayzz.com',
    status: 'resolved',
    createdAt: '2026-03-18T11:20:00Z',
  },
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', gameId: 'game-1', playerName: 'NovaStriker', score: 14250, achievedAt: '2026-03-20', verified: true },
  { id: 'lb-2', gameId: 'game-1', playerName: 'CyberGhost', score: 11800, achievedAt: '2026-03-21', verified: true },
  { id: 'lb-3', gameId: 'game-1', playerName: 'Valkyrie99', score: 9640, achievedAt: '2026-03-22', verified: true },
  { id: 'lb-4', gameId: 'game-1', playerName: 'PulseRider', score: 8120, achievedAt: '2026-03-23', verified: true },
  { id: 'lb-5', gameId: 'game-1', playerName: 'HyperDrive', score: 6490, achievedAt: '2026-03-24', verified: true },
  { id: 'lb-6', gameId: 'game-4', playerName: 'StarLord_X', score: 5800, achievedAt: '2026-03-21', verified: true },
  { id: 'lb-7', gameId: 'game-4', playerName: 'CosmoAce', score: 4350, achievedAt: '2026-03-22', verified: true },
  { id: 'lb-8', gameId: 'game-3', playerName: 'ApexClimber', score: 3200, achievedAt: '2026-03-24', verified: true },
];

class StorageService {
  private get<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.warn('LocalStorage write failed:', err);
    }
  }

  // Games collection
  getGames(): Game[] {
    const existing = this.get<Game[] | null>(STORAGE_KEYS.GAMES, null);
    if (!existing || existing.length === 0) {
      this.set(STORAGE_KEYS.GAMES, INITIAL_GAMES);
      return INITIAL_GAMES;
    }
    return existing;
  }

  getGameBySlug(slug: string): Game | undefined {
    const games = this.getGames();
    return games.find((g) => g.slug === slug);
  }

  getGameById(id: string): Game | undefined {
    const games = this.getGames();
    return games.find((g) => g.id === id);
  }

  saveGame(game: Game): Game {
    const games = this.getGames();
    const index = games.findIndex((g) => g.id === game.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      games[index] = { ...game, updatedAt: now };
    } else {
      games.unshift({
        ...game,
        createdAt: game.createdAt || now,
        updatedAt: now,
      });
    }
    this.set(STORAGE_KEYS.GAMES, games);
    return game;
  }

  deleteGame(id: string): boolean {
    const games = this.getGames();
    const filtered = games.filter((g) => g.id !== id);
    if (filtered.length !== games.length) {
      this.set(STORAGE_KEYS.GAMES, filtered);
      return true;
    }
    return false;
  }

  togglePublish(id: string): boolean {
    const games = this.getGames();
    const game = games.find((g) => g.id === id);
    if (game) {
      game.published = !game.published;
      game.updatedAt = new Date().toISOString();
      this.set(STORAGE_KEYS.GAMES, games);
      return game.published;
    }
    return false;
  }

  toggleFeatured(id: string): boolean {
    const games = this.getGames();
    const game = games.find((g) => g.id === id);
    if (game) {
      game.featured = !game.featured;
      game.updatedAt = new Date().toISOString();
      this.set(STORAGE_KEYS.GAMES, games);
      return game.featured;
    }
    return false;
  }

  incrementPlayCount(gameId: string): number {
    const games = this.getGames();
    const game = games.find((g) => g.id === gameId);
    if (game) {
      game.playCount = (game.playCount || 0) + 1;
      this.set(STORAGE_KEYS.GAMES, games);
      return game.playCount;
    }
    return 0;
  }

  // Ratings
  getRatings(): UserRating[] {
    return this.get<UserRating[]>(STORAGE_KEYS.RATINGS, []);
  }

  getUserRating(gameId: string, userId: string): number | null {
    const ratings = this.getRatings();
    const entry = ratings.find((r) => r.gameId === gameId && r.userId === userId);
    return entry ? entry.rating : null;
  }

  submitRating(gameId: string, userId: string, ratingValue: number): { rating: number; count: number } {
    const ratings = this.getRatings();
    const existingIndex = ratings.findIndex((r) => r.gameId === gameId && r.userId === userId);
    const prevRating = existingIndex >= 0 ? ratings[existingIndex].rating : undefined;

    const game = this.getGameById(gameId);
    if (!game) return { rating: 0, count: 0 };

    const { newRating, newCount } = calculateNewRating(
      game.rating,
      game.ratingsCount,
      ratingValue,
      prevRating
    );

    game.rating = newRating;
    game.ratingsCount = newCount;
    game.updatedAt = new Date().toISOString();
    this.saveGame(game);

    if (existingIndex >= 0) {
      ratings[existingIndex].rating = ratingValue;
      ratings[existingIndex].updatedAt = new Date().toISOString();
    } else {
      ratings.push({
        gameId,
        userId,
        rating: ratingValue,
        updatedAt: new Date().toISOString(),
      });
    }
    this.set(STORAGE_KEYS.RATINGS, ratings);

    return { rating: newRating, count: newCount };
  }

  // Favorites
  getFavorites(userId: string): string[] {
    const map = this.get<Record<string, string[]>>(STORAGE_KEYS.FAVORITES, {
      guest: ['game-1', 'game-4'], // demo default favorites for instant showcase
    });
    return map[userId] || [];
  }

  toggleFavorite(userId: string, gameId: string): boolean {
    const map = this.get<Record<string, string[]>>(STORAGE_KEYS.FAVORITES, {
      guest: ['game-1', 'game-4'],
    });
    const list = map[userId] || [];
    const isFav = list.includes(gameId);
    const updated = isFav ? list.filter((id) => id !== gameId) : [...list, gameId];
    map[userId] = updated;
    this.set(STORAGE_KEYS.FAVORITES, map);
    return !isFav;
  }

  // Leaderboard
  getLeaderboard(gameId: string): LeaderboardEntry[] {
    const all = this.get<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    return all
      .filter((e) => e.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  submitScore(entry: { gameId: string; playerName: string; score: number }): LeaderboardEntry {
    const all = this.get<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    const newEntry: LeaderboardEntry = {
      id: `lb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      gameId: entry.gameId,
      playerName: entry.playerName.trim() || 'Anonymous Pilot',
      score: entry.score,
      achievedAt: new Date().toISOString().split('T')[0],
      verified: true,
    };
    all.push(newEntry);
    this.set(STORAGE_KEYS.LEADERBOARD, all);
    return newEntry;
  }

  // Submissions
  getSubmissions(): GameSubmission[] {
    const existing = this.get<GameSubmission[] | null>(STORAGE_KEYS.SUBMISSIONS, null);
    if (!existing) {
      this.set(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
      return INITIAL_SUBMISSIONS;
    }
    return existing;
  }

  createSubmission(submission: Omit<GameSubmission, 'id' | 'status' | 'submittedAt'>): GameSubmission {
    const all = this.getSubmissions();
    const newSub: GameSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    all.unshift(newSub);
    this.set(STORAGE_KEYS.SUBMISSIONS, all);
    return newSub;
  }

  updateSubmissionStatus(id: string, status: 'approved' | 'rejected', notes?: string): boolean {
    const all = this.getSubmissions();
    const sub = all.find((s) => s.id === id);
    if (sub) {
      sub.status = status;
      if (notes) sub.adminNotes = notes;
      this.set(STORAGE_KEYS.SUBMISSIONS, all);

      // If approved, automatically convert and publish to games catalog!
      if (status === 'approved') {
        const slug = sub.gameTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const newGame: Game = {
          id: `game-approved-${Date.now()}`,
          title: sub.gameTitle,
          slug,
          description: sub.description,
          thumbnailUrl: sub.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
          gameUrl: sub.gameUrl,
          developer: sub.developerName,
          category: sub.category,
          tags: sub.tags,
          controls: [{ key: 'Action', action: sub.controls || 'Default Controls' }],
          rating: 5.0,
          ratingsCount: 1,
          playCount: 0,
          releaseDate: new Date().toISOString().split('T')[0],
          featured: false,
          published: true,
          licenseType: sub.licenseType,
          distributionPermission: sub.distributionPermission,
          attribution: sub.attributionNote,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.saveGame(newGame);
      }
      return true;
    }
    return false;
  }

  // Reports
  getReports(): GameReport[] {
    const existing = this.get<GameReport[] | null>(STORAGE_KEYS.REPORTS, null);
    if (!existing) {
      this.set(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
      return INITIAL_REPORTS;
    }
    return existing;
  }

  submitReport(report: Omit<GameReport, 'id' | 'status' | 'createdAt'>): GameReport {
    const all = this.getReports();
    const newRep: GameReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    all.unshift(newRep);
    this.set(STORAGE_KEYS.REPORTS, all);
    return newRep;
  }

  updateReportStatus(id: string, status: 'open' | 'investigating' | 'resolved'): boolean {
    const all = this.getReports();
    const rep = all.find((r) => r.id === id);
    if (rep) {
      rep.status = status;
      this.set(STORAGE_KEYS.REPORTS, all);
      return true;
    }
    return false;
  }

  // Admin Overview Statistics
  getOverviewStats() {
    const games = this.getGames();
    const submissions = this.getSubmissions();
    const reports = this.getReports();

    const totalGames = games.length;
    const publishedGames = games.filter((g) => g.published).length;
    const pendingGames = submissions.filter((s) => s.status === 'pending').length;
    const totalPlays = games.reduce((acc, g) => acc + (g.playCount || 0), 0);
    const mostPlayedGames = [...games].sort((a, b) => b.playCount - a.playCount).slice(0, 5);
    const openReports = reports.filter((r) => r.status === 'open').length;

    return {
      totalGames,
      publishedGames,
      pendingGames,
      totalPlays,
      mostPlayedGames,
      openReports,
    };
  }

  // Reset to initial demo catalog
  resetToDefault() {
    this.set(STORAGE_KEYS.GAMES, INITIAL_GAMES);
    this.set(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    this.set(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    this.set(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    return true;
  }
}

export const storage = new StorageService();
