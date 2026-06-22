import { getBookById } from '@/lib/api/books';
import { getUserSession } from '@/lib/core/session';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Bookmark,
} from 'lucide-react';
import ActionButtons from './ActionButtons';
import ReviewsSection from './ReviewsSection';

export const dynamic = 'force-dynamic';

export default async function BookDetailsPage({ params }) {
  const { bookId } = await params;

  const [dbResponse, currentUser] = await Promise.all([
    getBookById(bookId),
    getUserSession(),
  ]);

  const book = dbResponse?.data || dbResponse;

  if (!book) {
    return (
      <div className="min-h-screen bg-[#0D1530] flex items-center justify-center text-white">
        <p className="text-xl font-medium text-gray-400">
          Book data loading failed or not found!
        </p>
      </div>
    );
  }

  // ✅ Fixed: email-based librarian owner check (userId match করে না সবসময়)
  const currentUserEmail = currentUser?.email?.trim().toLowerCase();
  const bookOwnerEmail = book?.librarianEmail?.trim().toLowerCase();
  const isLibrarianOwner =
    currentUser?.role === 'librarian' &&
    currentUserEmail &&
    bookOwnerEmail &&
    currentUserEmail === bookOwnerEmail;

  const hasPurchased = book?.buyers?.includes(currentUser?.id) || false;

  // Price calculation
  const bookPrice = book?.price !== undefined ? Number(book.price) : 0;
  const deliveryFee =
    book?.deliveryFee !== undefined ? Number(book.deliveryFee) : 0;
  const totalPayable = bookPrice + deliveryFee;

  // Category color theme
  const categoryColors = {
    romance: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
    academic: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
    biography: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    fiction: 'bg-violet-500/15 text-violet-200 border-violet-500/30',
    science: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    history: 'bg-orange-500/15 text-orange-200 border-orange-500/30',
    'self-help': 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30',
    'sci-fi': 'bg-purple-500/15 text-purple-200 border-purple-500/30',
  };
  const currentCategory = (book?.category || 'General').toLowerCase();
  const catStyle =
    categoryColors[currentCategory] ||
    'bg-teal-500/15 text-teal-200 border-teal-500/30';

  // Dynamic Status Badge Theme
  const statusColors = {
    Published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Checked Out': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Pending Delivery': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Pending Approval': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Unpublished: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  const currentStatus = book?.status || 'Published';
  const statusStyle =
    statusColors[currentStatus] ||
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  const formattedDate = book?.dateAdded
    ? new Date(book.dateAdded).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-linear-to-br from-[#121B3A] via-[#0E152E] to-[#0A0E22] text-[#D1D5DB] antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-8">

        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/browsebooks"
            className="inline-flex items-center gap-2 text-sm text-[#A0AEC0] hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Catalog
          </Link>
        </div>

        {/* Showcase Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Left Side: Image Showcase */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="relative w-full max-w-107.5 md:max-w-112.5 aspect-square rounded-[2rem] overflow-hidden bg-[#16224F]/40 border border-white/8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/15">
              <Image
                src={
                  book?.coverImage ||
                  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'
                }
                alt={book?.title || 'Book Cover'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center"
              />

              {/* Dynamic Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border backdrop-blur-md ${statusStyle}`}
                >
                  {book?.status || 'Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Content Information */}
          <div className="flex flex-col gap-5 justify-center">
            <div className="space-y-2.5">
              <span
                className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${catStyle}`}
              >
                {book?.category || 'General'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {book?.title}
              </h1>
              <p className="text-sm sm:text-base text-[#A3AED0]">
                by{' '}
                <span className="text-white font-semibold">
                  {book?.author || 'Unknown Author'}
                </span>
              </p>
            </div>

            <div className="w-12 h-0.5 bg-white/[0.1]" />

            <p className="text-xs sm:text-sm text-[#B0BBD8] leading-relaxed max-w-xl">
              {book?.description || 'No description provided for this book.'}
            </p>

            {/* Pricing Card */}
            <div className="bg-[#111A3E]/80 border border-white/[0.06] backdrop-blur-sm rounded-2xl p-5 max-w-md space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                <div className="flex items-center gap-2.5">
                  <Bookmark size={16} className="text-[#A3AED0]" />
                  <p className="text-xs sm:text-sm text-[#A3AED0]">
                    Book Price
                  </p>
                </div>
                <p className="text-white text-sm font-bold">
                  ${bookPrice.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                <div className="flex items-center gap-2.5">
                  <DollarSign size={16} className="text-[#A3AED0]" />
                  <p className="text-xs sm:text-sm text-[#A3AED0]">
                    Delivery Fee
                  </p>
                </div>
                <p className="text-[#F5C842] text-sm font-bold">
                  ${deliveryFee.toFixed(2)}
                </p>
              </div>

              {/* Total Payable */}
              <div className="flex items-center justify-between bg-white/[0.02] -mx-5 -mb-3 p-3 px-5 border-t border-white/[0.05] rounded-b-2xl">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={16} className="text-indigo-400" />
                  <p className="text-xs uppercase tracking-wider font-bold text-indigo-300">
                    Total Payable
                  </p>
                </div>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-base font-black">
                  ${totalPayable.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 max-w-md">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-[#B0BBD8]">
                <User size={14} className="text-indigo-400" />
                <span>
                  Listed by:{' '}
                  <strong className="text-white font-semibold">
                    {book.librarianName || book.librarianEmail || 'System Librarian'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-[#B0BBD8]">
                <Calendar size={14} className="text-purple-400" />
                <span>
                  Date Cataloged:{' '}
                  <strong className="text-white font-semibold">
                    {formattedDate}
                  </strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="max-w-md pt-1">
              <ActionButtons
                bookId={bookId}
                status={book?.status || 'Available'}
                currentUser={currentUser}
                isLibrarianOwner={isLibrarianOwner}
                book={book}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/6 pt-12 pb-20">
        <ReviewsSection
          bookId={bookId}
          currentUser={currentUser}
          hasPurchased={hasPurchased}
          reviews={book?.reviews || []}
        />
      </div>
    </div>
  );
}