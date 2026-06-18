"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Michael Foster",
    role: "Graduate Student",
    comment: "BiblioDrop changed how I read. I can now access rare editions from libraries across the city without leaving home. Absolutely brilliant service!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Amanda Lee",
    role: "Head Librarian",
    comment: "As a librarian, BiblioDrop expanded our reach tremendously. We now serve passionate readers who could never visit our physical location.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "David Park",
    role: "Avid Reader",
    comment: "The delivery is always on time, and the book condition is museum-grade. The verified review system helps me pick the right books every single time.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Research Scholar",
    comment: "Finding specific reference papers and archival journals used to take weeks. With this premium network, it is now a matter of hours. Impeccable workflow.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 5,
    name: "Liam Henderson",
    role: "Collector",
    comment: "The white-glove packaging is what sets them apart. Every single luxury edition arrives in pristine, untouched condition. Highly recommended for book collectors.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 6,
    name: "Elena Rostova",
    role: "Literature Professor",
    comment: "A magnificent bridge between institutional repositories and contemporary readers. The UI is incredibly polished and the authentication is entirely flawless.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 7,
    name: "Marcus Vance",
    role: "Historical Novelist",
    comment: "The curated discovery engine suggested obscure text frameworks that directly shaped my latest chapter. An absolute goldmine for creative minds.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 8,
    name: "Clara Tremblay",
    role: "Bibliophile",
    comment: "Frictionless micro-transactions paired with real-time tracking systems. I have replaced standard storefronts with this elite network permanently.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 9,
    name: "Jonathan Wu",
    role: "Tech Entrepreneur",
    comment: "Pure architectural bliss on the web. The performance is incredibly fluid, making premium book curation feel like a true luxury digital experience.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 10,
    name: "Zara Sterling",
    role: "Editorial Director",
    comment: "Meticulous logistics meets literary passion. The speed of execution and the verified elite providers make this platform an absolute masterpiece.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
];

// Split data for parallel rows to look dynamic
const firstRow = testimonials.slice(0, 5);
const secondRow = testimonials.slice(5, 10);

function ReviewCard({ review }) {
  return (
    <div className="w-[380px] sm:w-[420px] shrink-0 relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#070a24]/40 backdrop-blur-2xl p-6 transition-all duration-500 hover:border-white/[0.12] hover:bg-[#0b0f35]/50 group mx-3">
      {/* Absolute Decorative Subtle Quote Icon */}
      <div className="absolute top-4 right-6 text-white/[0.02] group-hover:text-amber-400/[0.04] transition-colors duration-500 pointer-events-none">
        <MessageSquareQuote size={80} />
      </div>

      {/* Five Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mb-6 min-h-[72px] line-clamp-3 group-hover:text-white transition-colors duration-300">
        &quot;{review.comment}&quot;
      </p>

      {/* User Info Line */}
      <div className="flex items-center gap-3 border-t border-white/[0.04] pt-4">
        <div className="h-10 w-10 overflow-hidden rounded-full p-[1px] bg-gradient-to-b from-white/[0.15] to-transparent">
          <img
            src={review.image}
            alt={review.name}
            className="h-full w-full object-cover rounded-full grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors duration-300">
            {review.name}
          </h4>
          <p className="text-[11px] font-medium text-slate-500">
            {review.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PeopleSay() {
  const containerRef = useRef(null);
  const isHeaderInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020410] py-24 lg:py-32 border-b border-white/[0.01]"
    >
      {/* Background Deep Light System */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-[300px] h-[300px] bg-amber-500/[0.01] rounded-full blur-[100px]" />

      {/* Subtle Dot Matrix Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center flex flex-col items-center px-4"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.03] px-4 py-1.5 backdrop-blur-md">
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/90">
              What People Say
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Readers
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Don&apos;t just take our word for it — hear from our thriving international literary community.
          </p>
        </motion.div>

        {/* INFINITE MARQUEE STREAM */}
        <div className="flex flex-col gap-6 overflow-hidden py-4 mask-gradient-x relative select-none">
          
          {/* Row 1: Moving Left */}
          <div className="flex w-max group/row1">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{
                ease: "linear",
                duration: 35,
                repeat: Infinity,
              }}
              className="flex w-max"
              // Pause loop on hover for high luxury readability
              style={{ animationPlayState: "running" }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {/* Double arrays seamlessly for absolute endless loop illusion */}
              {[...firstRow, ...firstRow].map((review, i) => (
                <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
              ))}
            </motion.div>
          </div>

          {/* Row 2: Moving Right */}
          <div className="flex w-max group/row2">
            <motion.div
              animate={{ x: [-1000, 0] }}
              transition={{
                ease: "linear",
                duration: 38,
                repeat: Infinity,
              }}
              className="flex w-max"
            >
              {[...secondRow, ...secondRow].map((review, i) => (
                <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}