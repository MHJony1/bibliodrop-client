'use client';

import React, { useState, useEffect } from 'react';
import { Star, Info, Trash2, Edit2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getBookReviews, addReview, updateReview, deleteReview } from '@/lib/api/reviews';

const StarRating = ({ rating, onRatingChange, size = 18, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`${
              star <= (hover || rating)
                ? 'fill-[#F5C842] text-[#F5C842]'
                : 'text-[#565C7A]'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export default function ReviewsSection({ bookId, currentUser, hasPurchased }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // ✅ Load reviews
  const loadReviews = async () => {
    if (!bookId) return;
    
    setLoading(true);
    try {
      const result = await getBookReviews(bookId);
      if (result?.success) {
        setReviews(result.data || []);
        setAverageRating(result.averageRating || 0);
      }
    } catch (error) {
      console.error('Load Reviews Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [bookId]);

  // ✅ Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to review');
      return;
    }
    
    if (!hasPurchased) {
      toast.error('You can only review books you have received');
      return;
    }

    if (reviewText.trim().length < 3) {
      toast.error('Comment must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addReview(bookId, {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name || currentUser.email?.split('@')[0],
        rating,
        comment: reviewText.trim(),
      });

      if (result?.success) {
        toast.success('Review added successfully!');
        setReviewText('');
        setRating(5);
        loadReviews();
      } else {
        toast.error(result?.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Submit Review Error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Edit review
  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (reviewId) => {
    try {
      const result = await updateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
        userEmail: currentUser.email,
      });

      if (result?.success) {
        toast.success('Review updated!');
        setEditingId(null);
        loadReviews();
      } else {
        toast.error(result?.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('Something went wrong');
    }
  };

  // ✅ Delete review
  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const result = await deleteReview(reviewId, currentUser.email);
      if (result?.success) {
        toast.success('Review deleted!');
        loadReviews();
      } else {
        toast.error(result?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Something went wrong');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-white">Reviews</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-[#0E1330]/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-white">
        Reviews ({reviews.length})
      </h2>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0D1033]/40 border border-white/[0.06]">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</p>
            <StarRating rating={Math.round(averageRating)} readonly size={14} />
            <p className="text-xs text-[#8890B5] mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="text-[#8890B5] w-3">{star}</span>
                  <Star size={12} className="fill-[#F5C842] text-[#F5C842]" />
                  <div className="flex-1 h-1.5 bg-[#0E1330]/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6D4AFF] to-[#A78BFA] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[#565C7A] w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rule Alert */}
      {currentUser && currentUser.role === 'user' && !hasPurchased && (
        <div className="flex items-center gap-2.5 bg-[#14153D] border border-white/[0.05] text-[#A2A9CD] px-4 py-3 rounded-xl text-xs sm:text-sm">
          <Info size={16} className="text-amber-500 shrink-0" />
          <span>Only users who have received this book can leave a review.</span>
        </div>
      )}

      {/* Review Form - Only verified buyers */}
      {currentUser && hasPurchased && (
        <form onSubmit={handleSubmitReview} className="bg-[#0D1033] border border-white/[0.06] p-5 rounded-2xl space-y-4">
          <p className="text-sm font-bold text-white">Share your thoughts</p>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} onRatingChange={setRating} size={22} />
          </div>
          <textarea
            required
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write an honest review..."
            className="w-full bg-[#080C24] border border-white/[0.08] text-white placeholder-gray-500 rounded-xl p-3 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors resize-none"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#6C47FF] hover:bg-[#5b3ae0] text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-[#0D1033]/40 border border-dashed border-white/[0.06] rounded-2xl p-8 text-center">
          <p className="text-sm text-[#8890B5]">No reviews yet. Be the first to review this book!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isEditing = editingId === review._id;
            const isOwner = currentUser?.email === review.userEmail;

            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0D1033] border border-white/[0.05] p-4 rounded-xl space-y-2"
              >
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <StarRating rating={editRating} onRatingChange={setEditRating} size={20} />
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#6D4AFF] resize-none text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(review._id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-semibold text-white">
                          {review.userName || review.userEmail?.split('@')[0]}
                        </span>
                        <p className="text-xs text-[#8890B5] mt-0.5">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} readonly size={14} />
                        {isOwner && (
                          <>
                            <button
                              onClick={() => handleEdit(review)}
                              className="p-1 rounded-lg hover:bg-blue-500/10 text-[#8890B5] hover:text-blue-400 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="p-1 rounded-lg hover:bg-red-500/10 text-[#8890B5] hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#9FA6C5] leading-relaxed">
                      {review.comment}
                    </p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}