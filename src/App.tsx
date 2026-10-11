import React, { useState } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { ToastContainer } from './components/ToastContainer';
import { MobileHeader } from './components/mobile/MobileHeader';
import { HomeDashboardScreen } from './components/mobile/HomeDashboardScreen';
import { SendMoneyScreen } from './components/mobile/SendMoneyScreen';
import { PaymentKeypadScreen } from './components/mobile/PaymentKeypadScreen';
import { WalletScreen } from './components/mobile/WalletScreen';
import { ReportScreen } from './components/mobile/ReportScreen';
import { AccountScreen } from './components/mobile/AccountScreen';
import { AdminConsoleScreen } from './components/mobile/AdminConsoleScreen';
import { BottomNavBar, type TabType } from './components/mobile/BottomNavBar';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import type { Contact, Transaction } from './types/banking';
import { Smartphone, Monitor, Shield, Coins } from 'lucide-react';

const MobileBankingApp: React.FC = () => {
  const {
    currentRole,
    switchRole,
    currencySymbol,
    toggleCurrency,
    setSelectedContact,
  } = useBanking();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewMode, setViewMode] = useState<'phone' | 'fluid'>('phone');

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleSelectContactForPayment = (contact: Contact) => {
    setSelectedContact(contact);
    setActiveTab('payment');
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Desktop Utility Control Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between text-xs z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2555EA] text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
            FC
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">FinCore Mobile Banking</span>
            <span className="text-[10px] text-slate-400 font-medium">Human-Crafted Fintech UI</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition active:scale-95"
            title="Toggle currency display"
          >
            <Coins className="w-3.5 h-3.5 text-[#2555EA]" />
            <span>{currencySymbol === '$' ? '$ USD' : '₹ INR'}</span>
          </button>

          {/* Role Toggle */}
          <button
            onClick={() => switchRole(currentRole === 'CUSTOMER' ? 'ADMIN' : 'CUSTOMER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition active:scale-95 ${
              currentRole === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentRole === 'ADMIN' ? 'Admin Mode' : 'Customer Mode'}</span>
            <span className="sm:hidden">{currentRole}</span>
          </button>

          {/* View Mode Toggle (Phone Bezel vs Fluid Desktop) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('phone')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'phone' ? 'bg-white text-[#2555EA] shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Mobile Phone View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('fluid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'fluid' ? 'bg-white text-[#2555EA] shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Full-Width View"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-y-auto">
        <div
          className={`w-full transition-all duration-300 ${
            viewMode === 'phone'
              ? 'max-w-[412px] min-h-[820px] bg-white rounded-none md:rounded-[44px] shadow-none md:shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)] border-0 md:border-[8px] md:border-slate-900 overflow-hidden flex flex-col relative ring-1 ring-slate-900/5'
              : 'max-w-2xl min-h-[800px] bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col'
          }`}
        >
          {/* Scrollable Screen Body */}
          <div className="flex-1 overflow-y-auto px-5 pt-3 scrollbar-none">
            {/* Header: Only shown on home and wallet screens */}
            {(activeTab === 'home' || activeTab === 'wallet') && (
              <MobileHeader
                onOpenNotifications={() => setActiveTab('report')}
                onOpenProfile={() => setActiveTab('account')}
              />
            )}

            {/* Screen 1: Home Dashboard */}
            {activeTab === 'home' && (
              <HomeDashboardScreen
                onNavigateToSend={() => setActiveTab('send')}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
                onOpenAddMoney={() => setIsDepositOpen(true)}
                onSelectTransaction={(tx) => setSelectedTx(tx)}
                onSeeAllTransactions={() => setActiveTab('wallet')}
              />
            )}

            {/* Screen 2: Send Money Hub */}
            {activeTab === 'send' && (
              <SendMoneyScreen
                onBack={() => setActiveTab('home')}
                onSelectContact={handleSelectContactForPayment}
                onOpenStatement={() => setActiveTab('wallet')}
                onOpenAccounts={() => setActiveTab('wallet')}
                onCustomTransfer={() => setActiveTab('payment')}
              />
            )}

            {/* Screen 3: Payment Keypad Screen */}
            {activeTab === 'payment' && (
              <PaymentKeypadScreen
                onBack={() => setActiveTab('send')}
                onChangeRecipient={() => setActiveTab('send')}
                onPaymentSuccess={() => setActiveTab('home')}
              />
            )}

            {/* Screen 4: Wallet & Cards */}
            {activeTab === 'wallet' && <WalletScreen />}

            {/* Screen 5: Reports & Analytics */}
            {activeTab === 'report' && <ReportScreen />}

            {/* Screen 6: Profile & Settings */}
            {activeTab === 'account' && (
              <AccountScreen onOpenAdmin={() => setActiveTab('admin')} />
            )}

            {/* Screen 7: Admin Console */}
            {activeTab === 'admin' && (
              <AdminConsoleScreen onBack={() => setActiveTab('account')} />
            )}
          </div>

          {/* Bottom Navigation Bar */}
          {activeTab !== 'payment' && activeTab !== 'admin' && (
            <BottomNavBar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
          )}
        </div>
      </main>

      {/* Interactive Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <MobileBankingApp />
    </BankingProvider>
  );
}
