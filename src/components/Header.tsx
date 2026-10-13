import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
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
  const { currentUser } = useBanking();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
          {title}
        </h1>
      </div>

      {/* Right: Search, Theme Toggle, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Search bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Type to search ..."
            className="w-full bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2555EA] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
        </div>

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

        {/* User avatar */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 cursor-pointer group"
          title={`Logged in as ${currentUser.fullName}`}
        >
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm group-hover:ring-2 group-hover:ring-[#2555EA]/30 transition"
          />
        </div>
      </div>
    </header>
  );
};
