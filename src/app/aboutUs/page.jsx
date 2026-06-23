'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Truck,
  ShieldCheck,
  Sparkles,
  Compass,
  Layers,
} from 'lucide-react';

export default function AboutUsPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const coreFeatures = [
    {
      icon: <Truck className="text-[#6D4AFF]" size={28} />,
      title: 'Doorstep Delivery',
      desc: 'No more long queues or traffic. We bring your favorite physical books straight to your home with elite-tier packaging.',
    },
    {
      icon: <Layers className="text-[#8B5CF6]" size={28} />,
      title: 'Curated Collections',
      desc: 'From rare academic gems to trending global bestsellers, our inventory is meticulously filtered for true bibliophiles.',
    },
    {
      icon: <ShieldCheck className="text-[#F7B500]" size={28} />,
      title: 'Premium Quality',
      desc: 'Every book undergoes a strict quality check. We ensure pristine pages, original prints, and flawless delivery conditions.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Books Delivered' },
    { value: '12K+', label: 'Happy Readers' },
    { value: '99.4%', label: 'Satisfaction Rate' },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#05081F] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Background Decorative Glows */}
        <div className="absolute top-1/4 left-1/10 w-[400px] h-[400px] bg-[#6D4AFF]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1140px] mx-auto relative z-10">
          {/* HERO SECTION */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-wide text-[#8B5CF6] mb-5 shadow-[0_0_20px_rgba(109,74,255,0.15)]">
              <Sparkles size={14} className="text-[#F7B500]" />
              Discover Our Story
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight m-0">
              Redefining the Way You <br />
              <span className="bg-gradient-to-r from-[#6D4AFF] via-[#8B5CF6] to-[#FFD04D] bg-clip-text text-transparent">
                Access Knowledge
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#B8B8C5] mt-6 leading-relaxed">
              At <span className="text-white font-semibold">BiblioDrop</span>,
              we believe that books are placeholders for identity, portals to
              new worlds, and tools for raw growth. Our mission is to bridge the
              gap between world-class literature and your reading desk
              effortlessly.
            </p>
          </motion.div>

          {/* IDENTITY & VISION SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
            {/* Left Column - Premium Box */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(109,74,255,0.4)]">
                  <Compass size={20} className="text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight m-0">
                  Our Core Vision
                </h2>
              </div>

              <p className="text-[#B8B8C5] leading-relaxed m-0">
                Founded with a passion for continuous learning and modern
                efficiency, BiblioDrop transforms traditional book purchasing
                into a luxury, personalized experience. We aren&apos;t just an
                e-commerce platform; we are a dedicated tech-ecosystem built for
                passionate readers, busy students, and lifelong researchers.
              </p>

              <p className="text-[#B8B8C5] leading-relaxed m-0">
                By combining robust logistics with an ultra-smooth dashboard, we
                ensure that the physical weight of a book is the only heavy
                lifting you ever have to experience.
              </p>

              {/* Statistics Row */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="border-l-2 border-[#6D4AFF] pl-4">
                    <p className="text-2xl sm:text-3xl font-extrabold text-white m-0 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-[#B8B8C5] m-0 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Luxury Visual Card with Premium Image Background */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:col-span-5 relative"
            >
              <div className="w-full aspect-[4/3] sm:aspect-square rounded-3xl border border-white/10 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                {/* Unsplash Premium Dark Book/Library Image */}
                <Image
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop"
                  alt="Premium Library"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.85]"
                />

                {/* Luxury Dark Gradient Overlay for perfect text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05081F] via-[#05081F]/70 to-[#6D4AFF]/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05081F]/40 to-[#05081F]" />

                {/* Decorative inner blur light */}
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#6D4AFF]/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                {/* Card Content Wrapper */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  {/* Top Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#6D4AFF]/20 backdrop-blur-md border border-[#6D4AFF]/30 flex items-center justify-center text-white shadow-[0_0_20px_rgba(109,74,255,0.25)]">
                    <BookOpen size={26} />
                  </div>

                  {/* Bottom Quote */}
                  <div className="backdrop-blur-[2px] p-2 rounded-xl bg-black/5">
                    <blockquote className="text-xl font-medium italic text-gray-100 leading-relaxed m-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      &quot;A room without books is like a body without a
                      soul.&quot;
                    </blockquote>
                    <p className="text-sm font-bold text-[#F7B500] mt-4 mb-0 uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                      — Marcus Tullius Cicero
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* WHY CHOOSE US - FEATURES SECTION */}
          <div className="border-t border-white/5 pt-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center max-w-xl mx-auto mb-14"
            >
              <h2 className="text-3xl font-bold tracking-tight m-0">
                Why Readers Choose BiblioDrop
              </h2>
              <p className="text-sm text-[#B8B8C5] mt-3">
                Crafting an unparalleled ecosystem for your next literary
                journey.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {coreFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeIn}
                  className="p-6 rounded-2xl border border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white m-0 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#B8B8C5] mt-2.5 leading-relaxed m-0">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
