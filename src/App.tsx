import React, { useState } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { TransferModal } from './components/TransferModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { CustomerDashboard } from './views/CustomerDashboard';
import { AccountsView } from './views/AccountsView';
import { TransfersView } from './views/TransfersView';
import { TransactionsView } from './views/TransactionsView';
import { StatementsView } from './views/StatementsView';
import { ProfileView } from './views/ProfileView';
import { AdminOverviewView } from './views/AdminOverviewView';
import { Transaction } from './types/banking';

const BankingAppContent: React.FC = () => {
  const { currentRole } = useBanking();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState<boolean>(false);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [modalAccountId, setModalAccountId] = useState<number | undefined>(undefined);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Auto-switch default tab if role changes
  React.useEffect(() => {
    if (currentRole === 'ADMIN' && !currentTab.startsWith('admin')) {
      setCurrentTab('admin-overview');
    } else if (currentRole === 'CUSTOMER' && currentTab.startsWith('admin')) {
      setCurrentTab('dashboard');
    }
  }, [currentRole]);

  const handleOpenDeposit = (accId?: number) => {
    setModalAccountId(accId);
    setIsDepositOpen(true);
  };

  const handleOpenWithdraw = (accId?: number) => {
    setModalAccountId(accId);
    setIsWithdrawOpen(true);
  };

  const handleOpenTransfer = (accId?: number) => {
    setModalAccountId(accId);
    setIsTransferOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Body with Sidebar and Content View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {/* View Switching */}
            {currentTab === 'dashboard' && (
              <CustomerDashboard
                onOpenDeposit={handleOpenDeposit}
                onOpenWithdraw={handleOpenWithdraw}
                onOpenTransfer={handleOpenTransfer}
                onDownloadStatement={(accId) => setCurrentTab('statements')}
                onSelectTransaction={(tx) => setSelectedTx(tx)}
              />
            )}

            {currentTab === 'accounts' && (
              <AccountsView
                onOpenDeposit={handleOpenDeposit}
                onOpenWithdraw={handleOpenWithdraw}
                onOpenTransfer={handleOpenTransfer}
                onDownloadStatement={(accId) => setCurrentTab('statements')}
              />
            )}

            {currentTab === 'transfers' && <TransfersView />}

            {currentTab === 'deposit' && (
              <div className="max-w-xl mx-auto py-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-white">Deposit Cash Simulation</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Select an account and deposit funds directly into your balance.
                  </p>
                </div>
                <button
                  onClick={() => setIsDepositOpen(true)}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition shadow-xl shadow-emerald-600/30 text-sm"
                >
                  Open Deposit Window
                </button>
              </div>
            )}

            {currentTab === 'withdraw' && (
              <div className="max-w-xl mx-auto py-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-white">Withdraw Cash Simulation</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Withdraw funds from your active account balance.
                  </p>
                </div>
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white transition shadow-xl shadow-rose-600/30 text-sm"
                >
                  Open Withdrawal Window
                </button>
              </div>
            )}

            {currentTab === 'transactions' && (
              <TransactionsView onSelectTransaction={(tx) => setSelectedTx(tx)} />
            )}

            {currentTab === 'statements' && <StatementsView />}

            {currentTab === 'profile' && <ProfileView />}

            {currentTab.startsWith('admin') && (
              <AdminOverviewView onSelectTransaction={(tx) => setSelectedTx(tx)} />
            )}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        defaultAccountId={modalAccountId}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        defaultAccountId={modalAccountId}
      />
      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BankingAppContent />
    </BankingProvider>
  );
}
