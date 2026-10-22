import { UserProfile } from '../types/game.ts';

const AUTH_STORAGE_KEY = 'uniplayzz_auth_user_v1';

const DEMO_ADMIN: UserProfile = {
  id: 'admin-001',
  email: 'admin@uniplayzz.com',
  displayName: 'Commander Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isAdmin: true,
  favorites: ['game-1', 'game-4'],
  recentlyPlayed: [
    { gameId: 'game-1', playedAt: '2026-03-24T18:00:00Z' },
    { gameId: 'game-2', playedAt: '2026-03-24T17:30:00Z' },
  ],
};

const DEMO_PLAYER: UserProfile = {
  id: 'player-002',
  email: 'cyberpilot@uniplayzz.com',
  displayName: 'NeonPilot',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  isAdmin: false,
  favorites: ['game-1', 'game-3'],
  recentlyPlayed: [
    { gameId: 'game-1', playedAt: '2026-03-24T15:00:00Z' },
  ],
};

type AuthListener = (user: UserProfile | null) => void;

class AuthService {
  private listeners: AuthListener[] = [];
  private currentUser: UserProfile | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          this.currentUser = JSON.parse(saved);
        } else {
          // Default to demo player so visitors can immediately test favorites, ratings, and profile
          this.currentUser = DEMO_PLAYER;
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_PLAYER));
        }
      } catch {
        this.currentUser = DEMO_PLAYER;
      }
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return Boolean(this.currentUser?.isAdmin);
  }

  onAuthStateChanged(callback: AuthListener): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      if (this.currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    this.listeners.forEach((l) => l(this.currentUser));
  }

  loginAsAdmin(): UserProfile {
    this.currentUser = DEMO_ADMIN;
    this.notify();
    return DEMO_ADMIN;
  }

  loginAsPlayer(name = 'NeonPilot'): UserProfile {
    this.currentUser = { ...DEMO_PLAYER, displayName: name };
    this.notify();
    return this.currentUser;
  }

  loginWithEmail(email: string, name?: string): UserProfile {
    const isAdminEmail = email.toLowerCase().includes('admin');
    this.currentUser = {
      id: `usr-${Date.now()}`,
      email,
      displayName: name || email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      isAdmin: isAdminEmail,
      favorites: [],
      recentlyPlayed: [],
    };
    this.notify();
    return this.currentUser;
  }

  loginWithGoogle(): UserProfile {
    // Quick Google sign-in simulation
    this.currentUser = {
      id: `usr-google-${Date.now()}`,
      email: 'user.google@uniplayzz.com',
      displayName: 'Google Player',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      isAdmin: false,
      favorites: ['game-1'],
      recentlyPlayed: [],
    };
    this.notify();
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    this.notify();
  }

  addRecentlyPlayed(gameId: string): void {
    if (!this.currentUser) return;
    const filtered = (this.currentUser.recentlyPlayed || []).filter((r) => r.gameId !== gameId);
    filtered.unshift({
      gameId,
      playedAt: new Date().toISOString(),
    });
    this.currentUser.recentlyPlayed = filtered.slice(0, 10);
    this.notify();
  }

  toggleFavorite(gameId: string): boolean {
    if (!this.currentUser) {
      this.loginAsPlayer();
    }
    if (!this.currentUser) return false;

    const favs = this.currentUser.favorites || [];
    const isFav = favs.includes(gameId);
    if (isFav) {
      this.currentUser.favorites = favs.filter((id) => id !== gameId);
    } else {
      this.currentUser.favorites = [...favs, gameId];
    }
    this.notify();
    return !isFav;
  }

  isFavorite(gameId: string): boolean {
    return Boolean(this.currentUser?.favorites?.includes(gameId));
  }
}

export const auth = new AuthService();
