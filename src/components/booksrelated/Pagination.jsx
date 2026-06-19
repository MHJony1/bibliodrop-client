'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ totalPages, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/browsebooks?${params.toString()}`, { scroll: true });
  };

  // Generate page numbers with ellipsis
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    if (currentPage <= 3) end = 4;
    if (currentPage >= totalPages - 2) start = totalPages - 3;
    
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-white/[0.04]">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="p-2.5 rounded-lg border border-white/[0.06] bg-[#0E1330]/50 text-gray-400 hover:text-white hover:bg-[#6D4AFF] disabled:opacity-20 disabled:hover:bg-transparent transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, index) => {
        if (page === '...') {
          return <span key={`ellipsis-${index}`} className="w-9 text-center text-gray-500">…</span>;
        }
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-9 h-9 text-xs font-bold rounded-lg border transition-all ${
              currentPage === page
                ? 'bg-[#6D4AFF] border-[#6D4AFF] text-white shadow-[0_0_15px_rgba(109,74,255,0.3)]'
                : 'border-white/[0.06] bg-[#0E1330]/50 text-gray-400 hover:text-white hover:border-white/[0.15]'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="p-2.5 rounded-lg border border-white/[0.06] bg-[#0E1330]/50 text-gray-400 hover:text-white hover:bg-[#6D4AFF] disabled:opacity-20 disabled:hover:bg-transparent transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}