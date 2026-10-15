import React from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Wallet,
  ShieldCheck,
  Download,
  PlusCircle,
  ArrowUpRight,
  Landmark,
  QrCode,
  Percent,
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface AccountsViewProps {
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenTransfer?: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTransfer,
}) => {
  const { currentUser, accounts, fixedDeposits, currencySymbol, downloadCsvStatement } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
            Domestic Accounts & Deposits
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Savings, Current, and High-Yield Fixed Deposits under RBI Scheduled Commercial Bank guidelines
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenTransfer && (
            <button
              onClick={onOpenTransfer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Transfer (UPI/IMPS)</span>
            </button>
          )}
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#2555EA] dark:text-blue-400" />
              <span>Add Money (UPI)</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {userAccounts.map((account) => (
          <div
            key={account.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">
                  {account.accountNumber}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                  {account.accountType} ACCOUNT • IFSC: {account.ifscCode || 'FCBL0001001'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                {account.status}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Available Balance</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {formatINR(account.balance)}
              </div>
              {account.upiId && (
                <span className="text-[11px] font-mono text-[#2555EA] dark:text-blue-400 block mt-1">
                  UPI VPA: {account.upiId}
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Branch: {account.branchName || 'Nariman Point, Mumbai'}
              </span>
              <button
                onClick={() => downloadCsvStatement(account.id)}
                className="flex items-center gap-1 text-[#2555EA] dark:text-blue-400 hover:underline font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Passbook CSV</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Deposits Summary */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Fixed Deposits (FDs)</h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Up to 7.50% p.a.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fixedDeposits.map((fd) => (
            <div
              key={fd.id}
              className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-slate-900 dark:text-white">{fd.fdNumber}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  {fd.interestRate}% p.a.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Principal:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{formatINR(fd.principalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Maturity Value:</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatINR(fd.maturityAmount)}</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                Matures: {new Date(fd.maturityDate).toLocaleDateString('en-IN')} {fd.isTaxSaver ? '• 80C Tax Saver' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBI & DICGC Insurance Certification Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2555EA] dark:text-blue-400 shrink-0" />
        <span>
          Every account is backed by authoritative double-entry bookkeeping with strict row-locking concurrency controls.
          All domestic deposits are guaranteed by the <strong>Deposit Insurance and Credit Guarantee Corporation (DICGC)</strong>, an RBI subsidiary, up to <strong>₹5,00,000</strong> per depositor.
        </span>
      </div>
    </div>
  );
};
