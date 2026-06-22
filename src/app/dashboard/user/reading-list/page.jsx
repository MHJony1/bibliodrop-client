'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { 
  BookOpen, 
  RefreshCw, 
  Library,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReadingListCard from '@/components/dashboardrelated/userrelated/ReadingListCard';
import { getUserReadingList } from '@/lib/api/user';

export default function ReadingListPage() {
  const { data: session, isPending } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    totalSpent: 0,
  });

  const loadReadingList = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    try {
      const result = await getUserReadingList(session.user.email);
      console.log('📚 Reading List Response:', result);
      
      if (result?.success) {
        const data = result.data || [];
        setBooks(data);
        
        // ✅ Calculate stats
        const uniqueCategories = new Set(data.map(b => b.category).filter(Boolean));
        const totalSpent = data.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
        
        setStats({
          total: data.length,
          categories: uniqueCategories.size,
          totalSpent,
        });
      } else {
        toast.error(result?.message || 'Failed to load reading list');
      }
    } catch (error) {
      console.error('Load Reading List Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadReadingList();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D4AFF]"></div>
      </div>
    );
  }

  const statsCards = [
    {
      icon: BookOpen,
      label: 'Books Read',
      value: stats.total,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Library,
      label: 'Categories',
      value: stats.categories,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6D4AFF]/10 border border-[#6D4AFF]/20">
              <BookOpen size={20} className="text-[#A78BFA]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                My Reading List
              </h1>
              <p className="text-sm text-[#8890B5]">
                Books you&apos;ve successfully read. ({books.length} total)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadReadingList}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl bg-[#0D1033]/60 border ${stat.border} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-white">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reading List Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-[3/4] bg-[#0E1330]/60 rounded-2xl" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-[#0E1330]/60 rounded-lg w-3/4" />
                <div className="h-3 bg-[#0E1330]/60 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/[0.07] bg-[#0D1033]/40 text-center">
          <BookOpen size={40} className="text-[#6D4AFF]/30 mb-4" />
          <p className="text-[#8890B5] text-sm font-medium">No books in your reading list yet</p>
          <p className="text-[#565C7A] text-xs mt-1">Start browsing and read some books!</p>
          <button
            onClick={() => window.location.href = '/browsebooks'}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[#6D4AFF] hover:bg-[#7A58FF] text-white text-sm font-medium transition-all"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {books.map((book, index) => (
            <ReadingListCard key={book._id || index} book={book} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}