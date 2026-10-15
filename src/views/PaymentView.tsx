import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Send,
  QrCode,
  Building2,
  Zap,
  Smartphone,
  Car,
  Flame,
  CheckCircle2,
  Copy,
  Download,
  ShieldCheck,
  Percent,
  PlusCircle,
  Clock,
  ArrowRight,
  Landmark,
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const PaymentView: React.FC = () => {
  const {
    accounts,
    contacts,
    upiTransfer,
    impsNeftTransfer,
    openFixedDeposit,
    payBill,
    fixedDeposits,
    bills,
    currencySymbol,
    currentUser,
    showToast,
  } = useBanking();

  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');

  // Sub-tabs: 'UPI' | 'IFSC_TRANSFER' | 'BBPS_BILLS' | 'FIXED_DEPOSIT'
  const [activeTab, setActiveTab] = useState<'UPI' | 'IFSC_TRANSFER' | 'BBPS_BILLS' | 'FIXED_DEPOSIT'>('UPI');

  // UPI Form State
  const [sourceAccountId, setSourceAccountId] = useState<number>(userAccounts[0]?.id || 1);
  const [upiId, setUpiId] = useState<string>('ananya@oksbi');
  const [upiAmount, setUpiAmount] = useState<string>('1500');
  const [upiNote, setUpiNote] = useState<string>('Dinner & Cab Split');
  const [selectedPayeeName, setSelectedPayeeName] = useState<string>('Ananya Iyer');
  const [showMyQrModal, setShowMyQrModal] = useState<boolean>(false);

  // IFSC Bank Transfer State
  const [ifscAccNumber, setIfscAccNumber] = useState<string>('FCBL1001004001');
  const [confirmAccNumber, setConfirmAccNumber] = useState<string>('FCBL1001004001');
  const [ifscCode, setIfscCode] = useState<string>('SBIN0001234');
  const [beneficiaryName, setBeneficiaryName] = useState<string>('Ananya Iyer');
  const [ifscAmount, setIfscAmount] = useState<string>('25000');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT' | 'RTGS'>('IMPS');
  const [ifscNote, setIfscNote] = useState<string>('Project Consulting Fee');

  // Fixed Deposit Form State
  const [fdPrincipal, setFdPrincipal] = useState<number>(50000);
  const [fdTenureMonths, setFdTenureMonths] = useState<number>(12);
  const [isTaxSaver, setIsTaxSaver] = useState<boolean>(false);

  const selectedSource = accounts.find((a) => a.id === sourceAccountId) || userAccounts[0];

  // UPI Submit Handler
  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(upiAmount);
    if (isNaN(num) || num <= 0) return;
    upiTransfer(sourceAccountId, upiId, num, upiNote);
  };

  // IFSC Submit Handler
  const handleIfscSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ifscAccNumber !== confirmAccNumber) {
      showToast('Account numbers do not match. Please verify.', 'error');
      return;
    }
    const num = parseFloat(ifscAmount);
    if (isNaN(num) || num <= 0) return;
    impsNeftTransfer(sourceAccountId, ifscAccNumber, ifscCode, beneficiaryName, num, transferMode, ifscNote);
  };

  // FD Submit Handler
  const handleFdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openFixedDeposit(sourceAccountId, fdPrincipal, fdTenureMonths, isTaxSaver);
  };

  // FD calculations
  const fdRate = isTaxSaver ? 7.5 : fdTenureMonths >= 24 ? 7.35 : 7.25;
  const estimatedInterest = Math.round(fdPrincipal * (fdRate / 100) * (fdTenureMonths / 12));
  const estimatedMaturity = fdPrincipal + estimatedInterest;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
            Indian Payments & UPI Hub
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Unified Payments Interface (UPI 2.0), IMPS/NEFT with IFSC, Bharat BillPay (BBPS), and Fixed Deposits
          </p>
        </div>

        {/* My QR Button */}
        <button
          onClick={() => setShowMyQrModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4" />
          <span>My UPI QR & VPA</span>
        </button>
      </div>

      {/* Primary Sub-Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold overflow-x-auto border border-slate-200/50 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('UPI')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'UPI'
              ? 'bg-white dark:bg-slate-700 text-[#2555EA] dark:text-blue-400 shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>UPI Instant Pay</span>
        </button>

        <button
          onClick={() => setActiveTab('IFSC_TRANSFER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'IFSC_TRANSFER'
              ? 'bg-white dark:bg-slate-700 text-[#2555EA] dark:text-blue-400 shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>IMPS / NEFT / RTGS (IFSC)</span>
        </button>

        <button
          onClick={() => setActiveTab('BBPS_BILLS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'BBPS_BILLS'
              ? 'bg-white dark:bg-slate-700 text-[#2555EA] dark:text-blue-400 shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Bharat BillPay (BBPS)</span>
        </button>

        <button
          onClick={() => setActiveTab('FIXED_DEPOSIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'FIXED_DEPOSIT'
              ? 'bg-white dark:bg-slate-700 text-[#2555EA] dark:text-blue-400 shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Fixed Deposits (7.25% p.a.)</span>
        </button>
      </div>

      {/* TAB 1: UPI INSTANT TRANSFER */}
      {activeTab === 'UPI' && (
        <div className="space-y-6">
          {/* Quick Payees Carousel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Frequent UPI Beneficiaries
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                NPCI 24x7 Ready
              </span>
            </div>

            <div className="flex items-center gap-3.5 overflow-x-auto pb-1">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedPayeeName(c.name);
                    setUpiId(c.upiId || `${c.name.toLowerCase()}@upi`);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition shrink-0 ${
                    selectedPayeeName === c.name
                      ? 'border-[#2555EA] bg-blue-50/50 dark:bg-blue-900/30 shadow-sm ring-1 ring-[#2555EA]/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img src={c.avatarUrl} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{c.name}</span>
                    <span className="text-[10px] text-[#2555EA] dark:text-blue-400 font-mono">{c.upiId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UPI Form & Right Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition-colors">
              <form onSubmit={handleUpiSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Debit Bank Account
                  </label>
                  <select
                    value={sourceAccountId}
                    onChange={(e) => setSourceAccountId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  >
                    {userAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountNumber} ({acc.accountType}) — Available: {formatINR(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Beneficiary UPI ID (VPA)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. rohan@okaxis, priya@upi, 9820154321@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Accepts VPAs from Google Pay, PhonePe, Paytm, BHIM, Cred, and all Indian banks.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Amount (INR ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400 dark:text-slate-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={selectedSource?.balance}
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setUpiAmount(amt.toString())}
                        className="py-1 px-2.5 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-[#2555EA] font-semibold transition"
                      >
                        +₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Note / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rent, Grocery split, Tuition fees"
                    value={upiNote}
                    onChange={(e) => setUpiNote(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send {formatINR(parseFloat(upiAmount) || 0)} Instantly via UPI</span>
                </button>
              </form>
            </div>

            {/* Right Side Info & Limits Card */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">NPCI UPI Gateway</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">24x7 Real-Time</span>
                </div>

                <div>
                  <span className="text-[11px] text-blue-200 block">Linked VPA</span>
                  <span className="text-sm font-mono font-bold">{currentUser.upiId || 'aarav.sharma@fincore'}</span>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Daily UPI Limit:</span>
                    <span className="font-bold">₹1,00,000 / day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Per Transaction Cap:</span>
                    <span className="font-bold">₹1,00,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Transaction Fee:</span>
                    <span className="font-bold text-emerald-300">₹0.00 (Zero Fee)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  All UPI payments generate a 12-digit RBI/NPCI compliant Unique Transaction Reference (UTR) logged in double-entry bookkeeping.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMPS / NEFT / RTGS (IFSC) */}
      {activeTab === 'IFSC_TRANSFER' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inter-Bank National Fund Transfer</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Send funds to any bank branch in India using IFSC</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#2555EA] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                RBI RTGS / NEFT / IMPS
              </span>
            </div>

            <form onSubmit={handleIfscSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Transfer Mode
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'IMPS', title: 'IMPS (Immediate)', desc: '24x7 Real-time, up to ₹5L' },
                    { id: 'NEFT', title: 'NEFT (Batch)', desc: 'RBI hourly settlement' },
                    { id: 'RTGS', title: 'RTGS (High Value)', desc: 'Instant, Min ₹2 Lakh' },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setTransferMode(m.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        transferMode === m.id
                          ? 'border-[#2555EA] bg-blue-50/50 dark:bg-blue-900/30 ring-1 ring-[#2555EA]'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{m.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{m.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Debit Account
                </label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                >
                  {userAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber} ({acc.accountType}) — Available: {formatINR(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Beneficiary Account Number
                  </label>
                  <input
                    type="text"
                    value={ifscAccNumber}
                    onChange={(e) => setIfscAccNumber(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Confirm Account Number
                  </label>
                  <input
                    type="text"
                    value={confirmAccNumber}
                    onChange={(e) => setConfirmAccNumber(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    11-Character Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0001234, FCBL0001001"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    maxLength={11}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Beneficiary Full Name
                  </label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Transfer Amount (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min={transferMode === 'RTGS' ? 200000 : 1}
                    value={ifscAmount}
                    onChange={(e) => setIfscAmount(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Remarks / Note
                </label>
                <input
                  type="text"
                  value={ifscNote}
                  onChange={(e) => setIfscNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Process {transferMode} Transfer ({formatINR(parseFloat(ifscAmount) || 0)})</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: BHARAT BILLPAY (BBPS) */}
      {activeTab === 'BBPS_BILLS' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                B
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Bharat Bill Payment System (BBPS)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">NPCI authorized one-stop bill payment ecosystem</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              ● Live BBPS Switch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.map((bill) => {
              const isPaid = bill.status === 'PAID';
              return (
                <div
                  key={bill.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                        {bill.category === 'electricity' && <Zap className="w-5 h-5 text-amber-500" />}
                        {bill.category === 'mobile' && <Smartphone className="w-5 h-5 text-blue-500" />}
                        {bill.category === 'fastag' && <Car className="w-5 h-5 text-indigo-500" />}
                        {bill.category === 'gas' && <Flame className="w-5 h-5 text-rose-500" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{bill.billerName}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Consumer: {bill.consumerNumber}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPaid
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Due Date: {bill.dueDate}</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                        {formatINR(bill.amount)}
                      </span>
                    </div>

                    {isPaid ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Receipt Ready</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => payBill(bill.id, sourceAccountId)}
                        className="px-4 py-2 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition active:scale-95"
                      >
                        Pay Bill
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: FIXED DEPOSITS (FD) */}
      {activeTab === 'FIXED_DEPOSIT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FD Booking Form */}
            <div className="md:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Instant Fixed Deposit Booking</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
                Earn guaranteed high interest with complete DICGC insurance up to ₹5,00,000.
              </p>

              <form onSubmit={handleFdSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Funding Account
                  </label>
                  <select
                    value={sourceAccountId}
                    onChange={(e) => setSourceAccountId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  >
                    {userAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountNumber} ({acc.accountType}) — Available: {formatINR(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Deposit Amount (INR ₹)
                    </label>
                    <span className="text-xs font-bold text-[#2555EA] dark:text-blue-400 font-mono">
                      {formatINR(fdPrincipal)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={fdPrincipal}
                    onChange={(e) => setFdPrincipal(Number(e.target.value))}
                    className="w-full accent-[#2555EA] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Tenure (Months)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { m: 12, rate: '7.25%' },
                      { m: 24, rate: '7.35%' },
                      { m: 36, rate: '7.40%' },
                      { m: 60, rate: '7.50%' },
                    ].map((item) => (
                      <button
                        key={item.m}
                        type="button"
                        onClick={() => setFdTenureMonths(item.m)}
                        className={`p-2.5 rounded-xl border text-center transition ${
                          fdTenureMonths === item.m
                            ? 'border-[#2555EA] bg-blue-50/50 dark:bg-blue-900/30 text-[#2555EA] font-bold ring-1 ring-[#2555EA]'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-xs block">{item.m} Mo</span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{item.rate}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    id="taxSaver"
                    checked={isTaxSaver}
                    onChange={(e) => setIsTaxSaver(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2555EA] accent-[#2555EA]"
                  />
                  <label htmlFor="taxSaver" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <strong>Section 80C Tax Saver FD</strong> (5-year lock-in with up to ₹1,50,000 IT deduction)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  Book Instant FD of {formatINR(fdPrincipal)}
                </button>
              </form>
            </div>

            {/* FD Maturity Summary Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block mb-1">
                  Maturity Estimation
                </span>
                <span className="text-3xl font-black font-mono block">
                  {formatINR(estimatedMaturity)}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                  + {formatINR(estimatedInterest)} Total Interest Earned
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-blue-200">Principal Deposit:</span>
                  <span className="font-mono font-bold">{formatINR(fdPrincipal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Interest Rate:</span>
                  <span className="font-bold text-emerald-300">{fdRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Tenure:</span>
                  <span className="font-bold">{fdTenureMonths} Months ({fdTenureMonths / 12} Years)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Premature Withdrawal:</span>
                  <span className="font-bold">Allowed with 0.5% penalty</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 text-[10px] text-blue-200">
                Backed by DICGC (Reserve Bank of India subsidiary) deposit insurance scheme.
              </div>
            </div>
          </div>

          {/* Active FDs List */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Your Active Fixed Deposits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fixedDeposits.map((fd) => (
                <div
                  key={fd.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{fd.fdNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      {fd.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Principal</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{formatINR(fd.principalAmount)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Maturity Value ({fd.interestRate}%)</span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatINR(fd.maturityAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between text-[11px] text-slate-500">
                    <span>Matures: {new Date(fd.maturityDate).toLocaleDateString('en-IN')}</span>
                    {fd.isTaxSaver && <span className="font-bold text-[#2555EA]">80C Tax Saver</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MY UPI QR MODAL */}
      {showMyQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">FinCore Bharat QR</span>
              <button
                onClick={() => setShowMyQrModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block border border-slate-200 dark:border-slate-700">
              {/* Simulated Authentic Indian UPI QR Code */}
              <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner flex flex-col items-center justify-center border-2 border-dashed border-[#2555EA]/40">
                <QrCode className="w-36 h-36 text-slate-900" />
                <span className="text-[10px] font-black text-[#2555EA] tracking-wider uppercase mt-1">BHARAT UPI QR</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">{currentUser.fullName}</span>
              <span className="text-xs font-mono text-[#2555EA] dark:text-blue-400 font-bold block mt-0.5">
                {currentUser.upiId || 'aarav.sharma@fincore'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Scan using any UPI app (GPay, PhonePe, Paytm, BHIM) to pay in INR (₹)
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(currentUser.upiId || 'aarav.sharma@fincore');
                  showToast('UPI ID copied to clipboard!');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy VPA</span>
              </button>
              <button
                onClick={() => {
                  showToast('QR Code saved to gallery');
                  setShowMyQrModal(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#2555EA] text-white text-xs font-bold hover:bg-blue-600 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
