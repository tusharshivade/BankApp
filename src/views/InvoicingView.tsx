import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Download, FileText, ShieldCheck, FileCheck2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const InvoicingView: React.FC = () => {
  const { accounts, downloadCsvStatement, currencySymbol, currentUser } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);
  const [selectedAccId, setSelectedAccId] = useState<number>(userAccounts[0]?.id || 1);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Passbook Statements & Tax Certificates</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Download certified digital passbook ledgers, GST tax invoices, and interest certificates
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Select Account</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccId(acc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedAccId === acc.id
                    ? 'border-[#2555EA] bg-blue-50/40 dark:bg-blue-900/30 shadow-sm ring-1 ring-[#2555EA]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{acc.accountNumber}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {acc.accountType}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Balance: <span className="font-bold text-slate-900 dark:text-white font-mono">{formatINR(acc.balance)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  IFSC: {acc.ifscCode || 'FCBL0001001'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSV Passbook Export Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-900/40 text-[#2555EA] dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Export Detailed Passbook Ledger</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Official Comma-Separated Values (CSV) with NPCI UTR and double-entry ledger references
              </span>
            </div>
          </div>

          <button
            onClick={() => downloadCsvStatement(selectedAccId)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Statement</span>
          </button>
        </div>

        {/* Indian Tax & Compliance Documents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Form 16A / TDS Certificate</span>
                <span className="text-[10px] text-slate-400">Section 194A Interest Tax Deducted</span>
              </div>
            </div>
            <button
              onClick={() => downloadCsvStatement(selectedAccId)}
              className="text-xs font-bold text-[#2555EA] dark:text-blue-400 hover:underline"
            >
              Export
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Interest & 80C Certificate</span>
                <span className="text-[10px] text-slate-400">ITR Filing FY 2026-27</span>
              </div>
            </div>
            <button
              onClick={() => downloadCsvStatement(selectedAccId)}
              className="text-xs font-bold text-[#2555EA] dark:text-blue-400 hover:underline"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
