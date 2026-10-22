import React from 'react';
import { Heart } from 'lucide-react';
import { playFavoriteSound } from '../utils/sound.ts';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  className = '',
  showLabel = true,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playFavoriteSound();
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
        isFavorite
          ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 shadow-lg shadow-rose-950/40'
          : 'bg-[#121727] text-slate-300 hover:text-rose-400 border-slate-700/60 hover:border-rose-500/40 hover:bg-rose-950/30'
      } ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500 animate-bounce' : ''}`} />
      {showLabel && (
        <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
      )}
    </button>
  );
};
