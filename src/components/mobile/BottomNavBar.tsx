import React from 'react';
import { Home, CreditCard, PieChart, User } from 'lucide-react';

export type TabType = 'home' | 'send' | 'payment' | 'wallet' | 'report' | 'account' | 'admin';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'wallet' as TabType, label: 'Wallet', icon: CreditCard },
    { id: 'report' as TabType, label: 'Report', icon: PieChart },
    { id: 'account' as TabType, label: 'Account', icon: User },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex items-center justify-between z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || (tab.id === 'home' && (activeTab === 'send' || activeTab === 'payment'));

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 ${
              isActive ? 'text-[#2555EA]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
