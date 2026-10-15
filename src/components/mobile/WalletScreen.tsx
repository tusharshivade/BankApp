import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { Download, ShieldCheck, AlertTriangle } from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const { accounts, currencySymbol, downloadCsvStatement, currentUser } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  return (
    <div className="space-y-5 pb-6">
      <div className="pt-1">
        <h2 className="text-lg font-bold text-slate-900">My Wallet & Cards</h2>
        <p className="text-xs text-slate-400 font-medium">Manage your payment cards and bank accounts</p>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {userAccounts.map((account, index) => {
          const isPrimary = index === 0;
          const isSuspended = account.status === 'SUSPENDED';

          return (
            <div
              key={account.id}
              className={`rounded-[24px] p-5 shadow-lg relative overflow-hidden transition ${
                isPrimary
                  ? 'bg-gradient-to-tr from-[#1E40AF] to-[#2555EA] text-white shadow-blue-500/20'
                  : 'bg-gradient-to-tr from-slate-800 to-slate-900 text-white shadow-slate-900/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  {account.accountType} ACCOUNT
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSuspended ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-[11px] text-white/70 block">Available Balance</span>
                <div className="text-2xl font-black">
                  {currencySymbol}
                  {account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="font-mono tracking-wider">{account.accountNumber}</span>
                <div className="bg-white text-[#005B9C] font-black text-[10px] tracking-wider px-2 py-0.5 rounded">
                  RuPay
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statement Download Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Download Account Statement</h4>
          <p className="text-[11px] text-slate-400">Export official transaction records as CSV</p>
        </div>
        <button
          onClick={() => downloadCsvStatement(userAccounts[0]?.id || 1)}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#2555EA] text-white font-semibold text-xs shadow-sm hover:bg-blue-600 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#2555EA] shrink-0 mt-0.5" />
        <span>
          FinCore double-entry accounting guarantees balance reconciliation against all historical ledger entries.
        </span>
      </div>
    </div>
  );
};
