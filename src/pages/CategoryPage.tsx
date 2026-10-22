import React, { useState, useMemo } from 'react';
import { ChevronLeft, Filter, Gamepad2, Compass } from 'lucide-react';
import { Game, GameCategory } from '../types/game.ts';
import { GameCard } from '../components/GameCard.tsx';
import { filterGames, SortOption } from '../utils/gameFilters.ts';
import { playUiClick } from '../utils/sound.ts';

interface CategoryPageProps {
  categorySlug: string;
  games: Game[];
  onNavigate: (path: string) => void;
  onSelectGame: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (gameId: string) => void;
}

const CATEGORY_META: Record<
  string,
  { name: GameCategory; icon: string; desc: string; gradient: string }
> = {
  arcade: {
    name: 'Arcade',
    icon: '🕹️',
    desc: 'High-score chasing, neon blasters, and adrenaline-charged reflex games.',
    gradient: 'from-purple-900/40 to-[#090d16]',
  },
  action: {
    name: 'Action',
    icon: '⚔️',
    desc: 'High-speed kinetic combat, asteroid dogfights, and dynamic arenas.',
    gradient: 'from-rose-900/40 to-[#090d16]',
  },
  adventure: {
    name: 'Adventure',
    icon: '🧭',
    desc: 'Epic journeys, dungeon crawlers, and sprawling quests.',
    gradient: 'from-amber-900/40 to-[#090d16]',
  },
  racing: {
    name: 'Racing',
    icon: '🏎️',
    desc: 'Drift circuits, hovercars, and high-velocity speedways.',
    gradient: 'from-orange-900/40 to-[#090d16]',
  },
  puzzle: {
    name: 'Puzzle',
    icon: '🧩',
    desc: 'Chromatic matrices, spatial deduction, and brain-teasing mechanics.',
    gradient: 'from-blue-900/40 to-[#090d16]',
  },
  strategy: {
    name: 'Strategy',
    icon: '♟️',
    desc: 'Turn-based tactics, defense planning, and master maneuvers.',
    gradient: 'from-indigo-900/40 to-[#090d16]',
  },
  sports: {
    name: 'Sports',
    icon: '⚽',
    desc: 'Kinetic paddle duels, precision curve shots, and tournament leagues.',
    gradient: 'from-cyan-900/40 to-[#090d16]',
  },
  platformer: {
    name: 'Platformer',
    icon: '🧗',
    desc: 'Tower climbers, bouncy spring jumps, and precision timing challenges.',
    gradient: 'from-emerald-900/40 to-[#090d16]',
  },
  casual: {
    name: 'Casual',
    icon: '☕',
    desc: 'Instant pick-up fun designed for relaxing short sessions.',
    gradient: 'from-pink-900/40 to-[#090d16]',
  },
  multiplayer: {
    name: 'Multiplayer',
    icon: '👥',
    desc: 'Competitive 1v1 duels, local co-op, and shared arena battles.',
    gradient: 'from-teal-900/40 to-[#090d16]',
  },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  games,
  onNavigate,
  onSelectGame,
  favorites,
  onToggleFavorite,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const meta = CATEGORY_META[categorySlug.toLowerCase()] || {
    name: (categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)) as GameCategory,
    icon: '🎮',
    desc: `Browse all ${categorySlug} browser games on UNIPLAYZZ.`,
    gradient: 'from-slate-900 to-[#090d16]',
  };

  const categoryGames = useMemo(() => {
    return filterGames(games, {
      category: meta.name,
      sortBy,
      onlyPublished: true,
    });
  }, [games, meta.name, sortBy]);

  return (
    <div className="space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => {
            playUiClick();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f1424] hover:bg-[#151c32] border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {/* Category Banner */}
      <div
        className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-r ${meta.gradient} border border-violet-500/20 shadow-2xl relative overflow-hidden`}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{meta.icon}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-cyan-300 border border-white/10">
              {categoryGames.length} {categoryGames.length === 1 ? 'Game' : 'Games'} Available
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {meta.name} Games
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {meta.desc}
          </p>
        </div>
      </div>

      {/* Filter and Sort bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <span className="text-xs text-slate-400 font-semibold">
          Showing {categoryGames.length} games in {meta.name}
        </span>

        <div className="flex items-center gap-2 bg-[#101422] border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
          >
            <option value="popular" className="bg-[#101422]">Most Played</option>
            <option value="newest" className="bg-[#101422]">Newest</option>
            <option value="rating" className="bg-[#101422]">Highest Rated</option>
            <option value="title" className="bg-[#101422]">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Game Cards Grid */}
      {categoryGames.length === 0 ? (
        <div className="py-20 text-center bg-[#0d1222] border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <p className="text-base text-slate-300 font-semibold">
            No games currently listed under {meta.name}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Are you a developer? Submit a game in this category to feature your title here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelectGame={onSelectGame}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
