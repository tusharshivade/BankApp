import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Eye,
  EyeOff,
  PlusCircle,
  ArrowUpRight,
  CheckSquare,
  CreditCard,
  Coffee,
  ShoppingBag,
  ArrowRightLeft,
  Zap,
  Briefcase,
} from 'lucide-react';
import type { Transaction } from '../../types/banking';

interface HomeDashboardScreenProps {
  onNavigateToSend: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenAddMoney: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onSeeAllTransactions: () => void;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  onNavigateToSend,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenAddMoney,
  onSelectTransaction,
  onSeeAllTransactions,
}) => {
  const { accounts, transactions, currencySymbol, isBalanceHidden, toggleBalanceHidden } = useBanking();
  const [filterTab, setFilterTab] = useState<'All' | 'Income' | 'Expense'>('All');

  // Primary account (first account)
  const primaryAccount = accounts[0] || {
    balance: 185000,
    accountNumber: 'FCBL1001002001',
    currency: 'INR',
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterTab === 'Income') return tx.transactionType === 'DEPOSIT';
    if (filterTab === 'Expense') return tx.transactionType === 'WITHDRAWAL' || tx.transactionType === 'TRANSFER';
    return true;
  });

  const getCategoryIcon = (category?: string, type?: string) => {
    switch (category) {
      case 'drinks':
        return {
          icon: Coffee,
          bg: 'bg-amber-100 text-amber-600',
        };
      case 'market':
        return {
          icon: ShoppingBag,
          bg: 'bg-purple-100 text-purple-600',
        };
      case 'transfer':
        return {
          icon: ArrowRightLeft,
          bg: 'bg-cyan-100 text-cyan-600',
        };
      case 'bills':
        return {
          icon: Zap,
          bg: 'bg-yellow-100 text-yellow-600',
        };
      case 'salary':
        return {
          icon: Briefcase,
          bg: 'bg-emerald-100 text-emerald-600',
        };
      default:
        return type === 'DEPOSIT'
          ? { icon: ArrowRightLeft, bg: 'bg-emerald-100 text-emerald-600' }
          : { icon: CreditCard, bg: 'bg-slate-100 text-slate-600' };
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Main Cobalt Blue Wallet Card */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#2555EA] text-white p-6 shadow-xl shadow-blue-600/20">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header: "Balance" */}
        <div className="flex items-center justify-between text-blue-100 text-xs font-medium mb-1.5">
          <span>Balance</span>
        </div>

        {/* Amount with Eye Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl sm:text-[34px] font-black tracking-tight">
            {isBalanceHidden
              ? '••••••••'
              : `${currencySymbol}${primaryAccount.balance.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </span>
          <button
            onClick={toggleBalanceHidden}
            className="p-1 rounded-full text-blue-200 hover:text-white transition active:scale-90"
            title={isBalanceHidden ? 'Show Balance' : 'Hide Balance'}
            aria-label="Toggle balance visibility"
          >
            {isBalanceHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Card Bottom: Masked Number & VISA Badge */}
        <div className="flex items-center justify-between text-xs font-medium text-blue-100">
          <span className="font-mono tracking-wider text-sm">{primaryAccount.accountNumber}</span>
          <div className="bg-white text-[#2555EA] font-black text-[11px] italic tracking-tighter px-2.5 py-0.5 rounded shadow-sm">
            VISA
          </div>
        </div>
      </div>

      {/* 2. Quick Action Grid (4 rounded pills) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenAddMoney}
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-semibold text-xs shadow-sm hover:border-blue-400 hover:bg-blue-50/40 transition active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 text-[#2555EA]" />
          <span>Add Money</span>
        </button>

        <button
          onClick={onNavigateToSend}
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-semibold text-xs shadow-sm hover:border-blue-400 hover:bg-blue-50/40 transition active:scale-[0.98]"
        >
          <ArrowUpRight className="w-4 h-4 text-[#2555EA]" />
          <span>Send Money</span>
        </button>

        <button
          onClick={onOpenDeposit}
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-semibold text-xs shadow-sm hover:border-blue-400 hover:bg-blue-50/40 transition active:scale-[0.98]"
        >
          <CheckSquare className="w-4 h-4 text-[#2555EA]" />
          <span>Deposit</span>
        </button>

        <button
          onClick={onOpenWithdraw}
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-semibold text-xs shadow-sm hover:border-blue-400 hover:bg-blue-50/40 transition active:scale-[0.98]"
        >
          <CreditCard className="w-4 h-4 text-[#2555EA]" />
          <span>Withdraw</span>
        </button>
      </div>

      {/* 3. Transaction History Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-slate-900">Transaction History</h3>
          <button
            onClick={onSeeAllTransactions}
            className="text-xs font-semibold text-slate-400 hover:text-[#2555EA] transition"
          >
            See all
          </button>
        </div>

        {/* Filter Tabs: All, Income, Expense */}
        <div className="flex items-center gap-6 mb-4 px-1 text-xs font-semibold border-b border-slate-200/60 pb-2">
          {(['All', 'Income', 'Expense'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`transition relative ${
                filterTab === tab ? 'text-[#2555EA]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {filterTab === tab && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#2555EA] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Transaction Items */}
        <div className="space-y-2.5">
          {filteredTransactions.slice(0, 5).map((tx) => {
            const { icon: CatIcon, bg } = getCategoryIcon(tx.category, tx.transactionType);
            const isCredit = tx.transactionType === 'DEPOSIT';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm cursor-pointer transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{tx.description}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {tx.subTitle || (isCredit ? 'Received' : 'Paid')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold block ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isCredit ? '+' : '-'}
                    {currencySymbol}
                    {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
