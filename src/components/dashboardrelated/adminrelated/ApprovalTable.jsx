'use client';

import React, { useState, useTransition, useMemo } from 'react';
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  handleApproveBookAction,
  handleAdminDeleteBookAction,
} from '@/lib/actions/admin';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Delete Confirm Dialog
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState('dateAdded');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isPending, startTransition] = useTransition();

  // Get unique categories
  const categories = useMemo(() => {
    const unique = new Set();
    books.forEach((book) => {
      if (book.category && book.category.trim() !== '') {
        unique.add(book.category.toLowerCase());
      }
    });
    return ['all', ...Array.from(unique)];
  }, [books]);

  // Filter, Sort & Paginate
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase()) ||
        book.librarianName?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === 'all' ||
        book.category?.toLowerCase() === filterCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [books, search, filterCategory]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredBooks, sortField, sortDirection]);

  const totalItems = sortedBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = sortedBooks.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document
      .querySelector('.overflow-x-auto')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterChange = (value) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 3) end = 4;
    if (currentPage >= totalPages - 2) start = totalPages - 3;
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

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
          toast.success('Book approved successfully!');
        } else {
          toast.error(result?.error || 'Failed to approve book');
        }
      } catch (err) {
        console.error('Approve failed:', err);
        toast.error('Something went wrong');
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
          toast.success('Book deleted successfully');
        } else {
          toast.error(result?.error || 'Failed to delete book');
        }
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Something went wrong');
      } finally {
        setLoadingId(null);
        setLoadingAction(null);
        setDeleteTarget(null);
      }
    });
  };

  const SortableHeader = ({ field, children, width }) => (
    <th
      onClick={() => handleSort(field)}
      className={`${width} px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap cursor-pointer hover:text-white transition-colors group`}
    >
      <div className="flex items-center gap-1.5">
        {children}
        <ArrowUpDown
          size={11}
          className="opacity-30 group-hover:opacity-100 transition-opacity"
        />
        {sortField === field &&
          (sortDirection === 'asc' ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          ))}
      </div>
    </th>
  );

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
        {/* Top Bar with Search & Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-400 text-xs font-medium">
              <span className="text-amber-400 font-bold">{books.length}</span>{' '}
              submission{books.length !== 1 ? 's' : ''} awaiting review
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-44">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={13} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500/30 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-1.5 pr-8 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer min-w-[120px]"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== 'all')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
              </select>
              <Filter
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>

            {/* Active Filter Badge */}
            {filterCategory !== 'all' && (
              <button
                onClick={() => handleFilterChange('all')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium hover:bg-amber-500/20 transition-all whitespace-nowrap"
              >
                <span>Filter: {filterCategory}</span>
                <X size={12} className="hover:text-amber-300" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                <SortableHeader field="title" width="w-48">
                  Title
                </SortableHeader>
                <SortableHeader field="author" width="w-32">
                  Author
                </SortableHeader>
                <SortableHeader field="category" width="w-24">
                  Category
                </SortableHeader>
                <SortableHeader field="price" width="w-20">
                  Fee
                </SortableHeader>
                <SortableHeader field="librarianName" width="w-36">
                  Librarian
                </SortableHeader>
                <SortableHeader field="dateAdded" width="w-28">
                  Date
                </SortableHeader>
                <th className="w-40 px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/30">
              <AnimatePresence>
                {currentBooks.map((book, index) => {
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
                        <p className="font-semibold text-slate-100 text-sm leading-snug group-hover:text-white transition-colors line-clamp-1 max-w-[160px]">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/60 bg-slate-900/60">
            <span className="text-xs text-slate-500">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of{' '}
              {totalItems}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-amber-500/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
              >
                <ChevronLeft size={15} />
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-7 text-center text-slate-500 text-xs"
                    >
                      …
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 text-xs font-bold rounded-lg border transition-all ${
                      currentPage === page
                        ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        : 'border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-amber-500/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between">
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
