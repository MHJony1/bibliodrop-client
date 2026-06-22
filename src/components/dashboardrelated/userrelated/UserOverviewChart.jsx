'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6D4AFF', '#7C3AED', '#8B5CF6', '#A78BFA', '#6D4AFF', '#4A2FE8', '#5B21B6', '#7C3AED', '#8B5CF6', '#A78BFA', '#6D4AFF', '#4A2FE8'];

export default function UserOverviewChart({ data = [] }) {
  // ✅ Ensure 12 months data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // ✅ If data has less than 12 months, pad with zeros
  const fullData = months.map((month, index) => {
    const existing = data.find(d => d.month === month);
    return {
      month,
      books: existing?.books || 0,
      spent: existing?.spent || 0,
    };
  });

  if (!data || data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-56 text-[#8890B5] text-sm gap-3"
      >
        <div className="p-4 rounded-full bg-[#6D4AFF]/10 border border-[#6D4AFF]/20">
          <svg className="w-8 h-8 text-[#6D4AFF]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="font-medium">No reading activity yet</p>
        <p className="text-xs text-[#565C7A]">Start exploring books to see your stats</p>
      </motion.div>
    );
  }

  const maxValue = Math.max(...fullData.map(item => item.books), 1);
  const totalBooks = fullData.reduce((sum, item) => sum + item.books, 0);
  const totalSpent = fullData.reduce((sum, item) => sum + (item.spent || 0), 0);
  const activeMonths = fullData.filter(item => item.books > 0).length;

  // ✅ Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0D1033] border border-[#6D4AFF]/30 rounded-xl px-4 py-3 shadow-2xl shadow-[#6D4AFF]/10 backdrop-blur-xl min-w-[120px]"
        >
          <p className="text-xs text-[#8890B5] font-medium">{label}</p>
          <p className="text-lg font-bold text-white mt-1">
            {data.books} <span className="text-xs font-normal text-[#8890B5]">books</span>
          </p>
          {data.spent > 0 && (
            <p className="text-xs text-emerald-400 mt-0.5">
              ${data.spent.toFixed(2)} spent
            </p>
          )}
          {data.books > 0 && (
            <div className="w-full h-0.5 bg-gradient-to-r from-[#6D4AFF] to-transparent mt-2" />
          )}
        </motion.div>
      );
    }
    return null;
  };

  // ✅ Custom Label
  const CustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#A78BFA"
        fontSize={11}
        fontWeight="bold"
        textAnchor="middle"
        className="opacity-80"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full">
      {/* Chart Header with Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0D1033]/40 rounded-xl p-3 border border-white/[0.04]">
          <p className="text-[10px] text-[#8890B5] font-medium uppercase tracking-wider">Total Books</p>
          <p className="text-xl font-bold text-white mt-0.5">{totalBooks}</p>
        </div>
        <div className="bg-[#0D1033]/40 rounded-xl p-3 border border-white/[0.04]">
          <p className="text-[10px] text-[#8890B5] font-medium uppercase tracking-wider">Total Spent</p>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-[#0D1033]/40 rounded-xl p-3 border border-white/[0.04]">
          <p className="text-[10px] text-[#8890B5] font-medium uppercase tracking-wider">Active Months</p>
          <p className="text-xl font-bold text-[#A78BFA] mt-0.5">{activeMonths} / 12</p>
        </div>
        <div className="bg-[#0D1033]/40 rounded-xl p-3 border border-white/[0.04]">
          <p className="text-[10px] text-[#8890B5] font-medium uppercase tracking-wider">Avg Monthly</p>
          <p className="text-xl font-bold text-white mt-0.5">{(totalBooks / 12).toFixed(1)}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart 
          data={fullData} 
          margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          barGap={4}
        >
          <defs>
            {/* Bar Gradients */}
            {fullData.map((entry, index) => (
              <linearGradient 
                key={`gradient-${index}`} 
                id={`barGradient-${index}`}
                x1="0" y1="0" x2="0" y2="1"
              >
                <stop 
                  offset="0%" 
                  stopColor={entry.books > 0 ? COLORS[index % COLORS.length] : '#2A2A4A'} 
                  stopOpacity={entry.books > 0 ? 1 : 0.3}
                />
                <stop 
                  offset="100%" 
                  stopColor={entry.books > 0 ? COLORS[index % COLORS.length] : '#2A2A4A'} 
                  stopOpacity={entry.books > 0 ? 0.4 : 0.1}
                />
              </linearGradient>
            ))}

            {/* Area Gradient */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D4AFF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6D4AFF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="rgba(255,255,255,0.04)" 
            vertical={false}
          />
          
          <XAxis 
            dataKey="month" 
            stroke="#8890B5" 
            fontSize={11}
            fontWeight="500"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8890B5' }}
            dy={10}
            interval={0}
          />
          
          <YAxis 
            stroke="#8890B5" 
            fontSize={11}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, maxValue + 1]}
            tick={{ fill: '#8890B5' }}
            dx={-5}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
          <ReferenceLine 
            y={0} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth={1}
          />

          {/* Area line for trend */}
          <Area
            type="monotone"
            dataKey="books"
            stroke="#6D4AFF"
            strokeWidth={2}
            fill="url(#areaGradient)"
            dot={{ fill: '#6D4AFF', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#A78BFA' }}
          />

          {/* Bars */}
          <Bar 
            dataKey="books" 
            radius={[6, 6, 0, 0]}
            barSize={24}
            label={<CustomizedLabel />}
            animationDuration={800}
            animationBegin={200}
          >
            {fullData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#barGradient-${index})`}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      {/* Chart Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-4 text-xs text-[#565C7A]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
            Active Reading
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6D4AFF]/30" />
            Inactive
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-[#6D4AFF]" />
            Trend Line
          </span>
        </div>
        <p className="text-[10px] text-[#565C7A] font-mono tracking-wider">
          {fullData.length} MONTHS • {activeMonths} ACTIVE
        </p>
      </div>
    </div>
  );
}