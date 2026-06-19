import SkeletonLoader from '@/components/SkeletonLoader';
import { Library } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070B1E] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-[1200px] mx-auto z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[#6C47FF]/25 bg-[#6C47FF]/8 backdrop-blur-sm">
            <Library size={11} className="text-[#A78BFA]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A78BFA]">Premium Library</span>
          </div>
        </div>

        {/* 📚 Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          <SkeletonLoader count={8} />
        </div>
      </div>
    </div>
  );
}