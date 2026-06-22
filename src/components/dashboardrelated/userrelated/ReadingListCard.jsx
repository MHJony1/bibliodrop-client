'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReadingListCard({ book, index = 0 }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const bookId = book?.bookId || book?._id;
  const bookLink = bookId ? `/browsebooks/${bookId}` : '#';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: (index % 6) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl bg-[#0D1033]/60 border border-white/[0.06] overflow-hidden hover:border-[#6D4AFF]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(109,74,255,0.1)]"
    >
      <Link href={bookLink} className="block">
        {/* Cover Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0E1330]">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.bookTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#6D4AFF]/10 to-[#4A2FE8]/10">
              <BookOpen size={40} className="text-[#6D4AFF]/30" />
            </div>
          )}
          
          {/* Read Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1.5">
              <BookOpen size={10} />
              Read
            </span>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B1E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover CTA */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#6D4AFF] hover:bg-[#7A58FF] text-white text-xs font-bold shadow-[0_0_24px_rgba(108,71,255,0.3)] transition-colors">
              View Details
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
            {book.bookTitle}
          </h3>
          
          <p className="text-xs text-[#8890B5] line-clamp-1 flex items-center gap-1">
            <User size={12} />
            {book.author || 'Unknown'}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#8890B5]">
              <Calendar size={11} />
              {formatDate(book.dateRead)}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6D4AFF]/10 text-[#A78BFA] border border-[#6D4AFF]/20">
              {book.category || 'General'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}