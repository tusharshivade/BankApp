import React from 'react';
import { Search, Bell, Menu, ShieldCheck } from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title: string;
  onToggleMobileSidebar: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onToggleMobileSidebar,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const { currentUser, currentRole, switchRole } = useBanking();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-200 shadow-xs">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-[#2555EA] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              <ShieldCheck className="w-3 h-3 text-[#2555EA] dark:text-blue-400" />
              INR (₹) Scheduled Bank
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:block">
            Reserve Bank of India (RBI) License: FCBL-RBI-9018 • IFSC: FCBL0001001
          </span>
        </div>
      </div>

      {/* Right: Search, Role Switcher, Theme Toggle, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Search bar */}
        <div className="relative hidden md:block w-48 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search UPI ID, A/c, IFSC, UTR..."
            className="w-full bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2555EA] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
        </div>

        {/* Quick Role Switcher Pill */}
        <button
          onClick={() => switchRole(currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
            currentRole === 'ADMIN'
              ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          }`}
          title="Toggle between Indian Customer Portal and RBI Admin Governance Console"
        >
          <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
          <span>{currentRole === 'ADMIN' ? 'RBI Admin' : 'Retail Customer'}</span>
        </button>

        {/* Dark Mode Toggle on Navbar */}
        <ThemeToggle />

        {/* Bell notification button */}
        <button
          onClick={onOpenNotifications}
          className="relative w-9 h-9 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>

        {/* User avatar & name */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 cursor-pointer group p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Logged in as ${currentUser.fullName} (${currentUser.role})`}
        >
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm group-hover:ring-2 group-hover:ring-[#2555EA]/30 transition"
          />
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {currentUser.city || 'Mumbai, MH'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
