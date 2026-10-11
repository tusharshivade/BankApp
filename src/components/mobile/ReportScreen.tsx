import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MONTHLY_CHART_DATA } from '../../services/mockData';
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';

export const ReportScreen: React.FC = () => {
  const { currencySymbol } = useBanking();

  const totalIncome = 9200;
  const totalExpense = 1800;

  return (
    <div className="space-y-5 pb-6">
      <div className="pt-1">
        <h2 className="text-lg font-bold text-slate-900">Financial Reports</h2>
        <p className="text-xs text-slate-400 font-medium">Income vs expenses analysis</p>
      </div>

      {/* Income / Expense Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Total Income</span>
          <span className="text-lg font-black text-slate-900">
            {currencySymbol}{totalIncome.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Total Expense</span>
          <span className="text-lg font-black text-slate-900">
            {currencySymbol}{totalExpense.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#2555EA]" />
            Monthly Spending Flow
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">Past 6 Months</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${currencySymbol}${val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-[11px] space-y-1">
                        <p className="font-bold">{label} 2026</p>
                        <p className="text-emerald-400">Income: {currencySymbol}{payload[0].value?.toLocaleString()}</p>
                        <p className="text-rose-400">Expense: {currencySymbol}{payload[1].value?.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="deposits" fill="#2555EA" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="withdrawals" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900">Top Categories</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Cafe & Drinks</span>
            <span className="font-bold text-slate-900">{currencySymbol}150.00 (35%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full w-[35%]" />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-600">Groceries & Market</span>
            <span className="font-bold text-slate-900">{currencySymbol}250.00 (50%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full w-[50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
