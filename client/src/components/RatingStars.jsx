import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const RatingStars = ({ rating = 0, count = null, size = 'sm' }) => {
  const numStars = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(numStars);
  const hasHalfStar = numStars - fullStars >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSizeClass = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className="flex items-center gap-1.5" title={`${rating} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${starSizeClass} fill-amber-400`} />
        ))}
        {hasHalfStar && <StarHalf className={`${starSizeClass} fill-amber-400`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSizeClass} text-slate-300 dark:text-slate-700`} />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {rating.toFixed(1)}
      </span>
      {count !== null && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ({count.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};

export default RatingStars;

