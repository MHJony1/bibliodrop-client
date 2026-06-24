import React from 'react';
import { getBooks } from '@/lib/api/books';
import { Library, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import FilterBar from '@/components/booksrelated/FilterBar';
import BookCard from '@/components/booksrelated/BookCard';
import Pagination from '@/components/booksrelated/Pagination';

export const metadata = {
  title: 'Browse Books | BiblioDrop',
  description:
    'Explore our curated collection of premium books from local libraries.',
};

export default async function BrowseBooksPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const LIMIT = 12;

  const params = {
    search: resolvedParams?.search || '',
    category: resolvedParams?.category || '',
    minPrice: resolvedParams?.minPrice || '',
    maxPrice: resolvedParams?.maxPrice || '',
    availability: resolvedParams?.availability || '',
    sort: resolvedParams?.sort || 'createdAt',
    order: resolvedParams?.order || 'desc',
    page: resolvedParams?.page || 1,
    limit: LIMIT,
  };

  const response = await getBooks(params);

  let books = [];
  let pagination = null;

  if (response?.success && Array.isArray(response.data)) {
    books = response.data;
    pagination = response.pagination || null;
  } else if (response?.data && Array.isArray(response.data)) {
    books = response.data;
    pagination = response.pagination || null;
  } else if (Array.isArray(response)) {
    books = response;
  } else if (response?.books && Array.isArray(response.books)) {
    books = response.books;
    pagination = response.pagination || null;
  }

  const currentPage = parseInt(params.page, 10) || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalBooks = pagination?.total || books.length || 0;
  const showingCount = books.length;
  const showingFrom = totalBooks === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const showingTo = showingFrom + showingCount - 1;

  return (
    <div className="min-h-screen bg-[#070B1E] text-white relative overflow-hidden">
      {/* Premium Ambient Glow Effects */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#6C47FF]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#4A2FE8]/[0.03] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#8B5CF6]/[0.02] rounded-full blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20">
        {/* ===== HEADER SECTION ===== */}
        <div className="mb-6 sm:mb-8 lg:mb-10 mt-1">
          {/* Premium Badge - Centered on Mobile, Left on Desktop */}
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6C47FF]/20 bg-[#6C47FF]/5 backdrop-blur-sm">
              <Sparkles size={9} className="text-[#A78BFA]" />
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-[#A78BFA]">
                Premium Library
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
            {/* Left: Title & Subtitle */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-5xl  font-extrabold tracking-tight text-white leading-tight">
                Browse{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#6C47FF]">
                  Books
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#8890B5] mt-0.5 hidden sm:block">
                Discover your next great read from our curated collection
              </p>
            </div>

            {/* Right: Stats - Desktop */}
            {totalBooks > 0 && (
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                  <Library size={13} className="text-[#8890B5]" />
                  <span className="text-xs text-[#8890B5]">
                    <span className="text-white font-semibold">
                      {totalBooks}
                    </span>{' '}
                    books
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6C47FF]/8 to-[#8B5CF6]/5 border border-[#6C47FF]/15 backdrop-blur-sm">
                  <BookOpen size={13} className="text-[#A78BFA]" />
                  <span className="text-xs text-[#A78BFA]">
                    {showingFrom}–{showingTo} of {totalBooks}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7B500]/10 border border-[#F7B500]/15">
                  <span className="text-[10px] font-medium text-[#F7B500]">
                    Page {currentPage}/{totalPages}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Subtitle & Stats - Below Title */}
          <div className="sm:hidden text-center mt-1.5">
            <p className="text-xs text-[#8890B5]">
              Discover your next great read
            </p>
            {totalBooks > 0 && (
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <Library size={10} className="text-[#8890B5]" />
                  <span className="text-[9px] text-[#8890B5]">
                    <span className="text-white font-medium">{totalBooks}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#6C47FF]/8 to-[#8B5CF6]/5 border border-[#6C47FF]/15">
                  <BookOpen size={10} className="text-[#A78BFA]" />
                  <span className="text-[9px] text-[#A78BFA]">
                    {showingFrom}–{showingTo}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F7B500]/10 border border-[#F7B500]/15">
                  <span className="text-[8px] font-medium text-[#F7B500]">
                    Pg {currentPage}/{totalPages}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Decorative Line - Desktop only */}
          <div className="hidden sm:block w-14 h-0.5 bg-gradient-to-r from-[#6C47FF] to-transparent mt-3 rounded-full" />
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="mb-5 sm:mb-6 lg:mb-7">
          <FilterBar />
        </div>

        {/* ===== BOOKS GRID ===== */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 rounded-2xl border border-dashed border-white/[0.06] bg-[#0D1033]/20 text-center px-4">
            <div className="p-4 rounded-2xl bg-[#6C47FF]/8 border border-[#6C47FF]/15 mb-3">
              <Library size={36} className="text-[#6C47FF]/30" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
              No books found
            </h3>
            <p className="text-xs sm:text-sm text-[#8890B5] max-w-sm">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 w-full">
              {books.map((book, index) => (
                <BookCard
                  key={book._id?.$oid || book._id || book.id || index}
                  book={book}
                  index={index}
                />
              ))}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 lg:mt-12">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
