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
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6D4AFF', '#7C3AED', '#8B5CF6', '#A78BFA', '#6D4AFF', '#4A2FE8'];

export default function UserOverviewChart({ data = [] }) {
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

  const maxValue = Math.max(...data.map(item => item.books), 1);
  const totalBooks = data.reduce((sum, item) => sum + item.books, 0);

  // ✅ Custom Tooltip Component (ভিতরে define করো)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D1033] border border-[#6D4AFF]/30 rounded-xl px-4 py-3 shadow-2xl shadow-[#6D4AFF]/10 backdrop-blur-xl">
          <p className="text-xs text-[#8890B5] font-medium">{label}</p>
          <p className="text-lg font-bold text-white mt-1">
            {payload[0].value} <span className="text-xs font-normal text-[#8890B5]">books</span>
          </p>
          {payload[0].value > 0 && (
            <div className="w-full h-0.5 bg-gradient-to-r from-[#6D4AFF] to-transparent mt-2" />
          )}
        </div>
      );
    }
    return null;
  };

  // ✅ Custom Label Component
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-[#8890B5] font-medium">Total Books Read</p>
            <p className="text-2xl font-bold text-white">{totalBooks}</p>
          </div>
          <div className="h-10 w-px bg-white/[0.06]" />
          <div>
            <p className="text-xs text-[#8890B5] font-medium">Average per Month</p>
            <p className="text-2xl font-bold text-white">
              {(totalBooks / data.length).toFixed(1)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8890B5]">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#6D4AFF] to-[#A78BFA]" />
          Books Read
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          barGap={8}
        >
          <defs>
            {data.map((entry, index) => (
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
          </defs>

          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="rgba(255,255,255,0.04)" 
            vertical={false}
          />
          
          <XAxis 
            dataKey="month" 
            stroke="#8890B5" 
            fontSize={12}
            fontWeight="500"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8890B5' }}
            dy={10}
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
          
          {/* ✅ Tooltip - সঠিকভাবে */}
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
          {/* ✅ ReferenceLine - সঠিকভাবে */}
          <ReferenceLine 
            y={0} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth={1}
          />

          {/* ✅ Bar - সঠিকভাবে */}
          <Bar 
            dataKey="books" 
            radius={[6, 6, 0, 0]}
            barSize={32}
            label={<CustomizedLabel />}
            animationDuration={800}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#barGradient-${index})`}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
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
        </div>
        <p className="text-[10px] text-[#565C7A] font-mono tracking-wider">
          {data.length} MONTHS
        </p>
      </div>
    </div>
  );
}