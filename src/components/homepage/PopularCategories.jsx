'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Zap, 
  GraduationCap, 
  Heart, 
  Compass, 
  User, 
  Globe, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function PopularCategories() {
  const categories = [
    { name: 'Fiction', icon: BookOpen, count: '2.4K+', color: '#6D4AFF' },
    { name: 'Sci-Fi', icon: Zap, count: '1.8K+', color: '#EF4444' },
    { name: 'Academic', icon: GraduationCap, count: '3.1K+', color: '#10B981' },
    { name: 'Romance', icon: Heart, count: '2.1K+', color: '#EC4899' },
    { name: 'Mystery', icon: Compass, count: '1.5K+', color: '#F59E0B' },
    { name: 'Biography', icon: User, count: '3.1K+', color: '#3B82F6' },
    { name: 'History', icon: Globe, count: '1.2K+', color: '#84CC16' },
    { name: 'Self-Help', icon: Layers, count: '1.7K+', color: '#06B6D4' },
  ];

  // 🌟 Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Custom Ease-out curve for luxury feel
      },
    },
  };

  return (
    <section className="w-full py-24 relative bg-[#060814] overflow-hidden">
      {/* 🌌 Luxury Dot Grid Pattern Overlay (image_490f7d.png matching) */}
      <div 
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 🔮 Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#6D4AFF]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#F7B500]/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 🌟 Center-Aligned Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-[#0D1033]/60 backdrop-blur-md text-[10px] font-bold tracking-[0.15em] text-[#6D4AFF] uppercase">
            <Sparkles size={11} className="text-[#F7B500]" />
            EXPLORE GENRES
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white m-0">
            Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFEBB3] to-[#F7B500]">Categories</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-400 font-medium m-0 max-w-md mx-auto mt-4 leading-relaxed">
            Browse books by your favorite genres and find your next premium literary adventure.
          </p>
        </motion.div>

        {/* 🎴 Categories Grid with Framer Motion Stagger Action */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            
            return (
              <motion.div key={cat.name} variants={itemVariants}>
                <Link
                  href={`/browsebooks?category=${encodeURIComponent(cat.name)}`}
                  className="group block relative rounded-2xl border border-white/[0.04] bg-[#0D1033]/40 backdrop-blur-md p-6 overflow-hidden transition-all duration-300 hover:border-[#6D4AFF]/40 hover:bg-[#0D1033]/70 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(109,74,255,0.08)] no-underline"
                >
                  {/* Ambient Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6D4AFF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Icon Container with Dynamic Colors */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/[0.03] transition-all duration-300"
                        style={{ backgroundColor: `${cat.color}08` }}
                      >
                        <IconComponent 
                      
                          size={19} 
                          style={{ color: cat.color }}
                          className="transition-transform duration-300 group-hover:scale-110" 
                        />
                      </div>

                      {/* Content Metadata */}
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-white m-0 group-hover:text-[#F7B500] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-gray-500 m-0 tracking-wide">
                          {cat.count} books
                        </p>
                      </div>
                    </div>

                    {/* Elite Right Arrow Transition */}
                    <div className="w-7 h-7 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={12} className="text-gray-400 group-hover:text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}