'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  RefreshCw,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TransactionsTable from '@/components/dashboardrelated/adminrelated/TransactionsTable';
import { fetchAllTransactionsAction } from '@/lib/actions/admin';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalRevenue: 0,
    pending: 0,
    delivered: 0,
  });

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const result = await fetchAllTransactionsAction();
      if (result.success) {
        const data = result.data || [];
        setTransactions(data);

        const totalRevenue = data.reduce(
          (sum, tx) => sum + (tx.amountPaid || 0),
          0,
        );
        const pending = data.filter((tx) => tx.status === 'Pending').length;
        const delivered = data.filter((tx) => tx.status === 'Delivered').length;

        setStats({
          total: data.length,
          totalRevenue,
          pending,
          delivered,
        });
      } else {
        toast.error(result.error || 'Failed to load transactions');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Load Transactions Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const statsCards = [
    {
      icon: Receipt,
      label: 'Total Transactions',
      value: stats.total,
      color: 'from-[#6D4AFF] to-[#4A2FE8]',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Package,
      label: 'Delivered',
      value: stats.delivered,
      color: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6D4AFF]/10 border border-[#6D4AFF]/20">
              <Receipt size={20} className="text-[#A78BFA]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Transactions
              </h1>
              <p className="text-sm text-[#8890B5]">
                View all platform transactions. ({transactions.length} total)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadTransactions}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/6 text-[#8890B5] hover:text-white hover:border-white/15 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#0D1033]/60 border border-white/6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}
              >
                <stat.icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transactions Table - with pagination */}
      <TransactionsTable
        transactions={transactions}
        loading={loading}
        showActions={false}
      />
    </div>
  );
}
