import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BookDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#070B1E] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Custom CSS for Premium Shimmer Effect */}
      <style>{`
        @keyframes detailShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-bg {
          position: relative;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.05);
        }
        .shimmer-bg::after {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(108, 71, 255, 0.08) 50%, 
            rgba(255, 255, 255, 0) 100%
          );
          animation: detailShimmer 2s infinite;
          content: '';
        }
      `}</style>

      {/* Background Decorative Glow Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#6C47FF]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 -left-20 w-[400px] h-[400px] bg-[#4A2FE8]/4 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Button Placeholder */}
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-10 cursor-not-allowed select-none">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </div>

        {/* Main Split Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Book Cover Skeleton */}
          <div className="w-full aspect-square max-w-[440px] mx-auto md:mx-0 rounded-2xl border border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.4)] bg-[#0D1033]/40 p-4 flex items-center justify-center">
            <div className="shimmer-bg w-full h-full rounded-xl" />
          </div>

          {/* Right Column: Book Metadata Skeletons */}
          <div className="flex flex-col space-y-6 max-w-[550px]">
            
            {/* Header Meta Elements */}
            <div className="space-y-3">
              {/* Category Badge */}
              <div className="shimmer-bg h-5 w-16 rounded-md" />
              
              {/* Title Block */}
              <div className="shimmer-bg h-10 w-11/12 rounded-lg" />
              
              {/* Author Block */}
              <div className="shimmer-bg h-5 w-1/3 rounded-md mt-2" />
            </div>

            <hr className="border-white/[0.06] my-2" />

            {/* Description Text Mockups */}
            <div className="space-y-2">
              <div className="shimmer-bg h-3.5 w-full rounded" />
              <div className="shimmer-bg h-3.5 w-5/6 rounded" />
            </div>

            {/* Price Calculations Container Card */}
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-[#0D1033]/50 space-y-4">
              <div className="flex justify-between items-center">
                <div className="shimmer-bg h-4 w-20 rounded" />
                <div className="shimmer-bg h-4 w-16 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="shimmer-bg h-4 w-24 rounded" />
                <div className="shimmer-bg h-4 w-12 rounded" />
              </div>
              <div className="h-px bg-white/[0.06] my-1" />
              <div className="flex justify-between items-center">
                <div className="shimmer-bg h-5 w-28 rounded-md" />
                <div className="shimmer-bg h-5 w-20 rounded-md" />
              </div>
            </div>

            {/* Additional Metadata Tags (Librarian, Date) */}
            <div className="flex flex-wrap gap-3">
              <div className="shimmer-bg h-8 w-32 rounded-xl" />
              <div className="shimmer-bg h-8 w-44 rounded-xl" />
            </div>

            {/* Action Buttons Fillers */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="shimmer-bg h-12 flex-1 rounded-xl" />
              <div className="shimmer-bg h-12 w-full sm:w-40 rounded-xl" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}