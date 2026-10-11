import React from 'react';
import { useBanking } from '../context/BankingContext';
import { Wallet, ShieldCheck, Download, PlusCircle, ArrowUpRight } from 'lucide-react';

interface AccountsViewProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenTransfer: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTransfer,
}) => {
  const { currentUser, accounts, currencySymbol, downloadCsvStatement } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#2555EA]" />
            Accounts Overview
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage your savings and checking accounts with balance ledger protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2555EA] text-white text-xs font-semibold shadow-sm hover:bg-blue-600 transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>
          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#2555EA]" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {userAccounts.map((account, idx) => (
          <div
            key={account.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4 hover:border-blue-300 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 block">{account.accountNumber}</span>
                <span className="text-[11px] text-slate-400 font-semibold">{account.accountType} ACCOUNT</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {account.status}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Available Balance</span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {currencySymbol}
                {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">ID #{account.id}</span>
              <button
                onClick={() => downloadCsvStatement(account.id)}
                className="flex items-center gap-1 text-[#2555EA] hover:underline font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Statement</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#2555EA] shrink-0" />
        <span>
          Every account is backed by authoritative double-entry bookkeeping with strict row-locking concurrency controls.
        </span>
      </div>
    </div>
  );
};
