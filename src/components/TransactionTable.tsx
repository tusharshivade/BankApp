import React, { useState } from 'react';
import { Transaction } from '../types/banking';
import { Search, ArrowDownRight, ArrowUpRight, ArrowRightLeft, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  title?: string;
  limit?: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
  title = 'Transaction History',
  limit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.sourceAccountNumber && tx.sourceAccountNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.destinationAccountNumber && tx.destinationAccountNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || tx.transactionType === typeFilter;

    return matchesSearch && matchesType;
  });

  const displayedList = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
      {/* Header and filters */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">Click any row to inspect double-entry ledger records</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search reference, memo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-60"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAWAL">Withdrawals</option>
            <option value="TRANSFER">Transfers</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Amount (INR)</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  <p className="text-sm font-medium">No transactions match your criteria</p>
                  <p className="text-xs text-slate-600 mt-1">Try clearing your search query or filters</p>
                </td>
              </tr>
            ) : (
              displayedList.map((tx) => {
                const isDeposit = tx.transactionType === 'DEPOSIT';
                const isWithdrawal = tx.transactionType === 'WITHDRAWAL';
                const isTransfer = tx.transactionType === 'TRANSFER';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-300 group-hover:text-blue-400">
                      {tx.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDeposit
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isWithdrawal
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {isDeposit && <ArrowDownRight className="w-3 h-3" />}
                        {isWithdrawal && <ArrowUpRight className="w-3 h-3" />}
                        {isTransfer && <ArrowRightLeft className="w-3 h-3" />}
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={isDeposit ? 'text-emerald-400' : 'text-slate-100'}>
                        {isDeposit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          tx.status === 'SUCCESS'
                            ? 'text-emerald-400'
                            : tx.status === 'PENDING'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {tx.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {tx.status === 'FAILED' && <AlertTriangle className="w-3 h-3" />}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
