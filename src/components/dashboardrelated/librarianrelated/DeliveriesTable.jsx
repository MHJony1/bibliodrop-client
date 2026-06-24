'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  Truck,
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
import DeliveryActionButton from './DeliveryActionButton';

const DeliveriesTable = ({ deliveries: initialDeliveries }) => {
  const [deliveries] = useState(initialDeliveries);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const unique = new Set();
    deliveries.forEach((d) => {
      if (d.status && d.status.trim() !== '') {
        unique.add(d.status);
      }
    });
    return ['all', ...Array.from(unique)];
  }, [deliveries]);

  // Filter, Sort & Paginate
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      const matchesSearch =
        d.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
        d.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        d.clientEmail?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = filterStatus === 'all' || d.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, search, filterStatus]);

  const sortedDeliveries = useMemo(() => {
    return [...filteredDeliveries].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortField === 'amount') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredDeliveries, sortField, sortDirection]);

  const totalItems = sortedDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeliveries = sortedDeliveries.slice(startIndex, endIndex);

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

  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/20">
        <div className="p-6 rounded-full bg-slate-800/40 border border-slate-700/50 mb-4">
          <PackageOpen size={40} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No delivery requests found</p>
        <p className="text-slate-500 text-sm mt-1">
          Orders will appear here once placed
        </p>
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
            <span className="text-white font-bold">{deliveries.length}</span>{' '}
            delivery requests
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
              placeholder="Search client or book..."
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
              <SortableHeader field="clientName">Client</SortableHeader>
              <SortableHeader field="bookTitle">Book</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {currentDeliveries.map((item, index) => (
              <tr
                key={item._id || index}
                className="hover:bg-slate-800/30 transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <User size={13} className="text-slate-500" />
                      {item.clientName || 'Customer'}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 ml-5">
                      {item.clientEmail || 'N/A'}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <BookOpen size={14} className="text-slate-600 shrink-0" />
                    <span className="line-clamp-1 max-w-[180px]">
                      {item.bookTitle || 'Unknown Book'}
                    </span>
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm font-bold text-white">
                    ${item.amount?.toFixed(2) || '0.00'}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-600" />
                    {item.date
                      ? new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {item.status === 'Delivered' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle size={11} />
                      Delivered
                    </span>
                  )}
                  {item.status === 'Dispatched' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Truck size={11} />
                      Dispatched
                    </span>
                  )}
                  {item.status === 'Pending' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock size={11} />
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-right">
                  <DeliveryActionButton
                    orderId={item._id?.toString() || item._id}
                    currentStatus={item.status}
                  />
                </td>
              </tr>
            ))}
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
          <span className="text-white font-medium">
            {filteredDeliveries.length}
          </span>{' '}
          of <span className="text-white font-medium">{deliveries.length}</span>{' '}
          deliveries
        </span>
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Clock size={12} />
          Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default DeliveriesTable;
