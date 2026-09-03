import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showCount = false,
  reviewCount,
  interactive = false,
  onRatingChange
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalf = !isFilled && starValue - 0.5 <= rating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-slate-400 font-normal ml-0.5">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
