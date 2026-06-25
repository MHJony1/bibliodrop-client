'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import {
  Star,
  RefreshCw,
  MessageSquare,
  Trash2,
  Edit2,
  BookOpen,
  X,
  Check,
  User,
  Calendar,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { getUserReviews, deleteReview, updateReview } from '@/lib/api/reviews';

const StarRating = ({
  rating,
  onRatingChange,
  size = 16,
  readonly = false,
}) => {
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
            } transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};

// ✅ Delete Confirmation Modal Component
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  reviewTitle,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              Delete Review?
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 mb-6">
          <p className="text-white font-semibold text-sm line-clamp-1">
            "{reviewTitle || 'this review'}"
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            This review will be permanently removed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-slate-700/60 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />{' '}
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} /> Yes, Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function MyReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
  });

  // ✅ Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: null,
    reviewTitle: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadReviews = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const result = await getUserReviews(session.user.email);
      if (result?.success) {
        const data = result.data || [];
        setReviews(data);

        const avg =
          data.length > 0
            ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
            : 0;

        setStats({
          total: data.length,
          avgRating: avg,
        });
      }
    } catch (error) {
      console.error('Load Reviews Error:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadReviews();
    }
  }, [session]);

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
        userEmail: session.user.email,
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

  // ✅ Handle Delete with Modal
  const handleDeleteClick = (reviewId, reviewTitle) => {
    setDeleteModal({ isOpen: true, reviewId, reviewTitle });
  };

  const handleConfirmDelete = async () => {
    const { reviewId } = deleteModal;
    setIsDeleting(true);
    try {
      const result = await deleteReview(reviewId, session.user.email);
      if (result?.success) {
        toast.success('Review deleted!');
        setDeleteModal({ isOpen: false, reviewId: null, reviewTitle: '' });
        loadReviews();
      } else {
        toast.error(result?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#6D4AFF]/20 border-t-[#6D4AFF] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={20} className="text-[#6D4AFF]/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, reviewId: null, reviewTitle: '' })
        }
        onConfirm={handleConfirmDelete}
        reviewTitle={deleteModal.reviewTitle}
        isDeleting={isDeleting}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6D4AFF]/20 to-[#4A2FE8]/10 border border-[#6D4AFF]/20 backdrop-blur-sm">
              <MessageSquare size={22} className="text-[#A78BFA]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Reviews
              </h1>
              <p className="text-sm text-[#8890B5] mt-0.5">
                Manage your book reviews. ({reviews.length} total)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadReviews}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-2 text-sm disabled:opacity-50 group"
        >
          <RefreshCw
            size={15}
            className={
              loading
                ? 'animate-spin'
                : 'group-hover:rotate-180 transition-transform duration-500'
            }
          />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1033] to-[#0E1330]/60 border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <MessageSquare size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium uppercase tracking-wider">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1033] to-[#0E1330]/60 border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Star size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium uppercase tracking-wider">
                  Average Rating
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-white">
                    {stats.avgRating.toFixed(1)}
                  </p>
                  <StarRating
                    rating={Math.round(stats.avgRating)}
                    readonly
                    size={14}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1033] to-[#0E1330]/60 border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <BookOpen size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium uppercase tracking-wider">
                  Books Reviewed
                </p>
                <p className="text-2xl font-bold text-white">
                  {reviews.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-white/[0.07] bg-[#0D1033]/40 text-center"
        >
          <div className="p-6 rounded-full bg-[#6D4AFF]/10 border border-[#6D4AFF]/20 mb-6">
            <MessageSquare size={48} className="text-[#6D4AFF]/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
          <p className="text-[#8890B5] text-sm max-w-sm">
            Start reading books and share your thoughts with the community!
          </p>
          <Link
            href="/browsebooks"
            className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#4A2FE8] text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(109,74,255,0.3)] transition-all flex items-center gap-2 group"
          >
            Browse Books
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, index) => {
              const isEditing = editingId === review._id;

              return (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-5 rounded-2xl bg-[#0D1033]/60 border border-white/[0.06] hover:border-[#6D4AFF]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(109,74,255,0.05)]"
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-white">
                          Update your review
                        </p>
                        <span className="text-xs text-[#8890B5]">
                          Rate this book
                        </span>
                      </div>
                      <StarRating
                        rating={editRating}
                        onRatingChange={setEditRating}
                        size={24}
                      />
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#6D4AFF] resize-none text-sm transition-all"
                        rows={2}
                        placeholder="Write your review..."
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(review._id)}
                          className="px-5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-all flex items-center gap-2"
                        >
                          <Check size={16} /> Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-5 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                          <X size={16} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        {review.bookCover ? (
                          <Image
                            src={review.bookCover}
                            alt={review.bookTitle}
                            width={64}
                            height={80}
                            className="w-16 h-20 rounded-lg object-cover bg-[#0E1330] border border-white/[0.06]"
                            unoptimized
                          />
                        ) : (
                          <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-[#6D4AFF]/20 to-[#4A2FE8]/10 border border-white/[0.06] flex items-center justify-center">
                            <BookOpen size={24} className="text-[#6D4AFF]/30" />
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/browsebooks/${review.bookId}`}
                              className="text-base font-semibold text-white hover:text-[#A78BFA] transition-colors inline-flex items-center gap-2"
                            >
                              {review.bookTitle || 'Unknown Book'}
                              <ChevronRight
                                size={14}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </Link>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <div className="flex items-center gap-1">
                                <StarRating
                                  rating={review.rating}
                                  readonly
                                  size={14}
                                />
                                <span className="text-xs text-[#8890B5] ml-1">
                                  ({review.rating}/5)
                                </span>
                              </div>
                              <span className="w-1 h-1 rounded-full bg-[#565C7A]" />
                              <span className="text-xs text-[#8890B5] flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(review.createdAt)}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[#565C7A]" />
                              <span className="text-xs text-[#8890B5] flex items-center gap-1">
                                <User size={12} />
                                {review.userName ||
                                  review.userEmail?.split('@')[0]}
                              </span>
                            </div>
                          </div>

                          {/* ✅ Action Buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEdit(review)}
                              className="p-2 rounded-lg hover:bg-blue-500/10 text-[#8890B5] hover:text-blue-400 transition-all group-hover:opacity-100"
                              title="Edit Review"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(review._id, review.bookTitle)
                              }
                              className="p-2 rounded-lg hover:bg-red-500/10 text-[#8890B5] hover:text-red-400 transition-all"
                              title="Delete Review"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-[#C8D0E0] mt-2.5 leading-relaxed">
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
