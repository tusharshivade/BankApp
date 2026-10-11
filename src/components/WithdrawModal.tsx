import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { ArrowUpCircle, X } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccountId?: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, defaultAccountId }) => {
  const { accounts, currentUser, withdraw } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');

  const [accountId, setAccountId] = useState<number>(defaultAccountId || userAccounts[0]?.id || 1);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  if (!isOpen) return null;

  const selectedAccount = accounts.find((a) => a.id === accountId);
  const quickAmounts = [1000, 2000, 5000, 10000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const success = withdraw(accountId, numAmount, description);
    if (success) {
      setAmount('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
            <ArrowUpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
            <p className="text-xs text-slate-400">Simulate cash withdrawal with balance guardrails</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Account
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
            >
              {userAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} ({acc.accountType}) — Bal: ₹{acc.balance.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
            {selectedAccount && (
              <p className="text-[11px] text-slate-400 mt-1">
                Available to withdraw:{' '}
                <span className="font-semibold text-white">₹{selectedAccount.balance.toLocaleString('en-IN')}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Withdrawal Amount (INR ₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              max={selectedAccount?.balance || 0}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Withdrawal Reason / Note
            </label>
            <input
              type="text"
              placeholder="e.g. ATM withdrawal simulation, personal cash"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition shadow-lg shadow-rose-600/30"
            >
              Confirm Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
