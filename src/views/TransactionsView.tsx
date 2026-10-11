import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Search, Download, ArrowRightLeft, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { Transaction } from '../types/banking';

interface TransactionsViewProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onSelectTransaction }) => {
  const { transactions, currencySymbol, downloadCsvStatement, accounts } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'ALL' || t.transactionType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#2555EA]" />
            Transactions History
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Search, filter, and inspect financial transactions and ledger logs
          </p>
        </div>

        <button
          onClick={() => downloadCsvStatement(accounts[0]?.id || 1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2555EA] text-white text-xs font-semibold shadow-sm hover:bg-blue-600 transition active:scale-95 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search reference, note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2555EA]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#2555EA]"
            >
              <option value="ALL">All Types</option>
              <option value="DEPOSIT">Deposits</option>
              <option value="WITHDRAWAL">Withdrawals</option>
              <option value="TRANSFER">Transfers</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Reference</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5">Type</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Amount</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => {
                const isCredit = tx.transactionType === 'DEPOSIT';
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-5 font-mono text-slate-500 font-medium">{tx.referenceNumber}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{tx.description}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold">
                      <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                        {isCredit ? '+' : '-'}
                        {currencySymbol}
                        {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {tx.status}
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
