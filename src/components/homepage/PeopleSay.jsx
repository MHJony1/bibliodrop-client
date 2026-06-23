'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Star, MessageSquareQuote, Sparkles, Award } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Michael Foster',
    role: 'Graduate Student',
    comment:
      'BiblioDrop changed how I read. I can now access rare editions from libraries across the city without leaving home. Absolutely brilliant service!',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 2,
    name: 'Amanda Lee',
    role: 'Head Librarian',
    comment:
      'As a librarian, BiblioDrop expanded our reach tremendously. We now serve passionate readers who could never visit our physical location.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Park',
    role: 'Avid Reader',
    comment:
      'The delivery is always on time, and the book condition is museum-grade. The verified review system helps me pick the right books every single time.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sophia Martinez',
    role: 'Research Scholar',
    comment:
      'Finding specific reference papers and archival journals used to take weeks. With this premium network, it is now a matter of hours. Impeccable workflow.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 5,
    name: 'Liam Henderson',
    role: 'Collector',
    comment:
      'The white-glove packaging is what sets them apart. Every single luxury edition arrives in pristine, untouched condition. Highly recommended for book collectors.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 6,
    name: 'Elena Rostova',
    role: 'Literature Professor',
    comment:
      'A magnificent bridge between institutional repositories and contemporary readers. The UI is incredibly polished and the authentication is entirely flawless.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 7,
    name: 'Marcus Vance',
    role: 'Historical Novelist',
    comment:
      'The curated discovery engine suggested obscure text frameworks that directly shaped my latest chapter. An absolute goldmine for creative minds.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 8,
    name: 'Clara Tremblay',
    role: 'Bibliophile',
    comment:
      'Frictionless micro-transactions paired with real-time tracking systems. I have replaced standard storefronts with this elite network permanently.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 9,
    name: 'Jonathan Wu',
    role: 'Tech Entrepreneur',
    comment:
      'Pure architectural bliss on the web. The performance is incredibly fluid, making premium book curation feel like a true luxury digital experience.',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 10,
    name: 'Zara Sterling',
    role: 'Editorial Director',
    comment:
      'Meticulous logistics meets literary passion. The speed of execution and the verified elite providers make this platform an absolute masterpiece.',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150&auto=format&fit=crop',
    rating: 5,
  },
];

const firstRow = testimonials.slice(0, 5);
const secondRow = testimonials.slice(5, 10);

