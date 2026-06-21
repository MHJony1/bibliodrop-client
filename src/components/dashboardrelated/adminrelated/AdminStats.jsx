import React from 'react';
import { Users, BookOpen, Truck, DollarSign } from 'lucide-react';

/**
 * Individual Metric Card with custom background glow and micro-interactions
 */
const StatCard = ({ title, value, icon: Icon, badgeText, gradientClass }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 transition-all duration-300 hover:border-slate-700 hover:-translate-y-1 group">
      {/* Decorative radial ambient glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${gradientClass}`} />
      
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-100 font-sans">
            {value}
          </h3>
        </div>
        <div className="p-3.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-purple-400 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-medium text-slate-500">{badgeText}</span>
      </div>
    </div>
  );
};

/**
 * Main Metrics Grid mapping system data dynamically
 */
const AdminStats = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Users"
        value={metrics?.totalUsers?.toLocaleString() || '0'}
        icon={Users}
        badgeText="Active Platform Members"
        gradientClass="bg-blue-500"
      />
      <StatCard
        title="Total Books"
        value={metrics?.totalBooks?.toLocaleString() || '0'}
        icon={BookOpen}
        badgeText="Cataloged Book Titles"
        gradientClass="bg-purple-500"
      />
      <StatCard
        title="Total Deliveries"
        value={metrics?.totalDeliveries?.toLocaleString() || '0'}
        icon={Truck}
        badgeText="Successfully Fulfilled"
        gradientClass="bg-amber-500"
      />
      <StatCard
        title="Total Revenue"
        value={`$${metrics?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
        icon={DollarSign}
        badgeText="Gross Aggregate Earnings"
        gradientClass="bg-emerald-500"
      />
    </div>
  );
};

export default AdminStats;