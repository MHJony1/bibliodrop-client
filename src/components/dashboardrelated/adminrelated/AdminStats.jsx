'use client';

import React from 'react';
import { Users, BookOpen, Truck, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, badgeText, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6 hover:border-slate-700 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-slate-800/60 border border-slate-700/40 rounded-xl text-violet-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3">{badgeText}</p>
    </motion.div>
  );
};

const AdminStats = ({ metrics }) => {
  const stats = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers?.toLocaleString() || '0',
      icon: Users,
      badgeText: 'Active Members',
      delay: 0,
    },
    {
      title: 'Total Books',
      value: metrics?.totalBooks?.toLocaleString() || '0',
      icon: BookOpen,
      badgeText: 'Cataloged Titles',
      delay: 1,
    },
    {
      title: 'Total Deliveries',
      value: metrics?.totalDeliveries?.toLocaleString() || '0',
      icon: Truck,
      badgeText: 'Fulfilled Orders',
      delay: 2,
    },
    {
      title: 'Total Revenue',
      value: `$${metrics?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      badgeText: 'Gross Earnings',
      delay: 3,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default AdminStats;
