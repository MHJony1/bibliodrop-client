"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';

// Premium Color Palette
const CHART_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#6366F1'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#fff" className="text-xs font-bold uppercase tracking-wider">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#94a3b8" className="text-[10px]">
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
      />
    </g>
  );
};

const CategoryChart = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const parsedData = data.length > 0 
    ? data.map(item => ({ name: item.categoryName, value: item.count }))
    : [{ name: 'No Inventory', value: 0 }];

  const onPieEnter = (_, index) => setActiveIndex(index);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col transition-all duration-300 hover:border-slate-700">
      
      {/* Header Section */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Category Insights</h3>
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Global Catalog Inventory Distribution</p>
      </div>

      {/* Chart Section */}
      <div className="w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={parsedData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onClick={onPieEnter}
            >
              {parsedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Legend 
              wrapperStyle={{ fontSize: '10px', marginTop: '10px' }}
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;