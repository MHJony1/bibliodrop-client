'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'All Categories', 'Fiction', 'Sci-Fi', 'Academic',
  'Romance', 'Mystery', 'Biography', 'History', 'Self-Help',
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc',  label: 'Oldest First' },
  { value: 'price-asc',      label: 'Price: Low → High' },
  { value: 'price-desc',     label: 'Price: High → Low' },
  { value: 'title-asc',      label: 'Title: A → Z' },
  { value: 'title-desc',     label: 'Title: Z → A' },
];

function getFiltersFromParams(searchParams) {
  const sort  = searchParams.get('sort')  || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const avail = searchParams.get('availability') || '';

  return {
    search:       searchParams.get('search')    || '',
    category:     searchParams.get('category')  || 'All Categories',
    minPrice:     searchParams.get('minPrice')  || '',
    maxPrice:     searchParams.get('maxPrice')  || '',
    availability: avail === 'available'   ? 'Available Only'
                : avail === 'checked_out' ? 'Checked Out'
                : 'All',
    sortSelect:   `${sort}-${order}`,
  };
}

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);

  // ✅ category value DB field অনুযায়ী: "category"
  if (filters.category !== 'All Categories') {
    params.set('category', filters.category.toLowerCase());
  }

  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

  // ✅ availability value DB field অনুযায়ী: "available" বা "checked_out"
  if (filters.availability === 'Available Only') params.set('availability', 'available');
  if (filters.availability === 'Checked Out')    params.set('availability', 'checked_out');

  const [sort, order] = filters.sortSelect.split('-');
  params.set('sort', sort);
  params.set('order', order);
  params.set('page', '1');

  return params.toString();
}

export default function FilterBar() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]         = useState(() => getFiltersFromParams(searchParams));
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef  = useRef(null);
  const filtersRef   = useRef(filters);

  useEffect(() => { filtersRef.current = filters; }, [filters]);

  useEffect(() => {
    const synced = getFiltersFromParams(searchParams);
    setFilters(synced);
    setSearchInput(synced.search);
  }, [searchParams]);

  const pushRoute = (updatedFilters) => {
    const qs = buildQueryString(updatedFilters);
    router.push(`/browsebooks${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  // Search debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const updated = { ...filtersRef.current, search: searchInput };
      setFilters(updated);
      pushRoute(updated);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]); // eslint-disable-line

  const handleChange = (key, value) => {
    const updated = { ...filtersRef.current, [key]: value };
    setFilters(updated);
    pushRoute(updated);
  };

  const handleClearAll = () => {
    const reset = {
      search: '', category: 'All Categories',
      minPrice: '', maxPrice: '', availability: 'All', sortSelect: 'createdAt-desc',
    };
    setFilters(reset);
    setSearchInput('');
    router.push('/browsebooks', { scroll: false });
  };

  const activeCount = [
    filters.search,
    filters.category !== 'All Categories' && filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.availability !== 'All' && filters.availability,
  ].filter(Boolean).length;

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238890B5' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <div className="w-full space-y-3">

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565C8A] pointer-events-none" size={15} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                const updated = { ...filtersRef.current, search: searchInput };
                setFilters(updated);
                pushRoute(updated);
              }
            }}
            placeholder="Search by title or author and press Enter..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.07] bg-[#0D1033]/80
              text-white text-sm placeholder-[#565C8A] focus:outline-none focus:border-[#6C47FF]/60 transition-colors"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565C8A] hover:text-white transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={filters.sortSelect}
          onChange={(e) => handleChange('sortSelect', e.target.value)}
          className="sm:w-[180px] px-4 py-2.5 rounded-xl border border-white/[0.07] bg-[#0D1033]/80
            text-white text-sm focus:outline-none focus:border-[#6C47FF]/60 cursor-pointer appearance-none"
          style={selectStyle}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0D1033]">{opt.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(p => !p)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all
            ${showFilters ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#0D1033]/80 border-white/[0.07] text-[#C5C9E0] hover:border-white/20'}`}
        >
          <SlidersHorizontal size={13} />
          Filters
          {activeCount > 0 && (
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black
              ${showFilters ? 'bg-white text-[#6C47FF]' : 'bg-[#6C47FF] text-white'}`}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div key="filter-panel"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden">
            <div className="rounded-xl border border-white/[0.07] bg-[#0D1033]/80 backdrop-blur-md p-4">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.05]">
                <span className="text-[10px] font-bold text-[#8890B5] uppercase tracking-widest">Advanced Filters</span>
                <button onClick={handleClearAll}
                  className="text-[10px] text-[#8890B5] hover:text-red-400 flex items-center gap-1 transition-colors font-medium">
                  <X size={10} /> Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">Category</label>
                  <select value={filters.category} onChange={(e) => handleChange('category', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E] text-white text-sm
                      focus:outline-none focus:border-[#6C47FF]/60 cursor-pointer appearance-none"
                    style={{ ...selectStyle, backgroundPosition: 'right 10px center' }}>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#070B1E]">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">Min Price ($)</label>
                  <input type="number" min="0" value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E] text-white text-sm
                      focus:outline-none focus:border-[#6C47FF]/60 placeholder-[#3A3F5C]" />
                </div>

                {/* Max Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">Max Price ($)</label>
                  <input type="number" min="0" value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    placeholder="Any"
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E] text-white text-sm
                      focus:outline-none focus:border-[#6C47FF]/60 placeholder-[#3A3F5C]" />
                </div>

                {/* Availability */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">Availability</label>
                  <select value={filters.availability} onChange={(e) => handleChange('availability', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E] text-white text-sm
                      focus:outline-none focus:border-[#6C47FF]/60 cursor-pointer appearance-none"
                    style={{ ...selectStyle, backgroundPosition: 'right 10px center' }}>
                    <option value="All" className="bg-[#070B1E]">All Books</option>
                    <option value="Available Only" className="bg-[#070B1E]">Available Only</option>
                    <option value="Checked Out" className="bg-[#070B1E]">Checked Out</option>
                  </select>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}