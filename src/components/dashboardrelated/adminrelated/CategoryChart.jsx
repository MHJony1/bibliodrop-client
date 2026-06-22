'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from 'recharts';
import { BookOpen, TrendingUp } from 'lucide-react';

const CHART_COLORS = [
  '#8B5CF6',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#14B8A6',
  '#6366F1',
  '#F472B6',
  '#34D399',
];

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#fff"
        className="text-xs font-bold uppercase tracking-wider"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        fill="#94a3b8"
        className="text-[10px] font-medium"
      >
        {value} Titles
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-800/80 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl">
        <p className="text-sm font-bold text-white">{payload[0].name}</p>
        <p className="text-xs text-slate-400 mt-1">
          <span className="text-violet-400 font-semibold">
            {payload[0].value}
          </span>{' '}
          books
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of
          catalog
        </p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const parsedData =
    data.length > 0
      ? data.map((item) => ({
          name: item.categoryName || 'Uncategorized',
          value: item.count || 0,
          total,
        }))
      : [{ name: 'No Data', value: 1, total: 1 }];

  const onPieEnter = (_, index) => setActiveIndex(index);

  return (
    <div className="bg-gradient-to-br from-slate-900/40 to-slate-800/20 border border-slate-800/60 rounded-2xl p-6 h-[420px] flex flex-col transition-all duration-300 hover:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Category Insights</h3>
          <p className="text-xs text-slate-400 font-medium">
            Catalog Distribution
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <BookOpen size={12} className="text-violet-400" />
          <span className="text-xs text-violet-400 font-bold">{total}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={parsedData}
              cx="50%"
              cy="48%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onClick={onPieEnter}
            >
              {parsedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: '10px',
                marginTop: '8px',
                color: '#94a3b8',
              }}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
