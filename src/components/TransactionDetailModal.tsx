import React from 'react';
import { Transaction } from '../types/banking';
import { X, FileText, CheckCircle2, Clock, AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Transaction Details</h2>
            <p className="text-xs font-mono text-slate-400">{transaction.referenceNumber}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  transaction.status === 'SUCCESS'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : transaction.status === 'PENDING'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {transaction.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {transaction.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                {transaction.status === 'FAILED' && <AlertTriangle className="w-3.5 h-3.5" />}
                {transaction.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Transaction Type</span>
                <span className="font-semibold text-white">{transaction.transactionType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Amount</span>
                <span className="font-bold text-white text-base">₹{transaction.amount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Created At</span>
                <span className="text-slate-300 text-xs">{new Date(transaction.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Idempotency Key</span>
                <span className="font-mono text-[11px] text-slate-300 truncate block">
                  {transaction.idempotencyKey || 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-0.5">Description / Memo</span>
              <p className="text-sm text-slate-200">{transaction.description}</p>
            </div>
          </div>

          {/* Authoritative Double-Entry Ledger Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Authoritative Ledger Entries</span>
              <span className="text-[10px] text-emerald-400 font-normal">Double-Entry Verified</span>
            </h3>

            {transaction.ledgerEntries && transaction.ledgerEntries.length > 0 ? (
              <div className="space-y-2">
                {transaction.ledgerEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {entry.entryType === 'CREDIT' ? (
                        <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1 rounded bg-rose-500/20 text-rose-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white">{entry.entryType}</span>
                        <span className="text-slate-400 ml-2 font-mono">Acc #{entry.accountId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-semibold ${
                          entry.entryType === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {entry.entryType === 'CREDIT' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Post Bal: ₹{entry.balanceAfter.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-800/30 rounded">
                Ledger movements consolidated with primary bank journal.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
