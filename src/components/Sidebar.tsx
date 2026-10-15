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
  ShieldCheck,
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
    { id: 'accounts' as NavTabId, label: 'Accounts & Deposits', icon: Wallet },
    { id: 'cards' as NavTabId, label: 'RuPay Cards', icon: CreditCard },
    { id: 'loans' as NavTabId, label: 'Branch Loans', icon: Landmark, badge: '10%' },
    { id: 'transactions' as NavTabId, label: 'Passbook & Txns', icon: ArrowRightLeft },
    { id: 'payment' as NavTabId, label: 'UPI & Payments', icon: Send, badge: 'UPI 2.0' },
    { id: 'invoicing' as NavTabId, label: 'Statements & Tax', icon: FileText },
    { id: 'trading' as NavTabId, label: 'Markets & Gold', icon: TrendingUp },
    { id: 'reports' as NavTabId, label: 'Financial Reports', icon: BarChart3 },
    { id: 'admin' as NavTabId, label: 'RBI Governance', icon: ShieldAlert },
  ];

  const balances = [
    { label: 'Savings A/c', amount: '₹1,85,000.00', tag: 'SAVINGS' },
    { label: 'Current A/c', amount: '₹42,500.00', tag: 'CURRENT' },
    { label: 'Fixed Deposit', amount: '₹5,00,000.00', tag: '7.25% FD' },
    { label: 'Gold / SGB', amount: '₹1,55,000.00', tag: '24K SGB' },
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
        <div className="space-y-6">
          {/* Top Logo and Mobile Close */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center p-2 shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/20 group hover:scale-105 transition-transform duration-200">
                <BankLogo className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block leading-tight text-sm tracking-tight">
                  FinCore Bank
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>🇮🇳</span> Bharat Portal
                </span>
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
            <div className="px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Main Banking Menu
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
                        ? 'text-slate-900 dark:text-white font-bold bg-white/90 dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
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
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="w-1.5 h-4 rounded-full bg-[#2555EA] dark:bg-blue-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Indian Rupee Balances Section at Bottom */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 px-2 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              INR Portfolio (₹)
            </span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="space-y-1.5">
            {balances.map((b) => (
              <div
                key={b.label}
                className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
              >
                <div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                    {b.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {b.amount}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50">
                  {b.tag}
                </span>
              </div>
            ))}
          </div>

          {/* RBI & DICGC Insurance Certification Badge */}
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
            <div className="flex items-start gap-1.5 p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[10px] text-blue-800 dark:text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>RBI Regulated Bank</strong> • DICGC Insured up to <strong>₹5 Lakh</strong>
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
