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

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="mb-8 border-b border-slate-100 dark:border-white/5 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Manage Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Overview, status control, and publishing actions for your listed
            catalog.
          </p>
        </div>
        <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 rounded-xl px-4 py-2.5 text-xs font-semibold text-violet-700 dark:text-violet-400 flex items-center gap-2 self-start sm:self-center">
          <BookOpen size={14} />
          Your Titles: {booksData.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 rounded-2xl shadow-xl shadow-slate-100/40 dark:shadow-none backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Book Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Delivery Fee</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
              {booksData.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-600">
                      <PackageOpen size={40} strokeWidth={1.2} />
                      <p className="font-medium text-sm">
                        No books listed under your account.
                      </p>
                      <Link
                        href="/dashboard/librarian/add-book"
                        className="mt-1 text-xs font-semibold text-violet-600 dark:text-amber-400 hover:underline underline-offset-4"
                      >
                        + Add your first book
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
                      className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      {/* Book Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/10 shrink-0 transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={
                                book.coverImage ||
                                'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
                              }
                              alt={book.title || 'Book Cover'}
                              fill
                              sizes="48px"
                              className="object-cover"
                              priority={true}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-amber-400 transition-colors">
                              {book.title}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                              by {book.author}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                              ${Number(book.price || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Layers size={14} className="text-slate-400" />
                          {formattedCategory}
                        </div>
                      </td>

                      {/* Delivery Fee */}
                      <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-semibold">
                        <div className="flex items-center">
                          <DollarSign
                            size={14}
                            className="text-slate-400 mr-0.5"
                          />
                          {Number(book.deliveryFee || 0).toFixed(2)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {book.status === 'Published' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                            Published
                          </span>
                        )}
                        {book.status === 'Unpublished' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
                            Unpublished
                          </span>
                        )}
                        {(book.status === 'Pending Approval' ||
                          book.status === 'Pending Delivery' ||
                          !book.status) && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                            {book.status || 'Pending Approval'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
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
      </div>
    </div>
  );
};

export default ManageInventoryPage;
