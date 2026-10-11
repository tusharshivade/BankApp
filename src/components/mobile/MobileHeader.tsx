import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { Bell, Wifi, BatteryMedium } from 'lucide-react';

interface MobileHeaderProps {
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenNotifications, onOpenProfile }) => {
  const { currentUser } = useBanking();

  return (
    <div className="pt-2 pb-4">
      {/* Phone Status Bar (9:41) */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 px-3 pb-3 select-none">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-slate-700">
          <div className="flex gap-0.5 items-end h-2.5">
            <span className="w-0.5 h-1 bg-slate-700 rounded-sm" />
            <span className="w-0.5 h-1.5 bg-slate-700 rounded-sm" />
            <span className="w-0.5 h-2 bg-slate-700 rounded-sm" />
            <span className="w-0.5 h-2.5 bg-slate-700 rounded-sm" />
          </div>
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* User Greeting Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenProfile}>
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
          />
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Hi, {currentUser.fullName}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Welcome back!</p>
          </div>
        </div>

        {/* Bell with red indicator */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </div>
    </div>
  );
};
