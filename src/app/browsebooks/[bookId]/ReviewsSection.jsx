'use client';

import React, { useState } from 'react';
import { Star, Info } from 'lucide-react';

export default function ReviewsSection({ bookId, currentUser, hasPurchased, reviews }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log('Submitting review:', { bookId, reviewText, rating });
    // এখানে আপনার API এন্ডপয়েন্টে রিভিউ সাবমিট করার হ্যান্ডলার কল হবে
    setReviewText('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-white">
        Reviews ({reviews?.length || 0})
      </h2>

      {/* রুলস অ্যালার্ট: লগইন করা নরমাল ইউজার যদি বইটি পারচেজ না করে থাকে */}
      {currentUser && currentUser.role === 'user' && !hasPurchased && (
        <div className="flex items-center gap-2.5 bg-[#14153D] border border-white/[0.05] text-[#A2A9CD] px-4 py-3 rounded-xl text-xs sm:text-sm">
          <Info size={16} className="text-amber-500 shrink-0" />
          <span>Only users who have received this book can leave a review.</span>
        </div>
      )}

      {/* অ্যাক্টিভ রিভিউ ফর্ম: শুধুমাত্র ভেরিফাইড বায়ারদের জন্য */}
      {currentUser && hasPurchased && (
        <form onSubmit={handleSubmitReview} className="bg-[#0D1033] border border-white/[0.06] p-5 rounded-2xl space-y-4">
          <p className="text-sm font-bold text-white">Share your thoughts</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star size={18} className={star <= rating ? "fill-[#F5C842] text-[#F5C842]" : "text-gray-600"} />
              </button>
            ))}
          </div>
          <textarea
            required
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write an honest review..."
            className="w-full bg-[#080C24] border border-white/[0.08] text-white placeholder-gray-500 rounded-xl p-3 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors resize-none"
          />
          <button type="submit" className="bg-[#6C47FF] hover:bg-[#5b3ae0] text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors">
            Submit Review
          </button>
        </form>
      )}

      {/* রিভিউ তালিকা */}
      {reviews.length === 0 ? (
        <div className="bg-[#0D1033]/40 border border-dashed border-white/[0.06] rounded-2xl p-8 text-center">
          <p className="text-sm text-[#8890B5]">No reviews yet. Be the first to review this book!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev, index) => (
            <div key={index} className="bg-[#0D1033] border border-white/[0.05] p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">{rev.userName}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < rev.rating ? "fill-[#F5C842] text-[#F5C842]" : "text-gray-700"} />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#9FA6C5] leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}