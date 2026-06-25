import React from 'react';
import { getAdminOverview } from '@/lib/api/admin';
import { requireRole } from '@/lib/core/session';
import AdminStats from '@/components/dashboardrelated/adminrelated/AdminStats';
import CategoryChart from '@/components/dashboardrelated/adminrelated/CategoryChart';
import RevenueChart from '@/components/dashboardrelated/adminrelated/RevenueChart';
import { Shield, Activity } from 'lucide-react';

export default async function AdminDashboard() {
  const sessionUser = await requireRole('admin');
  const overviewResponse = await getAdminOverview();

  const metricsData = overviewResponse?.metrics || {
    totalUsers: 0,
    totalBooks: 0,
    totalDeliveries: 0,
    totalRevenue: 0,
  };


  const categoryChartData = overviewResponse?.categoryChart || [];
  const monthlyRevenueData = overviewResponse?.monthlyRevenueFeed || [];

  const statusItems = [
    { label: 'System Status', value: 'Operational', color: 'text-emerald-400' },
    { label: 'Uptime', value: '99.9%', color: 'text-blue-400' },
    { label: 'Active Sessions', value: 'Live', color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
              <Shield size={22} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Platform-wide overview and analytics for{' '}
                <span className="text-violet-400 font-semibold">
                  {sessionUser?.name || 'Administrator'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">
              System Live
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <span className="text-xs text-violet-400 font-mono tracking-wider">
              ⚡ ADMIN PANEL
            </span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-slate-500" />
          <span className="text-xs text-slate-400 font-medium">
            Platform Status:
          </span>
        </div>
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            <span className="text-xs text-slate-400">{item.label}</span>
            <span className={`text-xs font-semibold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
        <div className="flex-1" />
        <span className="text-[10px] text-slate-500 font-mono tracking-wider">
          LAST SYNC: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Stats Cards */}
      <AdminStats metrics={metricsData} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryChart data={categoryChartData} />
        </div>
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenueData} />
        </div>
      </div>
    </div>
  );
}
