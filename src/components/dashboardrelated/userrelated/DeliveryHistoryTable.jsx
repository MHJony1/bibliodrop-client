'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Truck,
  Package,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cancelOrder, deleteOrder } from '@/lib/api/user';

const statusColors = {
  Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Dispatched: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  Pending: <Clock size={14} />,
  Dispatched: <Truck size={14} />,
  Delivered: <CheckCircle size={14} />,
  Cancelled: <Package size={14} />,
};

export default function DeliveryHistoryTable({
  deliveries = [],
  loading = false,
  onRefresh,
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [processingId, setProcessingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  //  Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Sort
  const filteredDeliveries = useMemo(() => {
    return deliveries
      .filter((d) => {
        const matchesSearch =
          d.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
          d.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
          d.author?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          filterStatus === 'All' || d.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'date') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else if (sortField === 'amount' || sortField === 'totalFee') {
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
  }, [deliveries, search, filterStatus, sortField, sortDirection]);

  //  Pagination Logic
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(startIndex, endIndex);

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

  const handleFilterChange = (status) => {
    setFilterStatus(status);
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

  // Cancel order handler
  const handleCancel = async () => {
    if (!confirmModal) return;
    setProcessingId(confirmModal.orderId);
    setConfirmModal(null);
    try {
      const result = await cancelOrder(confirmModal.orderId);
      if (result?.success) {
        toast.success('Order cancelled successfully.');
        onRefresh?.();
      } else {
        toast.error(result?.message || 'Failed to cancel order.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setProcessingId(null);
    }
  };

  // Delete order handler
  const handleDelete = async () => {
    if (!confirmModal) return;
    setProcessingId(confirmModal.orderId);
    setConfirmModal(null);
    try {
      const result = await deleteOrder(confirmModal.orderId);
      if (result?.success) {
        toast.success('Order deleted successfully.');
        onRefresh?.();
      } else {
        toast.error(result?.message || 'Failed to delete order.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setProcessingId(null);
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-bold text-[#8890B5] uppercase tracking-wider cursor-pointer hover:text-white transition-colors group"
    >
      <div className="flex items-center gap-1.5">
        {children}
        <ArrowUpDown
          size={12}
          className="opacity-30 group-hover:opacity-100 transition-opacity"
        />
        {sortField === field &&
          (sortDirection === 'asc' ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          ))}
      </div>
    </th>
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D1033] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2.5 rounded-xl ${confirmModal.type === 'delete' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}
                >
                  {confirmModal.type === 'delete' ? (
                    <Trash2 size={20} className="text-red-400" />
                  ) : (
                    <XCircle size={20} className="text-yellow-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">
                    {confirmModal.type === 'delete'
                      ? 'Delete Order'
                      : 'Cancel Order'}
                  </h3>
                  <p className="text-[#8890B5] text-xs">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#C5C9E0] mb-6">
                {confirmModal.type === 'delete' ? (
                  <>
                    Are you sure you want to permanently delete the order for{' '}
                    <span className="text-white font-semibold">
                      &quot;{confirmModal.bookTitle}&quot;
                    </span>
                    ?
                  </>
                ) : (
                  <>
                    Are you sure you want to cancel the order for{' '}
                    <span className="text-white font-semibold">
                      &quot;{confirmModal.bookTitle}&quot;
                    </span>
                    ? The book will become available again.
                  </>
                )}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-[#8890B5] hover:text-white text-sm font-medium transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={
                    confirmModal.type === 'delete' ? handleDelete : handleCancel
                  }
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-colors ${
                    confirmModal.type === 'delete'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {confirmModal.type === 'delete'
                    ? 'Yes, Delete'
                    : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by book, transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white placeholder-[#8890B5] focus:outline-none focus:border-[#6D4AFF] transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white text-sm focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Dispatched">🚚 Dispatched</option>
              <option value="Delivered">✅ Delivered</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8890B5] pointer-events-none"
              size={14}
            />
          </div>
          <span className="text-xs text-[#8890B5] whitespace-nowrap">
            {filteredDeliveries.length} / {deliveries.length} deliveries
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0D1033]/40 backdrop-blur-sm">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-white/[0.06] bg-[#0E1330]/60">
            <tr>
              <SortableHeader field="bookTitle">Book Title</SortableHeader>
              <SortableHeader field="amount">Total Fee</SortableHeader>
              <SortableHeader field="date">Request Date</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="transactionId">
                Transaction ID
              </SortableHeader>
              <th className="px-4 py-3 text-right text-xs font-bold text-[#8890B5] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentDeliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-16 text-center text-[#8890B5]"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Package size={40} className="text-[#6D4AFF]/30" />
                      <p className="text-sm font-medium">
                        No delivery history found
                      </p>
                      <p className="text-xs text-[#565C7A]">
                        Start browsing books to place orders
                      </p>
                      <Link
                        href="/browsebooks"
                        className="mt-2 px-4 py-2 rounded-xl bg-[#6D4AFF] text-white text-sm font-medium hover:bg-[#5A3AE8] transition-all"
                      >
                        Browse Books
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                currentDeliveries.map((delivery, index) => {
                  const statusKey = delivery.status || 'Pending';
                  const statusColor =
                    statusColors[statusKey] || statusColors['Pending'];
                  const statusIcon =
                    statusIcons[statusKey] || statusIcons['Pending'];
                  const displayFee =
                    delivery.amount ||
                    delivery.totalFee ||
                    delivery.amountPaid ||
                    0;
                  const transactionId =
                    delivery.transactionId ||
                    `TXN-${delivery._id?.toString().slice(-8).toUpperCase()}`;
                  const bookId = delivery.bookId || delivery._id;
                  const viewBookUrl = bookId ? `/browsebooks/${bookId}` : '#';
                  const isProcessing =
                    processingId === (delivery._id?.toString() || delivery._id);
                  const canCancel = statusKey === 'Pending';
                  const canDelete =
                    statusKey === 'Delivered' || statusKey === 'Cancelled';

                  return (
                    <motion.tr
                      key={delivery._id || index}
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
                          {delivery.coverImage && (
                            <Image
                              src={delivery.coverImage}
                              alt={delivery.bookTitle}
                              width={40}
                              height={48}
                              className="w-10 h-12 rounded-lg object-cover bg-[#0E1330]"
                              unoptimized
                            />
                          )}
                          <div>
                            <p className="text-sm text-white font-medium line-clamp-1 max-w-[180px]">
                              {delivery.bookTitle || 'Unknown Book'}
                            </p>
                            <p className="text-xs text-[#8890B5]">
                              by{' '}
                              {delivery.bookAuthor ||
                                delivery.author ||
                                'Unknown'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-sm text-white font-bold">
                          ${displayFee.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-sm text-[#8890B5]">
                        {formatDate(delivery.date)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                        >
                          {statusIcon}
                          {statusKey}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-[#A78BFA] bg-[#6D4AFF]/10 px-2.5 py-1 rounded-lg border border-[#6D4AFF]/20">
                          {transactionId || 'N/A'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={viewBookUrl}
                            title="View Book Details"
                            className="p-2 rounded-lg bg-[#0E1330]/60 text-[#8890B5] hover:text-white hover:bg-[#0E1330] border border-white/[0.06] transition-all"
                            onClick={(e) => {
                              if (!bookId) {
                                e.preventDefault();
                                toast.error('Book details not available');
                              }
                            }}
                          >
                            <Eye size={14} />
                          </Link>

                          {canCancel && (
                            <button
                              title="Cancel Order"
                              disabled={isProcessing}
                              onClick={() =>
                                setConfirmModal({
                                  type: 'cancel',
                                  orderId:
                                    delivery._id?.toString() || delivery._id,
                                  bookTitle: delivery.bookTitle || 'this book',
                                })
                              }
                              className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isProcessing ? (
                                <span className="w-3.5 h-3.5 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin block" />
                              ) : (
                                <XCircle size={14} />
                              )}
                            </button>
                          )}

                          {canDelete && (
                            <button
                              title="Delete Order"
                              disabled={isProcessing}
                              onClick={() =>
                                setConfirmModal({
                                  type: 'delete',
                                  orderId:
                                    delivery._id?.toString() || delivery._id,
                                  bookTitle: delivery.bookTitle || 'this book',
                                })
                              }
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isProcessing ? (
                                <span className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin block" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
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
  );
}
