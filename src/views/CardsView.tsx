import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  CreditCard,
  Wifi,
  ShieldCheck,
  Lock,
  Unlock,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Eye,
  EyeOff,
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const CardsView: React.FC = () => {
  const { accounts, currencySymbol, currentUser, showToast } = useBanking();
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  const [atmLimit, setAtmLimit] = useState<number>(50000);
  const [posLimit, setPosLimit] = useState<number>(200000);
  const [isInternationalEnabled, setIsInternationalEnabled] = useState<boolean>(false);
  const [isContactlessEnabled, setIsContactlessEnabled] = useState<boolean>(true);
  const [isCardFrozen, setIsCardFrozen] = useState<boolean>(false);
  const [showCvv, setShowCvv] = useState<boolean>(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
              RuPay Cards & Digital Limits
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              National Payments Corporation of India (NPCI) certified RuPay Platinum debit & credit management
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
            ● RuPay on UPI Enabled
          </span>
        </div>
      </div>

      {/* Cards Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: RuPay Platinum Contactless Debit Card */}
        <div
          className={`rounded-3xl p-6 relative overflow-hidden transition shadow-xl ${
            isCardFrozen
              ? 'bg-gradient-to-tr from-slate-700 to-slate-800 text-slate-300 opacity-90'
              : 'bg-gradient-to-tr from-[#0F2B66] via-[#1E40AF] to-[#2555EA] text-white shadow-blue-500/20'
          }`}
        >
          {/* Card Top Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-widest uppercase">FinCore Bank</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 font-mono">DEBIT</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 rotate-90 opacity-90" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                {isCardFrozen ? 'FROZEN' : 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* EMV Chip Representation */}
          <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 shadow-inner border border-amber-500/40 mb-6 flex items-center justify-center">
            <div className="w-8 h-5 border border-amber-600/40 rounded-xs grid grid-cols-2" />
          </div>

          {/* Balance & Masked Card Number */}
          <div className="mb-6">
            <span className="text-xs text-white/70 block mb-0.5">Available Account Balance</span>
            <div className="text-2xl sm:text-3xl font-black font-mono">
              {formatINR(userAccounts[0]?.balance || 185000)}
            </div>
            <div className="mt-3 font-mono tracking-widest text-base sm:text-lg font-bold">
              6521 •••• •••• 4312
            </div>
          </div>

          {/* Card Bottom: Holder, Expiry, CVV & RuPay Logo */}
          <div className="flex items-end justify-between pt-3 border-t border-white/20 text-xs text-white/90">
            <div>
              <span className="text-[9px] text-white/60 block uppercase">Cardholder</span>
              <span className="font-bold tracking-wider uppercase text-xs">{currentUser.fullName}</span>
            </div>
            <div>
              <span className="text-[9px] text-white/60 block uppercase">Valid Thru</span>
              <span className="font-mono font-bold">08/30</span>
            </div>
            <div>
              <span className="text-[9px] text-white/60 block uppercase">CVV</span>
              <span
                onClick={() => setShowCvv(!showCvv)}
                className="font-mono font-bold cursor-pointer underline flex items-center gap-1"
              >
                {showCvv ? '892' : '•••'}
              </span>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-md text-slate-900 font-black text-xs italic tracking-wider flex items-center gap-1 shadow-sm">
              <span className="text-[#F37021]">Ru</span>
              <span className="text-[#005B9C]">Pay</span>
              <span className="text-[8px] font-sans font-bold text-slate-500 uppercase not-italic">Platinum</span>
            </div>
          </div>
        </div>

        {/* Card 2: RuPay Select Virtual Credit Card on UPI */}
        <div className="rounded-3xl p-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-widest uppercase">FinCore Bank</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/40 text-indigo-200 font-mono font-bold">
                  UPI CREDIT
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                RuPay on UPI
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-slate-400 to-slate-200 shadow-inner border border-slate-500/40 flex items-center justify-center">
                <div className="w-8 h-5 border border-slate-600/40 rounded-xs grid grid-cols-2" />
              </div>
              <QrCode className="w-6 h-6 text-indigo-300 opacity-80" />
            </div>

            <div>
              <span className="text-xs text-indigo-200/80 block mb-0.5">Approved Credit Line</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                ₹3,00,000.00
              </div>
              <div className="mt-3 font-mono tracking-widest text-base sm:text-lg font-bold text-slate-200">
                6070 •••• •••• 9018
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between pt-3 border-t border-white/10 text-xs text-white/90 mt-4">
            <div>
              <span className="text-[9px] text-indigo-200/60 block uppercase">Cardholder</span>
              <span className="font-bold tracking-wider uppercase text-xs">{currentUser.fullName}</span>
            </div>
            <div>
              <span className="text-[9px] text-indigo-200/60 block uppercase">Available</span>
              <span className="font-mono font-bold text-emerald-400">₹2,45,000</span>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-md text-slate-900 font-black text-xs italic tracking-wider flex items-center gap-1 shadow-sm">
              <span className="text-[#F37021]">Ru</span>
              <span className="text-[#005B9C]">Pay</span>
              <span className="text-[8px] font-sans font-bold text-indigo-600 uppercase not-italic">Select</span>
            </div>
          </div>
        </div>
      </div>

      {/* RBI Mandatory Security & Domestic Limit Controls */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2555EA] dark:text-blue-400" />
              RBI Security & Daily Limit Management
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Customize daily limits and card usage as per Reserve Bank of India card security guidelines.
            </p>
          </div>
          <button
            onClick={() => {
              setIsCardFrozen(!isCardFrozen);
              showToast(isCardFrozen ? 'Card unfrozen successfully' : 'Card temporarily blocked / frozen', 'info');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isCardFrozen
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {isCardFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isCardFrozen ? 'Unfreeze Card' : 'Freeze / Lock Card'}</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Daily ATM Cash Withdrawal Limit</span>
              <span className="text-xs font-mono font-black text-[#2555EA] dark:text-blue-400">
                {formatINR(atmLimit)}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={atmLimit}
              onChange={(e) => setAtmLimit(Number(e.target.value))}
              className="w-full accent-[#2555EA] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹5,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Daily POS & Online Shopping Limit</span>
              <span className="text-xs font-mono font-black text-[#2555EA] dark:text-blue-400">
                {formatINR(posLimit)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={posLimit}
              onChange={(e) => setPosLimit(Number(e.target.value))}
              className="w-full accent-[#2555EA] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹10,000</span>
              <span>₹2,50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Contactless Tap & Pay (NFC)</span>
              <span className="text-[11px] text-slate-400">Up to ₹5,000 without PIN</span>
            </div>
            <button
              onClick={() => setIsContactlessEnabled(!isContactlessEnabled)}
              className={`w-11 h-6 rounded-full transition p-1 ${
                isContactlessEnabled ? 'bg-[#2555EA]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  isContactlessEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">International Transactions</span>
              <span className="text-[11px] text-slate-400">Disabled by default per RBI mandate</span>
            </div>
            <button
              onClick={() => {
                setIsInternationalEnabled(!isInternationalEnabled);
                showToast(
                  !isInternationalEnabled
                    ? 'International usage enabled. Be cautious with foreign e-commerce.'
                    : 'International usage disabled.'
                );
              }}
              className={`w-11 h-6 rounded-full transition p-1 ${
                isInternationalEnabled ? 'bg-[#2555EA]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  isInternationalEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
