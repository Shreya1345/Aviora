import { Icon } from '@iconify/react';

const StarRating = ({ rating = 0, onChange, large = false }) => {
  const numericRating = Number(rating);
  const safeRating = Number.isFinite(numericRating) ? Math.min(5, Math.max(0, numericRating)) : 0;
  const displayRating = Math.round(safeRating * 2) / 2;
  const iconSize = large ? 'text-2xl' : 'text-sm';

  return (
    <span
      className={`inline-flex text-amber-500 ${iconSize}`}
      role={onChange ? 'group' : 'img'}
      aria-label={onChange ? 'Select a rating from 0.5 to 5 stars' : `${safeRating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const icon = displayRating >= starValue
          ? 'mdi:star'
          : displayRating >= starValue - 0.5
            ? 'mdi:star-half-full'
            : 'mdi:star-outline';

        return (
          <span key={starValue} className="relative inline-flex">
            <Icon icon={icon} aria-hidden="true" />
            {onChange && (
              <>
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 border-0 bg-transparent p-0"
                  style={{ width: '50%' }}
                  aria-label={`Set rating to ${starValue - 0.5} stars`}
                  aria-pressed={displayRating === starValue - 0.5}
                  onClick={() => onChange(starValue - 0.5)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 border-0 bg-transparent p-0"
                  style={{ width: '50%' }}
                  aria-label={`Set rating to ${starValue} ${starValue === 1 ? 'star' : 'stars'}`}
                  aria-pressed={displayRating === starValue}
                  onClick={() => onChange(starValue)}
                />
              </>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default StarRating;
