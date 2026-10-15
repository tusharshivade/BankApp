import React from 'react';
import type { Transaction } from '../types/banking';
import { useBanking } from '../context/BankingContext';
import { X, CheckCircle2, ArrowDownRight, ArrowUpRight, QrCode } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
  const { currencySymbol } = useBanking();
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2555EA] dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{transaction.description}</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {transaction.transactionType === 'DEPOSIT' ? '+' : '-'}
            {formatINR(transaction.amount)}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
            Ref: {transaction.referenceNumber}
          </span>
        </div>

        <div className="py-4 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <span className="text-slate-400 dark:text-slate-500">Status</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {transaction.status}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <span className="text-slate-400 dark:text-slate-500">Transfer Mode</span>
            <span className="font-bold text-[#2555EA] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
              {transaction.transferMode || 'UPI 2.0 / IMPS'}
            </span>
          </div>

          {transaction.upiReference && (
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-400 dark:text-slate-500">NPCI UTR</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {transaction.upiReference}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <span className="text-slate-400 dark:text-slate-500">Date & Time (IST)</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {new Date(transaction.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <span className="text-slate-400 dark:text-slate-500">Category</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {transaction.category || transaction.transactionType}
            </span>
          </div>

          {/* Double Entry Ledger Details */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              RBI Double-Entry Ledger Integrity
            </span>
            {transaction.ledgerEntries && transaction.ledgerEntries.length > 0 ? (
              <div className="space-y-1.5">
                {transaction.ledgerEntries.map((e, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {e.entryType === 'CREDIT' ? (
                        <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-200">{e.entryType}</span>
                    </div>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      Post Bal: {formatINR(e.balanceAfter)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">Journal balance updated in core ledger.</p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
