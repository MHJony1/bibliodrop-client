"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-800/80 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-slate-400 mb-1.5 tracking-wide uppercase">{label}</p>
        <div className="space-y-1">
          <p className="text-xs flex justify-between items-center gap-6">
            <span className="text-slate-400">Revenue:</span>
            <span className="font-bold text-purple-400">${payload[0].value}</span>
          </p>
          <p className="text-xs flex justify-between items-center gap-6">
            <span className="text-slate-400">Deliveries:</span>
            <span className="font-bold text-blue-400">{payload[1].value} orders</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6 h-[420px] flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-200">Financial Performance</h3>
        <p className="text-xs text-slate-500 mt-0.5">Monthly breakdown of aggregate transactions and completions</p>
      </div>

      <div className="w-full h-[300px] mt-4 font-mono text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="deliveryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
            <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
            <YAxis stroke="#64748b" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="line" />
            
            <Area 
              name="Revenue ($)" 
              type="monotone" 
              dataKey="revenue" 
              stroke="#A855F7" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#revenueGlow)" 
            />
            <Area 
              name="Deliveries" 
              type="monotone" 
              dataKey="deliveries" 
              stroke="#3B82F6" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#deliveryGlow)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;