'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  CheckCircle,
  XCircle,
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
  'Cancelled': <XCircle size={14} />,
};

// Helper function to capitalize first letter
const capitalize = (str) => {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function TransactionsTable({ 
  transactions = [], 
  loading = false,
  showActions = true // Admin dashboard এ true, অন্য কোথাও false
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter & Sort Logic
  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = 
        tx.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
        tx.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        tx.librarianEmail?.toLowerCase().includes(search.toLowerCase()) ||
        tx.transactionId?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || tx.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
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

  // Capitalize name
  const formatName = (email) => {
    if (!email) return 'N/A';
    const name = email.split('@')[0];
    return capitalize(name);
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
            placeholder="Search by ID, book, user..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white placeholder-[#8890B5] focus:outline-none focus:border-[#6D4AFF] transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-44 px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-white text-sm focus:outline-none focus:border-[#6D4AFF] appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Dispatched">🚚 Dispatched</option>
              <option value="Delivered">✅ Delivered</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8890B5] pointer-events-none" size={14} />
          </div>
          <span className="text-xs text-[#8890B5] whitespace-nowrap">
            {filteredTransactions.length} / {transactions.length} transactions
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0D1033]/40 backdrop-blur-sm">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-white/[0.06] bg-[#0E1330]/60">
            <tr>
              <SortableHeader field="transactionId">Transaction ID</SortableHeader>
              <SortableHeader field="userEmail">User</SortableHeader>
              <SortableHeader field="librarianEmail">Librarian</SortableHeader>
              <SortableHeader field="bookTitle">Book</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-bold text-[#8890B5] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={showActions ? 8 : 7} className="px-4 py-16 text-center text-[#8890B5]">
                    <div className="flex flex-col items-center gap-3">
                      <Package size={40} className="text-[#6D4AFF]/30" />
                      <p className="text-sm font-medium">No transactions found</p>
                      <p className="text-xs text-[#565C7A]">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, index) => {
                  const statusKey = tx.status || 'Pending';
                  const statusColor = statusColors[statusKey] || statusColors['Pending'];
                  const statusIcon = statusIcons[statusKey] || statusIcons['Pending'];
                  const isDelivered = statusKey === 'Delivered';

                  return (
                    <motion.tr
                      key={tx._id || index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-[#A78BFA] bg-[#6D4AFF]/10 px-2.5 py-1 rounded-lg border border-[#6D4AFF]/20">
                          {tx.transactionId || tx._id?.toString().slice(-8) || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm text-white font-medium">{formatName(tx.userEmail)}</p>
                          <p className="text-xs text-[#8890B5]">{tx.userEmail || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm text-[#C8D0E0]">{tx.librarianName || 'N/A'}</p>
                          <p className="text-xs text-[#8890B5]">{tx.librarianEmail || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-white font-medium line-clamp-1 max-w-[120px]">
                          {tx.bookTitle || 'Unknown Book'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-white font-bold">
                          ${tx.amountPaid?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#8890B5]">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                          {statusIcon}
                          {statusKey}
                        </span>
                      </td>
                      {showActions && (
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* ✅ Status দেখানোর জন্য শুধু - কোন Action নেই */}
                            <span className="text-xs text-[#565C7A]">
                              {isDelivered ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </td>
                      )}
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