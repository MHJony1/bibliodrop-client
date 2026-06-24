'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers,
  DollarSign,
  PackageOpen,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';
import BookActionButtons from './BookActionButtons';


const InventoryTable = ({ books: initialBooks }) => {
  const [books] = useState(initialBooks);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const unique = new Set();
    books.forEach((book) => {
      if (book.status && book.status.trim() !== '') {
        unique.add(book.status);
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
        book.category?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' || book.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [books, search, filterStatus]);

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
    setFilterStatus(value);
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

  const SortableHeader = ({ field, children, className = '' }) => (
    <th
      onClick={() => handleSort(field)}
      className={`px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap cursor-pointer hover:text-white transition-colors group ${className}`}
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
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/20">
        <div className="p-6 rounded-full bg-slate-800/40 border border-slate-700/50 mb-4">
          <PackageOpen size={40} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No books listed yet</p>
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
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900/30 backdrop-blur-sm">
      {/* Top Bar with Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            <span className="text-white font-bold">{books.length}</span> books
            in catalog
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
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500/30 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-1.5 pr-8 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-violet-500/30 appearance-none cursor-pointer min-w-[100px]"
            >
              <option value="all">All Status</option>
              {statuses
                .filter((s) => s !== 'all')
                .map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>
            <Filter
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>

          {/* Active Filter Badge */}
          {filterStatus !== 'all' && (
            <button
              onClick={() => handleFilterChange('all')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-medium hover:bg-violet-500/20 transition-all whitespace-nowrap"
            >
              <span>Filter: {filterStatus}</span>
              <X size={12} className="hover:text-violet-300" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-950/80">
              <SortableHeader field="title" className="pl-6">
                Book Details
              </SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="price">Price</SortableHeader>
              <SortableHeader field="deliveryFee">Delivery Fee</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {currentBooks.map((book) => {
              const formattedCategory = book.category
                ? book.category.charAt(0).toUpperCase() + book.category.slice(1)
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
            })}
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
              className="p-1.5 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-violet-500/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
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
                      ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
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
              className="p-1.5 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-violet-500/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
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
          <span className="text-white font-medium">{filteredBooks.length}</span>{' '}
          of <span className="text-white font-medium">{books.length}</span>{' '}
          books
        </span>
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Clock size={12} />
          Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default InventoryTable;
