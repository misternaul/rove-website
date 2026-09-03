"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center border border-white/10 bg-[#141414] text-white/40 font-mono text-xs uppercase tracking-widest">
        Not Enough Data Yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-[#141414] border border-white/10 p-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            stroke="#ffffff40" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            fontFamily="monospace"
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `Rs.${value}`}
            fontFamily="monospace"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)' }}
            itemStyle={{ color: '#D4AF37', fontFamily: 'monospace' }}
            labelStyle={{ color: '#fff', fontFamily: 'serif' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#D4AF37" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
