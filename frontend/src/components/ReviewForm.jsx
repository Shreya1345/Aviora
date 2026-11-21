import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import StarRating from './StarRating';

const ReviewForm = ({ productId, onSubmitted }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) return toast.error('Please login to write a review.');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to submit review.');
      onSubmitted?.(data);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully.');
    } catch (error) {
      toast.error(error.message || 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card h-full border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-6">
        <h4 className="mb-3"><Icon icon="mdi:comment-edit-outline" className="mr-2 text-primary" aria-hidden="true" />Write a Review</h4>
        {user ? (
          <form onSubmit={submitReview}>
            <div className="form-control mb-3">
              <label className="label font-medium">Rating</label>
              <div>
                <StarRating rating={rating} onChange={setRating} large />
                <div className="mt-1 text-sm text-base-content/60">{rating.toFixed(1)} out of 5</div>
              </div>
            </div>
            <div className="form-control mb-3">
              <label className="label font-medium" htmlFor="review-comment">Comment</label>
              <textarea
                id="review-comment"
                className="textarea textarea-bordered w-full"
                rows={4}
                maxLength={1000}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                required
                placeholder="Share your experience..."
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={submitting || !comment.trim()}>
              <Icon icon={submitting ? 'mdi:loading' : 'mdi:send-outline'} aria-hidden="true" />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="mb-0 text-base-content/60">Please login to write a review.</p>
        )}
      </div>
    </section>
  );
};

export default ReviewForm;
