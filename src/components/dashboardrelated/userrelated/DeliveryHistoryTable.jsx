'use client';

import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const statusColors = {
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Dispatched': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Delivered': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  'Pending': <Clock size={14} />,
  'Dispatched': <Truck size={14} />,
  'Delivered': <CheckCircle size={14} />,
  'Cancelled': <Package size={14} />,
};

export default function DeliveryHistoryTable({ deliveries = [], loading = false }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // ✅ Filter & Sort
  const filteredDeliveries = deliveries
    .filter(d => {
      const matchesSearch = 
        d.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
        d.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
        d.author?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
      
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-bold text-[#8890B5] uppercase tracking-wider cursor-pointer hover:text-white transition-colors group"
    >
      <div className="flex items-center gap-1.5">
        {children}
        <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890B5]" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book, transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white placeholder-[#8890B5] focus:outline-none focus:border-[#6D4AFF] transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white text-sm focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Dispatched">🚚 Dispatched</option>
              <option value="Delivered">✅ Delivered</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8890B5] pointer-events-none" size={14} />
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
              <SortableHeader field="transactionId">Transaction ID</SortableHeader>
              <th className="px-4 py-3 text-right text-xs font-bold text-[#8890B5] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center text-[#8890B5]">
                    <div className="flex flex-col items-center gap-3">
                      <Package size={40} className="text-[#6D4AFF]/30" />
                      <p className="text-sm font-medium">No delivery history found</p>
                      <p className="text-xs text-[#565C7A]">Start browsing books to place orders</p>
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
                filteredDeliveries.map((delivery, index) => {
                  const statusKey = delivery.status || 'Pending';
                  const statusColor = statusColors[statusKey] || statusColors['Pending'];
                  const statusIcon = statusIcons[statusKey] || statusIcons['Pending'];

                  // ✅ Total Fee - 'amount' field from API
                  const displayFee = delivery.amount || delivery.totalFee || delivery.amountPaid || 0;
                  
                  // ✅ Transaction ID
                  const transactionId = delivery.transactionId || `TXN-${delivery._id?.toString().slice(-8).toUpperCase()}`;
                  
                  // ✅ Book URL
                  const bookId = delivery.bookId || delivery._id;
                  const viewBookUrl = bookId ? `/browsebooks/${bookId}` : '#';

                  return (
                    <motion.tr
                      key={delivery._id || index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
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
                            <p className="text-xs text-[#8890B5]">by {delivery.author || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      {/* ✅ Total Fee */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-white font-bold">
                          ${displayFee.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#8890B5]">
                        {formatDate(delivery.date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                          {statusIcon}
                          {statusKey}
                        </span>
                      </td>
                      {/* ✅ Transaction ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-[#A78BFA] bg-[#6D4AFF]/10 px-2.5 py-1 rounded-lg border border-[#6D4AFF]/20">
                          {transactionId || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={viewBookUrl}
                          className={`p-2 rounded-lg inline-flex items-center gap-1.5 text-xs transition-all ${
                            bookId 
                              ? 'bg-[#0E1330]/60 text-[#8890B5] hover:text-white hover:bg-[#0E1330] border border-white/[0.06]'
                              : 'bg-[#0E1330]/30 text-[#565C7A] cursor-not-allowed opacity-50'
                          }`}
                          onClick={(e) => {
                            if (!bookId) {
                              e.preventDefault();
                              toast.error('Book details not available');
                            }
                          }}
                        >
                          <Eye size={14} />
                          <span className="hidden sm:inline">View Book</span>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}