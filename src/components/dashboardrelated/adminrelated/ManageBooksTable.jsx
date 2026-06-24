'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  BookOpen,
  Filter,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const statusColors = {
  'Pending Approval': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Published: 'bg-green-500/20 text-green-400 border-green-500/30',
  Unpublished: 'bg-red-500/20 text-red-400 border-red-500/30',
  'Checked Out': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const statusIcons = {
  'Pending Approval': <Clock size={14} />,
  Published: <CheckCircle size={14} />,
  Unpublished: <XCircle size={14} />,
  'Checked Out': <BookOpen size={14} />,
  Available: <CheckCircle size={14} />,
};

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, bookTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0D1033] border border-white/[0.06] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Delete Book</h3>
        </div>

        <p className="text-[#8890B5] text-sm mb-2">
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">&quot;{bookTitle}&quot;</span>?
        </p>
        <p className="text-[#565C7A] text-xs mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all text-sm"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ManageBooksTable({
  books = [],
  loading = false,
  onToggleStatus,
  onDelete,
  onView,
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bookId: null,
    bookTitle: '',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter & Sort Logic
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase()) ||
        book.category?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === 'All' || book.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

  // Pagination Logic
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document
      .querySelector('.overflow-x-auto')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (bookId, currentStatus) => {
    const newStatus =
      currentStatus === 'Published' ? 'Unpublished' : 'Published';
    const result = await onToggleStatus(bookId, newStatus);
    if (result?.success) {
      toast.success(
        `Book ${newStatus === 'Published' ? 'Published' : 'Unpublished'} successfully!`,
      );
    } else {
      toast.error(result?.error || 'Failed to update status');
    }
  };

  const handleDeleteClick = (bookId, bookTitle) => {
    setDeleteModal({ isOpen: true, bookId, bookTitle });
  };

  const handleConfirmDelete = async () => {
    const { bookId } = deleteModal;
    const result = await onDelete(bookId);
    if (result?.success) {
      toast.success('Book deleted successfully!');
      setDeleteModal({ isOpen: false, bookId: null, bookTitle: '' });
    } else {
      toast.error(result?.error || 'Failed to delete book');
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-bold text-[#8890B5] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortField === field &&
          (sortDirection === 'asc' ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          ))}
      </div>
    </th>
  );

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-[#0E1330]/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, bookId: null, bookTitle: '' })
        }
        onConfirm={handleConfirmDelete}
        bookTitle={deleteModal.bookTitle}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890B5]"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white placeholder-[#8890B5] focus:outline-none focus:border-[#6D4AFF] transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full sm:w-44 px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white text-sm focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8890B5] pointer-events-none"
              size={14}
            />
          </div>
          <span className="text-xs text-[#8890B5] whitespace-nowrap">
            {totalItems} books
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0D1033]/40 backdrop-blur-sm">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-white/[0.06] bg-[#0E1330]/60">
            <tr>
              <SortableHeader field="title">Title</SortableHeader>
              <SortableHeader field="author">Author</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="price">Price</SortableHeader>
              <SortableHeader field="librarian">Librarian</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-4 py-3 text-right text-xs font-bold text-[#8890B5] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentBooks.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-16 text-center text-[#8890B5]"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen size={40} className="text-[#6D4AFF]/30" />
                      <p className="text-sm font-medium">No books found</p>
                      <p className="text-xs text-[#565C7A]">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentBooks.map((book, index) => {
                  const statusKey = book.status || 'Pending Approval';
                  const statusColor =
                    statusColors[statusKey] || statusColors['Pending Approval'];
                  const statusIcon =
                    statusIcons[statusKey] || statusIcons['Pending Approval'];
                  const isPublished = statusKey === 'Published';
                  const isPending = statusKey === 'Pending Approval';

                  return (
                    <motion.tr
                      key={book._id || index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.2,
                        delay: (startIndex + index) * 0.03,
                      }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {book.coverImage && (
                            <Image
                              src={book.coverImage}
                              alt={book.title || 'Book cover'}
                              width={40}
                              height={48}
                              className="w-10 h-12 rounded-lg object-cover bg-[#0E1330]"
                              unoptimized
                            />
                          )}
                          <span className="text-sm text-white font-medium line-clamp-1 max-w-[160px]">
                            {book.title || 'Untitled'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#C8D0E0]">
                        {book.author || 'Unknown'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#6D4AFF]/10 text-[#A78BFA] border border-[#6D4AFF]/20">
                          {book.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-white font-medium">
                        $
                        {book.price?.toFixed(2) ||
                          book.deliveryFee?.toFixed(2) ||
                          '0.00'}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#8890B5]">
                        {book.librarianName || book.librarian || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                        >
                          {statusIcon}
                          {statusKey}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPending && (
                            <button
                              onClick={() =>
                                handleToggleStatus(book._id, statusKey)
                              }
                              className={`p-2 rounded-lg transition-all ${
                                isPublished
                                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                  : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                              }`}
                              title={
                                isPublished ? 'Unpublish Book' : 'Publish Book'
                              }
                            >
                              {isPublished ? (
                                <CheckCircle size={16} />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                          )}

                          {isPending && (
                            <Link
                              href="/dashboard/admin/book-approvals"
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                              title="Go to Book Approvals"
                            >
                              <Eye size={16} />
                            </Link>
                          )}

                          <button
                            onClick={() =>
                              handleDeleteClick(book._id, book.title)
                            }
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                            title="Delete Book"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-[#0E1330]/40">
            <span className="text-xs text-[#8890B5]">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of{' '}
              {totalItems}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/[0.06] bg-[#0E1330]/50 text-gray-400 hover:text-white hover:bg-[#6D4AFF] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-8 text-center text-gray-500 text-xs"
                    >
                      …
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg border transition-all ${
                      currentPage === page
                        ? 'bg-[#6D4AFF] border-[#6D4AFF] text-white shadow-[0_0_15px_rgba(109,74,255,0.3)]'
                        : 'border-white/[0.06] bg-[#0E1330]/50 text-gray-400 hover:text-white hover:border-white/[0.15]'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-white/[0.06] bg-[#0E1330]/50 text-gray-400 hover:text-white hover:bg-[#6D4AFF] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
