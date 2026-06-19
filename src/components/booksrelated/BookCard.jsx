'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Lock } from 'lucide-react';

export default function BookCard({ book }) {
  const isAvailable = book?.status === 'available';
  const bookId = book?._id?.['$oid'] || book?._id || book?.id;

  // Category color mapping for visual variety
  const categoryColors = {
    romance: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/20' },
    academic: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/20' },
    biography: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/20' },
    fiction: { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/20' },
    science: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/20' },
    history: { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/20' },
  };
  const catKey = (book?.category || '').toLowerCase();
  const catStyle = categoryColors[catKey] || {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/20',
  };

  return (
    <Link href={`/books/${bookId}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-[#6C47FF] rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-2xl overflow-hidden flex flex-col h-full
          bg-[#0D1033] border border-white/[0.07]
          hover:border-[#6C47FF]/50 hover:shadow-[0_0_40px_-8px_rgba(108,71,255,0.35)]
          transition-all duration-300 ease-out"
      >
        {/* ── Spine accent bar ── */}
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#6C47FF] via-[#9B7AFF] to-[#6C47FF]/20
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-l-2xl" />

        {/* ── Cover Image ── */}
        <div className="relative w-full aspect-square overflow-hidden bg-[#080C24]">
          <Image
            src={book?.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'}
            alt={book?.title || 'Book Cover'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Gradient overlay — always present, deepens on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1033] via-[#0D1033]/20 to-transparent
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* ── Category badge ── */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest
              border backdrop-blur-sm ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
              <BookOpen size={8} />
              {book?.category || 'General'}
            </span>
          </div>

          {/* ── Unavailable badge ── */}
          {!isAvailable && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold
                bg-red-900/60 text-red-300 border border-red-500/25 backdrop-blur-sm">
                <Lock size={8} />
                Unavailable
              </span>
            </div>
          )}

          {/* ── Slide-up CTA overlay ── */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4
            translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
              bg-[#6C47FF] hover:bg-[#7A58FF] text-white text-xs font-bold tracking-wide
              shadow-[0_0_24px_rgba(108,71,255,0.5)] transition-colors">
              {isAvailable ? 'Reserve this Book' : 'View Details'}
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* ── Metadata ── */}
        <div className="px-3 py-2.5 flex flex-col gap-1">
          {/* Title */}
          <h3 className="text-[12px] font-bold leading-snug text-white line-clamp-1
            group-hover:text-[#A78BFA] transition-colors duration-200">
            {book?.title || 'Untitled'}
          </h3>

          {/* Author */}
          <p className="text-[10px] text-[#8890B5] leading-none">
            by <span className="text-[#C5C9E0] font-medium">{book?.author || 'Unknown'}</span>
          </p>

          {/* Bottom row — price + availability */}
          <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-white/[0.05]">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[9px] text-[#F5C842] font-bold">$</span>
              <span className="text-[13px] font-extrabold text-white tracking-tight">
                {book?.price ? book.price.toFixed(2) : '0.00'}
              </span>
            </div>

            {/* Availability dot */}
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className={`text-[9px] font-semibold ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                {isAvailable ? 'Available' : 'Checked Out'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}