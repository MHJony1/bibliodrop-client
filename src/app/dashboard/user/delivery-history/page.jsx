'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Truck, RefreshCw, Package, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DeliveryHistoryTable from '@/components/dashboardrelated/userrelated/DeliveryHistoryTable';
import { getUserDeliveries } from '@/lib/api/user';

export default function DeliveryHistoryPage() {
  const { data: session, isPending } = useSession();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    dispatched: 0,
    delivered: 0,
  });

  const loadDeliveries = async () => {
    if (!session?.user?.email) {
      console.log('❌ No session email');
      return;
    }

    console.log('✅ Loading deliveries for:', session.user.email);
    setLoading(true);

    try {
      const result = await getUserDeliveries(session.user.email);
      console.log('📦 Full Response:', result);

      if (result?.success) {
        const data = result.data || [];
        console.log('📚 Data:', data);
        console.log('💰 First totalFee:', data[0]?.totalFee);
        console.log('💰 First amountPaid:', data[0]?.amountPaid);

        setDeliveries(data);

        const pending = data.filter((d) => d.status === 'Pending').length;
        const dispatched = data.filter((d) => d.status === 'Dispatched').length;
        const delivered = data.filter((d) => d.status === 'Delivered').length;

        setStats({
          total: data.length,
          pending,
          dispatched,
          delivered,
        });
      } else {
        toast.error(result?.message || 'Failed to load delivery history');
      }
    } catch (error) {
      console.error('❌ Load error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadDeliveries();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D4AFF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6D4AFF]/10 border border-[#6D4AFF]/20">
              <Truck size={20} className="text-[#A78BFA]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Delivery History
              </h1>
              <p className="text-sm text-[#8890B5]">
                Track all your book delivery requests. ({deliveries.length}{' '}
                total)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadDeliveries}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: 'Total Orders',
            value: stats.total,
            color: 'from-purple-500 to-purple-600',
          },
          {
            icon: Clock,
            label: 'Pending',
            value: stats.pending,
            color: 'from-amber-500 to-amber-600',
          },
          {
            icon: Truck,
            label: 'Dispatched',
            value: stats.dispatched,
            color: 'from-blue-500 to-blue-600',
          },
          {
            icon: CheckCircle,
            label: 'Delivered',
            value: stats.delivered,
            color: 'from-emerald-500 to-emerald-600',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl bg-[#0D1033]/60 border border-white/[0.06] backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}
              >
                <stat.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-[#8890B5] font-medium">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <DeliveryHistoryTable deliveries={deliveries} loading={loading} />
    </div>
  );
}
