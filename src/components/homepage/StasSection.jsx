// 'use client';

// import { useRef, useEffect, useState } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { Users, BookOpen, Truck, Heart } from 'lucide-react';

// const stats = [
//   {
//     icon: Users,
//     value: 10000,
//     suffix: '+',
//     display: '10K+',
//     label: 'Happy Readers',
//     description: 'Avid readers trust BiblioDrop',
//     color: '#6D4AFF',
//     gradient: 'from-[#6D4AFF]/20 to-[#6D4AFF]/5',
//     glow: 'rgba(109,74,255,0.3)',
//   },
//   {
//     icon: BookOpen,
//     value: 25000,
//     suffix: '+',
//     display: '25K+',
//     label: 'Books Available',
//     description: 'Titles across every genre',
//     color: '#F7B500',
//     gradient: 'from-[#F7B500]/20 to-[#F7B500]/5',
//     glow: 'rgba(247,181,0,0.3)',
//   },
//   {
//     icon: Truck,
//     value: 5000,
//     suffix: '+',
//     display: '5K+',
//     label: 'Orders Delivered',
//     description: 'Shipped to doorsteps',
//     color: '#22C55E',
//     gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
//     glow: 'rgba(34,197,94,0.3)',
//   },
//   {
//     icon: Heart,
//     value: 98,
//     suffix: '%',
//     display: '98%',
//     label: 'Satisfaction Rate',
//     description: '5-star experience guaranteed',
//     color: '#F43F5E',
//     gradient: 'from-[#F43F5E]/20 to-[#F43F5E]/5',
//     glow: 'rgba(244,63,94,0.3)',
//   },
// ];

// function useCountUp(target, duration = 2000, enabled = false) {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (!enabled) return;
//     let start = null;
//     const step = (timestamp) => {
//       if (!start) start = timestamp;
//       const progress = Math.min((timestamp - start) / duration, 1);
//       // Ease out cubic
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.floor(eased * target));
//       if (progress < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   }, [target, duration, enabled]);

//   return count;
// }

