'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import { 
  fetchAllBooksAction, 
  handleToggleBookStatusAction, 
  handleAdminDeleteBookAction 
} from '@/lib/actions/admin';
import ManageBooksTable from '@/components/dashboardrelated/adminrelated/ManageBooksTable';

export default function ManageBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const result = await fetchAllBooksAction();
      if (result.success) {
        setBooks(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load books');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Load Books Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleToggleStatus = async (bookId, status) => {
    const result = await handleToggleBookStatusAction(bookId, status);
    if (result.success) {
      await loadBooks();
    }
    return result;
  };

  const handleDelete = async (bookId) => {
    const result = await handleAdminDeleteBookAction(bookId);
    if (result.success) {
      await loadBooks(); // Refresh table
    }
    return result;
  };

  const handleViewBook = (bookId) => {
    router.push(`/books/${bookId}`);
  };

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
                Manage All Books
              </h1>
              <p className="text-sm text-[#8890B5]">
                Oversee all books on the platform. ({books.length} total)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadBooks}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <ManageBooksTable
        books={books}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onView={handleViewBook}
      />
    </div>
  );
}