import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  Heart,
  ShieldCheck,
  User,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Flame,
  Clock,
  Compass,
} from 'lucide-react';
import { GameCategory } from '../types/game.ts';
import { auth } from '../services/auth.ts';
import { playUiClick } from '../utils/sound.ts';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onOpenSubmit: () => void;
  favoritesCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORIES: GameCategory[] = [
  'Arcade',
  'Action',
  'Adventure',
  'Racing',
  'Puzzle',
  'Strategy',
  'Sports',
  'Platformer',
  'Casual',
  'Multiplayer',
];

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenAuth,
  onOpenSubmit,
  favoritesCount,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const user = auth.getCurrentUser();

  const handleNav = (path: string) => {
    playUiClick();
    onNavigate(path);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 group text-left transition-transform duration-200 hover:scale-[1.02] focus:outline-none"
            aria-label="UNIPLAYZZ Home"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/30 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:text-violet-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  UNIPLAYZZ
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold tracking-widest text-violet-300 bg-violet-950/80 border border-violet-500/40 rounded">
                  GAMES
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wider">
                PLAY • DISCOVER • CREATE
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentPath === '/'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/games')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentPath === '/games'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Games
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  currentPath.startsWith('/games/')
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                aria-expanded={categoriesOpen}
              >
                <Compass className="w-4 h-4 text-violet-400" />
                Categories
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#0d121f] border border-violet-500/30 rounded-xl shadow-2xl shadow-purple-950/60 p-2 grid grid-cols-2 gap-1 z-50">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleNav(`/games/${cat.toLowerCase()}`)}
                      className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-violet-900/40 rounded-lg text-left transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/#new')}
              className="flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              New
            </button>
            <button
              onClick={() => handleNav('/#popular')}
              className="flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              Popular
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs relative items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games, devs, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#121829] border border-slate-700/60 focus:border-cyan-500/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-slate-400 hover:text-white text-xs"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons: Submit Game, Favorites, Admin, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Submit Game button */}
            <button
              onClick={() => {
                playUiClick();
                onOpenSubmit();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/40 rounded-xl transition-all shadow-sm"
              aria-label="Submit a game for review"
            >
              <PlusCircle className="w-3.5 h-3.5 text-violet-400" />
              Submit Game
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => handleNav('/favorites')}
              className="relative p-2.5 text-slate-300 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"
              aria-label={`View favorites (${favoritesCount} saved)`}
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-extrabold text-white bg-rose-600 rounded-full text-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Quick Access */}
            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                currentPath === '/admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900/80 text-amber-400/90 hover:text-amber-300 border-amber-500/30 hover:bg-amber-950/30'
              }`}
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Admin</span>
            </button>

            {/* User / Profile Button */}
            <button
              onClick={() => {
                playUiClick();
                onOpenAuth();
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-violet-900/40 to-slate-900 border border-violet-500/30 hover:border-violet-400/60 rounded-xl transition-all"
              aria-label="User profile and login"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-violet-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-violet-950 flex items-center justify-center text-violet-300">
                  <User className="w-4 h-4" />
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold text-slate-200 truncate max-w-[90px]">
                {user ? user.displayName : 'Sign In'}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games, devs, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#121829] border border-slate-700/60 focus:border-cyan-500/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => handleNav('/')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/games')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              All Games
            </button>
            <div className="px-4 py-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleNav(`/games/${c.toLowerCase()}`)}
                    className="text-left text-xs text-slate-300 hover:text-cyan-400 py-1"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                onOpenSubmit();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-950/40 rounded-lg flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Submit Game (Developer)
            </button>
            <button
              onClick={() => handleNav('/favorites')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
            >
              <Heart className="w-4 h-4" /> My Favorites ({favoritesCount})
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-950/40 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
