import React from 'react';
import { Settings, Calendar, ShoppingCart, Smartphone, Car, Zap } from 'lucide-react';
import { Sparkline } from '../components/Sparkline';
import { RadialGauge } from '../components/RadialGauge';
import { useBanking } from '../context/BankingContext';
import { formatINR } from '../utils/formatters';

export const ReportsView: React.FC = () => {
  const { accounts, currencySymbol, currentUser } = useBanking();

  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');
  const totalBalance = userAccounts.reduce((sum, a) => sum + a.balance, 0);

  const watchlistItems = [
    {
      flag: '🇮🇳',
      name: 'NIFTY 50 Index',
      ticker: 'NSE: NIFTY',
      value: '24,850.40',
      change: '+0.73%',
      isPositive: true,
      sparkline: [24600, 24680, 24710, 24790, 24810, 24850.4],
    },
    {
      flag: '🇮🇳',
      name: 'BSE SENSEX',
      ticker: 'BSE: SENSEX',
      value: '81,420.15',
      change: '+0.65%',
      isPositive: true,
      sparkline: [80900, 81050, 81120, 81280, 81350, 81420.15],
    },
    {
      flag: '🇮🇳',
      name: 'Bank NIFTY Index',
      ticker: 'NSE: BANKNIFTY',
      value: '51,980.60',
      change: '+1.12%',
      isPositive: true,
      sparkline: [51200, 51450, 51380, 51720, 51850, 51980.6],
    },
  ];

  const categories = [
    {
      name: 'Groceries & Kirana',
      icon: ShoppingCart,
      percent: '32.3%',
      amount: '₹99,500',
      barColor: 'bg-[#2555EA]',
      barWidth: 'w-[75%]',
    },
    {
      name: 'Bharat BillPay & Utilities',
      icon: Zap,
      percent: '21.5%',
      amount: '₹64,200',
      barColor: 'bg-[#10B981]',
      barWidth: 'w-[62%]',
    },
    {
      name: 'Fuel & FASTag Tolls',
      icon: Car,
      percent: '16.8%',
      amount: '₹48,100',
      barColor: 'bg-[#F59E0B]',
      barWidth: 'w-[45%]',
    },
    {
      name: 'Mobile, DTH & Telecom',
      icon: Smartphone,
      percent: '11.4%',
      amount: '₹32,000',
      barColor: 'bg-[#8B5CF6]',
      barWidth: 'w-[32%]',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* 1. Hero Big Indian Rupee Balance Section */}
      <div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {formatINR(totalBalance > 0 ? totalBalance : 227500.0)}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
          <span>Total portfolio balance from all accounts</span>
          <span className="font-bold text-[#2555EA] dark:text-blue-400">INR (₹)</span>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
            ● DICGC Insured
          </span>
        </p>
      </div>

      {/* 2. Indian Market Watchlist Card (3-Column Grid) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Indian Markets Watchlist</h2>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
              NSE / BSE Real-Time
            </span>
          </div>
          <button
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            aria-label="Watchlist Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          {watchlistItems.map((item, index) => (
            <div
              key={item.ticker}
              className={`${index > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''} flex items-center justify-between`}
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mb-2">
                  <span>{item.flag}</span>
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{item.ticker}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {item.value}
                  </span>
                </div>

                <div className="mt-1">
                  <span
                    className={`text-[11px] font-bold ${
                      item.isPositive ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {item.change} {item.isPositive ? '↗' : '↘'}
                  </span>
                </div>
              </div>

              {/* Sparkline curve */}
              <div className="shrink-0 pl-2">
                <Sparkline data={item.sparkline} color="#2555EA" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Row: Breakdown (Radial Gauge) & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Breakdown Concentric Arch Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between min-h-[320px] transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Allocation</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Breakdown of domestic deposits</p>
            </div>
            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 transition" aria-label="Date Range">
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="my-auto">
            <RadialGauge amount={formatINR(totalBalance > 0 ? totalBalance : 227500.0)} subText="from all domestic accounts" size={270} />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-xs font-semibold flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2555EA]" />
              <span className="text-slate-600 dark:text-slate-400">Savings A/c (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-slate-600 dark:text-slate-400">Current A/c (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-slate-600 dark:text-slate-400">Fixed Deposits (15%)</span>
            </div>
          </div>
        </div>

        {/* Right: Categories Progress Bars Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between min-h-[320px] transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Domestic Monthly Spending</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Categorized debit ledger analytics</p>
            </div>
            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 transition" aria-label="Date Range">
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 my-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                      <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>{cat.name}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      <span className="text-slate-400 dark:text-slate-500 mr-1.5">{cat.percent}</span>
                      <span className="font-bold text-slate-900 dark:text-white">| {cat.amount}</span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cat.barColor} ${cat.barWidth}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
            <span className="text-[11px] font-semibold text-[#2555EA] dark:text-blue-400 hover:underline cursor-pointer">
              Download GST / IT spend tax summary →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
