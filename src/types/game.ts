export type GameCategory =
  | 'Arcade'
  | 'Action'
  | 'Adventure'
  | 'Racing'
  | 'Puzzle'
  | 'Strategy'
  | 'Sports'
  | 'Platformer'
  | 'Casual'
  | 'Multiplayer';

export type LicenseType =
  | 'MIT'
  | 'Apache 2.0'
  | 'GPL 3.0'
  | 'CC-BY 4.0'
  | 'Original Platform License'
  | 'Proprietary with Permission';

export interface GameControl {
  key: string;
  action: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  gameUrl: string;
  developer: string;
  category: GameCategory;
  tags: string[];
  controls: GameControl[];
  rating: number;
  ratingsCount: number;
  playCount: number;
  releaseDate: string;
  featured: boolean;
  published: boolean;
  licenseType: LicenseType;
  distributionPermission: string;
  attribution?: string;
  createdAt: string;
  updatedAt: string;
  isOriginal?: boolean;
}

export interface UserRating {
  userId: string;
  gameId: string;
  rating: number; // 1 to 5
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  gameId: string;
  playerName: string;
  score: number;
  achievedAt: string;
  verified: boolean;
}

export interface GameReport {
  id: string;
  gameId: string;
  gameTitle: string;
  reason: 'Game does not load' | 'Broken controls' | 'Copyright/rights concern' | 'Inappropriate content' | 'Other';
  details: string;
  reporterEmail?: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface GameSubmission {
  id: string;
  developerName: string;
  developerEmail: string;
  gameTitle: string;
  description: string;
  category: GameCategory;
  tags: string[];
  gameUrl: string;
  thumbnailUrl: string;
  controls: string;
  licenseType: LicenseType;
  distributionPermission: string;
  attributionNote?: string;
  rightsConfirmed: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isAdmin: boolean;
  favorites: string[];
  recentlyPlayed: {
    gameId: string;
    playedAt: string;
  }[];
}
