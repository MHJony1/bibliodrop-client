import React from 'react';
import { getBooks } from '@/lib/api/books';
import { Library } from 'lucide-react';
import FilterBar from '@/components/booksrelated/FilterBar';
import BookCard from '@/components/booksrelated/BookCard';
import Pagination from '@/components/booksrelated/Pagination';

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
    <div className="min-h-screen bg-[#070B1E] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 right-0 w-175 h-[700px] bg-[#6C47FF]/6 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -left-48 w-[600px] h-[600px] bg-[#4A2FE8]/5 rounded-full blur-[140px]" />
        <div className="absolute top-28 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6C47FF]/20 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[#6C47FF]/25 bg-[#6C47FF]/8 backdrop-blur-sm">
            <Library size={11} className="text-[#A78BFA]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A78BFA]">
              Premium Library
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-3">
            Browse{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#6C47FF]">
              Books
            </span>
          </h1>
          {totalBooks > 0 ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[11px] text-[#8890B5]">
                  Total in library:
                </span>
                <span className="text-[11px] font-bold text-white">
                  {totalBooks} books
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#3A3F5C]" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#6C47FF]/10 border border-[#6C47FF]/20">
                <span className="text-[11px] text-[#A78BFA]">Showing:</span>
                <span className="text-[11px] font-bold text-white">
                  {showingFrom}–{showingTo} of {totalBooks}
                </span>
                <span className="text-[11px] text-[#8890B5]">
                  (page {currentPage}/{totalPages})
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8890B5]">
              No books found matching your filters.
            </p>
          )}
        </div>

        <div className="mb-8">
          <FilterBar />
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/[0.07] bg-[#0D1033]/40 text-center">
            <Library size={32} className="text-[#6C47FF]/40 mb-4" />
            <p className="text-[#8890B5] text-sm font-medium mb-1">
              No books match your filters.
            </p>
            <p className="text-[#565C7A] text-xs">
              Try adjusting your search or clearing filters.
            </p>
          </div>
        ) : (
          <>
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {books.map((book) => (
                <BookCard key={book._id?.$oid || book._id || book.id} book={book} />
              ))}
            </div> */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {books.map((book) => (
                <BookCard
                  key={book._id?.$oid || book._id || book.id}
                  book={book}
                />
              ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </>
        )}
      </div>
    </div>
  );
}
