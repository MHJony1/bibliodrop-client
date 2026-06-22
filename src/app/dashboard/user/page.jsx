'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getUserOverview } from '@/lib/api/user';
import UserOverviewChart from '@/components/dashboardrelated/userrelated/UserOverviewChart';
import { useSession } from '@/lib/auth-client';

export default function UserDashboardPage() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    totalBooksRead: 0,
    pendingDeliveries: 0,
    totalSpent: 0,
    monthlyData: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    if (!session?.user?.email) return;

    
    setLoading(true);
    try {
      const result = await getUserOverview(session.user.email);
      if (result?.success) {
        setStats(result.data);
      } else {
        toast.error(result?.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Load Overview Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadOverview();
    }
  }, [session]);

  // Loading state
  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D4AFF]"></div>
      </div>
    );
  }

  const statCards = [
    {
      icon: BookOpen,
      label: 'Books Read',
      value: stats.totalBooksRead,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      color: 'text-blue-400',
    },
    {
      icon: Clock,
      label: 'Pending Deliveries',
      value: stats.pendingDeliveries,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      color: 'text-amber-400',
    },
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      color: 'text-emerald-400',
    },
    {
      icon: TrendingUp,
      label: 'Total Orders',
      value: stats.orders?.length || 0,
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {session?.user?.name || 'Reader'} 👋
          </h1>
          <p className="text-sm text-[#8890B5]">
            Here&#39;s your reading overview.
          </p>
        </div>
        <button
          onClick={loadOverview}
          disabled={loading}
          className="p-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl bg-[#0D1033]/60 border ${stat.border} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-white">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#0D1033]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Monthly Reading Activity</h2>
            <p className="text-xs text-[#8890B5]">Books read per month</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8890B5]">
            <span className="w-3 h-3 rounded-full bg-[#6D4AFF]" />
            Books Read
          </div>
        </div>
        <UserOverviewChart data={stats.monthlyData} />
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0D1033]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <p className="text-xs text-[#8890B5]">Your latest book requests</p>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard/user/delivery-history'}
            className="text-xs text-[#A78BFA] hover:text-white transition-colors"
          >
            View All →
          </button>
        </div>
        
        {stats.orders?.length === 0 ? (
          <div className="text-center py-8 text-[#8890B5] text-sm">
            No orders yet. Start exploring books!
          </div>
        ) : (
          <div className="space-y-2">
            {stats.orders?.slice(0, 5).map((order, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0E1330]/40 border border-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    order.status === 'Delivered' ? 'bg-emerald-500/10' :
                    order.status === 'Dispatched' ? 'bg-blue-500/10' :
                    'bg-amber-500/10'
                  }`}>
                    {order.status === 'Delivered' ? (
                      <CheckCircle size={16} className="text-emerald-400" />
                    ) : order.status === 'Dispatched' ? (
                      <Truck size={16} className="text-blue-400" />
                    ) : (
                      <Clock size={16} className="text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium line-clamp-1 max-w-[150px]">
                      {order.bookTitle || 'Unknown Book'}
                    </p>
                    <p className="text-xs text-[#8890B5]">
                      {new Date(order.createdAt || order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">
                    ${(order.amountPaid || order.amount || 0).toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




