import React from 'react';
import { useBanking } from '../context/BankingContext';
import {
  PlusCircle,
  ArrowUpRight,
  CreditCard,
  Download,
  QrCode,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import type { Transaction } from '../types/banking';
import { formatINR } from '../utils/formatters';

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
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(totalBalance)}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span>Total domestic balance across all accounts</span>
            <span className="font-bold text-[#2555EA] dark:text-blue-400">INR (₹)</span>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
              RBI Regulated • Scheduled Commercial Bank
            </span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenTransfer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Send Money (UPI / IMPS)</span>
          </button>

          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#2555EA] dark:text-blue-400" />
            <span>Add Funds (UPI)</span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>ATM Cash</span>
          </button>

          <button
            onClick={() => downloadCsvStatement(userAccounts[0]?.id || 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs transition active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Passbook / CSV</span>
          </button>
        </div>
      </div>

      {/* Account Cards Grid with RuPay Branding & Indian IFSC */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Indian Bank Accounts</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">IFSC: FCBL0001001 • Nariman Point, Mumbai</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userAccounts.map((account, idx) => (
            <div
              key={account.id}
              className={`rounded-2xl p-6 border transition relative overflow-hidden shadow-sm ${
                idx === 0
                  ? 'bg-gradient-to-tr from-[#1E40AF] to-[#2555EA] text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block ${
                      idx === 0 ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {account.accountType} ACCOUNT
                  </span>
                  <span className={`text-[10px] ${idx === 0 ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    IFSC: {account.ifscCode || 'FCBL0001001'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    idx === 0
                      ? 'bg-white/20 text-white'
                      : account.status === 'ACTIVE'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {account.status}
                </span>
              </div>

              <div className="mb-6">
                <span className={`text-xs block ${idx === 0 ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                  Available Balance
                </span>
                <div className="text-3xl font-black tracking-tight mt-0.5 font-mono">
                  {formatINR(account.balance)}
                </div>
                {account.upiId && (
                  <span className={`text-[11px] block mt-1 font-mono ${idx === 0 ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    UPI: {account.upiId}
                  </span>
                )}
              </div>

              <div
                className={`flex items-center justify-between text-xs pt-3 border-t ${
                  idx === 0 ? 'border-white/20 text-blue-100' : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="font-mono tracking-wider font-semibold">{account.accountNumber}</span>
                <div
                  className={`font-black text-[11px] tracking-wide px-2.5 py-0.5 rounded flex items-center gap-1 ${
                    idx === 0 ? 'bg-white text-[#2555EA]' : 'bg-slate-900 dark:bg-slate-800 text-white'
                  }`}
                >
                  <span>RuPay</span>
                  <span className="text-[9px] font-normal opacity-80">Platinum</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPI Quick Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-200/50 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-[#2555EA] dark:text-blue-400 flex items-center justify-center shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Instant 24x7 UPI 2.0 & Bharat QR Transfers
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Your default VPA: <strong className="text-[#2555EA] dark:text-blue-400 font-mono">aarav.sharma@fincore</strong> • Linked to RuPay Platinum
            </span>
          </div>
        </div>
        <button
          onClick={onOpenTransfer}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-semibold text-xs shadow-xs transition"
        >
          Open UPI Hub
        </button>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Passbook Ledger</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">All amounts verified in Indian Rupees (INR ₹)</span>
          </div>
          <span className="text-[11px] text-[#2555EA] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-lg">
            NPCI Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5">Ref / UTR</th>
                <th className="py-3 px-5">Particulars</th>
                <th className="py-3 px-5">Mode</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Amount (₹)</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.slice(0, 6).map((tx) => {
                const isDeposit = tx.transactionType === 'DEPOSIT';
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-5 font-mono text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                      {tx.referenceNumber}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 dark:text-white">{tx.description}</div>
                      {tx.subTitle && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{tx.subTitle}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-[#2555EA] dark:text-blue-300 font-bold text-[10px] border border-blue-200/50 dark:border-blue-900/40">
                        {tx.transferMode || tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-400 dark:text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold font-mono">
                      <span className={isDeposit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                        {isDeposit ? '+' : '-'}
                        {formatINR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        ● {tx.status}
                      </span>
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