// function StatCard({ stat, index }) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, margin: '-60px' });
//   const Icon = stat.icon;

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 32 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{
//         duration: 0.6,
//         delay: index * 0.1,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-500 hover:border-white/14 hover:bg-white/[0.05]"
//     >
//       {/* Hover glow */}
//       <div
//         className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
//         style={{
//           background: `radial-gradient(circle at 50% 0%, ${stat.glow}, transparent 60%)`,
//         }}
//       />

//       {/* Top accent line */}
//       <div
//         className="absolute left-6 right-6 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
//         style={{
//           background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
//         }}
//       />

//       <div className="relative">
//         {/* Icon */}
//         <div
//           className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} transition-shadow duration-300 group-hover:shadow-[0_0_20px_var(--icon-glow)]`}
//           style={{ '--icon-glow': stat.glow }}
//         >
//           <Icon
//             className="h-6 w-6"
//             style={{ color: stat.color }}
//             strokeWidth={1.75}
//           />
//         </div>

//         {/* Stat number */}
//         <div className="mb-1 flex items-baseline gap-0.5">
//           <CountUpNumber
//             target={stat.value}
//             display={stat.display}
//             suffix={stat.suffix}
//             enabled={inView}
//             color={stat.color}
//           />
//         </div>

//         <p className="mb-1 text-sm font-semibold text-white">{stat.label}</p>
//         <p className="text-xs text-[#B8B8C5]">{stat.description}</p>
//       </div>
//     </motion.div>
//   );
// }

// function CountUpNumber({ target, display, suffix, enabled, color }) {
//   const count = useCountUp(target, 2200, enabled);

//   const formatted = () => {
//     if (target >= 10000) return `${Math.floor(count / 1000)}K`;
//     return count.toString();
//   };

//   return (
//     <span
//       className="text-4xl font-extrabold tracking-tight lg:text-5xl"
//       style={{ color }}
//     >
//       {enabled ? `${formatted()}${suffix}` : display}
//     </span>
//   );
// }

// export default function StatsSection() {
//   const sectionRef = useRef(null);
//   const titleInView = useInView(sectionRef, { once: true, margin: '-80px' });

//   return (
//     <section
//       ref={sectionRef}
//       className="relative overflow-hidden bg-[#05081F] py-20 lg:py-28"
//     >
//       {/* Background decoration */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(109,74,255,0.08),transparent)]" />
//       <div
//         className="absolute inset-0 opacity-[0.018]"
//         style={{
//           backgroundImage:
//             'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
//           backgroundSize: '64px 64px',
//         }}
//       />

//       <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Section header */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={titleInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="mb-14 text-center"
//         >
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6D4AFF]/20 bg-[#6D4AFF]/10 px-4 py-1.5">
//             <div className="h-1.5 w-1.5 rounded-full bg-[#6D4AFF] animate-pulse" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-[#6D4AFF]">
//               By the Numbers
//             </span>
//           </div>
//           <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
//             Trusted by readers{' '}
//             <span className="bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] bg-clip-text text-transparent">
//               nationwide
//             </span>
//           </h2>
//           <p className="mt-3 text-base text-[#B8B8C5]">
//             Numbers that speak louder than marketing copy ever could.
//           </p>
//         </motion.div>

//         {/* Stats grid */}
//         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//           {stats.map((stat, i) => (
//             <StatCard key={stat.label} stat={stat} index={i} />
//           ))}
//         </div>

//         {/* Bottom CTA strip */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={titleInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6, delay: 0.5 }}
//           className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/8 bg-white/[0.03] px-8 py-6 backdrop-blur-sm sm:flex-row"
//         >
//           <div>
//             <p className="text-sm font-semibold text-white">
//               Join thousands of book lovers
//             </p>
//             <p className="text-xs text-[#B8B8C5]">
//               Start your reading journey today — first delivery free.
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20 sm:hidden" />
//             <a
//               href="/register"
//               className="shrink-0 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(109,74,255,0.35)] transition-all hover:shadow-[0_0_32px_rgba(109,74,255,0.5)] hover:scale-[1.02]"
//             >
//               Get Started Free →
//             </a>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }







"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Truck, Heart } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Users,    display: "10K+", value: 10000, suffix: "+", label: "Happy Readers",    desc: "Avid readers trust BiblioDrop", color: "text-[#6D4AFF]", iconBg: "bg-[#6D4AFF]/15", glow: "group-hover:shadow-[0_0_20px_rgba(109,74,255,0.35)]", top: "group-hover:bg-[linear-gradient(90deg,transparent,#6D4AFF,transparent)]" },
  { icon: BookOpen, display: "25K+", value: 25000, suffix: "+", label: "Books Available",  desc: "Titles across every genre",      color: "text-[#F7B500]", iconBg: "bg-[#F7B500]/15", glow: "group-hover:shadow-[0_0_20px_rgba(247,181,0,0.35)]",  top: "group-hover:bg-[linear-gradient(90deg,transparent,#F7B500,transparent)]" },
  { icon: Truck,    display: "5K+",  value: 5000,  suffix: "+", label: "Orders Delivered", desc: "Shipped to doorsteps",           color: "text-[#22C55E]", iconBg: "bg-[#22C55E]/15", glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]",  top: "group-hover:bg-[linear-gradient(90deg,transparent,#22C55E,transparent)]" },
  { icon: Heart,    display: "98%",  value: 98,    suffix: "%", label: "Satisfaction Rate",desc: "5-star experience guaranteed",   color: "text-[#F43F5E]", iconBg: "bg-[#F43F5E]/15", glow: "group-hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]",  top: "group-hover:bg-[linear-gradient(90deg,transparent,#F43F5E,transparent)]" },
];

function useCountUp(target, duration = 2200, enabled = false) {
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(stat.value, 2200, inView);
  const Icon = stat.icon;

  const formatted = () => {
    if (stat.value >= 10000) return `${Math.floor(count / 1000)}K`;
    return count.toString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-500 hover:border-white/14 hover:bg-white/[0.05]"
    >
      {/* top accent line */}
      <div className={`absolute left-6 right-6 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${stat.top}`} />

      {/* Icon */}
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} transition-shadow duration-300 ${stat.glow}`}>
        <Icon size={22} className={stat.color} strokeWidth={1.75} />
      </div>

      {/* Count */}
      <div className={`mb-1 text-5xl font-extrabold tracking-tight ${stat.color}`}>
        {inView ? `${formatted()}${stat.suffix}` : stat.display}
      </div>

      <p className="mb-1 text-sm font-semibold text-white">{stat.label}</p>
      <p className="text-xs text-[#B8B8C5]">{stat.desc}</p>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#05081F] py-20 lg:py-28">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(109,74,255,0.08),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6D4AFF]/20 bg-[#6D4AFF]/10 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#6D4AFF] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6D4AFF]">
              By the Numbers
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            Trusted by readers{" "}
            <span className="bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] bg-clip-text text-transparent">
              nationwide
            </span>
          </h2>
          <p className="mt-3 text-base text-[#B8B8C5]">
            Numbers that speak louder than marketing copy ever could.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/8 bg-white/[0.03] px-8 py-6 sm:flex-row"
        >
          <div>
            <p className="text-sm font-semibold text-white">Join thousands of book lovers</p>
            <p className="text-xs text-[#B8B8C5]">Start your reading journey today — first delivery free.</p>
          </div>
          <Link
            href="/register"
            className="shrink-0 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(109,74,255,0.35)] hover:shadow-[0_0_32px_rgba(109,74,255,0.5)] hover:scale-[1.02] transition-all duration-250 no-underline"
          >
            Get Started Free →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}