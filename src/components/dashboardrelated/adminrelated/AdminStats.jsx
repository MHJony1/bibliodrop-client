'use client';

import React from 'react';
import {
  Users,
  BookOpen,
  Truck,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  icon: Icon,
  badgeText,
  delay = 0,
  isPending = false,
  trend,
  trendValue,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: delay * 0.08,
        duration: 0.4,
        ease: 'easeOut',
      }}
      className={`group relative rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isPending
          ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 hover:border-amber-500/50 hover:shadow-amber-500/10'
          : 'bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-transparent border-slate-700/50 hover:border-slate-600/70 hover:shadow-violet-500/5'
      }`}
    >
      {/* Background Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPending
            ? 'bg-gradient-to-r from-amber-500/5 to-transparent'
            : 'bg-gradient-to-r from-violet-500/5 to-transparent'
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
              {title}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3
                className={`text-2xl font-bold tracking-tight ${
                  isPending ? 'text-amber-400' : 'text-white'
                }`}
              >
                {value}
              </h3>
              {trend && (
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {trend === 'up' ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {trendValue}
                </span>
              )}
            </div>
          </div>
          <div
            className={`p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 ${
              isPending
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/40'
                : 'bg-slate-800/60 border-slate-700/40 text-violet-400 group-hover:bg-violet-500/10 group-hover:border-violet-500/30'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div
            className={`h-[2px] flex-1 rounded-full ${
              isPending
                ? 'bg-gradient-to-r from-amber-500/40 to-amber-500/10'
                : 'bg-gradient-to-r from-violet-500/30 to-slate-700/30'
            }`}
          />
          <p
            className={`text-[11px] font-medium whitespace-nowrap ${
              isPending ? 'text-amber-400/70' : 'text-slate-400'
            }`}
          >
            {badgeText}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AdminStats = ({ metrics }) => {
  // Calculate trends (you can adjust these based on your data)
  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const diff = ((current - previous) / previous) * 100;
    if (Math.abs(diff) < 1) return null;
    return {
      direction: diff > 0 ? 'up' : 'down',
      value: `${Math.abs(diff).toFixed(1)}%`,
    };
  };

  const stats = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers?.toLocaleString() || '0',
      icon: Users,
      badgeText: 'Active Members',
      delay: 0,
      isPending: false,
      trend: getTrend(metrics?.totalUsers || 0, metrics?.previousUsers || 0),
    },
    {
      title: 'Total Books',
      value: metrics?.totalBooks?.toLocaleString() || '0',
      icon: BookOpen,
      badgeText: 'Cataloged Titles',
      delay: 1,
      isPending: false,
      trend: getTrend(metrics?.totalBooks || 0, metrics?.previousBooks || 0),
    },
    {
      title: 'Pending Approvals',
      value: metrics?.pendingApprovals?.toLocaleString() || '0',
      icon: Clock,
      badgeText: 'Books Awaiting Review',
      delay: 2,
      isPending: true,
      trend: null,
    },
    {
      title: 'Total Deliveries',
      value: metrics?.totalDeliveries?.toLocaleString() || '0',
      icon: Truck,
      badgeText: 'Fulfilled Orders',
      delay: 3,
      isPending: false,
      trend: getTrend(
        metrics?.totalDeliveries || 0,
        metrics?.previousDeliveries || 0,
      ),
    },
    {
      title: 'Total Revenue',
      value: `$${metrics?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      badgeText: 'Gross Earnings',
      delay: 4,
      isPending: false,
      trend: getTrend(
        metrics?.totalRevenue || 0,
        metrics?.previousRevenue || 0,
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AdminStats;
