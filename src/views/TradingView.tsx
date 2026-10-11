import React from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Sparkline } from '../components/Sparkline';

export const TradingView: React.FC = () => {
  const forexPairs = [
    { pair: 'USD / INR', rate: '83.92', change: '+0.15%', isUp: true, sparkline: [83.4, 83.6, 83.5, 83.8, 83.7, 83.92] },
    { pair: 'EUR / USD', rate: '1.0845', change: '-0.32%', isUp: false, sparkline: [1.092, 1.09, 1.087, 1.089, 1.086, 1.0845] },
    { pair: 'GBP / USD', rate: '1.2980', change: '+0.45%', isUp: true, sparkline: [1.289, 1.292, 1.291, 1.295, 1.294, 1.298] },
    { pair: 'USD / JPY', rate: '154.20', change: '-0.10%', isUp: false, sparkline: [155.1, 154.8, 154.9, 154.4, 154.6, 154.2] },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#2555EA]" />
          Global Markets & Forex
        </h2>
        <p className="text-xs text-slate-400 font-medium">Real-time indicative exchange rates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forexPairs.map((fx) => (
          <div key={fx.pair} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{fx.pair}</span>
              <span className={`font-bold flex items-center ${fx.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {fx.isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {fx.change}
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">{fx.rate}</div>

            <div className="pt-2">
              <Sparkline data={fx.sparkline} color={fx.isUp ? '#10B981' : '#F43F5E'} width={180} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
