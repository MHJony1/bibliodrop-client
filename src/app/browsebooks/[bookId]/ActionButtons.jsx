'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Truck, Lock, Edit3, Trash2, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ActionButtons({ bookId, status, currentUser, isLibrarianOwner, book }) {
  const [isProcessing, setIsProcessing] = useState(false);


  const isAvailable = status === 'Published';
  const isPendingDelivery = status === 'Pending Delivery';

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          title: book?.title || 'Unknown Book',
          price: book?.price !== undefined ? Number(book.price) : 0,
          deliveryFee: book?.deliveryFee !== undefined ? Number(book.deliveryFee) : 0,
        }),
      });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error || 'Failed to initialize checkout.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Stripe Error:', error);
      alert('Network error. Please try again.');
      setIsProcessing(false);
    }
  };

  // Condition 1: Not logged in
  if (!currentUser) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/auth/login" className="flex-1">
          <button className="w-full bg-[#6C47FF] hover:bg-[#5b3ae0] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(108,71,255,0.25)]">
            Login to Request Delivery
          </button>
        </Link>
        <button className="flex items-center justify-center gap-2 border border-white/4 bg-white/2 hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors">
          <Heart size={16} className="text-[#8890B5]" />
          Add to Wishlist
        </button>
      </div>
    );
  }

  // Condition 2: ✅ Librarian যে এই book এর owner - সে শুধু controls দেখবে
  if (isLibrarianOwner) {
    return (
      <div className="space-y-4 w-full">
        <button disabled className="flex items-center justify-center gap-2 w-full border border-white/4 bg-white/1 text-gray-600 font-semibold py-3 rounded-xl text-sm cursor-not-allowed">
          <Heart size={16} /> Add to Wishlist
        </button>
        <div className="bg-[#0D1033] border border-white/6 p-4 rounded-xl space-y-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#8890B5]">Librarian Controls</p>
          <div className="grid grid-cols-3 gap-2">
            <Link href={`/dashboard/librarian/manage-books/${bookId}/edit`}>
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/4 border border-white/8 text-xs font-bold hover:bg-white/8 text-white transition-colors">
                <Edit3 size={14} className="text-blue-400" /> Edit
              </button>
            </Link>
            <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/4 border border-white/8 text-xs font-bold hover:bg-white/8 text-white transition-colors">
              <EyeOff size={14} className="text-amber-400" /> Unpublish
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 text-red-400 transition-colors">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Condition 3: ✅ Regular user - অন্য librarian এর book কিনতে পারবে
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {isAvailable ? (
        // ✅ Published = Request Delivery button
        <button
          onClick={handleStripeCheckout}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-[#D48416] hover:bg-[#bd7410] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(212,132,22,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <><Loader2 size={16} className="animate-spin" /> Redirecting...</>
          ) : (
            <><Truck size={16} /> Request Delivery</>
          )}
        </button>
      ) : isPendingDelivery ? (
        // ✅ Pending Delivery = Checked Out
        <button disabled className="flex-1 flex items-center justify-center gap-2 bg-white/4 border border-white/8 text-gray-500 font-bold py-3 px-6 rounded-xl text-sm cursor-not-allowed">
          <Lock size={16} /> Checked Out
        </button>
      ) : (
        // ✅ অন্য যেকোনো status
        <button disabled className="flex-1 flex items-center justify-center gap-2 bg-white/4 border border-white/8 text-gray-500 font-bold py-3 px-6 rounded-xl text-sm cursor-not-allowed">
          <Lock size={16} /> Unavailable
        </button>
      )}

      <button className="flex items-center justify-center gap-2 border border-white/8 bg-white/2 hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors">
        <Heart size={16} className="text-[#8890B5]" />
        Add to Wishlist
      </button>
    </div>
  );
}