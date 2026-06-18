"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, ShieldCheck, CheckCircle2, Clock, Globe, Award, Sparkles } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Zap,
    title: "Express White-Glove Dispatch",
    desc: "Premium archival books delivered within 24-48 hours. Fully handled via climate-controlled safety vaults to maintain absolute museum-grade preservation.",
    iconColor: "#F59E0B",
    glow: "rgba(245,158,11,0.08)",
    size: "lg:col-span-8", // Large horizontal card
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Tier-1 Encryption",
    desc: "Fortified financial micro-transactions handled seamlessly with Stripe security protocols.",
    iconColor: "#6366F1",
    glow: "rgba(99,102,241,0.08)",
    size: "lg:col-span-4", // Small card
  },
  {
    id: 3,
    icon: CheckCircle2,
    title: "Verified Peer Reviews",
    desc: "Cryptographic consensus algorithms block spam. Only readers with true verified smart-receipts can write reviews.",
    iconColor: "#10B981",
    glow: "rgba(16,185,129,0.08)",
    size: "lg:col-span-4", // Small card
  },
  {
    id: 4,
    icon: Globe,
    title: "Global Repositories",
    desc: "Instant decentralized access hooks you directly into premium worldwide libraries, independent archives, and legendary hidden private collections.",
    iconColor: "#3B82F6",
    glow: "rgba(59,130,246,0.08)",
    size: "lg:col-span-4", // Small card
  },
  {
    id: 5,
    icon: Clock,
    title: "24/7 Elite Concierge",
    desc: "Our automated systems and dedicated network vectors run uninterrupted, ensuring instant processing.",
    iconColor: "#EC4899",
    glow: "rgba(236,72,153,0.08)",
    size: "lg:col-span-4", // Small card
  },
  {
    id: 6,
    icon: Award,
    title: "Curated Rare Literature Framework",
    desc: "Every single volume undergoes strict carbon-rating and tactile preservation audits by certified master archivists before dispatch allocation.",
    iconColor: "#A855F7",
    glow: "rgba(168,85,247,0.08)",
    size: "lg:col-span-12", // Full-width spectacular base card
  },
];

export default function WhyChooseUs() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020410] py-24 lg:py-32 border-b border-white/[0.01]"
    >
      {/* Dynamic Background Lens Flare Systems */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent,70%)]" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/[0.01] rounded-full blur-[140px]" />

      {/* Cybernetic Dot Matrix Mesh Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* CENTERED PREMIUM HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/10 bg-amber-500/[0.02] px-4 py-1.5 backdrop-blur-md">
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/80">
              Platform Benefits
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Engineered For The{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Elite Bibliophile
            </span>
          </h2>
          
          <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            We bypass traditional constraints. Discover a premium ecosystem featuring modern cryptographic asset security, global vaults, and bespoke logistic infrastructure.
          </p>
        </motion.div>

        {/* LUXURY BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-3xl border border-white/[0.04] bg-[#06081f]/40 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:border-white/[0.12] hover:bg-[#0a0d3a]/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ${feature.size}`}
              >
                {/* Advanced Light Follow Interaction */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${feature.glow}, transparent 60%)`,
                  }}
                />

                {/* Micro-Accent Metallic Glow Bar */}
                <div
                  className="absolute top-0 inset-x-12 h-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-50 group-hover:scale-x-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.iconColor}, transparent)`
                  }}
                />

                <div>
                  {/* Icon Frame */}
                  <div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.01] border border-white/[0.06] transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      borderColor: `${feature.iconColor}20`,
                      boxShadow: `0 0 20px ${feature.glow}`
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: feature.iconColor }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="mt-3 text-xs sm:text-[13.5px] text-slate-400 leading-relaxed font-medium transition-colors duration-300 group-hover:text-slate-300">
                    {feature.desc}
                  </p>
                </div>

                {/* Subdued Bottom Design Element for Large Cards to balance visual weight */}
                {(feature.size.includes("span-8") || feature.size.includes("span-12")) && (
                  <div className="mt-8 pt-4 border-t border-white/[0.02] flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                    <span>Premium Architecture Tier</span>
                    <span>System Active</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}