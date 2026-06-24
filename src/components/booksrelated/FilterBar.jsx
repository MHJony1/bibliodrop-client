'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Fiction',
  'Sci-Fi',
  'Academic',
  'Romance',
  'Mystery',
  'Biography',
  'History',
  'Self-Help',
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'deliveryFee-asc', label: 'Delivery Fee: Low → High' },
  { value: 'deliveryFee-desc', label: 'Delivery Fee: High → Low' },
  { value: 'title-asc', label: 'Title: A → Z' },
  { value: 'title-desc', label: 'Title: Z → A' },
];

function getFiltersFromParams(searchParams) {
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const avail = searchParams.get('availability') || '';
  const category = searchParams.get('category') || '';

  let displayCategory = 'All Categories';
  if (category) {
    const found = CATEGORIES.find(
      (c) => c.toLowerCase() === category.toLowerCase(),
    );
    displayCategory =
      found || category.charAt(0).toUpperCase() + category.slice(1);
  }

  return {
    search: searchParams.get('search') || '',
    category: displayCategory,
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    availability:
      avail === 'available'
        ? 'Available Only'
        : avail === 'checked_out'
          ? 'Checked Out'
          : 'All',
    sortSelect: `${sort}-${order}`,
  };
}

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);

  if (filters.category && filters.category !== 'All Categories') {
    params.set('category', filters.category.toLowerCase());
  }

  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

  if (filters.availability === 'Available Only')
    params.set('availability', 'available');
  if (filters.availability === 'Checked Out')
    params.set('availability', 'checked_out');

  const [sort, order] = filters.sortSelect.split('-');
  params.set('sort', sort);
  params.set('order', order);
  params.set('page', '1');

  return params.toString();
}

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() =>
    getFiltersFromParams(searchParams),
  );
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef(null);
  const filtersRef = useRef(filters);
  const isEnterPress = useRef(false);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const synced = getFiltersFromParams(searchParams);
    setFilters(synced);
    setSearchInput(synced.search);
  }, [searchParams]);

  const pushRoute = (updatedFilters) => {
    const qs = buildQueryString(updatedFilters);
    router.push(`/browsebooks${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  useEffect(() => {
    if (isEnterPress.current) {
      isEnterPress.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const updated = { ...filtersRef.current, search: searchInput };
      setFilters(updated);
      pushRoute(updated);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleChange = (key, value) => {
    const updated = { ...filtersRef.current, [key]: value };
    setFilters(updated);

    if (key !== 'search') {
      pushRoute(updated);
    }
  };

  const handleClearAll = () => {
    const reset = {
      search: '',
      category: 'All Categories',
      minPrice: '',
      maxPrice: '',
      availability: 'All',
      sortSelect: 'createdAt-desc',
    };
    setFilters(reset);
    setSearchInput('');
    router.push('/browsebooks', { scroll: false });
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      isEnterPress.current = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const updated = { ...filtersRef.current, search: searchInput };
      setFilters(updated);
      pushRoute(updated);
    }
  };

  const activeCount = [
    filters.search,
    filters.category !== 'All Categories' && filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.availability !== 'All' && filters.availability,
  ].filter(Boolean).length;

  return (
    <div className="w-full space-y-3">
      {/* Top Row - Premium Glassmorphism */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#565C8A] group-focus-within:text-[#A78BFA] transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchEnter}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-white/[0.06] bg-[#0D1033]/60 text-white text-sm placeholder-[#565C8A] focus:outline-none focus:border-[#6C47FF]/50 focus:bg-[#0D1033]/80 transition-all duration-300"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565C8A] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sortSelect}
            onChange={(e) => handleChange('sortSelect', e.target.value)}
            className="w-full sm:w-[170px] lg:w-[190px] px-4 py-2.5 sm:py-3 rounded-xl border border-white/[0.06] bg-[#0D1033]/60 text-white text-sm focus:outline-none focus:border-[#6C47FF]/50 focus:bg-[#0D1033]/80 cursor-pointer appearance-none transition-all duration-300"
          >
            {SORT_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[#0D1033]"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#565C8A] pointer-events-none"
          />
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap ${
            showFilters
              ? 'bg-[#6C47FF] border-[#6C47FF] text-white shadow-[0_0_30px_rgba(108,71,255,0.15)]'
              : 'border-white/[0.06] bg-[#0D1033]/60 text-[#C5C9E0] hover:border-white/20 hover:bg-[#0D1033]/80'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden xs:inline">Filters</span>
          {activeCount > 0 && (
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                showFilters
                  ? 'bg-white text-[#6C47FF]'
                  : 'bg-[#6C47FF] text-white'
              }`}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters Panel - Premium Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-white/[0.06] bg-[#0D1033]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-[#6C47FF]" />
                  <span className="text-[10px] font-bold text-[#8890B5] uppercase tracking-widest">
                    Advanced Filters
                  </span>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-[10px] text-[#8890B5] hover:text-red-400 flex items-center gap-1.5 transition-colors font-medium px-2.5 py-1 rounded-lg hover:bg-red-500/5"
                >
                  <X size={12} /> Clear All
                </button>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] sm:text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E]/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#6C47FF]/50 focus:bg-[#070B1E] cursor-pointer appearance-none transition-all duration-200"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#070B1E]">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="text-[8px] text-[#8890B5]/60 mt-0.5 hidden sm:block">
                    Selected:{' '}
                    <span className="text-white/80 font-medium">
                      {filters.category}
                    </span>
                  </span>
                </div>

                {/* Min Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] sm:text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E]/80 text-white text-xs sm:text-sm placeholder-[#3A3F5C] focus:outline-none focus:border-[#6C47FF]/50 focus:bg-[#070B1E] transition-all duration-200"
                  />
                </div>

                {/* Max Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] sm:text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    placeholder="Any"
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E]/80 text-white text-xs sm:text-sm placeholder-[#3A3F5C] focus:outline-none focus:border-[#6C47FF]/50 focus:bg-[#070B1E] transition-all duration-200"
                  />
                </div>

                {/* Availability */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] sm:text-[10px] font-bold text-[#8890B5] uppercase tracking-wider">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) =>
                      handleChange('availability', e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-white/[0.05] bg-[#070B1E]/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#6C47FF]/50 cursor-pointer appearance-none transition-all duration-200"
                  >
                    <option value="All">All Books</option>
                    <option value="Available Only">Available Only</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Tags */}
              {activeCount > 0 && (
                <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap items-center gap-1.5">
                  <span className="text-[8px] sm:text-[9px] text-[#8890B5]/60 font-medium mr-1">
                    Active:
                  </span>
                  {filters.search && (
                    <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#A78BFA] border border-[#6C47FF]/15 flex items-center gap-1">
                      {filters.search}
                      <button
                        onClick={() => handleChange('search', '')}
                        className="hover:text-white"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filters.category !== 'All Categories' && (
                    <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#A78BFA] border border-[#6C47FF]/15">
                      {filters.category}
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#A78BFA] border border-[#6C47FF]/15">
                      Min ${filters.minPrice}
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#A78BFA] border border-[#6C47FF]/15">
                      Max ${filters.maxPrice}
                    </span>
                  )}
                  {filters.availability !== 'All' && (
                    <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#A78BFA] border border-[#6C47FF]/15">
                      {filters.availability}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
