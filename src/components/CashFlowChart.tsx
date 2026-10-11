import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { MONTHLY_CHART_DATA } from '../services/mockData';

export const CashFlowChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Monthly Cash Flow Analytics</h3>
          <p className="text-xs text-slate-400">Deposits vs Withdrawals over the past 6 months (INR)</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-block w-3 h-3 rounded bg-emerald-500" />
          <span className="text-slate-300">Deposits</span>
          <span className="inline-block w-3 h-3 rounded bg-rose-500 ml-2" />
          <span className="text-slate-300">Withdrawals</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                      <p className="font-bold text-white mb-1">{label} 2026</p>
                      <p className="text-emerald-400">
                        Deposits: ₹{payload[0].value?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-rose-400">
                        Withdrawals: ₹{payload[1].value?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="deposits" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="withdrawals" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
