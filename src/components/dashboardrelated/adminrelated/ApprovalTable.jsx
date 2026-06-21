'use client';

import React, { useState, useTransition } from 'react';
import { Trash2, CheckCircle2, BookOpen, Loader2, AlertTriangle, X } from 'lucide-react';
import {
  handleApproveBookAction,
  handleAdminDeleteBookAction,
} from '@/lib/actions/admin';

// ✅ Confirmation Dialog Component
const DeleteConfirmDialog = ({ book, onConfirm, onCancel, isDeleting }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base leading-tight">Delete Book?</h3>
            <p className="text-slate-500 text-xs mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        {/* Book info */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 mb-6">
          <p className="text-slate-200 font-semibold text-sm line-clamp-1">{book?.title || 'Untitled'}</p>
          <p className="text-slate-500 text-xs mt-0.5">by {book?.author || '—'}</p>
        </div>

        {/* Buttons */}
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
              <><Loader2 size={14} className="animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 size={14} /> Yes, Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ApprovalTable = ({ books: initialBooks }) => {
  const [books, setBooks] = useState(initialBooks);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // ✅ Dialog state
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

  // ✅ Delete: dialog 
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
      <div className="flex flex-col items-center justify-center py-24 border border-slate-800/50 rounded-3xl bg-slate-900/20">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4 border border-slate-700/50">
          <BookOpen className="text-slate-500" size={26} />
        </div>
        <p className="text-slate-300 font-semibold text-lg">All caught up!</p>
        <p className="text-slate-500 text-sm mt-1.5">No pending book submissions right now.</p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          book={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={loadingId === deleteTarget._id && loadingAction === 'delete'}
        />
      )}

      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/50">
        {/* Top bar */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800/60 flex items-center backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-400 text-xs font-medium">
              <span className="text-amber-400 font-bold">{books.length}</span>{' '}
              submission{books.length !== 1 ? 's' : ''} awaiting review
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-[#070d1a]">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                {[
                  { label: 'Title', width: 'w-56' },
                  { label: 'Author', width: 'w-40' },
                  { label: 'Category', width: 'w-32' },
                  { label: 'Fee', width: 'w-24' },
                  { label: 'Librarian', width: 'w-44' },
                  { label: 'Date', width: 'w-32' },
                  { label: 'Actions', width: 'w-36' },
                ].map(({ label, width }) => (
                  <th key={label} className={`${width} px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/30">
              {books.map((book) => {
                const isThisLoading = loadingId === book._id;

                return (
                  <tr
                    key={book._id}
                    className={`group transition-all duration-300 ${
                      isThisLoading
                        ? 'opacity-40 pointer-events-none bg-slate-800/10'
                        : 'hover:bg-slate-800/20'
                    }`}
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-100 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2 max-w-[200px]">
                        {book.title || 'Untitled'}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-slate-400 text-sm">{book.author || '—'}</span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold uppercase tracking-wider text-violet-400 whitespace-nowrap">
                        {book.category || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-slate-200 font-mono font-semibold text-sm">
                        ${parseFloat(book.price || 0).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-slate-400 text-sm">{book.librarianName || '—'}</span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-slate-500 text-xs font-mono whitespace-nowrap">
                        {formatDate(book)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
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

                        {/* ✅ Delete button */}
                        <button
                          onClick={() => setDeleteTarget(book)}
                          disabled={isThisLoading}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300 transition-all duration-200 disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ApprovalTable;