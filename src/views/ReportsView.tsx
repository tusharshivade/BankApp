import React from 'react';
import { Settings, Calendar, ShoppingCart, Shirt, Car, Zap } from 'lucide-react';
import { Sparkline } from '../components/Sparkline';
import { RadialGauge } from '../components/RadialGauge';
import { useBanking } from '../context/BankingContext';

export const ReportsView: React.FC = () => {
  const { currencySymbol } = useBanking();

  const watchlistItems = [
    {
      flag: '🇺🇸',
      name: 'U.S. Dollar Index',
      ticker: 'DXY',
      value: '108.75',
      change: '+0.73%',
      isPositive: true,
      sparkline: [104, 105.8, 105.2, 107.4, 106.9, 108.75],
    },
    {
      flag: '🇪🇺',
      name: 'Euro Stoxx 50 Index',
      ticker: 'STOXX',
      value: '3,396.61',
      change: '-1.66%',
      isPositive: false,
      sparkline: [3450, 3435, 3445, 3405, 3420, 3396.61],
    },
    {
      flag: '🇦🇺',
      name: 'All Ordinaries Index',
      ticker: 'ASX',
      value: '6,848.6',
      change: '+0.60%',
      isPositive: true,
      sparkline: [6810, 6835, 6825, 6842, 6838, 6848.6],
    },
  ];

  const categories = [
    {
      name: 'Grocery',
      icon: ShoppingCart,
      percent: '20.3%',
      amount: '$99.5k',
      barColor: 'bg-[#2555EA]',
      barWidth: 'w-[75%]',
    },
    {
      name: 'Clothing',
      icon: Shirt,
      percent: '18.5%',
      amount: '$64.2k',
      barColor: 'bg-[#10B981]',
      barWidth: 'w-[62%]',
    },
    {
      name: 'Car & Transport',
      icon: Car,
      percent: '12.8%',
      amount: '$48.1k',
      barColor: 'bg-[#F59E0B]',
      barWidth: 'w-[45%]',
    },
    {
      name: 'Energy & Tech',
      icon: Zap,
      percent: '9.4%',
      amount: '$32.0k',
      barColor: 'bg-[#8B5CF6]',
      barWidth: 'w-[32%]',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* 1. Hero Big Balance Section */}
      <div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          $120,420.50
        </div>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
          <span>Total balance from all accounts</span>
          <span className="font-bold text-[#2555EA] dark:text-blue-400">USD</span>
        </p>
      </div>

      {/* 2. Watchlist Card (3-Column Grid) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Watchlist</h2>
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Breakdown</h3>
            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 transition" aria-label="Date Range">
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="my-auto">
            <RadialGauge amount="$80,720.50" subText="from all accounts" size={270} />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2555EA]" />
              <span className="text-slate-600 dark:text-slate-400">Savings (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-slate-600 dark:text-slate-400">Checking (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-slate-600 dark:text-slate-400">Investments (10%)</span>
            </div>
          </div>
        </div>

        {/* Right: Categories Progress Bars Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between min-h-[320px] transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Categories</h3>
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
              View all category spending →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
