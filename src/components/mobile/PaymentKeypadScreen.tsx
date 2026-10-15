import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowLeft,
  MoreVertical,
  Delete,
  ChevronsRight,
  CheckCircle2,
} from 'lucide-react';
import type { Contact } from '../../types/banking';

interface PaymentKeypadScreenProps {
  onBack: () => void;
  onChangeRecipient: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentKeypadScreen: React.FC<PaymentKeypadScreenProps> = ({
  onBack,
  onChangeRecipient,
  onPaymentSuccess,
}) => {
  const {
    accounts,
    selectedContact,
    currencySymbol,
    transfer,
    showToast,
  } = useBanking();

  const primaryAccount = accounts[0] || {
    id: 1,
    balance: 18500,
    accountNumber: '**** **** **** 4312',
  };

  const [amountStr, setAmountStr] = useState<string>('580.00');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Keypad click handler
  const handleKeyPress = (val: string) => {
    if (val === 'backspace') {
      if (amountStr.length <= 1) {
        setAmountStr('0');
      } else {
        setAmountStr((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (val === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => prev + '.');
      }
      return;
    }

    // Default digits
    if (amountStr === '0' || amountStr === '0.00') {
      setAmountStr(val);
    } else {
      // Limit to 2 decimal places if decimal exists
      if (amountStr.includes('.')) {
        const parts = amountStr.split('.');
        if (parts[1] && parts[1].length >= 2) return;
      }
      if (amountStr.length < 8) {
        setAmountStr((prev) => prev + val);
      }
    }
  };

  const handleExecutePayment = () => {
    const numAmount = parseFloat(amountStr);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (numAmount > primaryAccount.balance) {
      showToast(`Insufficient funds! Available: ${currencySymbol}${primaryAccount.balance.toLocaleString()}`, 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const success = transfer(
        primaryAccount.id,
        selectedContact.accountNumber,
        numAmount,
        `Payment to ${selectedContact.name}`
      );

      setIsProcessing(false);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onPaymentSuccess();
        }, 1800);
      }
    }, 700);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Bar: Back, Payment Title, More */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Payment</h2>
        <button
          onClick={() => showToast('Payment settings', 'info')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
          aria-label="Options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Mini Wallet Balance Card */}
      <div className="rounded-2xl bg-[#2555EA] text-white p-4 flex items-center justify-between shadow-lg shadow-blue-600/20">
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#005B9C] font-black text-[10px] tracking-wider px-2 py-0.5 rounded shadow-sm">
            RuPay
          </div>
          <div>
            <span className="text-[11px] text-blue-100 block">Wallet Balance</span>
            <span className="text-sm font-bold text-white">
              {currencySymbol}{primaryAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Recipient Strip */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={selectedContact.avatarUrl}
            alt={selectedContact.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">{selectedContact.name}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedContact.accountNumber}</p>
          </div>
        </div>

        <button
          onClick={onChangeRecipient}
          className="text-xs font-bold text-[#2555EA] hover:underline px-2 py-1"
        >
          Change
        </button>
      </div>

      {/* Amount Display */}
      <div className="text-center py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {currencySymbol}{amountStr || '0'}
        </div>
        <p className="text-xs font-medium text-slate-400 mt-1">
          Your balance: {currencySymbol}{primaryAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Interactive Numeric Keypad (3x4 Grid) */}
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeyPress(digit)}
            className="h-14 rounded-2xl bg-white border border-slate-100 text-slate-800 text-xl font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition active:scale-95 flex items-center justify-center"
          >
            {digit}
          </button>
        ))}

        {/* Backspace Button */}
        <button
          onClick={() => handleKeyPress('backspace')}
          className="h-14 rounded-2xl bg-white border border-slate-100 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition active:scale-95 flex items-center justify-center"
          aria-label="Backspace"
        >
          <Delete className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Swipe to Payment / Execute Action */}
      <div className="pt-2">
        {isSuccess ? (
          <div className="w-full py-4 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>Payment Sent Successfully!</span>
          </div>
        ) : (
          <button
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-md hover:bg-slate-50 transition active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200/80 group-hover:bg-[#2555EA] group-hover:text-white flex items-center justify-center transition">
              <ChevronsRight className="w-4 h-4 text-slate-700 group-hover:text-white transition" />
            </div>
            <span>{isProcessing ? 'Processing Payment...' : 'Swipe to Payment'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
