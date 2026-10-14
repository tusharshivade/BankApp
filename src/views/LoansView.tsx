import React, { useState } from 'react';
import {
  Landmark,
  Building2,
  Percent,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  Calendar,
  Wallet,
  Phone,
  MapPin,
  Check,
  Scale,
  BookOpen,
  DollarSign,
  Download,
  X,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import type { Loan, LoanType } from '../types/banking';

interface LoansViewProps {
  onOpenDeposit?: () => void;
}

export const LoansView: React.FC<LoansViewProps> = () => {
  const {
    currentUser,
    accounts,
    loans,
    branches,
    currencySymbol,
    applyLoan,
    payLoanEmi,
    forecloseLoan,
  } = useBanking();

  // Active view tab: 'apply' | 'active' | 'rules'
  const [activeTab, setActiveTab] = useState<'apply' | 'active' | 'rules'>('apply');

  // Application Form State
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'br-01');
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>('PERSONAL');
  const [loanAmount, setLoanAmount] = useState<number>(20000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(userAccounts[0]?.id || 1);
  const [purpose, setPurpose] = useState<string>('Personal expense and home improvement');
  const [agreedToRules, setAgreedToRules] = useState<boolean>(false);
  const [rulesSearchQuery, setRulesSearchQuery] = useState<string>('');

  // Modals state
  const [selectedSanctionLoan, setSelectedSanctionLoan] = useState<Loan | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fixed 10.0% Annual Interest Rate Calculation
  const annualInterestRate = 10.0;
  const monthlyRate = annualInterestRate / 100 / 12;
  const emiFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const calculatedEmi = (loanAmount * monthlyRate * emiFactor) / (emiFactor - 1);
  const totalRepayment = calculatedEmi * tenureMonths;
  const totalInterest = totalRepayment - loanAmount;

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const userLoans = loans.filter((l) => l.userId === currentUser.id);
  const activeLoans = userLoans.filter((l) => l.status === 'ACTIVE');
  const totalActiveDebt = activeLoans.reduce((sum, l) => sum + l.remainingBalance, 0);

  const loanTypesList: { type: LoanType; title: string; subtitle: string; icon: any }[] = [
    {
      type: 'PERSONAL',
      title: 'Personal Term Loan',
      subtitle: 'Immediate branch approval, 10% fixed rate, flexible usage',
      icon: Wallet,
    },
    {
      type: 'HOME',
      title: 'Home & Renovation Loan',
      subtitle: 'Property improvement, interior upgrades, architectural work',
      icon: Building2,
    },
    {
      type: 'BUSINESS',
      title: 'Small Business Loan',
      subtitle: 'Commercial inventory, expansion capital, operational cashflow',
      icon: Scale,
    },
    {
      type: 'VEHICLE',
      title: 'Auto & Vehicle Loan',
      subtitle: 'New or certified pre-owned personal or commercial vehicles',
      icon: CreditCard,
    },
    {
      type: 'EDUCATION',
      title: 'Education & Career Loan',
      subtitle: 'Tuition financing, specialized credentials, graduate degrees',
      icon: BookOpen,
    },
  ];

  const presetAmounts = [5000, 15000, 25000, 50000, 75000, 100000];
  const tenureOptions = [6, 12, 18, 24, 36, 48, 60];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToRules) {
      alert('Please read and accept the Bank Loan Rules and Regulations before proceeding.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = applyLoan({
        accountId: selectedAccountId,
        branchId: selectedBranchId,
        loanType: selectedLoanType,
        principalAmount: loanAmount,
        tenureMonths,
        purpose,
      });

      setIsSubmitting(false);
      if (success) {
        setActiveTab('active');
      }
    }, 450);
  };

  // Bank Rules & Regulations Articles
  const bankRegulations = [
    {
      id: 'reg-01',
      category: 'Interest Rate & Pricing',
      title: 'Article 1: Guaranteed 10.0% Fixed Annual Percentage Rate (APR)',
      badge: '10.0% Fixed',
      summary:
        'All branch-sanctioned loans are governed by a flat, non-escalating 10.00% p.a. interest rate for the entire lifespan of the contracted facility.',
      details: [
        'Calculation Method: The interest is calculated daily on a reducing balance basis (Daily Outstanding Principal × 10% ÷ 365) and debited monthly with the installment.',
        'No Interest Rate Hikes: FinCore Bank covenants that this 10.0% fixed rate cannot be arbitrarily raised during market benchmark rate hikes or liquidity contractions.',
        'Zero Hidden Spread: No administrative margin, ledger creation fee, or compounding surprise charges shall be levied beyond the contracted 10% rate.',
      ],
    },
    {
      id: 'reg-02',
      category: 'Branch Sanction & Disbursement',
      title: 'Article 2: Branch Jurisdiction & Instant Account Credit Policy',
      badge: 'Branch Disbursal',
      summary:
        'Every facility is legally anchored to the chosen issuing FinCore branch, providing dedicated loan officer oversight and statutory documentation.',
      details: [
        'Disbursement Protocol: Upon customer confirmation, sanctioned funds are directly and immediately credited to the borrower’s designated operational checking or savings account via internal real-time gross ledger settlement.',
        'Sanction Letter: A legally binding, tamper-evident digital Sanction Letter is generated bearing the Branch Manager’s credentials and central reference code.',
        'Permissible Use of Funds: Funds may be utilized for any legitimate consumer or commercial purpose declared during application, excluding speculative day-trading or prohibited activities.',
      ],
    },
    {
      id: 'reg-03',
      category: 'Repayment & Auto-Debit',
      title: 'Article 3: Monthly Repayment Schedule & 3-Day Grace Window',
      badge: '5th of Every Month',
      summary:
        'Equated Monthly Installments (EMIs) are scheduled on the 5th calendar day of each successive calendar month.',
      details: [
        'Auto-Debit Mandate: The borrower authorizes FinCore Bank to execute automated recurring electronic debits (NACH / Standing Order) against their verified deposit account on each monthly due date.',
        '3-Day Grace Period: Borrowers are granted a statutory 3-day grace period following the 5th of the month. No late charges or negative credit remarks shall apply if full payment is received within this grace window.',
        'Prepayment Notification: Borrowers receive automated SMS and email reminders 48 hours prior to each scheduled EMI debit.',
      ],
    },
    {
      id: 'reg-04',
      category: 'Prepayment & Foreclosure',
      title: 'Article 4: 0% Penalty Foreclosure & Partial Prepayment Rights',
      badge: 'Zero Penalty',
      summary:
        'FinCore Bank strongly protects customer financial freedom with zero foreclosure fees after 6 completed monthly installments.',
      details: [
        'Full Prepayment (Foreclosure): After completing six (6) successful monthly EMI cycles, borrowers may liquidate and close the entire remaining loan principal at any time with 0.00% prepayment penalty.',
        'Part-Payment Privilege: Partial capital prepayments of minimum two (2) EMIs can be deposited anytime, with immediate option to either curtail monthly EMI or truncate total tenure.',
        'Prompt NOC Delivery: A formal digitally signed No-Dues Certificate (NOC) and lien release confirmation is dispatched to the customer within 24 hours of loan payoff.',
      ],
    },
    {
      id: 'reg-05',
      category: 'Delinquency & Penalties',
      title: 'Article 5: Delinquency Management, Penalties & Credit Reporting',
      badge: 'Statutory Compliance',
      summary:
        'Clear, fair, and transparent default procedures in strict conformity with Central Consumer Credit Regulations.',
      details: [
        'Overdue Charge: If an EMI remains unsettled following the 3-day grace window, a penal interest of 2.0% per month is assessed solely on the overdue installment amount (never on the overall principal).',
        'Credit Bureau Reporting: Unsettled accounts remaining 30 or more consecutive days past due are required under statutory regulations to be reported to credit rating repositories (CIBIL, Experian, Equifax, TransUnion).',
        'Banker’s Right of Set-Off: In the event of persistent default (>90 days) after formal written warnings, the bank reserves statutory rights to set off overdue installments against positive balances in customer’s FinCore accounts.',
      ],
    },
    {
      id: 'reg-06',
      category: 'Eligibility & KYC',
      title: 'Article 6: Statutory Borrower Eligibility & KYC Requirements',
      badge: 'KYC Mandate',
      summary:
        'Underwriting thresholds designed to preserve safety, prevent identity fraud, and adhere to Anti-Money Laundering (AML) standards.',
      details: [
        'Age Range: Minimum 21 years at the time of application; maximum 60 years at the projected final loan maturity date.',
        'Income Verification: Net monthly verified income must exceed three times (3x) the proposed monthly EMI installment.',
        'Credit Score Threshold: Minimum credit bureau score of 650 with clean repayment track record over the preceding 24 months.',
        'Required Documentation: Valid government-issued photo identification (Passport, National ID, Driving License) and verified primary residence address on file.',
      ],
    },
    {
      id: 'reg-07',
      category: 'Fair Practices & Ombudsman',
      title: 'Article 7: Fair Lending Code, Customer Rights & Ombudsman Escalation',
      badge: 'Customer Protection',
      summary:
        'FinCore Bank adheres to the Fair Banking Practice Code ensuring dignified debt collection and robust grievance redressal.',
      details: [
        'Zero Harassment Guarantee: All recovery communications strictly observe professional hours (9:00 AM - 6:00 PM) without third-party intimidation or invasive practices.',
        'Tier-1 Branch Resolution: Dedicated Branch Grievance Redressal Officers resolve customer loan disputes within twenty-four (24) business hours.',
        'Tier-2 Ombudsman Recourse: If any grievance remains unresolved within thirty (30) days, the customer holds the statutory right to escalate directly to the Regional Banking Ombudsman.',
      ],
    },
  ];

  const filteredRegulations = bankRegulations.filter((reg) => {
    if (!rulesSearchQuery.trim()) return true;
    const q = rulesSearchQuery.toLowerCase();
    return (
      reg.title.toLowerCase().includes(q) ||
      reg.summary.toLowerCase().includes(q) ||
      reg.category.toLowerCase().includes(q) ||
      reg.details.some((d) => d.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Official FinCore Branch Retail Credit Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Landmark className="w-8 h-8 text-[#2555EA]" />
              Branch Loans & Financing
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Apply for instant personal, home, or business loans from our network of verified bank branches
              with a guaranteed <span className="font-bold text-emerald-400">10.0% fixed annual interest rate</span> and
              comprehensive bank regulatory protections.
            </p>
          </div>

          {/* Quick Rate Badge Card */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-xl shrink-0 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Percent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Guaranteed Fixed Rate
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                10.0% <span className="text-xs font-semibold text-emerald-400">p.a. Fixed</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Daily reducing balance • Zero markup</span>
            </div>
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Loan Debt</span>
            <span className="text-lg font-black text-white">
              {currencySymbol}
              {totalActiveDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Interest Rate</span>
            <span className="text-lg font-black text-emerald-400">10.0% Fixed APR</span>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sanctioning Branches</span>
            <span className="text-lg font-black text-white">{branches.length} Active Centers</span>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disbursement Speed</span>
            <span className="text-lg font-black text-blue-400">Instant to Account</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'apply'
              ? 'bg-[#2555EA] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Take Loan from Branch</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-white text-[10px]">10%</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'active'
              ? 'bg-[#2555EA] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>My Loans & Repayment</span>
          {activeLoans.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeLoans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-[#2555EA] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Bank Rules & Regulations</span>
          <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
            Policy Charter
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: APPLY FOR BRANCH LOAN */}
      {/* ============================================================ */}
      {activeTab === 'apply' && (
        <form onSubmit={handleApply} className="space-y-8">
          {/* Step 1: Branch Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#2555EA] dark:text-blue-400 uppercase tracking-wider block">
                  Step 1 • Select Branch
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
                  Choose Originating Bank Branch
                </h3>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Your loan officer and sanction agreement will be anchored here
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((branch) => {
                const isSelected = selectedBranchId === branch.id;
                return (
                  <div
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition relative group ${
                      isSelected
                        ? 'border-[#2555EA] bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-[#2555EA]/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {branch.name}
                          </span>
                          {branch.badge && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2555EA] dark:text-blue-300">
                              {branch.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {branch.address}
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-[#2555EA] text-white'
                            : 'border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Branch Code</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{branch.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Loan Officer Desk</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                          {branch.manager}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {branch.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {branch.timing}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Loan Category */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-bold text-[#2555EA] dark:text-blue-400 uppercase tracking-wider block">
                Step 2 • Purpose & Facility Type
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
                Select Loan Classification
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {loanTypesList.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedLoanType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setSelectedLoanType(item.type)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#2555EA] bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-[#2555EA]/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#2555EA] text-white shadow-md shadow-blue-500/25'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                          10%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Interactive 10% Interest Calculator & Customizer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#2555EA] dark:text-blue-400 uppercase tracking-wider block">
                  Step 3 • Loan Amount & Tenure
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
                  Loan Calculator with Guaranteed 10.0% Interest
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Percent className="w-3.5 h-3.5" />
                <span>10.0% Fixed APR Locked</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Controls: Sliders and Inputs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Principal Amount */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Required Loan Principal
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        min={1000}
                        max={200000}
                        step={1000}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Math.max(1000, Number(e.target.value) || 0))}
                        className="w-36 pl-7 pr-3 py-1.5 text-right font-mono font-bold text-base bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2555EA]"
                  />

                  {/* Preset Amount Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Presets:</span>
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLoanAmount(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          loanAmount === amt
                            ? 'bg-[#2555EA] text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {currencySymbol}
                        {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenure Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Repayment Tenure
                    </label>
                    <span className="text-sm font-bold text-[#2555EA] dark:text-blue-400">
                      {tenureMonths} Months ({Math.floor(tenureMonths / 12)}y {tenureMonths % 12 ? `${tenureMonths % 12}m` : ''})
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {tenureOptions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenureMonths(t)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center ${
                          tenureMonths === t
                            ? 'bg-[#2555EA] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {t}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Purpose / Loan Description
                  </label>
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Home interior upgrade, equipment purchase"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2555EA]"
                  />
                </div>

                {/* Destination Account Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Deposit Disbursed Funds Into Account
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#2555EA]"
                  >
                    {userAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountNumber} ({acc.accountType} - Current Balance: {currencySymbol}
                        {acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right: Live Calculation Card */}
              <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Calculation Summary
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    10.0% p.a. Fixed
                  </span>
                </div>

                {/* Primary EMI Figure */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">Monthly Installment (EMI)</span>
                  <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                    {currencySymbol}
                    {calculatedEmi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs font-normal text-slate-400">/ month</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Due on the 5th of every month with 3-day grace period
                  </span>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Principal Amount</span>
                    <span className="font-mono font-bold text-white">
                      {currencySymbol}
                      {loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>Total Interest Payable</span>
                      <span className="text-[10px] text-emerald-400 font-bold">(10%)</span>
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {currencySymbol}
                      {totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Processing Fee</span>
                    <span className="font-mono font-bold text-emerald-400">
                      $0.00 (Waived)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Prepayment / Foreclosure Fee</span>
                    <span className="font-mono font-bold text-emerald-400">
                      0.00% after 6 mos
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-white font-bold pt-3 border-t border-slate-800 text-sm">
                    <span>Total Repayment Amount</span>
                    <span className="font-mono text-emerald-400">
                      {currencySymbol}
                      {totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual ratio */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Principal: {Math.round((loanAmount / totalRepayment) * 100)}%</span>
                    <span>Interest (10%): {Math.round((totalInterest / totalRepayment) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(loanAmount / totalRepayment) * 100}%` }}
                      className="bg-[#2555EA] h-full"
                    />
                    <div
                      style={{ width: `${(totalInterest / totalRepayment) * 100}%` }}
                      className="bg-amber-400 h-full"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-900/30 border border-blue-500/20 text-[11px] text-blue-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Sanctioned directly by <strong>{selectedBranch.name}</strong> ({selectedBranch.code}). Funds will
                    be immediately credited to your bank account upon submission.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Bank Rules & Regulations Acceptance ("all back roles and rugulaction") */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#2555EA] dark:text-blue-400 uppercase tracking-wider block">
                  Step 4 • Statutory Compliance & Legal Terms
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  FinCore Bank Rules & Regulations Agreement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRulesModalOpen(true)}
                className="text-xs text-[#2555EA] dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Read Full Policy Charter</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Regulatory Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">1. 10.0% Fixed APR Guarantee</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Daily reducing balance computation. The 10% rate is legally locked against rate escalations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">2. Auto-Debit on 5th & Grace</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Monthly installment auto-debited on 5th with a guaranteed 3-day grace period before late charges.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">3. 0% Foreclosure Rights</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prepay or settle full remaining debt after 6 completed installments with zero penalties.
                </p>
              </div>
            </div>

            {/* Checkbox agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="w-5 h-5 rounded mt-0.5 accent-[#2555EA] text-white focus:ring-[#2555EA]"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  I hereby confirm that I am of legal age (21–60 yrs), have read, understood, and solemnly agree
                  to abide by all <strong>FinCore Bank Rules, Regulations, 10.0% Interest Terms, Repayment Auto-Debit Covenants,
                  and Central Bank Statutory Guidelines</strong> for loan disbursement through{' '}
                  <span className="font-bold text-[#2555EA] dark:text-blue-400">{selectedBranch.name}</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !agreedToRules}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition ${
                  isSubmitting || !agreedToRules
                    ? 'bg-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-[#2555EA] hover:bg-blue-600 shadow-blue-500/25 hover:scale-[1.01]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Branch Sanction...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Disburse {currencySymbol}{loanAmount.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MY ACTIVE LOANS & REPAYMENT */}
      {/* ============================================================ */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
                Active Loans & Repayment Portfolio
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Track your active branch facilities, submit monthly EMIs, or execute zero-penalty foreclosures.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('apply')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply for New Loan</span>
            </button>
          </div>

          {userLoans.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2555EA] flex items-center justify-center mx-auto">
                <Landmark className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No active loans found
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
                Take advantage of our instant branch loan facility with a guaranteed 10.0% annual interest rate.
              </p>
              <button
                onClick={() => setActiveTab('apply')}
                className="px-5 py-2.5 rounded-xl bg-[#2555EA] text-white text-xs font-bold shadow-md hover:bg-blue-600 transition"
              >
                Apply for Branch Loan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userLoans.map((loan) => {
                const isPaidOff = loan.status === 'PAID_OFF';
                const progressPercent = Math.min(
                  100,
                  Math.round((loan.emisPaid / loan.totalEmis) * 100)
                );

                return (
                  <div
                    key={loan.id}
                    className={`rounded-3xl p-6 border shadow-sm transition space-y-5 ${
                      isPaidOff
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-md'
                    }`}
                  >
                    {/* Top bar with Loan Number and Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white block">
                          {loan.loanNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#2555EA]" />
                          {loan.branchName} ({loan.branchCode})
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isPaidOff
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </div>

                    {/* Financial Figures */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Remaining Balance
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {currencySymbol}
                          {loan.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Monthly Installment (EMI)
                        </span>
                        <div className="text-2xl font-black text-[#2555EA] dark:text-blue-400 tracking-tight">
                          {currencySymbol}
                          {loan.monthlyEmi.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span>
                          Repayment: {loan.emisPaid} of {loan.totalEmis} EMIs Paid
                        </span>
                        <span className="text-emerald-500 font-bold">{progressPercent}% Settled</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Metadata Table */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Interest Rate</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">10.0% Fixed</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Original Amount</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {currencySymbol}
                          {loan.principalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Next EMI Date</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {isPaidOff ? 'Closed' : new Date(loan.nextEmiDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      {!isPaidOff && (
                        <>
                          <button
                            type="button"
                            onClick={() => payLoanEmi(loan.id)}
                            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Pay EMI ({currencySymbol}{loan.monthlyEmi.toFixed(2)})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Foreclose loan #${loan.loanNumber}? Total payoff: ${currencySymbol}${loan.remainingBalance.toLocaleString()} (0% Prepayment Penalty).`
                                )
                              ) {
                                forecloseLoan(loan.id);
                              }
                            }}
                            className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                          >
                            Foreclose (0% Fee)
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedSanctionLoan(loan)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-[#2555EA]" />
                        <span>Sanction Letter</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: BANK RULES AND REGULATIONS (POLICY CHARTER) */}
      {/* ============================================================ */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#2555EA] dark:text-blue-400" />
                FinCore Bank Rules & Statutory Regulations
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Official institutional lending policy charter, consumer protection rules, and 10% rate covenants.
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search regulations..."
                value={rulesSearchQuery}
                onChange={(e) => setRulesSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2555EA]"
              />
            </div>
          </div>

          {/* Policy Articles Accordion/Card Grid */}
          <div className="space-y-4">
            {filteredRegulations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-500/40 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2555EA] dark:text-blue-400">
                      {reg.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {reg.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#2555EA] dark:text-blue-300 self-start sm:self-auto">
                    {reg.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {reg.summary}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Statutory Clauses & Sub-Rules
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {reg.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2555EA] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">
                Banking Ombudsman & Regulatory Guarantee
              </span>
              <p className="leading-relaxed">
                All retail credit contracts issued by FinCore Bank branches operate under strict oversight of the
                Central Banking Authority and the Fair Consumer Credit Protection Bureau. For regulatory inquiries or
                disputes, contact our Compliance Directorate at compliance@fincore.bank or call toll-free +1 (800) 555-0999.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SANCTION LETTER MODAL */}
      {/* ============================================================ */}
      {selectedSanctionLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSanctionLoan(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2555EA] dark:text-blue-400 uppercase tracking-widest block">
                  Official Sanction Letter
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  FinCore Bank Retail Credit Sanction
                </h3>
                <span className="text-xs text-slate-400">
                  Ref: {selectedSanctionLoan.loanNumber} • Certified Digital Document
                </span>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                This certifies that the retail credit application submitted by{' '}
                <strong>{currentUser.fullName}</strong> has been officially approved and sanctioned by{' '}
                <strong>{selectedSanctionLoan.branchName} ({selectedSanctionLoan.branchCode})</strong> pursuant to
                the FinCore Bank Retail Credit Guidelines and Central Bank Statutory Regulations.
              </p>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Borrower Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentUser.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Sanctioned Amount</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {currencySymbol}
                    {selectedSanctionLoan.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Interest Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white">10.0% p.a. (Fixed)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Monthly EMI</span>
                  <span className="font-bold text-[#2555EA] dark:text-blue-400">
                    {currencySymbol}
                    {selectedSanctionLoan.monthlyEmi.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Sanctioning Branch</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedSanctionLoan.branchName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Disbursed Account</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedSanctionLoan.accountNumber}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Statutory Covenant Affirmation
                </span>
                <p className="text-[11px] leading-normal">
                  The loan is governed by the standard 10.0% reducing balance formula, 5th-of-month auto-debit schedule
                  with a 3-day grace period, and 0% foreclosure penalty after six completed installments.
                </p>
              </div>
            </div>

            {/* Document Footer with Bank Seal */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <span className="block font-bold text-slate-600 dark:text-slate-300">
                  FinCore Central Banking Authority Seal
                </span>
                <span>Digitally Authenticated • SHA-256 Validated</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2555EA] text-white text-xs font-bold hover:bg-blue-600 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* QUICK RULES MODAL */}
      {/* ============================================================ */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Scale className="w-6 h-6 text-[#2555EA]" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  FinCore Bank Retail Loan Policy Charter
                </h3>
                <span className="text-xs text-slate-400">Complete regulatory clauses and borrower protections</span>
              </div>
            </div>

            <div className="space-y-4">
              {bankRegulations.map((reg) => (
                <div key={reg.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#2555EA] uppercase">{reg.category}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{reg.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{reg.summary}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#2555EA] text-white text-xs font-bold hover:bg-blue-600 transition"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
