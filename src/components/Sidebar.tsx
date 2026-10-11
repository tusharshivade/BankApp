import React from 'react';
import { useBanking } from '../context/BankingContext';
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  FileSpreadsheet,
  UserCheck,
  ShieldAlert,
  Users,
  Settings,
  DatabaseZap,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpen, onCloseMobile }) => {
  const { currentRole } = useBanking();

  const customerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transfers', label: 'Transfer Money', icon: ArrowRightLeft },
    { id: 'deposit', label: 'Deposit Funds', icon: ArrowDownCircle },
    { id: 'withdraw', label: 'Withdraw Funds', icon: ArrowUpCircle },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'statements', label: 'Statements (CSV)', icon: FileSpreadsheet },
    { id: 'profile', label: 'Profile & KYC', icon: UserCheck },
  ];

  const adminNav = [
    { id: 'admin-overview', label: 'System Overview', icon: Activity },
    { id: 'admin-customers', label: 'Customers', icon: Users },
    { id: 'admin-accounts', label: 'Account Controls', icon: CreditCard },
    { id: 'admin-transactions', label: 'Global Transactions', icon: History },
    { id: 'admin-audit', label: 'Audit Trail', icon: ShieldAlert },
  ];

  const handleSelect = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6 pt-12 lg:pt-2">
          {/* Section: Customer or Admin Nav */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === 'ADMIN' ? 'Admin Controls' : 'Personal Banking'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {currentRole}
              </span>
            </div>

            <nav className="space-y-1">
              {(currentRole === 'ADMIN' ? adminNav : customerNav).map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? currentRole === 'ADMIN'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
              <DatabaseZap className="w-4 h-4 text-emerald-400" />
              <span>Double-Entry Ledger</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every transaction generates balanced debit & credit movements with row-level locks.
            </p>
          </div>
        </div>

        {/* Bottom system status */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>FinCore v1.0.0</span>
          <span className="text-emerald-400 font-medium">● Connected</span>
        </div>
      </aside>
    </>
  );
};
