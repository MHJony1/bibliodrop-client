'use client';

import React, { useState, useTransition } from 'react';
import {
  Trash2,
  CheckCircle2,
  BookOpen,
  Loader2,
  AlertTriangle,
  X,
  Clock,
  User,
  Calendar,
  DollarSign,
  Tag,
} from 'lucide-react';
import {
  handleApproveBookAction,
  handleAdminDeleteBookAction,
} from '@/lib/actions/admin';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Confirmation Dialog Component
const DeleteConfirmDialog = ({ book, onConfirm, onCancel, isDeleting }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              Delete Book?
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 mb-6">
          <p className="text-white font-semibold text-sm line-clamp-1">
            {book?.title || 'Untitled'}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            by {book?.author || '—'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-slate-700/60 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} /> Yes, Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ApprovalTable = ({ books: initialBooks }) => {
  const [books, setBooks] = useState(initialBooks);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const formatDate = (book) => {
    const raw = book.dateAdded || book.createdAt;
    if (!raw) return '—';
    const date = new Date(raw);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filter books
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.librarianName?.toLowerCase().includes(search.toLowerCase()),
  );

  const performApprove = async (id) => {
    setLoadingId(id);
    setLoadingAction('approve');
    startTransition(async () => {
      try {
        const result = await handleApproveBookAction(id);
        if (result?.success) {
          setBooks((prev) => prev.filter((b) => b._id !== id));
        }
      } catch (err) {
        console.error('Approve failed:', err);
      } finally {
        setLoadingId(null);
        setLoadingAction(null);
      }
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setLoadingId(id);
    setLoadingAction('delete');

    startTransition(async () => {
      try {
        const result = await handleAdminDeleteBookAction(id);
        if (result?.success) {
          setBooks((prev) => prev.filter((b) => b._id !== id));
        }
      } catch (err) {
        console.error('Delete failed:', err);
      } finally {
        setLoadingId(null);
        setLoadingAction(null);
        setDeleteTarget(null);
      }
    });
  };

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-slate-700/50 bg-slate-900/20">
        <div className="p-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <CheckCircle2 size={48} className="text-emerald-400/60" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">All caught up! 🎉</h3>
        <p className="text-slate-400 text-sm max-w-sm text-center">
          No pending book submissions right now. All books have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmDialog
            book={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={
              loadingId === deleteTarget._id && loadingAction === 'delete'
            }
          />
        )}
      </AnimatePresence>

      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/50 bg-slate-900/30 backdrop-blur-sm">
        {/* Top Bar with Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-400 text-xs font-medium">
              <span className="text-amber-400 font-bold">{books.length}</span>{' '}
              submission{books.length !== 1 ? 's' : ''} awaiting review
            </span>
          </div>

          <div className="relative w-full sm:w-56">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500/30 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                {[
                  { label: 'Title', width: 'w-52' },
                  { label: 'Author', width: 'w-36' },
                  { label: 'Category', width: 'w-28' },
                  { label: 'Fee', width: 'w-20' },
                  { label: 'Librarian', width: 'w-40' },
                  { label: 'Date', width: 'w-28' },
                  { label: 'Actions', width: 'w-40' },
                ].map(({ label, width }) => (
                  <th
                    key={label}
                    className={`${width} px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/30">
              <AnimatePresence>
                {filteredBooks.map((book, index) => {
                  const isThisLoading = loadingId === book._id;

                  return (
                    <motion.tr
                      key={book._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className={`group transition-all duration-300 ${
                        isThisLoading
                          ? 'opacity-40 pointer-events-none bg-slate-800/10'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-100 text-sm leading-snug group-hover:text-white transition-colors line-clamp-1 max-w-[180px]">
                          {book.title || 'Untitled'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-slate-400 text-sm">
                          {book.author || '—'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold uppercase tracking-wider text-violet-400 whitespace-nowrap">
                          <Tag size={10} />
                          {book.category || 'N/A'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-slate-200 font-mono font-semibold text-sm flex items-center gap-1">
                          <DollarSign size={12} className="text-slate-500" />
                          {parseFloat(book.price || 0).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-slate-400 text-sm flex items-center gap-1.5">
                          <User size={12} className="text-slate-500" />
                          {book.librarianName || '—'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-slate-500 text-xs flex items-center gap-1.5">
                          <Calendar size={11} className="text-slate-600" />
                          {formatDate(book)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* Approve */}
                          <button
                            onClick={() => performApprove(book._id)}
                            disabled={isThisLoading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 hover:text-emerald-300 transition-all duration-200 text-xs font-semibold whitespace-nowrap disabled:opacity-50"
                          >
                            {isThisLoading && loadingAction === 'approve' ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            Approve
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(book)}
                            disabled={isThisLoading}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300 transition-all duration-200 disabled:opacity-50 group-hover:scale-105"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing{' '}
            <span className="text-white font-medium">
              {filteredBooks.length}
            </span>{' '}
            of <span className="text-white font-medium">{books.length}</span>{' '}
            pending books
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock size={12} />
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </>
  );
};

export default ApprovalTable;
