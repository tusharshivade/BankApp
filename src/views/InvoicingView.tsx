import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export const InvoicingView: React.FC = () => {
  const { accounts, downloadCsvStatement, currencySymbol, currentUser } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);
  const [selectedAccId, setSelectedAccId] = useState<number>(userAccounts[0]?.id || 1);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Statements & Invoicing</h2>
        <p className="text-xs text-slate-400 font-medium">Download official bank statements and transaction ledgers</p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Select Account</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccId(acc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedAccId === acc.id
                    ? 'border-[#2555EA] bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-slate-900">{acc.accountNumber}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {acc.accountType}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Balance: <span className="font-bold text-slate-900">{currencySymbol}{acc.balance.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2555EA] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Export Full Statement</span>
              <span className="text-[11px] text-slate-400">Comma-Separated Values (CSV) with reference IDs</span>
            </div>
          </div>

          <button
            onClick={() => downloadCsvStatement(selectedAccId)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
