import React, { useState } from 'react';
import { Send } from 'lucide-react';
import api from '../../api/client';
import { RatingStars } from '../common/RatingStars';
import { IReview } from '../../types';

interface ReviewFormProps {
  studioId: string;
  onReviewAdded: (review: IReview) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  studioId,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !comment.trim()) {
      alert('Please enter a review title and comment.');
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await api.post('/reviews', {
        targetType: 'studio',
        targetId: studioId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        photos: [],
      });

      if (res.data?.success && res.data?.review) {
        onReviewAdded(res.data.review);

        setRating(5);
        setTitle('');
        setComment('');

        alert('Review posted successfully!');
      } else {
        alert(res.data?.message || 'Failed to post review.');
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to post review.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5"
    >
      <div>
        <span className="text-amber-600 text-[10px] font-bold uppercase tracking-wider">
          Share Your Experience
        </span>

        <h3 className="text-lg font-bold text-slate-900 mt-1">
          Write a Review
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Tell other customers about your experience with this studio.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          Your Rating
        </label>

        <RatingStars
          rating={rating}
          size="lg"
          interactive={true}
          onRatingChange={setRating}
        />

        <span className="text-[11px] text-slate-500 mt-1 block">
          {rating} out of 5 stars
        </span>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Review Title
        </label>

        <input
          type="text"
          required
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example: Amazing photoshoot experience"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Your Review
        </label>

        <textarea
          required
          rows={5}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with the studio, photographer and service..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500 resize-none"
        />

        <span className="text-[10px] text-slate-400 mt-1 block text-right">
          {comment.length}/1000
        </span>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Submit Review
            </>
          )}
        </button>
      </div>
    </form>
  );
};
