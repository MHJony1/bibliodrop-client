import React from 'react';
import { getLibrarianBooks } from '@/lib/api/books';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import InventoryTable from '@/components/dashboardrelated/librarianrelated/InventoryTable';

const ManageInventoryPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const loggedInUserEmail = session?.user?.email;

  const apiResponse = await getLibrarianBooks(loggedInUserEmail);
  const booksData =
    apiResponse?.data && Array.isArray(apiResponse.data)
      ? apiResponse.data
      : [];

  // Calculate stats
  const totalBooks = booksData.length;
  const publishedBooks = booksData.filter(
    (b) => b.status === 'Published',
  ).length;
  const pendingBooks = booksData.filter(
    (b) => b.status === 'Pending Approval' || b.status === 'Pending Delivery',
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
              <BookOpen size={22} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Manage Inventory
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Overview, status control, and publishing actions for your listed
                catalog.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <BookOpen size={14} className="text-violet-400" />
            <span className="text-xs text-violet-400 font-semibold">
              {totalBooks} Titles
            </span>
          </div>
          <Link
            href="/dashboard/librarian/add-book"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(109,74,255,0.3)] transition-all flex items-center gap-2"
          >
            Add Book
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Total Books</p>
          <p className="text-2xl font-bold text-white mt-1">{totalBooks}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Published</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {publishedBooks}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {pendingBooks}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Unpublished</p>
          <p className="text-2xl font-bold text-slate-400 mt-1">
            {totalBooks - publishedBooks - pendingBooks}
          </p>
        </div>
      </div>

      {/* Table with Search, Filter & Pagination */}
      <InventoryTable books={booksData} />
    </div>
  );
};

export default ManageInventoryPage;
