"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Award, BookOpen, ShieldCheck } from "lucide-react";

const librarians = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Chief Archivist",
    library: "Downtown Public Library",
    deliveries: "1,240",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    badgeColor: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    id: 2,
    name: "James Rodriguez",
    role: "Senior Curator",
    library: "Heritage Books Collection",
    deliveries: "980",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    badgeColor: "from-indigo-400 to-purple-600",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Literary Specialist",
    library: "Academic Resource Hub",
    deliveries: "856",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    badgeColor: "from-emerald-400 to-teal-600",
    glow: "rgba(16,185,129,0.15)",
  },
];

function LibrarianCard({ curator, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#070a24]/40 backdrop-blur-2xl p-6 sm:p-8 transition-all duration-500 hover:border-white/[0.12] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
    >
      {/* Background Interactive Radial Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${curator.glow}, transparent 70%)`,
        }}
      />

      {/* Luxury Border Accent on Hover */}
      <div
        className={`absolute bottom-0 left-8 right-8 h-[1.5px] bg-gradient-to-r ${curator.badgeColor} opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-75 group-hover:scale-x-100`}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Profile Image with Luxury Metallic Border & Badge */}
        <div className="relative mb-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full p-[2.5px] bg-gradient-to-b from-white/[0.15] to-transparent group-hover:from-white/[0.3] transition-all duration-500 shadow-xl">
            <div className="h-full w-full overflow-hidden rounded-full bg-[#050714]">
              <img
                src={curator.image}
                alt={curator.name}
                className="h-full w-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
          
          {/* Floating Verification Badge */}
          <div className={`absolute -bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${curator.badgeColor} p-1 shadow-md border border-[#030616]`}>
            <ShieldCheck size={12} className="text-slate-950 font-black" strokeWidth={3} />
          </div>
        </div>

        {/* Identity & Metadata */}
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors duration-300">
            {curator.name}
          </h3>
          <p className={`text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r ${curator.badgeColor} bg-clip-text text-transparent mt-0.5`}>
            {curator.role}
          </p>
          <p className="mt-2 text-xs text-slate-400 font-medium tracking-wide">
            {curator.library}
          </p>
        </div>

        {/* Divider line */}
        <div className="w-full h-[1px] bg-white/[0.05] my-5 group-hover:bg-white/[0.08] transition-colors duration-500" />

        {/* Real-time Counter Stats */}
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Deliveries */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              <BookOpen size={13} className="text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Deliveries</span>
            </div>
            <span className="mt-1 text-lg font-black text-white tracking-tight">
              {curator.deliveries}
            </span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              <Star size={13} className="text-amber-400 fill-amber-400/20" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Rating</span>
            </div>
            <span className="mt-1 text-lg font-black text-white tracking-tight flex items-baseline gap-0.5">
              {curator.rating}
              <span className="text-[10px] text-slate-500 font-bold">/5</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedLibrarians() {
  const containerRef = useRef(null);
  const isHeaderInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020410] py-24 lg:py-32 border-b border-white/[0.01]"
    >
      {/* Background Cinematic Lens Flares */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-10 left-10 w-[350px] h-[350px] bg-amber-500/[0.01] rounded-full blur-[120px]" />
      
      {/* Subtle Dot Mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.04] px-4 py-1.5 backdrop-blur-md">
            <Award size={12} className="text-indigo-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400/90">
              Top Providers
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Featured{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Librarians
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Meet our most active literary experts driving nationwide culture with exceptional dispatch records.
          </p>
        </motion.div>

        {/* 3-COLUMN LIBRARIANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {librarians.map((curator, index) => (
            <LibrarianCard key={curator.id} curator={curator} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}