'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-950/95 border border-slate-800/80 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl min-w-[160px]"
      >
        <p className="text-xs font-bold text-slate-400 mb-2 tracking-wide uppercase">
          {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Revenue
            </span>
            <span className="text-sm font-bold text-violet-400">
              ${payload[0]?.value || 0}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Deliveries
            </span>
            <span className="text-sm font-bold text-blue-400">
              {payload[1]?.value || 0} orders
            </span>
          </div>
          <div className="border-t border-slate-800/60 pt-1.5 mt-1 flex justify-between">
            <span className="text-[10px] text-slate-500">Avg per delivery</span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              $
              {payload[0]?.value && payload[1]?.value
                ? (payload[0].value / payload[1].value).toFixed(2)
                : '0.00'}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

const RevenueChart = ({ data = [] }) => {
  const [hovered, setHovered] = useState(null);

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalDeliveries = data.reduce(
    (sum, item) => sum + (item.deliveries || 0),
    0,
  );

  return (
    <div className="bg-linear-to-br from-slate-900/40 to-slate-800/20 border border-slate-800/60 rounded-2xl p-6 h-[420px] flex flex-col transition-all duration-300 hover:border-slate-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            Financial Performance
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Monthly Revenue & Delivery Trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <DollarSign size={12} className="text-violet-400" />
            <span className="text-xs text-violet-400 font-bold">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Package size={12} className="text-blue-400" />
            <span className="text-xs text-blue-400 font-bold">
              {totalDeliveries.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deliveryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#1e293b"
              opacity={0.3}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              dy={8}
            />

            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              dx={-4}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: '10px',
                color: '#94a3b8',
                paddingTop: '8px',
              }}
            />

            <Area
              name="Revenue ($)"
              type="monotone"
              dataKey="revenue"
              stroke="#A855F7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGlow)"
              activeDot={{ r: 6, fill: '#A855F7', strokeWidth: 0 }}
            />

            <Area
              name="Deliveries"
              type="monotone"
              dataKey="deliveries"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#deliveryGlow)"
              activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
