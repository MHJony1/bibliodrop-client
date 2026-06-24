'use client';

import React, { useRef, useState, useEffect } from 'react';
import { getBooks } from '@/lib/api/books';
import { Sparkles, Library, ArrowRight } from 'lucide-react';
import BookCard from '@/components/booksrelated/BookCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// 1. Inner Component with Swiper
function BookGridContent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const apiResponse = await getBooks({ availability: 'available' });
        let allBooks = [];
        if (Array.isArray(apiResponse)) {
          allBooks = apiResponse;
        } else if (apiResponse && Array.isArray(apiResponse.data)) {
          allBooks = apiResponse.data;
        } else if (apiResponse && Array.isArray(apiResponse.books)) {
          allBooks = apiResponse.books;
        }
        // Filter only available books
        const availableBooks = allBooks.filter(
          (book) => book.status === 'Published' || book.status === 'Available',
        );
        setBooks(availableBooks.slice(0, 8));
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <SkeletonLoader count={8} />;
  }

  if (books.length === 0) {
    return (
      <div className="w-full text-center py-20 border border-dashed border-white/[0.07] rounded-2xl bg-[#0D1033]/30 backdrop-blur-sm flex flex-col items-center justify-center col-span-full">
        <Library size={32} className="text-[#6D4AFF]/30 mb-3" />
        <p className="text-gray-400 text-sm font-semibold m-0">
          No premium books available right now.
        </p>
      </div>
    );
  }

  // Mobile: Swiper Slider
  if (isMobile) {
    return (
      <div className="relative w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={12}
          slidesPerView={1.1}
          centeredSlides={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.3,
              spaceBetween: 12,
              centeredSlides: true,
            },
            640: {
              slidesPerView: 1.8,
              spaceBetween: 14,
              centeredSlides: false,
            },
          }}
          className="w-full pb-14"
        >
          {books.map((book) => (
            <SwiperSlide
              key={book?._id?.['$oid'] || book?._id || Math.random()}
              className="flex justify-center"
            >
              <div className="w-full max-w-[280px] sm:max-w-[300px] transition-all duration-300 ease-out">
                <BookCard book={book} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Dots - Spaced properly */}
        <style jsx global>{`
          .swiper-pagination {
            bottom: 0px !important;
            position: relative !important;
            margin-top: 20px !important;
          }
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.25) !important;
            opacity: 1 !important;
            width: 8px !important;
            height: 8px !important;
            margin: 0 5px !important;
          }
          .swiper-pagination-bullet-active {
            background: #f7b500 !important;
            width: 24px !important;
            border-radius: 4px !important;
            height: 8px !important;
          }
        `}</style>
      </div>
    );
  }

  // Desktop: Grid View
  return (
    <>
      {books.map((book) => (
        <div
          key={book?._id?.['$oid'] || book?._id || Math.random()}
          className="hover:-translate-y-2 transition-all duration-300 ease-out"
        >
          <BookCard book={book} />
        </div>
      ))}
    </>
  );
}

// 2. Main Component
const FeaturedBooks = () => {
  return (
    <section className="w-full py-20 sm:py-24 relative bg-[#060814] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#6D4AFF]/8 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/5 bg-[#0D1033]/60 backdrop-blur-md text-[10px] font-bold tracking-[0.15em] text-[#6D4AFF] uppercase shadow-[0_0_15px_rgba(109,74,255,0.05)]">
            <Sparkles size={11} className="text-[#F7B500]" />
            PREMIUM ARCHIVE
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white m-0 font-sans leading-none">
            Featured{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF] via-[#FFEBB3] to-[#F7B500]">
              Masterpieces
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-medium m-0 leading-relaxed mt-3">
            Explore our curated collection of{' '}
            <span className="text-[#F7B500] font-bold">
              premium masterpieces
            </span>{' '}
            from elite worldwide repositories.
          </p>
        </div>

        {/* Grid / Swiper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          <BookGridContent />
        </div>

        {/* Button */}
        <div className="w-full flex justify-center mt-14">
          <Link
            href="/browsebooks"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs sm:text-sm font-extrabold text-black bg-[#F7B500] hover:bg-[#E0A300] rounded-xl shadow-[0_4px_20px_rgba(247,181,0,0.25)] hover:shadow-[0_4px_30px_rgba(247,181,0,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 no-underline group tracking-wider"
          >
            Explore All Books
            <ArrowRight
              size={16}
              className="text-black group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
