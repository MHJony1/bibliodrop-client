'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Truck, DollarSign, Bookmark, Lock } from 'lucide-react';

export default function BookCard({ book }) {
  const isAvailable = book?.status === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl border border-white/5 bg-gradient-to-b from-[#0D1035] to-[#08092A] overflow-hidden group shadow-[0_12px_30px_rgba(0,0,0,0.2)] hover:border-white/10 hover:shadow-[0_20px_40px_rgba(109,74,255,0.12)] transition-all flex flex-col h-full"
    >
      {/* Cover Image Area */}
      <div className="w-full aspect-[4/5] relative bg-[#05081F] overflow-hidden">
        <Image
          src={book?.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f"}
          alt={book?.title}
          fill
          sizes="(max-w-768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08092A] via-transparent to-black/30" />

        {/* Dynamic Category & Status Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#6D4AFF]/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
            {book?.category}
          </span>
          
          {!isAvailable && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/20 backdrop-blur-md text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Lock size={10} />
              Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Book Info Area */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white m-0 tracking-tight line-clamp-1 group-hover:text-[#8B5CF6] transition-colors">
            {book?.title}
          </h3>
          <p className="text-xs text-[#B8B8C5] m-0 mt-1 font-medium">
            by <span className="text-gray-300">{book?.author}</span>
          </p>
        </div>

        {/* Price & Delivery Logistics */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-white flex items-center mt-0.5 tracking-tight">
              <DollarSign size={16} className="text-[#F7B500] -mr-0.5" />
              {book?.price?.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Truck size={10} className="text-[#8B5CF6]" /> Delivery
            </span>
            <span className="text-sm font-semibold text-gray-300 mt-1">
              ${book?.deliveryFee?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Interactive Action Button */}
        <button 
          disabled={!isAvailable}
          className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isAvailable 
              ? 'bg-white/5 border border-white/10 text-white hover:bg-[#6D4AFF] hover:border-[#6D4AFF] hover:shadow-[0_0_20px_rgba(109,74,255,0.4)]' 
              : 'bg-white/5 border border-dashed border-white/5 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Bookmark size={13} />
          {isAvailable ? 'Reserve Book' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
}