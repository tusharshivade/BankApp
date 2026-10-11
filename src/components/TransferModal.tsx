import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { ArrowRightLeft, X, ShieldCheck, AlertCircle } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { accounts, currentUser, transfer, currentRole } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');

  const [sourceAccountId, setSourceAccountId] = useState<number>(userAccounts[0]?.id || 1);
  const [destAccountNumber, setDestAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedSourceAccount = accounts.find((a) => a.id === sourceAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    const success = transfer(sourceAccountId, destAccountNumber, numAmount, description);
    if (success) {
      setIsConfirming(false);
      setAmount('');
      setDestAccountNumber('');
      setDescription('');
      onClose();
    } else {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={() => {
            setIsConfirming(false);
            onClose();
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Transfer Funds</h2>
            <p className="text-xs text-slate-400">Atomic double-entry simulated ledger transfer</p>
          </div>
        </div>

        {currentRole === 'ADMIN' ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Administrator accounts cannot initiate personal transfers. Switch to Customer mode in top bar.</span>
          </div>
        ) : isConfirming ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Confirm Transfer Details
              </h3>
              <div className="flex justify-between text-sm py-1 border-b border-slate-700/50">
                <span className="text-slate-400">From Account:</span>
                <span className="font-mono text-white">{selectedSourceAccount?.accountNumber}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-slate-700/50">
                <span className="text-slate-400">To Account:</span>
                <span className="font-mono text-white">{destAccountNumber.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-slate-700/50">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-emerald-400">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-400">Description:</span>
                <span className="text-slate-200">{description || 'Simulated Transfer'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/30"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Source Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                {userAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} ({acc.accountType}) — Available: ₹{acc.balance.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Recipient Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. FCB1001003001"
                value={destAccountNumber}
                onChange={(e) => setDestAccountNumber(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Demo accounts: <span className="font-mono text-blue-400 cursor-pointer" onClick={() => setDestAccountNumber('FCB1001003001')}>FCB1001003001</span> (Priya Patel), <span className="font-mono text-blue-400 cursor-pointer" onClick={() => setDestAccountNumber('FCB1001002002')}>FCB1001002002</span> (Current)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount (INR ₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Rent, consulting demo, invoice payment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
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
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/30"
              >
                Review Transfer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
