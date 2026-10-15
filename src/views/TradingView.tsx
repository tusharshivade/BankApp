import React from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Sparkline } from '../components/Sparkline';

export const TradingView: React.FC = () => {
  const forexPairs = [
    { pair: 'USD / INR', rate: '₹84.05', change: '+0.12%', isUp: true, sparkline: [83.8, 83.9, 83.85, 84.0, 83.95, 84.05], note: 'RBI Reference Rate' },
    { pair: 'EUR / INR', rate: '₹91.20', change: '-0.25%', isUp: false, sparkline: [91.6, 91.5, 91.4, 91.3, 91.25, 91.2], note: 'Indicative Interbank' },
    { pair: 'GBP / INR', rate: '₹108.80', change: '+0.38%', isUp: true, sparkline: [108.1, 108.3, 108.2, 108.5, 108.7, 108.8], note: 'Cross Currency FX' },
    { pair: 'AED / INR', rate: '₹22.88', change: '+0.05%', isUp: true, sparkline: [22.82, 22.84, 22.85, 22.86, 22.87, 22.88], note: 'Middle East Corridor' },
  ];

  const commodities = [
    { name: 'Gold 24K (Hallmarked)', symbol: 'MCX: GOLD', price: '₹77,500 / 10g', change: '+0.45%', isUp: true, sparkline: [76800, 77000, 77150, 77300, 77420, 77500] },
    { name: 'Silver 999 (Pure)', symbol: 'MCX: SILVER', price: '₹91,200 / 1kg', change: '+0.80%', isUp: true, sparkline: [89800, 90200, 90500, 90900, 91050, 91200] },
    { name: 'Sovereign Gold Bond (SGB)', symbol: 'RBI: SGB-SERIES', price: '₹7,850 / g', change: '+0.30%', isUp: true, sparkline: [7780, 7800, 7815, 7830, 7840, 7850] },
    { name: 'Crude Oil (INR)', symbol: 'MCX: CRUDEOIL', price: '₹6,150 / bbl', change: '-1.10%', isUp: false, sparkline: [6280, 6240, 6210, 6190, 6170, 6150] },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
              INR Forex & Indian Commodity Markets
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Real-time indicative Reserve Bank of India (RBI) reference rates & MCX commodity prices
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg font-mono">
            IST Market Hours (9:00 - 17:00)
          </span>
        </div>
      </div>

      {/* Forex Section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Rupee Exchange Rates (INR Pairs)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forexPairs.map((fx) => (
            <div
              key={fx.pair}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{fx.pair}</span>
                <span className={`font-bold flex items-center ${fx.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {fx.isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                  {fx.change}
                </span>
              </div>

              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {fx.rate}
              </div>

              <div className="text-[10px] text-slate-400">{fx.note}</div>

              <div className="pt-2">
                <Sparkline data={fx.sparkline} color={fx.isUp ? '#10B981' : '#F43F5E'} width={180} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commodities Section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Bullion & Commodities (MCX India)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commodities.map((item) => (
            <div
              key={item.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.symbol}</span>
                </div>
                <span className={`font-bold text-xs flex items-center ${item.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                  {item.change}
                </span>
              </div>

              <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {item.price}
              </div>

              <div className="pt-2">
                <Sparkline data={item.sparkline} color={item.isUp ? '#10B981' : '#F43F5E'} width={180} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
