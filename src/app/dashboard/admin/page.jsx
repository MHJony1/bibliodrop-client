import React from 'react';
import { getAdminOverview } from '@/lib/api/admin';
import { requireRole } from '@/lib/core/session';
import AdminStats from '@/components/dashboardrelated/adminrelated/AdminStats';
import CategoryChart from '@/components/dashboardrelated/adminrelated/CategoryChart';
import RevenueChart from '@/components/dashboardrelated/adminrelated/RevenueChart';


export default async function AdminDashboard() {
  // 🛡️ Strict Route Protection Guard
  const sessionUser = await requireRole('admin');
  
  // Unified dashboard metrics payload from backend api
  const overviewResponse = await getAdminOverview();

  // Extract metrics safely with production-grade defaults
  const metricsData = overviewResponse?.metrics || { 
    totalUsers: 0, 
    totalBooks: 0, 
    totalDeliveries: 0, 
    totalRevenue: 0 
  };
  
  // Directly extract live arrays generated from backend calculations
  const categoryChartData = overviewResponse?.categoryChart || [];
  const monthlyRevenueData = overviewResponse?.monthlyRevenueFeed || [];

  return (
    // Fixed padding setup to elevate the header beautifully according to screenshot rules
    <div className="space-y-6 pt-2 px-6 pb-8 lg:pt-3 lg:px-8 bg-slate-950 min-h-screen text-slate-100">
      
      {/* Welcome & Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-0.5">
            Platform-wide overview and analytics for <span className="text-purple-400 font-semibold">{sessionUser?.name || 'Administrator'}</span>
          </p>
        </div>
        <div className="text-[11px] font-mono tracking-wider text-purple-400 bg-purple-500/5 px-3 py-1.5 rounded-xl border border-purple-500/10">
          SYSTEM LIVE FEED
        </div>
      </div>

      {/* Top 4 Metric Summaries Grid Module */}
      <AdminStats metrics={metricsData} />

      {/* Data Visualization Charts Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Books Distribution Pie Chart (Takes 1 Column) */}
        <div className="lg:col-span-1">
          <CategoryChart data={categoryChartData} />
        </div>

        {/* Right Side: Financial Performance Area Chart (Takes 2 Columns for seamless 12-month rendering) */}
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenueData} />
        </div>

      </div>
    </div>
  );
}