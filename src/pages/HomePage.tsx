import React, { useState, useMemo } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  TrendingUp,
  Compass,
  Search,
  Filter,
  Grid,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Game, GameCategory } from '../types/game.ts';
import { HeroFeatured } from '../components/HeroFeatured.tsx';
import { GameCard } from '../components/GameCard.tsx';
import {
  filterGames,
  getFeaturedGame,
  getNewGames,
  getPopularGames,
  getTrendingGames,
  paginateGames,
  SortOption,
} from '../utils/gameFilters.ts';
import { playUiClick } from '../utils/sound.ts';

interface HomePageProps {
  games: Game[];
  onSelectGame: (slug: string) => void;
  onSelectCategory: (category: string) => void;
  favorites: string[];
  onToggleFavorite: (gameId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: { name: GameCategory; icon: string; count: number; desc: string; gradient: string }[] = [
  { name: 'Arcade', icon: '🕹️', count: 0, desc: 'Classic reflex & neon blasters', gradient: 'from-purple-900/60 to-indigo-900/40 border-purple-500/30' },
  { name: 'Action', icon: '⚔️', count: 0, desc: 'Fast combat & dodging', gradient: 'from-rose-900/60 to-orange-900/40 border-rose-500/30' },
  { name: 'Adventure', icon: '🧭', count: 0, desc: 'Exploration & journeys', gradient: 'from-amber-900/60 to-yellow-900/40 border-amber-500/30' },
  { name: 'Racing', icon: '🏎️', count: 0, desc: 'High-velocity drift & speed', gradient: 'from-orange-900/60 to-red-900/40 border-orange-500/30' },
  { name: 'Puzzle', icon: '🧩', count: 0, desc: 'Logic, chromatic & spatial', gradient: 'from-blue-900/60 to-cyan-900/40 border-blue-500/30' },
  { name: 'Strategy', icon: '♟️', count: 0, desc: 'Tactical planning & mastery', gradient: 'from-indigo-900/60 to-violet-900/40 border-indigo-500/30' },
  { name: 'Sports', icon: '⚽', count: 0, desc: 'Kinetic duels & athletic goals', gradient: 'from-cyan-900/60 to-teal-900/40 border-cyan-500/30' },
  { name: 'Platformer', icon: '🧗', count: 0, desc: 'Precision jumps & spires', gradient: 'from-emerald-900/60 to-green-900/40 border-emerald-500/30' },
  { name: 'Casual', icon: '☕', count: 0, desc: 'Quick pick-up-and-play', gradient: 'from-pink-900/60 to-rose-900/40 border-pink-500/30' },
  { name: 'Multiplayer', icon: '👥', count: 0, desc: 'Co-op & head-to-head', gradient: 'from-teal-900/60 to-emerald-900/40 border-teal-500/30' },
];

export const HomePage: React.FC<HomePageProps> = ({
  games,
  onSelectGame,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Compute sections
  const featuredGame = useMemo(() => getFeaturedGame(games), [games]);
  const trendingGames = useMemo(() => getTrendingGames(games, 4), [games]);
  const newGames = useMemo(() => getNewGames(games, 4), [games]);
  const popularGames = useMemo(() => getPopularGames(games, 4), [games]);

  // Compute category game counts
  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      count: games.filter((g) => g.published && g.category === cat.name).length,
    }));
  }, [games]);

  // Filtered all games catalog
  const filteredAll = useMemo(() => {
    return filterGames(games, {
      query: searchQuery,
      category: selectedCategory,
      sortBy,
      onlyPublished: true,
    });
  }, [games, searchQuery, selectedCategory, sortBy]);

  const paginatedResult = useMemo(() => {
    return paginateGames(filteredAll, page, pageSize);
  }, [filteredAll, page, pageSize]);

  return (
    <div className="space-y-16">
      {/* Hero Featured Section */}
      {featuredGame && !searchQuery && (
        <section aria-label="Featured Game">
          <HeroFeatured game={featuredGame} onPlayGame={onSelectGame} />
        </section>
      )}

      {/* Quick Category Chips bar */}
      <section className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => {
              playUiClick();
              setSelectedCategory('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Games
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                playUiClick();
                setSelectedCategory(cat.name);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* If search query is active, show Search Results view directly */}
      {searchQuery ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Search Results for "{searchQuery}"
              <span className="text-sm font-semibold text-slate-400">
                ({filteredAll.length} found)
              </span>
            </h2>
            <button
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear Search
            </button>
          </div>

          {filteredAll.length === 0 ? (
            <div className="py-16 text-center bg-[#0d1222] border border-slate-800 rounded-3xl p-8 space-y-3">
              <p className="text-base text-slate-300 font-semibold">
                No games matched "{searchQuery}"
              </p>
              <p className="text-xs text-slate-500">
                Try searching by category, genre, or developer name.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAll.map((game) => (
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
        </section>
      ) : (
        <>
          {/* Section: Trending Games */}
          <section id="trending" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-950/40">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Trending Games
                  </h2>
                  <p className="text-xs text-slate-400">
                    High engagement and surging community activity
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelectGame={onSelectGame}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* Section: New Games */}
          <section id="new" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/40">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    New Games
                  </h2>
                  <p className="text-xs text-slate-400">
                    Freshly verified releases ready to play
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelectGame={onSelectGame}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* Section: Popular Games */}
          <section id="popular" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-950/40">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Popular Games
                  </h2>
                  <p className="text-xs text-slate-400">
                    Titles with the highest all-time player counts
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelectGame={onSelectGame}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* Section: Categories Showcase */}
          <section id="categories" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-violet-950/70 border border-violet-500/40 text-violet-400 shadow-lg shadow-purple-950/40">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Browse by Category
                </h2>
                <p className="text-xs text-slate-400">
                  Curated game worlds tailored to every gameplay taste
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryStats.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    playUiClick();
                    onSelectCategory(cat.name.toLowerCase());
                  }}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${cat.gradient} border text-left hover:scale-[1.03] transition-all duration-200 group flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[11px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                      {cat.count} games
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section: All Games Catalog with Live Filters & Pagination */}
          <section id="all-games" className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    All Games Catalog
                  </h2>
                  <p className="text-xs text-slate-400">
                    Showing {filteredAll.length} verified titles
                  </p>
                </div>
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-3">
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
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedResult.items.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelectGame={onSelectGame}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {paginatedResult.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    playUiClick();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className="p-2.5 rounded-xl bg-[#101422] border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 disabled:hover:bg-[#101422]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-400 font-semibold px-4">
                  Page <strong className="text-white">{page}</strong> of{' '}
                  <strong className="text-white">{paginatedResult.totalPages}</strong>
                </div>

                <button
                  disabled={page >= paginatedResult.totalPages}
                  onClick={() => {
                    playUiClick();
                    setPage((p) => Math.min(paginatedResult.totalPages, p + 1));
                  }}
                  className="p-2.5 rounded-xl bg-[#101422] border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 disabled:hover:bg-[#101422]"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
