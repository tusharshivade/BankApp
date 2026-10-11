import React from 'react';
import { Account } from '../types/banking';
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, Download, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onDeposit: (accountId: number) => void;
  onWithdraw: (accountId: number) => void;
  onTransfer: (accountId: number) => void;
  onDownloadStatement: (accountId: number) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDeposit,
  onWithdraw,
  onTransfer,
  onDownloadStatement,
}) => {
  const isSuspended = account.status === 'SUSPENDED';

  // Format account number masked (show last 4 digits)
  const lastFour = account.accountNumber.slice(-4);
  const maskedNumber = `•••• •••• •••• ${lastFour}`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/80 p-6 shadow-xl transition-all duration-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-950/20">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      {/* Top row: Brand & Status */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            FC
          </div>
          <span className="font-semibold text-sm tracking-wider text-slate-200 uppercase">FinCore Bank</span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isSuspended
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isSuspended ? (
            <>
              <AlertTriangle className="w-3 h-3" />
              SUSPENDED
            </>
          ) : (
            <>
              <ShieldCheck className="w-3 h-3" />
              ACTIVE
            </>
          )}
        </span>
      </div>

      {/* EMV Chip and Type */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-300/40 flex items-center justify-center relative overflow-hidden">
          <div className="w-6 h-4 border border-amber-300/30 rounded-sm" />
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
          {account.accountType} ACCOUNT
        </span>
      </div>

      {/* Balance */}
      <div className="mb-5">
        <span className="text-xs font-medium text-slate-400 block mb-1">Available Balance</span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-slate-400">₹</span>
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs font-bold text-slate-500 ml-1">{account.currency}</span>
        </div>
      </div>

      {/* Account Number */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 mb-5">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase">Account Number</span>
          <span className="font-mono text-sm tracking-widest text-slate-300">{maskedNumber}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">ID #{account.id}</span>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => onDeposit(account.id)}
          disabled={isSuspended}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 hover:border-emerald-500/40 border border-slate-700 text-slate-300 hover:text-emerald-400 transition text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          title="Deposit"
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span className="text-[11px]">Deposit</span>
        </button>

        <button
          onClick={() => onWithdraw(account.id)}
          disabled={isSuspended}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600/20 hover:border-rose-500/40 border border-slate-700 text-slate-300 hover:text-rose-400 transition text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          title="Withdraw"
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span className="text-[11px]">Withdraw</span>
        </button>

        <button
          onClick={() => onTransfer(account.id)}
          disabled={isSuspended}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600/20 hover:border-blue-500/40 border border-slate-700 text-slate-300 hover:text-blue-400 transition text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          title="Transfer"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span className="text-[11px]">Transfer</span>
        </button>

        <button
          onClick={() => onDownloadStatement(account.id)}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 hover:border-slate-500 border border-slate-700 text-slate-300 hover:text-white transition text-xs font-medium"
          title="Download CSV Statement"
        >
          <Download className="w-4 h-4" />
          <span className="text-[11px]">CSV</span>
        </button>
      </div>
    </div>
  );
};
