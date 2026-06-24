'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Play,
  BookMarked,
  Truck,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

// Swiper React components and modules imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const features = [
  {
    icon: BookMarked,
    title: 'Wide Collection',
    sub: 'Thousands of curated books',
  },
  { icon: Truck, title: 'Priority Dispatch', sub: 'Quick, tracked & reliable' },
  {
    icon: ShieldCheck,
    title: 'Premium Security',
    sub: '100% white-glove handling',
  },
  {
    icon: Headphones,
    title: '24/7 Concierge',
    sub: 'Dedicated VIP assistance',
  },
];

export default function Banner() {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#030712] border-b border-white/5"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      {/* Ambient Premium Lighting Setup */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(17,24,39,1)_0%,rgba(3,7,18,1)_75%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Dot Grid */}
      <div
        className="absolute top-8 right-8 w-32 h-32 opacity-[0.05] pointer-events-none hidden lg:block"
        style={{
          backgroundImage:
            'radial-gradient(circle, #fff 1.2px, transparent 1.2px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start lg:items-center min-h-[calc(100vh-200px)]">
          {/* ===== LEFT COLUMN: Content ===== */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0 w-full mt-4 sm:mt-0"
            style={{ y: mounted ? yText : 0, opacity: mounted ? opacText : 1 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-3 sm:mb-4 lg:mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 sm:px-4 py-1 sm:py-1.5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[8px] sm:text-[10px] lg:text-xs font-semibold uppercase tracking-widest text-amber-400/90 whitespace-nowrap">
                Premium Literary Dispatch
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-3 sm:mb-4 lg:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] sm:leading-[1.2]"
            >
              Your Favorite Books,
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Delivered Luxury
              </span>{' '}
              to You.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-5 sm:mb-6 lg:mb-8 text-xs sm:text-sm lg:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0 px-3 sm:px-0"
            >
              From rare collector editions to timeless contemporary fiction —
              discover, borrow, and experience doorstep delivery tailored with
              perfection via{' '}
              <span className="text-amber-400 font-semibold shadow-sm">
                BiblioDrop
              </span>
              .
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full px-3 sm:px-0"
            >
              <Link
                href="/browsebooks"
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-7 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold tracking-wide shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.35)] hover:scale-[1.01] transition-all duration-300 text-xs sm:text-sm lg:text-base"
              >
                Explore Collection
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/how-it-works"
                className="group flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold tracking-wide backdrop-blur-md hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 text-xs sm:text-sm lg:text-base"
              >
                <span className="w-5 h-5 sm:w-5 lg:w-6 sm:h-5 lg:h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play
                    size={7}
                    className="text-white fill-white translate-x-[0.5px]"
                  />
                </span>
                Experience Journey
              </Link>
            </motion.div>
          </motion.div>

          {/* ===== RIGHT COLUMN: Swiper ===== */}
          <motion.div
            className="lg:col-span-5 relative w-full h-60 sm:h-72 md:h-80 lg:h-130 flex items-center justify-center mt-4 sm:mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-amber-500/10 blur-3xl rounded-3xl pointer-events-none" />

            <div className="relative w-full h-full max-w-xs sm:max-w-md lg:max-w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group bg-slate-900 select-none">
              {mounted ? (
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect={'fade'}
                  fadeEffect={{ crossFade: true }}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  className="w-full h-full"
                >
                  {[
                    'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=600&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=600&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1517148892120-4d2da39c8dc1?w=600&auto=format&fit=crop&q=60',
                  ].map((src, index) => (
                    <SwiperSlide key={index} className="w-full h-full relative">
                      <Image
                        src={src}
                        alt={`Aesthetic Luxury Library Collection ${index + 1}`}
                        fill
                        className="object-cover filter brightness-[0.85] contrast-[1.03] scale-100 group-hover:scale-[1.02] transition-transform duration-4000 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="w-full h-full bg-slate-950 animate-pulse" />
              )}

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-black/20 pointer-events-none z-10" />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030712]/40 to-transparent pointer-events-none z-10" />

              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6 p-2.5 sm:p-3 lg:p-5 rounded-xl border border-white/10 bg-slate-950/70 backdrop-blur-md opacity-90 shadow-xl pointer-events-none z-10">
                <p className="text-[7px] sm:text-[8px] lg:text-xs font-bold text-amber-400 tracking-wider uppercase mb-0.5 sm:mb-1">
                  Curated Spaces
                </p>
                <p className="text-[8px] sm:text-[10px] lg:text-sm font-medium text-slate-200 leading-snug line-clamp-2">
                  Immerse yourself into premium authentic layouts and premium
                  rare collections.
                </p>
              </div>
            </div>

            {/* ✅ Floating Dispatch Badge - Half inside, Half outside */}
            <motion.div
              className="absolute -bottom-4 lg:-bottom-5 right-2 sm:right-4 lg:-right-3 z-20 flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-slate-950 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9)] backdrop-blur-md hidden lg:flex"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}
            >
              <div className="mb-0.5 sm:mb-1 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center shadow-md">
                <Truck size={10} className="text-slate-950" strokeWidth={2.5} />
              </div>
              <p className="text-[6px] sm:text-[7px] lg:text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                Express
              </p>
              <p className="text-[8px] sm:text-[9px] lg:text-[11px] font-black text-amber-400">
                24–48 Hrs
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== BOTTOM FEATURE BAR ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-white/5 bg-gradient-to-r from-white/1 to-white/3 backdrop-blur-xl overflow-hidden divide-y sm:divide-y-0 lg:divide-x divide-white/5"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 hover:bg-white/1 transition-colors duration-300"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-indigo-400" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] lg:text-sm font-semibold text-white tracking-wide line-clamp-1">
                    {f.title}
                  </p>
                  <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {f.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
