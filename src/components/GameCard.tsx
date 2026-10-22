import React from 'react';
import { Play, Star, Eye, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { Game } from '../types/game.ts';
import { formatPlayCount } from '../utils/scoring.ts';
import { playUiClick, playFavoriteSound } from '../utils/sound.ts';

interface GameCardProps {
  game: Game;
  onSelectGame: (slug: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Arcade: 'bg-purple-900/60 text-purple-300 border-purple-500/40',
  Action: 'bg-rose-900/60 text-rose-300 border-rose-500/40',
  Adventure: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
  Racing: 'bg-orange-900/60 text-orange-300 border-orange-500/40',
  Puzzle: 'bg-blue-900/60 text-blue-300 border-blue-500/40',
  Strategy: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40',
  Sports: 'bg-cyan-900/60 text-cyan-300 border-cyan-500/40',
  Platformer: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
  Casual: 'bg-pink-900/60 text-pink-300 border-pink-500/40',
  Multiplayer: 'bg-teal-900/60 text-teal-300 border-teal-500/40',
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelectGame,
  isFavorite,
  onToggleFavorite,
}) => {
  const categoryBadgeClass =
    CATEGORY_COLORS[game.category] || 'bg-slate-800 text-slate-300 border-slate-600';

  const handleCardClick = () => {
    playUiClick();
    onSelectGame(game.slug);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playFavoriteSound();
    onToggleFavorite(game.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#0f1422] hover:bg-[#141b2e] border border-slate-800/80 hover:border-violet-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/60 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gradient dark vignette over thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-transparent to-black/30 pointer-events-none" />

        {/* Category & License Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border backdrop-blur-md shadow-sm ${categoryBadgeClass}`}
          >
            {game.category}
          </span>
          {game.isOriginal && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm border border-violet-400/40">
              <Sparkles className="w-3 h-3 text-cyan-300" /> ORIGINAL
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-20 ${
            isFavorite
              ? 'bg-rose-950/80 text-rose-500 border border-rose-500/50 shadow-md shadow-rose-950/50'
              : 'bg-black/50 hover:bg-black/80 text-white/80 hover:text-rose-400 border border-white/10'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick Play Hover Overlay with energetic play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/30 transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-4 h-4 fill-white" />
            PLAY NOW
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {game.title}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {game.description}
          </p>
        </div>

        {/* Footer Meta & Stats */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1 font-semibold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>

            {/* Play Count */}
            <div className="flex items-center gap-1 text-slate-400" title={`${game.playCount.toLocaleString()} plays`}>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatPlayCount(game.playCount)}</span>
            </div>
          </div>

          {/* Developer */}
          <div className="text-[11px] font-medium text-slate-400 truncate max-w-[110px]" title={game.developer}>
            by {game.developer}
          </div>
        </div>
      </div>
    </div>
  );
};