function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      viewport={{ once: true }}
      className="w-[340px] sm:w-[380px] shrink-0 relative overflow-hidden rounded-xl border border-white/[0.04] bg-gradient-to-br from-[#070a24]/50 to-[#0b0f35]/30 backdrop-blur-md p-5 transition-all duration-400 hover:border-white/[0.08] hover:bg-[#0b0f35]/50 group mx-2.5 shadow-[0_2px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.04)]"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-20 -right-20 w-28 h-28 bg-violet-500/6 rounded-full blur-2xl group-hover:bg-violet-500/12 transition-all duration-700" />
      <div className="absolute -bottom-20 -left-20 w-28 h-28 bg-amber-500/4 rounded-full blur-2xl group-hover:bg-amber-500/8 transition-all duration-700" />

      {/* Quote Icon */}
      <div className="absolute top-2 right-4 text-white/[0.01] group-hover:text-amber-400/[0.03] transition-colors duration-500 pointer-events-none">
        <MessageSquareQuote size={56} />
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-0.5 mb-2.5 relative z-10">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
        ))}
        <span className="ml-1.5 text-[9px] text-amber-400/40 font-medium">
          5.0
        </span>
      </div>

      {/* Review Text */}
      <p className="text-[11px] sm:text-xs text-slate-300/90 leading-relaxed font-medium mb-4 min-h-[56px] line-clamp-3 group-hover:text-white/90 transition-colors duration-300 relative z-10">
        &quot;{review.comment}&quot;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-2.5 border-t border-white/[0.02] pt-3 relative z-10">
        <div className="relative h-9 w-9 overflow-hidden rounded-full p-[1.5px] bg-gradient-to-br from-violet-500/20 to-amber-500/20">
          <Image
            src={review.image}
            alt={review.name}
            width={36}
            height={36}
            className="h-full w-full object-cover rounded-full grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
            unoptimized
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500/80 border border-[#070a24] flex items-center justify-center">
            <Award size={6} className="text-white" />
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white/80 tracking-wide group-hover:text-amber-400 transition-colors duration-300">
            {review.name}
          </h4>
          <p className="text-[9px] font-medium text-slate-500/70 tracking-wide">
            {review.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PeopleSay() {
  const containerRef = useRef(null);
  const isHeaderInView = useInView(containerRef, {
    once: true,
    margin: '-80px',
  });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020410] py-14 lg:py-20 border-y border-white/[0.01]"
    >
      {/* Background Glow - Very Subtle */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.02)_0%,transparent_70%)]" />

      {/* Dot Pattern - Very Subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.005]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Main Container - Max Width 1320px */}
      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center flex flex-col items-center"
        >
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-amber-500/12 bg-amber-500/[0.015] px-3 py-0.5 backdrop-blur-md">
            <Sparkles size={10} className="text-amber-400/70" />
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-amber-400/70">
              Testimonials
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Readers
            </span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400/70 max-w-xl mx-auto font-medium leading-relaxed">
            Don&apos;t just take our word for it — hear from our thriving
            international literary community.
          </p>
        </motion.div>

        {/* ===== MARQUEE WITH LIGHT SHADOW ===== */}
        <div className="relative">
          {/* Left Shadow - Light */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-[#020410] via-[#020410]/70 to-transparent pointer-events-none" />

          {/* Right Shadow - Light */}
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-[#020410] via-[#020410]/70 to-transparent pointer-events-none" />

          {/* Top Shadow - Very Light */}
          <div className="absolute top-0 left-0 right-0 h-4 z-10 bg-gradient-to-b from-[#020410] to-transparent pointer-events-none" />

          {/* Bottom Shadow - Very Light */}
          <div className="absolute bottom-0 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[#020410] to-transparent pointer-events-none" />

          {/* ===== MARQUEE ROWS ===== */}
          <div className="flex flex-col gap-4 overflow-hidden py-1.5 relative">
            {/* Row 1: Left to Right */}
            <div className="flex w-max group/row1">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{
                  ease: 'linear',
                  duration: 38,
                  repeat: Infinity,
                }}
                className="flex w-max"
                whileHover={{ animationPlayState: 'paused' }}
              >
                {[...firstRow, ...firstRow, ...firstRow].map((review, i) => (
                  <ReviewCard
                    key={`r1-${review.id}-${i}`}
                    review={review}
                    index={i}
                  />
                ))}
              </motion.div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="flex w-max group/row2">
              <motion.div
                animate={{ x: [-1000, 0] }}
                transition={{
                  ease: 'linear',
                  duration: 40,
                  repeat: Infinity,
                }}
                className="flex w-max"
                whileHover={{ animationPlayState: 'paused' }}
              >
                {[...secondRow, ...secondRow, ...secondRow].map((review, i) => (
                  <ReviewCard
                    key={`r2-${review.id}-${i}`}
                    review={review}
                    index={i}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM STATS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-center"
        >
          <div>
            <p className="text-xl font-bold text-white">10+</p>
            <p className="text-[9px] text-slate-500/60 font-medium tracking-wide">
              Verified Reviews
            </p>
          </div>
          <div className="w-px h-5 bg-white/[0.03]" />
          <div>
            <p className="text-xl font-bold text-amber-400">5.0</p>
            <p className="text-[9px] text-slate-500/60 font-medium tracking-wide">
              Avg Rating
            </p>
          </div>
          <div className="w-px h-5 bg-white/[0.03]" />
          <div>
            <p className="text-xl font-bold text-white">100%</p>
            <p className="text-[9px] text-slate-500/60 font-medium tracking-wide">
              Satisfaction
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
