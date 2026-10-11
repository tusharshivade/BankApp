import React from 'react';
import { useBanking } from '../context/BankingContext';
import { AccountCard } from '../components/AccountCard';
import { CashFlowChart } from '../components/CashFlowChart';
import { TransactionTable } from '../components/TransactionTable';
import { Transaction } from '../types/banking';
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, FileSpreadsheet, ShieldCheck, Wallet } from 'lucide-react';

interface CustomerDashboardProps {
  onOpenDeposit: (accId?: number) => void;
  onOpenWithdraw: (accId?: number) => void;
  onOpenTransfer: (accId?: number) => void;
  onDownloadStatement: (accId: number) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTransfer,
  onDownloadStatement,
  onSelectTransaction,
}) => {
  const { currentUser, accounts, transactions } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  // Total balance across customer accounts
  const totalBalance = userAccounts.reduce((sum, acc) => sum + (acc.status === 'ACTIVE' ? acc.balance : 0), 0);

  // Filter transactions belonging to user's accounts
  const userAccountIds = userAccounts.map((a) => a.id);
  const userTransactions = transactions.filter(
    (tx) =>
      (tx.sourceAccountId && userAccountIds.includes(tx.sourceAccountId)) ||
      (tx.destinationAccountId && userAccountIds.includes(tx.destinationAccountId))
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome & Net Balance Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Verified Digital Banking Customer
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Here is your financial portfolio summary across your active demo accounts.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl min-w-[240px]">
            <span className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Total Combined Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-400">₹</span>
              <span className="text-3xl font-black text-white tracking-tight">
                {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-slate-500">INR</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => onOpenTransfer()}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Money</span>
          </button>

          <button
            onClick={() => onOpenDeposit()}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>Deposit Cash</span>
          </button>

          <button
            onClick={() => onOpenWithdraw()}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition"
          >
            <ArrowUpCircle className="w-4 h-4 text-rose-400" />
            <span>Withdraw Cash</span>
          </button>

          <button
            onClick={() => onDownloadStatement(userAccounts[0]?.id || 1)}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span>Statement CSV</span>
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Your Bank Accounts</h2>
          <span className="text-xs text-slate-400 font-medium">{userAccounts.length} Accounts Registered</span>
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
      </div>

      {/* Analytics Chart */}
      <CashFlowChart />

      {/* Recent Transactions Table */}
      <TransactionTable
        transactions={userTransactions}
        onSelectTransaction={onSelectTransaction}
        title="Recent Account Transactions"
        limit={5}
      />
    </div>
  );
};
