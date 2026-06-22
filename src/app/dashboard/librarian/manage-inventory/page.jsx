import React from 'react';
import { getLibrarianBooks } from '@/lib/api/books';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Layers,
  DollarSign,
  PackageOpen,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BookActionButtons from '@/components/dashboardrelated/librarianrelated/BookActionButtons';

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

      {/* Table */}
      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900/30 backdrop-blur-sm">
        <div className="px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            <span className="text-white font-bold">{totalBooks}</span> books in
            your catalog
            <span className="text-slate-500 ml-2">
              • {publishedBooks} published • {pendingBooks} pending
            </span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                {[
                  'Book Details',
                  'Category',
                  'Price',
                  'Delivery Fee',
                  'Status',
                  'Actions',
                ].map((head, index) => (
                  <th
                    key={head}
                    className={`px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap ${
                      index === 0 ? 'pl-6' : ''
                    } ${index === 5 ? 'text-right' : ''}`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {booksData.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="p-6 rounded-full bg-slate-800/40 border border-slate-700/50 mb-4">
                        <PackageOpen size={40} className="text-slate-600" />
                      </div>
                      <p className="text-slate-400 font-medium">
                        No books listed yet
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Start by adding your first book
                      </p>
                      <Link
                        href="/dashboard/librarian/add-book"
                        className="mt-4 px-6 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-400 text-sm font-medium hover:bg-violet-500/30 transition-all"
                      >
                        + Add Book
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                booksData.map((book) => {
                  const formattedCategory = book.category
                    ? book.category.charAt(0).toUpperCase() +
                      book.category.slice(1)
                    : 'N/A';

                  return (
                    <tr
                      key={book._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Book Info */}
                      <td className="px-5 py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 shrink-0 transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={
                                book.coverImage ||
                                'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
                              }
                              alt={book.title || 'Book Cover'}
                              fill
                              sizes="40px"
                              className="object-cover"
                              priority
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-white truncate max-w-[200px] group-hover:text-violet-400 transition-colors">
                              {book.title || 'Untitled'}
                            </span>
                            <span className="text-xs text-slate-500 truncate">
                              by {book.author || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-medium text-violet-400">
                          <Layers size={11} />
                          {formattedCategory}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-white">
                          ${Number(book.price || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Delivery Fee */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-300 flex items-center gap-0.5">
                          <DollarSign size={14} className="text-slate-500" />
                          {Number(book.deliveryFee || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {book.status === 'Published' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Published
                          </span>
                        )}
                        {book.status === 'Unpublished' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Unpublished
                          </span>
                        )}
                        {(book.status === 'Pending Approval' ||
                          book.status === 'Pending Delivery' ||
                          !book.status) && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            {book.status || 'Pending'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <BookActionButtons
                          bookId={book._id.toString()}
                          initialStatus={book.status}
                          book={book}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing{' '}
            <span className="text-white font-medium">{booksData.length}</span>{' '}
            books
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock size={12} />
            Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManageInventoryPage;
