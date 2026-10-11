import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { ArrowRightLeft, ShieldCheck, Zap, Info, CheckCircle2 } from 'lucide-react';

export const TransfersView: React.FC = () => {
  const { accounts, currentUser, transfer, currentRole } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');

  const [sourceAccountId, setSourceAccountId] = useState<number>(userAccounts[0]?.id || 1);
  const [destAccountNumber, setDestAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const selectedSource = accounts.find((a) => a.id === sourceAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const success = transfer(sourceAccountId, destAccountNumber, numAmount, description);
    if (success) {
      setAmount('');
      setDestAccountNumber('');
      setDescription('');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <ArrowRightLeft className="w-6 h-6 text-blue-400" />
          Transfer Money
        </h1>
        <p className="text-xs text-slate-400">
          Transfer funds instantly between eligible demo accounts with double-entry ledger verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                From Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
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
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 text-sm"
              />
              <div className="flex gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Click to fill demo payee:</span>
                <button
                  type="button"
                  onClick={() => setDestAccountNumber('FCB1001003001')}
                  className="text-[11px] text-blue-400 hover:underline font-mono"
                >
                  FCB1001003001 (Priya Patel)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount (INR ₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={selectedSource?.balance || 0}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-blue-500 text-sm"
              />
              {selectedSource && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Max transferable: ₹{selectedSource.balance.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Purpose / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Service payment, simulated bill, family transfer"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={currentRole === 'ADMIN'}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/30 disabled:opacity-40"
            >
              Transfer Funds Now
            </button>
          </form>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Transfer Limits
            </h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex justify-between">
                <span>Per transaction limit:</span>
                <span className="font-semibold text-white">₹500,000.00</span>
              </li>
              <li className="flex justify-between">
                <span>Daily simulated limit:</span>
                <span className="font-semibold text-white">₹1,000,000.00</span>
              </li>
              <li className="flex justify-between">
                <span>Fee:</span>
                <span className="font-semibold text-emerald-400">₹0.00 (Demo)</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Idempotent Safety
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every transfer submission automatically generates a unique UUIDv4 idempotency key. Duplicate requests
              will never debit your balance twice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
