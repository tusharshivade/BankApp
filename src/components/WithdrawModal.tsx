import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { CreditCard, X } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { accounts, withdraw, currencySymbol } = useBanking();
  const primaryAccount = accounts[0] || { id: 1, accountNumber: 'FCBL1001002001', balance: 185000 };

  const [amount, setAmount] = useState<string>('2000');
  const [description, setDescription] = useState<string>('RuPay ATM Cash Withdrawal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const success = withdraw(primaryAccount.id, numAmount, description);
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
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ATM Cash Withdrawal</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Available: {formatINR(primaryAccount.balance)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Withdrawal Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-bold text-slate-400 dark:text-slate-500">₹</span>
              <input
                type="number"
                step="100"
                min="100"
                max={primaryAccount.balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-9 pr-4 py-3 text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[500, 1000, 2000, 5000].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="flex-1 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/40 hover:text-rose-600 text-slate-700 dark:text-slate-300 font-semibold transition"
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Purpose / Memo</label>
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
              className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              Withdraw {formatINR(parseFloat(amount) || 0)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
