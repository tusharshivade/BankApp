import React from 'react';
import { useBanking } from '../context/BankingContext';
import { CreditCard, ShieldCheck } from 'lucide-react';

export const CardsView: React.FC = () => {
  const { accounts, currencySymbol, currentUser } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#2555EA]" />
          Payment Cards & Virtual Accounts
        </h2>
        <p className="text-xs text-slate-400 font-medium">Manage your active debit cards and limits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userAccounts.map((account, idx) => (
          <div
            key={account.id}
            className={`rounded-3xl p-6 shadow-md relative overflow-hidden transition ${
              idx === 0
                ? 'bg-gradient-to-tr from-[#1E40AF] to-[#2555EA] text-white shadow-blue-500/20'
                : 'bg-gradient-to-tr from-slate-800 to-slate-900 text-white shadow-slate-900/20'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold tracking-widest uppercase text-white/80">FinCore Bank</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {account.status}
              </span>
            </div>

            <div className="mb-8">
              <span className="text-xs text-white/70 block mb-1">Available Balance</span>
              <div className="text-3xl font-black">
                {currencySymbol}
                {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="font-mono tracking-widest text-sm">{account.accountNumber}</span>
              <div className="bg-white text-slate-900 font-black text-xs italic px-2 py-0.5 rounded shadow-sm">
                VISA
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
