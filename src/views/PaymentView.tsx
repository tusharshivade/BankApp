import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Send, ShieldCheck, Zap } from 'lucide-react';

export const PaymentView: React.FC = () => {
  const { accounts, contacts, transfer, currencySymbol, currentUser } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');

  const [sourceAccountId, setSourceAccountId] = useState<number>(userAccounts[0]?.id || 1);
  const [destAccountNumber, setDestAccountNumber] = useState<string>('**** **** **** 4312');
  const [amount, setAmount] = useState<string>('580.00');
  const [description, setDescription] = useState<string>('Business Payment');
  const [selectedPayee, setSelectedPayee] = useState<string>('Clara');

  const selectedSource = accounts.find((a) => a.id === sourceAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    transfer(sourceAccountId, destAccountNumber, numAmount, description);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Payment</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Instant inter-account and contact transfer</p>
      </div>

      {/* Payee Selection Carousel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quick Payees</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelectedPayee(contact.name);
                setDestAccountNumber(contact.accountNumber);
              }}
              className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition ${
                selectedPayee === contact.name
                  ? 'border-[#2555EA] bg-blue-50/50 dark:bg-blue-900/30 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{contact.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{contact.accountNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Debit Account</label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
              >
                {userAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} ({acc.accountType}) — Available: {currencySymbol}{acc.balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Recipient Account / ID</label>
              <input
                type="text"
                value={destAccountNumber}
                onChange={(e) => setDestAccountNumber(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Transfer Amount ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={selectedSource?.balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Payment Note</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Execute Transfer</span>
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Settlement
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Funds are settled immediately through double-entry ledger entries with balance checks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Idempotent Safety
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every request carries a unique idempotency key to prevent accidental double-debiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
