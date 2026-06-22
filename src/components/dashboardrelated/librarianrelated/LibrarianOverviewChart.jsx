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
  Legend,
  Cell,
} from 'recharts';

// ✅ Premium Color Palette - Unique vibrant colors for each category
const COLORS = [
  '#818CF8', // Indigo
  '#34D399', // Emerald
  '#FBBF24', // Amber
  '#F472B6', // Pink
  '#60A5FA', // Light Blue
  '#A78BFA', // Violet
  '#34D399', // Teal
  '#FB923C', // Orange
  '#F87171', // Red
  '#67E8F9', // Cyan
];

// ✅ Custom Tooltip - Large & Premium
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/50 min-w-[140px]">
        <p className="text-base font-bold text-white mb-1.5">{label}</p>
        <p className="text-sm text-violet-400 flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <span className="font-bold text-lg text-white">
            {payload[0].value}
          </span>
          <span className="text-slate-400 text-xs">books</span>
        </p>
        <div className="w-full h-px bg-slate-700/50 mt-2" />
        <p className="text-[10px] text-slate-500 mt-1.5">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of
          catalog
        </p>
      </div>
    );
  }
  return null;
};

const LibrarianOverviewChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[340px] flex flex-col items-center justify-center text-slate-500 gap-3 border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-900/20">
        <p className="text-base font-semibold text-slate-400">
          No inventory data available
        </p>
        <p className="text-sm text-slate-600">
          Add books with categories to view analytics
        </p>
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  const maxValue = Math.max(...chartData.map((item) => item.count), 1);

  // ✅ Add total to each data item
  const enrichedData = chartData.map((item) => ({
    ...item,
    total,
  }));

  return (
    <div className="w-full">
      {/* Header - Large & Premium */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-300">
            <span className="text-white text-2xl font-bold">{total}</span>
            <span className="ml-2 text-slate-400">total books</span>
          </span>
          <span className="w-px h-6 bg-slate-700/50" />
          <span className="text-sm text-slate-400">
            <span className="text-violet-400 font-bold">
              {chartData.length}
            </span>{' '}
            categories
          </span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <span className="text-[11px] font-bold text-violet-400">✦</span>
          <span className="text-[11px] font-medium text-violet-400">
            Catalog Overview
          </span>
        </div>
      </div>

      {/* Chart - Large & Premium */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={enrichedData}
            margin={{ top: 15, right: 15, left: -10, bottom: 10 }}
            barGap={12}
            barCategoryGap={20}
          >
            <defs>
              {/* Each bar has its own gradient */}
              {enrichedData.map((entry, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`barGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={COLORS[index % COLORS.length]}
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor={COLORS[index % COLORS.length]}
                    stopOpacity={0.5}
                  />
                </linearGradient>
              ))}

              {/* Glow filter */}
              <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodColor="#6366f1"
                  floodOpacity="0.15"
                />
              </filter>
            </defs>

            {/* Grid - Subtle */}
            <CartesianGrid
              strokeDasharray="6 6"
              vertical={false}
              stroke="rgba(255,255,255,0.04)"
            />

            {/* X Axis */}
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={13}
              fontWeight="600"
              tickLine={false}
              axisLine={false}
              dy={12}
              interval={0}
            />

            {/* Y Axis */}
            <YAxis
              stroke="#64748b"
              fontSize={12}
              fontWeight="500"
              tickLine={false}
              axisLine={false}
              dx={-6}
              allowDecimals={false}
              domain={[0, maxValue + 1]}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#94a3b8',
                paddingBottom: '8px',
              }}
            />

            {/* Bars */}
            <Bar
              name="Books"
              dataKey="count"
              radius={[10, 10, 0, 0]}
              barSize={48}
              filter="url(#barGlow)"
              animationDuration={800}
              animationBegin={200}
              label={{
                position: 'top',
                fill: '#A78BFA',
                fontSize: 13,
                fontWeight: 'bold',
                formatter: (value) => (value > 0 ? value : ''),
              }}
            >
              {enrichedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LibrarianOverviewChart;
