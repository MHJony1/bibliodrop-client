'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookCard({ book, index = 0 }) {
  const isAvailable = book?.status === 'available';
  const bookId = book?._id?.toString() || book?._id;

  const categoryColors = {
    romance: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-300',
      border: 'border-rose-500/20',
    },
    academic: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-300',
      border: 'border-blue-500/20',
    },
    biography: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/20',
    },
    fiction: {
      bg: 'bg-violet-500/15',
      text: 'text-violet-300',
      border: 'border-violet-500/20',
    },
    science: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/20',
    },
    history: {
      bg: 'bg-orange-500/15',
      text: 'text-orange-300',
      border: 'border-orange-500/20',
    },
  };

  const catKey = (book?.category || '').toLowerCase();
  const catStyle = categoryColors[catKey] || {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/browsebooks/${bookId}`}
        className="block group outline-none focus-visible:ring-2 focus-visible:ring-[#6C47FF] rounded-2xl"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden flex flex-col h-full bg-[#0D1033] border border-white/[0.07] hover:border-[#6C47FF]/50 hover:shadow-[0_0_40px_-8px_rgba(108,71,255,0.35)] transition-all duration-300 ease-out"
        >
          {/* Spine accent bar */}
          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6C47FF] via-[#9B7AFF] to-[#6C47FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-l-2xl" />

          {/* Cover Image */}
          <div className="relative w-full aspect-square overflow-hidden bg-[#080C24]">
            <Image
              src={
                book?.coverImage ||
                'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
              }
              alt={book?.title || 'Book Cover'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1033] via-[#0D1033]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Category badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.1 + 0.2, duration: 0.4 }}
              className="absolute top-3 left-3 z-10"
            >
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border backdrop-blur-sm ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
              >
                <BookOpen size={8} />
                {book?.category || 'General'}
              </span>
            </motion.div>

            {/* Unavailable badge */}
            {!isAvailable && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.1 + 0.2, duration: 0.4 }}
                className="absolute top-3 right-3 z-10"
              >
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-900/60 text-red-300 border border-red-500/25 backdrop-blur-sm">
                  <Lock size={8} />
                  Unavailable
                </span>
              </motion.div>
            )}

            {/* Desktop CTA */}
            <div className="hidden lg:block absolute inset-x-0 bottom-0 z-10 px-4 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#6C47FF] hover:bg-[#7A58FF] text-white text-xs font-bold tracking-wide shadow-[0_0_24px_rgba(108,71,255,0.5)] transition-colors">
                {isAvailable ? 'Reserve this Book' : 'View Details'}
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 4) * 0.1 + 0.3, duration: 0.4 }}
            className="px-3 py-3 flex flex-col grow justify-between gap-2"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-[12px] font-bold leading-snug text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors duration-200 m-0">
                {book?.title || 'Untitled'}
              </h3>

              <p className="text-[10px] text-[#8890B5] leading-none m-0">
                by{' '}
                <span className="text-[#C5C9E0] font-medium">
                  {book?.author || 'Unknown'}
                </span>
              </p>

              <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[9px] text-[#F5C842] font-bold">$</span>
                  <span className="text-[13px] font-extrabold text-white tracking-tight">
                    {book?.price ? book.price.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`}
                  />
                  <span
                    className={`text-[9px] font-semibold ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {isAvailable ? 'Available' : 'Checked Out'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="block lg:hidden w-full mt-2">
              <div
                className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11px] font-bold tracking-wide text-white transition-colors ${isAvailable ? 'bg-[#6C47FF] shadow-[0_4px_12px_rgba(108,71,255,0.2)]' : 'bg-white/10 border border-white/10 text-gray-400'}`}
              >
                {isAvailable ? 'Reserve Book' : 'View Details'}
                <ArrowRight
                  size={12}
                  className={isAvailable ? 'text-white' : 'text-gray-500'}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
