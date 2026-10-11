import React from 'react';
import { useBanking } from '../context/BankingContext';
import { AccountCard } from '../components/AccountCard';
import { CreditCard, PlusCircle, ShieldAlert } from 'lucide-react';

interface AccountsViewProps {
  onOpenDeposit: (accId: number) => void;
  onOpenWithdraw: (accId: number) => void;
  onOpenTransfer: (accId: number) => void;
  onDownloadStatement: (accId: number) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTransfer,
  onDownloadStatement,
}) => {
  const { currentUser, accounts } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Accounts Overview
          </h1>
          <p className="text-xs text-slate-400">
            Manage your simulated savings and current accounts with real-time balance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            Currency: <span className="font-bold text-white">INR (₹)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onDeposit={onOpenDeposit}
            onWithdraw={onOpenWithdraw}
            onTransfer={onOpenTransfer}
            onDownloadStatement={onDownloadStatement}
          />
        ))}
      </div>

      {/* Account Safety Guidelines */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          FinCore Ledger Integrity Architecture
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          FinCore uses strict double-entry ledger bookkeeping. When you transfer funds, an atomic unit of work
          acquires row locks on both accounts in deterministic ascending order of account ID to eliminate race conditions
          and deadlocks. No account balance can ever be modified directly without an authoritative debit/credit ledger record.
        </p>
      </div>
    </div>
  );
};
