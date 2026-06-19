'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Truck, Lock, Edit3, Trash2, EyeOff } from 'lucide-react';
import Link from 'next/link';

// ১. ফাংশনের ব্র্যাকেটের ভেতরের প্রপ্সগুলো খেয়াল করুন
export default function ActionButtons({ bookId, status, currentUser, isLibrarianOwner }) {
  const router = useRouter();
  
  // আপনার ডাটাবেজ অনুযায়ী যদি status ফিল্ড না থাকে, তবে default হিসেবে 'available' ধরে নেওয়া হলো
  const isAvailable = status === 'available' || status === undefined;

  // ২. কনসোল লগ (টেস্ট করার জন্য, পরে কেটে দিতে পারেন)
  console.log("Client Side User Check:", currentUser);

  // ৩. এখানে কন্ডিশনটি আমরা একটু সহজ ও নিখুঁত করে দিলাম
  if (!currentUser) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full">
      <Link href="/auth/login">
        <button 
          onClick={() => router.push('/login')}
          className="flex-1 bg-[#6C47FF] hover:bg-[#5b3ae0] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(108,71,255,0.25)]"
        >
          Login to Request Delivery
        </button>
      </Link>
        <button className="flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors">
          <Heart size={16} className="text-[#8890B5]" />
          Add to Wishlist
        </button>
      </div>
    );
  }

  // ৪. ইউজার যদি লিব্রেরিয়ার ওনার হন
  if (isLibrarianOwner) {
    return (
      <div className="space-y-4 w-full">
        <button disabled className="flex items-center justify-center gap-2 w-full border border-white/[0.04] bg-white/[0.01] text-gray-600 font-semibold py-3 rounded-xl text-sm cursor-not-allowed">
          <Heart size={16} /> Add to Wishlist
        </button>
        <div className="bg-[#0D1033] border border-white/[0.06] p-4 rounded-xl space-y-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#8890B5]">Librarian Controls</p>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-bold hover:bg-white/[0.08] text-white transition-colors">
              <Edit3 size={14} className="text-blue-400" /> Edit
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-bold hover:bg-white/[0.08] text-white transition-colors">
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

  // ৫. আপনি যেহেতু এখন "user" হিসেবে লগইন আছেন, আপনার জন্য এই নিচের বাটনটিই দেখাবে!
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {isAvailable ? (
        <button 
          onClick={() => router.push(`/checkout/${bookId}`)} 
          className="flex-1 flex items-center justify-center gap-2 bg-[#D48416] hover:bg-[#bd7410] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(212,132,22,0.2)]"
        >
          <Truck size={16} />
          Request Delivery
        </button>
      ) : (
        <button 
          disabled
          className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.08] text-gray-500 font-bold py-3 px-6 rounded-xl text-sm cursor-not-allowed"
        >
          <Lock size={16} />
          Checked Out
        </button>
      )}

      <button className="flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors">
        <Heart size={16} className="text-[#8890B5]" />
        Add to Wishlist
      </button>
    </div>
  );
}