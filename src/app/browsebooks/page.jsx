import React from 'react';
import { getBooks } from '@/lib/api/books';
import { Library, BookOpen, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#070B1E] text-white pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background Effects - Soft & Premium */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#6C47FF]/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#4A2FE8]/3 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/2 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 w-full">
        {/* ===== HEADER ===== */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-[#6C47FF]/20 bg-[#6C47FF]/5 backdrop-blur-sm">
            <Sparkles size={10} className="text-[#A78BFA]" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-[#A78BFA]">
              Premium Library
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Browse{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#6C47FF]">
                  Books
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#8890B5] mt-0.5">
                Discover your next great read from our curated collection
              </p>
            </div>

            {totalBooks > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <Library size={12} className="text-[#8890B5]" />
                  <span className="text-[10px] sm:text-[11px] text-[#8890B5]">
                    <span className="text-white font-bold">{totalBooks}</span>{' '}
                    books
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#6C47FF]/8 border border-[#6C47FF]/15">
                  <BookOpen size={12} className="text-[#A78BFA]" />
                  <span className="text-[10px] sm:text-[11px] text-[#A78BFA]">
                    {showingFrom}–{showingTo}{' '}
                    <span className="hidden xs:inline">of</span> {totalBooks}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="mb-6">
          <FilterBar />
        </div>

        {/* ===== BOOKS GRID ===== */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 rounded-2xl border border-dashed border-white/[0.06] bg-[#0D1033]/20 text-center">
            <div className="p-4 rounded-full bg-[#6C47FF]/8 border border-[#6C47FF]/15 mb-4">
              <Library size={32} className="text-[#6C47FF]/30" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
              No books found
            </h3>
            <p className="text-xs sm:text-sm text-[#8890B5] max-w-sm">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full">
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
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
