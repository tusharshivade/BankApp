import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { PlusCircle, X } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { accounts, deposit, currencySymbol } = useBanking();
  const primaryAccount = accounts[0] || { id: 1, accountNumber: '**** 4312', balance: 18500 };

  const [amount, setAmount] = useState<string>('500');
  const [description, setDescription] = useState<string>('Online Wallet Top-up');

  if (!isOpen) return null;

  const quickAmounts = [100, 250, 500, 1000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const success = deposit(primaryAccount.id, numAmount, description);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#2555EA] dark:text-blue-400 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Money / Deposit</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Simulate adding funds to wallet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Amount ({currencySymbol})</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-bold text-slate-400 dark:text-slate-500">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-9 pr-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
              />
            </div>

            <div className="flex gap-2 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="flex-1 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-[#2555EA] dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 font-semibold transition"
                >
                  +{currencySymbol}{q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Note</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-[#2555EA] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition"
            >
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
