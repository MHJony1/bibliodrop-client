'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import {
  Heart,
  RefreshCw,
  BookOpen,
  Trash2,
  HeartOff,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { getWishlist, removeFromWishlist } from '@/lib/api/wishlist';

const WishlistCard = ({ item, onRemove }) => {
  const { book, addedAt } = item;
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group bg-[#0D1033]/60 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#6D4AFF]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(109,74,255,0.08)]"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              width={80}
              height={100}
              className="w-20 h-28 rounded-lg object-cover bg-[#0E1330] border border-white/[0.06]"
              unoptimized
            />
          ) : (
            <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-[#6D4AFF]/20 to-[#4A2FE8]/10 border border-white/[0.06] flex items-center justify-center">
              <BookOpen size={24} className="text-[#6D4AFF]/30" />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                href={`/browsebooks/${item.bookId}`}
                className="text-base font-semibold text-white hover:text-[#A78BFA] transition-colors"
              >
                {book.title || 'Unknown Book'}
              </Link>
              <p className="text-sm text-[#8890B5]">by {book.author || 'Unknown'}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#6D4AFF]/10 text-[#A78BFA] border border-[#6D4AFF]/20">
                  {book.category || 'General'}
                </span>
                <span className="text-xs text-[#8890B5]">
                  ${book.price?.toFixed(2) || '0.00'}
                </span>
                <span className="text-xs text-[#8890B5]">
                  Added: {formatDate(addedAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/browsebooks/${item.bookId}`}
                className="p-2 rounded-lg hover:bg-[#6D4AFF]/10 text-[#8890B5] hover:text-[#A78BFA] transition-all"
                title="View Book"
              >
                <Eye size={18} />
              </Link>
              <button
                onClick={() => onRemove(item.bookId)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-[#8890B5] hover:text-red-400 transition-all"
                title="Remove from wishlist"
              >
                <HeartOff size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    totalPrice: 0,
  });

  const loadWishlist = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const result = await getWishlist(session.user.email);
      if (result?.success) {
        const data = result.data || [];
        setWishlist(data);

        // Calculate stats
        const uniqueCategories = new Set(
          data.map(item => item.book?.category).filter(Boolean)
        );
        const totalPrice = data.reduce(
          (sum, item) => sum + (item.book?.price || 0),
          0
        );

        setStats({
          total: data.length,
          categories: uniqueCategories.size,
          totalPrice,
        });
      } else {
        toast.error(result?.message || 'Failed to load wishlist');
      }
    } catch (error) {
      console.error('Load Wishlist Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadWishlist();
    }
  }, [session]);

  const handleRemove = async (bookId) => {
    if (!confirm('Remove this book from your wishlist?')) return;

    try {
      const result = await removeFromWishlist(session.user.email, bookId);
      if (result?.success) {
        toast.success('Removed from wishlist');
        loadWishlist();
      } else {
        toast.error(result?.message || 'Failed to remove');
      }
    } catch (error) {
      console.error('Remove Error:', error);
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#6D4AFF]/20 border-t-[#6D4AFF] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={20} className="text-[#6D4AFF]/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6D4AFF]/20 to-[#4A2FE8]/10 border border-[#6D4AFF]/20 backdrop-blur-sm">
              <Heart size={22} className="text-[#A78BFA]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Wishlist
              </h1>
              <p className="text-sm text-[#8890B5] mt-0.5">
                Books you've saved for later. ({wishlist.length} total)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadWishlist}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-2 text-sm disabled:opacity-50 group"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1033] to-[#0E1330]/60 border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Heart size={18} className="text-rose-400" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium uppercase tracking-wider">Total Books</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1033] to-[#0E1330]/60 border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <BookOpen size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium uppercase tracking-wider">Categories</p>
                <p className="text-2xl font-bold text-white">{stats.categories}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1033] to-[#0E1330]/60 border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <ShoppingBag size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium uppercase tracking-wider">Total Value</p>
                <p className="text-2xl font-bold text-white">${stats.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-white/[0.07] bg-[#0D1033]/40 text-center"
        >
          <div className="p-6 rounded-full bg-[#6D4AFF]/10 border border-[#6D4AFF]/20 mb-6">
            <Heart size={48} className="text-[#6D4AFF]/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
          <p className="text-[#8890B5] text-sm max-w-sm">
            Start exploring books and save your favorites for later!
          </p>
          <Link
            href="/browsebooks"
            className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#4A2FE8] text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(109,74,255,0.3)] transition-all flex items-center gap-2 group"
          >
            Browse Books
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {wishlist.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}