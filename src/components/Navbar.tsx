import React from 'react';
import { useBanking } from '../context/BankingContext';
import { ShieldCheck, User, Users, Menu, X, Landmark } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, currentRole, switchRole } = useBanking();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Navigation"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              FinCore
            </span>
            <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase block mt-0.5">
              Digital Banking
            </span>
          </div>
        </div>
      </div>

      {/* Center: Environment badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-medium">Educational Simulation Core</span>
        <span className="text-slate-500 font-mono text-[10px]">INR v1.0</span>
      </div>

      {/* Right: Quick Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Role toggle button */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs">
          <button
            onClick={() => switchRole('CUSTOMER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentRole === 'CUSTOMER'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer</span>
          </button>
          <button
            onClick={() => switchRole('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentRole === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* User badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
            {currentUser.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-semibold text-white block leading-tight">{currentUser.fullName}</span>
            <span className="text-[10px] text-slate-400 block font-mono">{currentUser.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
