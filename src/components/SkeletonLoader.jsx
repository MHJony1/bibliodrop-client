import React from 'react';

export default function SkeletonLoader({ count = 8 }) {
  return (
    <>
      {/* 🚀 Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::after {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(108, 71, 255, 0.1) 50%, rgba(255,255,255,0) 100%);
          animation: shimmer 2s infinite;
          content: '';
        }
      `}</style>

      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative rounded-2xl flex flex-col h-full bg-[#0D1033] border border-white/[0.07] animate-shimmer"
          style={{ minHeight: '400px' }} 
        >
          {/* Cover Image Placeholder */}
          <div className="relative w-full aspect-square bg-[#080C24] animate-pulse" />

          {/* Metadata Placeholder */}
          <div className="px-3 py-3 flex flex-col grow justify-between gap-2">
            <div className="flex flex-col gap-2">
              {/* Title Skeleton */}
              <div className="h-3 w-3/4 bg-white/10 rounded-md" />
              {/* Author Skeleton */}
              <div className="h-2 w-1/2 bg-white/5 rounded-md" />
            </div>

            <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between">
              <div className="h-4 w-12 bg-white/10 rounded-md" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <div className="h-2 w-12 bg-white/5 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}