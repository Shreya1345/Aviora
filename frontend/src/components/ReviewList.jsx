import StarRating from './StarRating';

const ReviewList = ({ reviews = [] }) => (
  <section className="card h-full border border-base-300 bg-base-100 shadow-sm">
    <div className="card-body p-6">
      <h3 className="mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="mb-0 text-base-content/60">No reviews yet. Be the first to review this product.</p>
      ) : reviews.map((review) => (
        <div key={review._id} className="mb-3 border-b border-base-300 pb-3">
          <div className="flex items-start justify-between gap-3">
            <strong>{review.name || review.userId?.name || 'Customer'}</strong>
            <small className="text-base-content/60">{new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
          <StarRating rating={review.rating} />
          <p className="mt-2 mb-0 text-base-content/70">{review.comment}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ReviewList;
