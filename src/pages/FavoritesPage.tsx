import React from 'react';
import { Heart, ChevronLeft, Gamepad2, Compass } from 'lucide-react';
import { Game } from '../types/game.ts';
import { GameCard } from '../components/GameCard.tsx';
import { playUiClick } from '../utils/sound.ts';

interface FavoritesPageProps {
  games: Game[];
  favorites: string[];
  onNavigate: (path: string) => void;
  onSelectGame: (slug: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  games,
  favorites,
  onNavigate,
  onSelectGame,
  onToggleFavorite,
}) => {
  const favoriteGames = games.filter((g) => favorites.includes(g.id));

  return (
    <div className="space-y-8">
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

      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-violet-950/30 to-[#090d16] border border-rose-500/20 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-950/50">
            <Heart className="w-7 h-7 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              My Saved Games
            </h1>
            <p className="text-xs text-slate-400">
              {favoriteGames.length} {favoriteGames.length === 1 ? 'game' : 'games'} bookmarked for instant play
            </p>
          </div>
        </div>
      </div>

      {/* Games List or Empty State */}
      {favoriteGames.length === 0 ? (
        <div className="py-20 text-center bg-[#0d1222] border border-slate-800 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No favorites saved yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the heart icon on any game card or game player to bookmark your favorite browser games here for instant access!
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all"
            >
              <Compass className="w-4 h-4" /> Discover Games
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelectGame={onSelectGame}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
