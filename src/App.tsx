import React, { useState } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Sidebar, type NavTabId } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { ReportsView } from './views/ReportsView';
import { DashboardView } from './views/DashboardView';
import { AccountsView } from './views/AccountsView';
import { CardsView } from './views/CardsView';
import { TransactionsView } from './views/TransactionsView';
import { PaymentView } from './views/PaymentView';
import { InvoicingView } from './views/InvoicingView';
import { TradingView } from './views/TradingView';
import { AdminView } from './views/AdminView';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { TransferModal } from './components/TransferModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import type { Transaction } from './types/banking';

const FinCoreAppLayout: React.FC = () => {
  const { currentRole } = useBanking();

  // Active navigation tab (default to 'reports' to match user's screenshot)
  const [currentTab, setCurrentTab] = useState<NavTabId>('reports');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const getPageTitle = (tab: NavTabId) => {
    switch (tab) {
      case 'reports':
        return 'Reports';
      case 'dashboard':
        return 'Dashboard';
      case 'accounts':
        return 'Accounts';
      case 'cards':
        return 'Cards';
      case 'transactions':
        return 'Transactions';
      case 'payment':
        return 'Payment';
      case 'invoicing':
        return 'Invoicing';
      case 'trading':
        return 'Trading';
      case 'admin':
        return 'Governance';
      default:
        return 'FinCore';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans antialiased">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Left Sidebar (Desktop permanent, Tablet/Mobile responsive drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white min-h-screen">
        {/* Top Header */}
        <Header
          title={getPageTitle(currentTab)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenNotifications={() => setCurrentTab('reports')}
          onOpenProfile={() => setCurrentTab('accounts')}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'dashboard' && (
            <DashboardView
              onOpenDeposit={() => setIsDepositOpen(true)}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              onOpenTransfer={() => setIsTransferOpen(true)}
              onSelectTransaction={(tx) => setSelectedTx(tx)}
            />
          )}

          {currentTab === 'accounts' && (
            <AccountsView
              onOpenDeposit={() => setIsDepositOpen(true)}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              onOpenTransfer={() => setIsTransferOpen(true)}
            />
          )}

          {currentTab === 'cards' && <CardsView />}

          {currentTab === 'transactions' && (
            <TransactionsView onSelectTransaction={(tx) => setSelectedTx(tx)} />
          )}

          {currentTab === 'payment' && <PaymentView />}

          {currentTab === 'invoicing' && <InvoicingView />}

          {currentTab === 'trading' && <TradingView />}

          {currentTab === 'admin' && <AdminView />}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <FinCoreAppLayout />
    </BankingProvider>
  );
}
