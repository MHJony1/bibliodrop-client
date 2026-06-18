'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, BookOpen, Truck, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    icon: Users,
    display: '10K+',
    value: 10000,
    suffix: '+',
    label: 'Happy Readers',
    desc: 'Avid readers trust BiblioDrop',
    color: '#6D4AFF',
    glowColor: 'rgba(109,74,255,0.15)',
    borderGlow: 'group-hover:border-[#6D4AFF]/40',
  },
  {
    icon: BookOpen,
    display: '25K+',
    value: 25000,
    suffix: '+',
    label: 'Books Available',
    desc: 'Titles across every genre',
    color: '#F7B500',
    glowColor: 'rgba(247,181,0,0.12)',
    borderGlow: 'group-hover:border-[#F7B500]/40',
  },
  {
    icon: Truck,
    display: '5K+',
    value: 5000,
    suffix: '+',
    label: 'Orders Delivered',
    desc: 'Shipped to doorsteps with care',
    color: '#22C55E',
    glowColor: 'rgba(34,197,94,0.12)',
    borderGlow: 'group-hover:border-[#22C55E]/40',
  },
  {
    icon: Heart,
    display: '98%',
    value: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    desc: '5-star luxury experience guaranteed',
    color: '#F43F5E',
    glowColor: 'rgba(244,63,94,0.15)',
    borderGlow: 'group-hover:border-[#F43F5E]/40',
  },
];

// কাউন্ট-আপ হুক (Ease Out Cubic)
function useCountUp(target, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);
  return count;
}

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCountUp(stat.value, 2000, inView);
  const Icon = stat.icon;

  const formatted = () => {
    if (stat.value >= 10000) return `${Math.floor(count / 1000)}K`;
    return count.toString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-[#090D2E]/40 backdrop-blur-md p-6 sm:p-7 transition-all duration-500 ${stat.borderGlow} hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]`}
    >
      {/* কার্ডের ভেতরে প্রিমিয়াম রেডিয়াল ব্যাকগ্রাউন্ড লাইটিং */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-750 pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 10%, ${stat.glowColor}, transparent 70%)`,
        }}
      />

      {/* টপ সক্ষ্ম লাইটিং লাইন */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-75 group-hover:scale-x-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
        }}
      />

      <div className="relative z-10">
        {/* আইকন বক্স */}
        <div
          className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06] transition-all duration-300 group-hover:scale-105"
          style={{ borderColor: `${stat.color}30` }}
        >
          <Icon size={20} style={{ color: stat.color }} strokeWidth={2} />
        </div>

        {/* কাউন্টিং নাম্বার */}
        <div
          className="mb-2 text-4xl sm:text-5xl font-black tracking-tight select-none"
          style={{ color: stat.color }}
        >
          {inView ? `${formatted()}${stat.suffix}` : stat.display}
        </div>

        {/* লেবেল ও ডেসক্রিপশন */}
        <p className="mb-1.5 text-sm font-bold text-white tracking-wide">
          {stat.label}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {stat.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#030712] py-20 lg:py-28 border-b border-white/[0.02]"
    >
      {/* প্রিমিয়াম ব্যাকগ্রাউন্ড গ্লো লেয়ার */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.04),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#6D4AFF]/[0.03] rounded-full blur-[130px]" />

      {/* এলিগ্যান্ট ডট-গ্রিড টেক্সচার */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #fff 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.05] px-4 py-1.5 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/90">
              By the Numbers
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Trusted by Readers{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Nationwide
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-medium">
            Real metrics from real book collectors. Excellence delivered
            straight to your doorstep.
          </p>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* PREMIUM CTA STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-white/[0.03] p-6 sm:p-8 backdrop-blur-xl sm:flex-row group"
        >
          <div className="text-center sm:text-left">
            <p className="text-base font-bold text-white tracking-wide">
              Join thousands of book lovers
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Start your premium reading journey today — first white-glove
              delivery is free.
            </p>
          </div>

          <Link
            href="/register"
            className="group/btn flex items-center justify-center gap-2 shrink-0 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.15)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.3)] hover:scale-[1.01] transition-all duration-300 w-full sm:w-auto"
          >
            Get Started Free
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
