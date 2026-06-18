"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Compass,
    title: "Curate & Discover",
    desc: "Explore our ultra-rare archival editions and contemporary luxury collections tailored exactly to your unique reading palate.",
    iconColor: "#F59E0B",
    bgGlow: "rgba(245,158,11,0.06)",
    borderColor: "group-hover:border-amber-500/30",
    textShadow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Seamless Authentication",
    desc: "Experience frictionless micro-transactions through premium integrated systems. Safe, encrypted, and completely transparent.",
    iconColor: "#6366F1",
    bgGlow: "rgba(99,102,241,0.06)",
    borderColor: "group-hover:border-indigo-500/30",
    textShadow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
  },
  {
    step: "03",
    icon: ShoppingBag,
    title: "White-Glove Dispatch",
    desc: "Sit back as our dedicated concierge team handles your book with pristine care, ensuring secured delivery straight to your doorstep.",
    iconColor: "#10B981",
    bgGlow: "rgba(16,185,129,0.06)",
    borderColor: "group-hover:border-emerald-500/30",
    textShadow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
  },
];

function StepCard({ item, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 45 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#070a24]/50 backdrop-blur-2xl p-8 transition-all duration-500 ${item.borderColor} hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]`}
    >
      {/* Dynamic Background Radial Inner Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${item.bgGlow}, transparent 75%)`,
        }}
      />

      {/* Sleek Glowing Top Line */}
      <div 
        className="absolute top-0 left-8 right-8 h-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-75 group-hover:scale-x-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.iconColor}, transparent)`
        }}
      />

      {/* Interactive Framer Motion Step Number (Outline to Solid Transition) */}
      <div className="absolute top-4 right-6 select-none pointer-events-none z-0">
        <motion.span 
          className="text-6xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-all duration-500"
          style={{
            WebkitTextStroke: `1.2px ${item.iconColor}40`,
            color: "transparent",
          }}
          variants={{
            hover: {
              color: `${item.iconColor}15`,
              WebkitTextStroke: `1.5px ${item.iconColor}40`,
              scale: 1.05
            }
          }}
          whileHover="hover"
          animate={{
            color: "transparent"
          }}
        >
          <span className="group-hover:hidden">{item.step}</span>
          <span 
            className="hidden group-hover:inline transition-all duration-500"
            style={{ 
              color: `${item.iconColor}18`,
              WebkitTextStroke: `1.2px ${item.iconColor}60`
            }}
          >
            {item.step}
          </span>
        </motion.span>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Enhanced Crisp Icon Box */}
          <div
            className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.01] border border-white/[0.08] transition-all duration-300 group-hover:scale-105"
            style={{ 
              borderColor: `${item.iconColor}35`,
              boxShadow: `0 0 20px ${item.bgGlow}`
            }}
          >
            <Icon
              size={20}
              style={{ color: item.iconColor }}
              strokeWidth={2.2}
            />
          </div>

          {/* Title */}
          <h3 className="mb-3 text-lg font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-white">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400/90 leading-relaxed font-medium transition-colors duration-300 group-hover:text-slate-300">
            {item.desc}
          </p>
        </div>

        {/* Action Bottom Text */}
        <div className="mt-8 flex items-center gap-2 opacity-25 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Discover
          </span>
          <ArrowRight size={12} style={{ color: item.iconColor }} strokeWidth={2.5} />
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const containerRef = useRef(null);
  const isHeaderInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020410] py-24 lg:py-32 border-b border-white/[0.01]"
    >
      {/* Ambient Deep Space Light Spheres */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[450px] h-[250px] bg-indigo-500/[0.015] rounded-full blur-[130px]" />

      {/* Micro Grid Overlay for Technical Premium Vibe */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.03] px-3 py-1 backdrop-blur-md">
            <div className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/90">
              The Elite Workflow
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              BiblioDrop
            </span>{" "}
            Operates
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Your next exquisite reading journey begins in three transparent, meticulously crafted steps.
          </p>
        </motion.div>

        {/* 3-STEP PREMIUM CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {steps.map((item, index) => (
            <StepCard key={item.step} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}