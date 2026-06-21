"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LibrarianOverviewChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No inventory data available for chart analysis.</p>
        <p className="text-xs text-slate-400/80">Add books with categories to view dynamic analytics.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 15,
            left: -25,
            bottom: 5,
          }}
          barGap={8}
        >
          {/* Glowing gradients definition */}
          <defs>
            <linearGradient id="librarianGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
              <stop offset="50%" stopColor="#4f46e5" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#312e81" stopOpacity={0.2} />
            </linearGradient>
            <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background grid adjustment */}
          <CartesianGrid 
            strokeDasharray="4 4" 
            vertical={false}
            className="stroke-slate-200/60 dark:stroke-slate-800/40" 
          />
          
          {/* X Axis config */}
          <XAxis 
            dataKey="name" 
            className="text-[11px] font-bold fill-slate-400 dark:fill-slate-500"
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          
          {/* Y Axis config */}
          <YAxis 
            className="text-[11px] font-bold fill-slate-400 dark:fill-slate-500"
            tickLine={false}
            axisLine={false}
            dx={-5}
          />
          
          {/* Premium blur tooltip style */}
          <Tooltip
            cursor={{ fill: 'rgba(99, 102, 241, 0.04)', radius: 8 }}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
              padding: "10px 14px"
            }}
            itemStyle={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "600" }}
            labelStyle={{ color: "#ffffff", fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}
          />
          
          {/* Chart Legend layout */}
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ 
              fontSize: '12px', 
              fontWeight: '750',
              paddingBottom: '10px',
              color: '#64748b'
            }} 
          />
          
          {/* Custom gradient bar implementation */}
          <Bar 
            name="Total Titles" 
            dataKey="count" 
            fill="url(#librarianGlow)" 
            radius={[8, 8, 0, 0]} 
            maxBarSize={45}
            filter="url(#barShadow)"
            activeBar={{ fill: '#818cf8', opacity: 0.95 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LibrarianOverviewChart;