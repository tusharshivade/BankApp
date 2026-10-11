import React from 'react';
import { useBanking } from '../context/BankingContext';
import { TransactionTable } from '../components/TransactionTable';
import { Transaction } from '../types/banking';
import { History, Download } from 'lucide-react';

interface TransactionsViewProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onSelectTransaction }) => {
  const { transactions, currentUser, currentRole, accounts, downloadCsvStatement } = useBanking();

  // If customer, show only customer account txs; if admin, show all
  const userAccountIds = accounts.filter((a) => a.userId === currentUser.id).map((a) => a.id);
  const relevantTransactions =
    currentRole === 'ADMIN'
      ? transactions
      : transactions.filter(
          (t) =>
            (t.sourceAccountId && userAccountIds.includes(t.sourceAccountId)) ||
            (t.destinationAccountId && userAccountIds.includes(t.destinationAccountId))
        );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-400" />
            Transaction History
          </h1>
          <p className="text-xs text-slate-400">
            {currentRole === 'ADMIN'
              ? 'Global ledger transaction records across all system users and accounts.'
              : 'Search and inspect all deposits, withdrawals, and transfers posted to your accounts.'}
          </p>
        </div>

        {currentRole === 'CUSTOMER' && userAccountIds.length > 0 && (
          <button
            onClick={() => downloadCsvStatement(userAccountIds[0])}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Statement (CSV)</span>
          </button>
        )}
      </div>

      <TransactionTable
        transactions={relevantTransactions}
        onSelectTransaction={onSelectTransaction}
        title={currentRole === 'ADMIN' ? 'All System Transactions' : 'Your Account Transactions'}
      />
    </div>
  );
};
