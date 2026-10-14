import React from 'react';
import {
  Compass,
  Wallet,
  CreditCard,
  Landmark,
  ArrowRightLeft,
  Send,
  FileText,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { BankLogo } from './BankLogo';

export type NavTabId =
  | 'dashboard'
  | 'accounts'
  | 'cards'
  | 'loans'
  | 'transactions'
  | 'payment'
  | 'invoicing'
  | 'trading'
  | 'reports'
  | 'admin';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentRole } = useBanking();

  const navItems = [
    { id: 'dashboard' as NavTabId, label: 'Dashboard', icon: Compass },
    { id: 'accounts' as NavTabId, label: 'Accounts', icon: Wallet },
    { id: 'cards' as NavTabId, label: 'Cards', icon: CreditCard },
    { id: 'loans' as NavTabId, label: 'Loans', icon: Landmark, badge: '10%' },
    { id: 'transactions' as NavTabId, label: 'Transactions', icon: ArrowRightLeft },
    { id: 'payment' as NavTabId, label: 'Payment', icon: Send },
    { id: 'invoicing' as NavTabId, label: 'Invoicing', icon: FileText },
    { id: 'trading' as NavTabId, label: 'Trading', icon: TrendingUp },
    { id: 'reports' as NavTabId, label: 'Reports', icon: BarChart3 },
    { id: 'admin' as NavTabId, label: 'Admin', icon: ShieldAlert },
  ];

  const balances = [
    { flag: '🇺🇸', amount: '100,050.75', currency: 'USD' },
    { flag: '🇪🇺', amount: '2310.40', currency: 'EUR' },
    { flag: '🇬🇧', amount: '9455.50', currency: 'GBP' },
    { flag: '🇮🇳', amount: '75,000.00', currency: 'INR' },
  ];

  const handleSelect = (tab: NavTabId) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`w-64 shrink-0 bg-[#F8FAFC] dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between py-6 px-4 transition-all duration-300 ease-in-out ${
          isOpenMobile
            ? 'fixed top-0 bottom-0 left-0 z-50 translate-x-0 shadow-2xl overflow-y-auto'
            : 'hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto translate-x-0 z-20'
        }`}
      >
        <div className="space-y-7">
          {/* Top Logo and Mobile Close */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center p-2 shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/20 group hover:scale-105 transition-transform duration-200">
                <BankLogo className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block leading-tight text-sm tracking-tight">FinCore Bank</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Digital Portal</span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div>
            <div className="px-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Navigation
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition relative group ${
                      isActive
                        ? 'text-slate-900 dark:text-white font-bold bg-white/80 dark:bg-slate-800 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive
                            ? 'text-[#2555EA] dark:text-blue-400 stroke-[2.2px]'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                      {/* Active vertical blue bar indicator on right edge */}
                      {isActive && (
                        <span className="w-1 h-5 rounded-full bg-[#2555EA] dark:bg-blue-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Balances Section at Bottom */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 px-2 space-y-3 shrink-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Balances
          </span>

          <div className="space-y-2">
            {balances.map((b) => (
              <div
                key={b.currency}
                className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <span className="text-sm">{b.flag}</span>
                <span className="font-mono text-[11px]">{b.amount}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{b.currency}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
