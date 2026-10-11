import React from 'react';
import { useBanking } from '../context/BankingContext';
import {
  PlusCircle,
  ArrowUpRight,
  CreditCard,
  Download,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { Transaction } from '../types/banking';

interface DashboardViewProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenTransfer: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTransfer,
  onSelectTransaction,
}) => {
  const { accounts, transactions, currencySymbol, downloadCsvStatement, currentUser } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  const totalBalance = userAccounts.reduce(
    (sum, acc) => sum + (acc.status === 'ACTIVE' ? acc.balance : 0),
    0
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Hero Balance & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {currencySymbol}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
            <span>Total balance from all accounts</span>
            <span className="font-bold text-[#2555EA]">{accounts[0]?.currency || 'USD'}</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenTransfer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Send Money</span>
          </button>

          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#2555EA]" />
            <span>Add Funds</span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => downloadCsvStatement(userAccounts[0]?.id || 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Statement</span>
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-4">Bank Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userAccounts.map((account, idx) => (
            <div
              key={account.id}
              className={`rounded-2xl p-6 border transition relative overflow-hidden shadow-sm ${
                idx === 0
                  ? 'bg-gradient-to-tr from-[#1E40AF] to-[#2555EA] text-white border-blue-600'
                  : 'bg-white border-slate-200/80 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    idx === 0 ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {account.accountType} ACCOUNT
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    idx === 0
                      ? 'bg-white/20 text-white'
                      : account.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {account.status}
                </span>
              </div>

              <div className="mb-6">
                <span className={`text-xs block ${idx === 0 ? 'text-blue-200' : 'text-slate-400'}`}>
                  Available Balance
                </span>
                <div className="text-3xl font-black tracking-tight mt-0.5">
                  {currencySymbol}
                  {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div
                className={`flex items-center justify-between text-xs pt-3 border-t ${
                  idx === 0 ? 'border-white/20 text-blue-100' : 'border-slate-100 text-slate-500'
                }`}
              >
                <span className="font-mono tracking-wider">{account.accountNumber}</span>
                <div
                  className={`font-black text-[11px] italic px-2 py-0.5 rounded ${
                    idx === 0 ? 'bg-white text-[#2555EA]' : 'bg-slate-900 text-white'
                  }`}
                >
                  VISA
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
          <span className="text-xs text-slate-400 font-medium">Click to inspect double-entry ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Reference</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5">Type</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Amount</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 6).map((tx) => {
                const isDeposit = tx.transactionType === 'DEPOSIT';
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-5 font-mono text-slate-500 font-medium">{tx.referenceNumber}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{tx.description}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold">
                      <span className={isDeposit ? 'text-emerald-600' : 'text-slate-900'}>
                        {isDeposit ? '+' : '-'}
                        {currencySymbol}
                        {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-emerald-600 font-semibold text-[11px]">● {tx.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
