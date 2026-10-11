import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { FileSpreadsheet, Download, Calendar, ShieldCheck } from 'lucide-react';

export const StatementsView: React.FC = () => {
  const { accounts, currentUser, downloadCsvStatement, transactions } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  const [selectedAccountId, setSelectedAccountId] = useState<number>(userAccounts[0]?.id || 1);
  const [dateRange, setDateRange] = useState<string>('last-30');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  // Count transactions for this account
  const txCount = transactions.filter(
    (t) => t.sourceAccountId === selectedAccountId || t.destinationAccountId === selectedAccountId
  ).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <FileSpreadsheet className="w-6 h-6 text-blue-400" />
          Account Statements
        </h1>
        <p className="text-xs text-slate-400">
          Generate and download official CSV financial statements for your bank accounts.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Account
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedAccountId(acc.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedAccountId === acc.id
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-sm font-bold">{acc.accountNumber}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800">
                    {acc.accountType}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Balance:{' '}
                  <span className="text-white font-semibold">₹{acc.balance.toLocaleString('en-IN')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              Statement Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="last-30">Last 30 Days (Current Month)</option>
              <option value="last-90">Last 3 Months (Quarterly)</option>
              <option value="financial-year">Current Financial Year (FY 2026-27)</option>
              <option value="all-time">All Time (Full Ledger History)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Export Format
            </label>
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono flex items-center justify-between">
              <span>Standard CSV (Comma-Separated)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Ready</span>
            </div>
          </div>
        </div>

        {selectedAccount && (
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-slate-300">Selected Statement Ready</span>
              <p className="text-[11px] text-slate-500">
                {txCount} transactions found for account {selectedAccount.accountNumber}
              </p>
            </div>

            <button
              onClick={() => downloadCsvStatement(selectedAccountId)}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV File</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          Statements exported from FinCore contain tamper-evident reference IDs corresponding to immutable ledger entries.
        </span>
      </div>
    </div>
  );
};
