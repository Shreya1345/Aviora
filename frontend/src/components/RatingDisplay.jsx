import StarRating from './StarRating';

const RatingDisplay = ({ rating = 0, count = 0, showCount = true, large = false }) => {
  const numericRating = Number(rating) || 0;
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={numericRating} large={large} />
      {showCount && (
        <span className="badge badge-ghost text-base-content">
          {numericRating.toFixed(1)} ({count} reviews)
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
