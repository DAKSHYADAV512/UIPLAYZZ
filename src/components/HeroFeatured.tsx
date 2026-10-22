import React from 'react';
import { Play, Star, Eye, ShieldCheck, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { Game } from '../types/game.ts';
import { formatPlayCount } from '../utils/scoring.ts';
import { playUiClick } from '../utils/sound.ts';

interface HeroFeaturedProps {
  game: Game;
  onPlayGame: (slug: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ game, onPlayGame }) => {
  const handlePlay = () => {
    playUiClick();
    onPlayGame(game.slug);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-violet-500/30 bg-[#0d1222] shadow-2xl shadow-purple-950/40">
      {/* Background artwork with deep cinematic gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover object-center scale-105 filter blur-[1px] brightness-75 transform transition-transform duration-1000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090c17] via-[#090c17]/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090c17] via-transparent to-black/40 z-10" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-20 px-6 py-12 sm:px-12 sm:py-16 lg:py-20 max-w-3xl flex flex-col justify-center">
        {/* Chips header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-wider text-rose-300 bg-rose-950/80 border border-rose-500/50 rounded-full shadow-lg shadow-rose-950/40">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> FEATURED TITLE
          </span>
          <span className="px-3 py-1 text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full">
            {game.category}
          </span>
          {game.isOriginal && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-violet-300 bg-violet-950/80 border border-violet-500/40 rounded-full">
              <Sparkles className="w-3 h-3 text-cyan-300" /> UNIPLAYZZ ORIGINAL
            </span>
          )}
        </div>

        {/* Game Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight drop-shadow-md">
          {game.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">
          {game.description}
        </p>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{game.rating.toFixed(1)} / 5.0</span>
            <span className="text-slate-400 font-normal text-xs">({game.ratingsCount} reviews)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>{formatPlayCount(game.playCount)} Plays</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Developer: {game.developer}</span>
          </div>
        </div>

        {/* Large PLAY NOW CTA Button */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handlePlay}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-black text-base sm:text-lg tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            PLAY NOW
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <span className="text-xs text-slate-400 italic">
            Instant browser play • No download required
          </span>
        </div>
      </div>
    </div>
  );
};
