'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, HelpCircle, Sparkles } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05081F] text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#6D4AFF]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-xs font-bold tracking-wider text-red-400 uppercase mb-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <HelpCircle size={13} />
          Error 404
        </div>

        {/* Big 404 Typography */}
        <h1 className="text-[120px] sm:text-[150px] font-black tracking-tighter leading-none m-0 bg-linear-to-b from-white via-gray-300 to-gray-700 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(109,74,255,0.3)]">
          404
        </h1>

        {/* Error Message */}
        <div className="space-y-3 mt-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
            Lost in the{' '}
            <span className="bg-linear-to-r from-[#6D4AFF] to-[#8B5CF6] bg-clip-text text-transparent">
              Archives?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#B8B8C5] leading-relaxed max-w-sm mx-auto m-0">
            The page you are looking for doesn&apos;t exist or has been relocated to another shelf.
          </p>
        </div>

        {/* BUTTONS GROUP */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-10">
          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          {/* Return Home Link */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold no-underline bg-[#F7B500] text-[#05081F] shadow-[0_4px_20px_rgba(247,181,0,0.25)] hover:bg-[#FFD04D] hover:shadow-[0_0_28px_rgba(247,181,0,0.4)] hover:scale-[1.02] transition-all duration-200"
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>

      </div>
    </div>
  );
}