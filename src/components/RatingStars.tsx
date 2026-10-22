import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { playUiClick } from '../utils/sound.ts';

interface RatingStarsProps {
  currentRating: number;
  ratingsCount: number;
  userRating?: number | null;
  onRate: (rating: number) => void;
  interactive?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  currentRating,
  ratingsCount,
  userRating,
  onRate,
  interactive = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStarClick = (rating: number) => {
    if (!interactive) return;
    playUiClick();
    onRate(rating);
  };

  const displayRating = hoverRating !== null ? hoverRating : currentRating;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= Math.round(displayRating);
            return (
              <button
                key={star}
                type="button"
                disabled={!interactive}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => interactive && setHoverRating(star)}
                onMouseLeave={() => interactive && setHoverRating(null)}
                className={`p-1 transition-transform ${
                  interactive ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
                }`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'text-slate-600 hover:text-amber-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-baseline gap-1.5 ml-1">
          <span className="font-extrabold text-lg text-amber-400">
            {currentRating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            ({ratingsCount.toLocaleString()} {ratingsCount === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      </div>

      {interactive && userRating && (
        <span className="text-[11px] text-cyan-400 font-medium">
          ✓ You rated this game {userRating} ★ (click any star to adjust)
        </span>
      )}
      {interactive && !userRating && (
        <span className="text-[11px] text-slate-400">
          Click stars to submit your rating
        </span>
      )}
    </div>
  );
};
