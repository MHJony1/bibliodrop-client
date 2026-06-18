import React from 'react';
import { getBooks } from '@/lib/api/books';
import { Sparkles } from 'lucide-react';
import FilterBar from '@/components/booksrelated/FilterBar';
import BookCard from '@/components/booksrelated/BookCard';

export default async function BrowseBooksPage() {

  const apiResponse = await getBooks();
  
  
  let browseBooks = [];
  
  if (Array.isArray(apiResponse)) {
    browseBooks = apiResponse;
  } else if (apiResponse && Array.isArray(apiResponse.data)) {
    browseBooks = apiResponse.data; // যদি অবজেক্টের ভেতর .data অ্যারে থাকে
  } else if (apiResponse && Array.isArray(apiResponse.books)) {
    browseBooks = apiResponse.books; // যদি অবজেক্টের ভেতর .books অ্যারে থাকে
  } else if (apiResponse && typeof apiResponse === 'object') {
   
    browseBooks = Object.values(apiResponse).filter(item => typeof item === 'object' && item !== null);
  }

  return (
    <div className="min-h-screen bg-[#05081F] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background Decorative Premium Lighting */}
      <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-[#6D4AFF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-20 w-[450px] h-[450px] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Page Header Section */}
        <div className="space-y-2.5 mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase shadow-sm">
            <Sparkles size={11} className="text-[#F7B500]" />
            Premium Archive
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight m-0 text-white">
            Browse Books
          </h1>
          <p className="text-sm text-[#B8B8C5] m-0">
            Explore our curated collection of{' '}
            <span className="text-white font-semibold">
              {browseBooks?.length || 0} books
            </span>{' '}
            from local premium libraries.
          </p>
        </div>

        {/* Filter and Search UI Component */}
        <FilterBar />

        {/* Core Products Cards Grid Display */}
        {!browseBooks || browseBooks.length === 0 ? (
          <div className="w-full text-center py-20 border border-dashed border-white/5 rounded-3xl bg-[#0D1035]/20">
            <p className="text-gray-400 font-medium">
              No masterpieces found on the shelves right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-7">
            {browseBooks.map((book) => (
              <BookCard key={book?._id?.['$oid'] || book?._id || Math.random()} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}