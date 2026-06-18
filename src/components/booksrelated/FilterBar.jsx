'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function FilterBar() {
  const [showFilters, setShowFilters] = useState(false);

  // ক্যাটাগরি লিস্ট (আপনার ইমেজ 'image_917486.jpg' এর উপর ভিত্তি করে)
  const categories = ['All Categories', 'Fiction', 'Sci-Fi', 'Academic', 'Romance', 'Mystery', 'Biography', 'History', 'Self-Help'];
  const availabilities = ['All', 'Available Only', 'Checked Out'];

  return (
    <div className="w-full space-y-4 mb-10">
      
      {/* Top Search & Filter Trigger Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input Box */}
        <div className="w-full relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#0D1035]/60 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF] shadow-inner transition-all"
          />
        </div>

        {/* Sort Select Box */}
        <div className="w-full sm:w-[180px] relative">
          <select className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#0D1035]/60 text-sm text-white focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer font-medium">
            <option>Newest First</option>
            <option>Price: Low → High</option>
            <option>Price: High → Low</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full sm:w-auto px-5 py-3.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            showFilters 
              ? 'bg-[#6D4AFF] border-[#6D4AFF] text-white shadow-[0_0_25px_rgba(109,74,255,0.45)]' 
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      {/* Expandable Filter Options Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full rounded-2xl border border-white/10 bg-[#0D1035]/80 backdrop-blur-md overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
          >
            <div className="p-6 space-y-6">
              {/* Filter Panel Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm font-bold text-white tracking-wide uppercase">Filter Options</span>
                <button className="text-xs font-semibold text-gray-400 hover:text-red-400 flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors">
                  <X size={13} /> Clear All
                </button>
              </div>

              {/* Filter Fields Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Category Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#B8B8C5] block">Category</label>
                  <div className="relative">
                    <select className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/5 bg-[#05081F] text-sm text-white focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer">
                      {categories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                  </div>
                </div>

                {/* 2. Min Delivery Fee Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#B8B8C5] block">Min Delivery Fee ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#05081F] text-sm text-white focus:outline-none focus:border-[#6D4AFF] placeholder-gray-700"
                  />
                </div>

                {/* 3. Max Delivery Fee Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#B8B8C5] block">Max Delivery Fee ($)</label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#05081F] text-sm text-white focus:outline-none focus:border-[#6D4AFF] placeholder-gray-700"
                  />
                </div>

                {/* 4. Availability Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#B8B8C5] block">Availability</label>
                  <div className="relative">
                    <select className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/5 bg-[#05081F] text-sm text-white focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer">
                      {availabilities.map((avail) => (
                        <option key={avail} value={avail}>{avail}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}