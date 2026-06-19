'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#05081F] overflow-hidden relative">
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-62.5 bg-[#6D4AFF]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-285 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-3xl border border-white/10 bg-linear-to-br from-[#0D1035] via-[#08092A] to-[#05081F] relative overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 group"
        >
          {/* Right Side Background Image Overlay inside the card */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full opacity-10 lg:opacity-20 pointer-events-none mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 ease-out">
            <Image
              src="https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1000&auto=format&fit=crop"
              alt="Luxury Book Minimal"
              fill
              className="object-cover"
            />
          </div>

          {/* Luxury Linear Gradient Mask for Image */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0D1035] via-[#0D1035]/90 to-transparent pointer-events-none hidden lg:block" />

          {/* LEFT CONTENT */}
          <div className="max-w-xl text-center lg:text-left relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#6D4AFF]/30 bg-[#6D4AFF]/10 text-xs font-bold tracking-wider text-[#8B5CF6] uppercase shadow-[0_0_15px_rgba(109,74,255,0.1)]">
              <Sparkles size={12} className="text-[#F7B500]" />
              Elevate Your Reading Desk
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white m-0 leading-tight">
              Ready to Start Your Next <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-[#6D4AFF] via-[#8B5CF6] to-[#FFD04D] bg-clip-text text-transparent">
                Literary Journey?
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#B8B8C5] leading-relaxed m-0">
              Unlock access to premium packaging, ultra-fast doorstep delivery,
              and a meticulously curated bookshelf tailored exactly to your
              passion.
            </p>
          </div>

          {/* RIGHT ACTION BUTTON */}
          <div className="shrink-0 relative z-10 w-full sm:w-auto flex justify-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/browsebooks"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold no-underline bg-[#F7B500] text-[#05081F] shadow-[0_4px_24px_rgba(247,181,0,0.3)] hover:bg-[#FFD04D] hover:shadow-[0_0_35px_rgba(247,181,0,0.5)] transition-all duration-300 group/btn"
              >
                <BookOpen
                  size={16}
                  className="transition-transform group-hover/btn:rotate-6 duration-300"
                />
                Explore Masterpieces
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover/btn:translate-x-1 duration-300"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
