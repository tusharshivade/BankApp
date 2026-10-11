import React, { createContext, useContext, useState } from 'react';
import { Account, AuditLog, Transaction, User, UserRole } from '../types/banking';
import { INITIAL_ACCOUNTS, INITIAL_AUDIT_LOGS, INITIAL_TRANSACTIONS, INITIAL_USERS } from '../services/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface BankingContextType {
  currentUser: User;
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  toasts: Toast[];
  currentRole: UserRole;
  selectedAccountId: number;
  setSelectedAccountId: (id: number) => void;
  switchRole: (role: UserRole) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  deposit: (accountId: number, amount: number, description: string) => boolean;
  withdraw: (accountId: number, amount: number, description: string) => boolean;
  transfer: (sourceAccountId: number, destAccountNumber: string, amount: number, description: string) => boolean;
  updateAccountStatus: (accountId: number, status: 'ACTIVE' | 'SUSPENDED', reason: string) => void;
  updateProfile: (fullName: string) => void;
  downloadCsvStatement: (accountId: number) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<number>(2); // Aarav Sharma by default
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(1);

  const currentUser = users.find((u) => u.id === currentUserId) || users[1];
  const currentRole = currentUser.role;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      setCurrentUserId(1); // FinCore Admin
      showToast('Switched to Administrator view', 'info');
    } else {
      setCurrentUserId(2); // Aarav Sharma
      showToast('Switched to Customer view (Aarav Sharma)', 'info');
    }
  };

  const updateProfile = (fullName: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, fullName } : u))
    );
    showToast('Profile information updated successfully');
  };

  const deposit = (accountId: number, amount: number, description: string): boolean => {
    if (amount <= 0) {
      showToast('Deposit amount must be greater than zero', 'error');
      return false;
    }

    const targetAccount = accounts.find((a) => a.id === accountId);
    if (!targetAccount) {
      showToast('Account not found', 'error');
      return false;
    }

    if (targetAccount.status === 'SUSPENDED') {
      showToast('Cannot deposit into a suspended account', 'error');
      return false;
    }

    const newBalance = targetAccount.balance + amount;
    const now = new Date().toISOString();
    const refNum = `TXN-${Date.now().toString().slice(-8)}`;

    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'DEPOSIT',
      status: 'SUCCESS',
      sourceAccountId: null,
      destinationAccountId: accountId,
      destinationAccountNumber: targetAccount.accountNumber,
      amount,
      description: description || 'Simulated Cash Deposit',
      createdAt: now,
      completedAt: now,
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId,
          entryType: 'CREDIT',
          amount,
          balanceAfter: newBalance,
          createdAt: now,
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: newBalance, updatedAt: now } : acc))
    );
    setTransactions((prev) => [newTx, ...prev]);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'DEPOSIT_EXECUTED',
        resourceType: 'ACCOUNT',
        resourceId: targetAccount.accountNumber,
        ipAddress: '127.0.0.1',
        details: `Simulated deposit of ₹${amount.toLocaleString('en-IN')} posted to account.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Successfully deposited ₹${amount.toLocaleString('en-IN')} to ${targetAccount.accountNumber}`);
    return true;
  };

  const withdraw = (accountId: number, amount: number, description: string): boolean => {
    if (amount <= 0) {
      showToast('Withdrawal amount must be greater than zero', 'error');
      return false;
    }

    const sourceAccount = accounts.find((a) => a.id === accountId);
    if (!sourceAccount) {
      showToast('Account not found', 'error');
      return false;
    }

    if (sourceAccount.status === 'SUSPENDED') {
      showToast('Cannot withdraw from a suspended account', 'error');
      return false;
    }

    if (sourceAccount.balance < amount) {
      showToast(`Insufficient funds! Available balance is ₹${sourceAccount.balance.toLocaleString('en-IN')}`, 'error');
      return false;
    }

    const newBalance = sourceAccount.balance - amount;
    const now = new Date().toISOString();
    const refNum = `TXN-${Date.now().toString().slice(-8)}`;

    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'WITHDRAWAL',
      status: 'SUCCESS',
      sourceAccountId: accountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: null,
      amount,
      description: description || 'Simulated Cash Withdrawal',
      createdAt: now,
      completedAt: now,
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId,
          entryType: 'DEBIT',
          amount,
          balanceAfter: newBalance,
          createdAt: now,
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: newBalance, updatedAt: now } : acc))
    );
    setTransactions((prev) => [newTx, ...prev]);

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'WITHDRAWAL_EXECUTED',
        resourceType: 'ACCOUNT',
        resourceId: sourceAccount.accountNumber,
        ipAddress: '127.0.0.1',
        details: `Simulated withdrawal of ₹${amount.toLocaleString('en-IN')} posted to account.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Successfully withdrew ₹${amount.toLocaleString('en-IN')} from ${sourceAccount.accountNumber}`);
    return true;
  };

  const transfer = (
    sourceAccountId: number,
    destAccountNumber: string,
    amount: number,
    description: string
  ): boolean => {
    if (amount <= 0) {
      showToast('Transfer amount must be greater than zero', 'error');
      return false;
    }

    const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
    if (!sourceAccount) {
      showToast('Source account not found', 'error');
      return false;
    }

    if (sourceAccount.status === 'SUSPENDED') {
      showToast('Source account is suspended', 'error');
      return false;
    }

    const cleanDestNumber = destAccountNumber.trim().toUpperCase();
    if (sourceAccount.accountNumber === cleanDestNumber) {
      showToast('Cannot transfer funds to the same account', 'error');
      return false;
    }

    const destAccount = accounts.find((a) => a.accountNumber === cleanDestNumber);
    if (!destAccount) {
      showToast(`Recipient account ${cleanDestNumber} does not exist in the system`, 'error');
      return false;
    }

    if (destAccount.status === 'SUSPENDED') {
      showToast(`Recipient account ${cleanDestNumber} is suspended and cannot receive funds`, 'error');
      return false;
    }

    if (sourceAccount.balance < amount) {
      showToast(`Insufficient funds! Available balance is ₹${sourceAccount.balance.toLocaleString('en-IN')}`, 'error');
      return false;
    }

    const now = new Date().toISOString();
    const sourceNewBal = sourceAccount.balance - amount;
    const destNewBal = destAccount.balance + amount;
    const refNum = `TXN-${Date.now().toString().slice(-8)}`;
    const txId = transactions.length + 1;

    const newTx: Transaction = {
      id: txId,
      referenceNumber: refNum,
      transactionType: 'TRANSFER',
      status: 'SUCCESS',
      sourceAccountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: destAccount.id,
      destinationAccountNumber: destAccount.accountNumber,
      amount,
      description: description || 'Simulated Inter-Account Transfer',
      idempotencyKey: `IDEM-${Date.now()}`,
      createdAt: now,
      completedAt: now,
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: txId,
          accountId: sourceAccountId,
          entryType: 'DEBIT',
          amount,
          balanceAfter: sourceNewBal,
          createdAt: now,
        },
        {
          id: Date.now() + 1,
          transactionId: txId,
          accountId: destAccount.id,
          entryType: 'CREDIT',
          amount,
          balanceAfter: destNewBal,
          createdAt: now,
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === sourceAccountId) return { ...acc, balance: sourceNewBal, updatedAt: now };
        if (acc.id === destAccount.id) return { ...acc, balance: destNewBal, updatedAt: now };
        return acc;
      })
    );
    setTransactions((prev) => [newTx, ...prev]);

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'TRANSFER_EXECUTED',
        resourceType: 'TRANSACTION',
        resourceId: refNum,
        ipAddress: '127.0.0.1',
        details: `Simulated transfer of ₹${amount.toLocaleString('en-IN')} from ${sourceAccount.accountNumber} to ${destAccount.accountNumber}.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Transferred ₹${amount.toLocaleString('en-IN')} to ${cleanDestNumber}`);
    return true;
  };

  const updateAccountStatus = (accountId: number, status: 'ACTIVE' | 'SUSPENDED', reason: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;

    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: status === 'SUSPENDED' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_REACTIVATED',
        resourceType: 'ACCOUNT',
        resourceId: acc.accountNumber,
        ipAddress: '127.0.0.1',
        details: `Account status updated to ${status}. Reason: ${reason || 'Administrative action'}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(`Account ${acc.accountNumber} is now ${status}`);
  };

  const downloadCsvStatement = (accountId: number) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;

    const relevantTxs = transactions.filter(
      (t) => t.sourceAccountId === accountId || t.destinationAccountId === accountId
    );

    const headers = ['Reference Number', 'Date', 'Type', 'Description', 'Debit/Credit', 'Amount (INR)', 'Status'];
    const rows = relevantTxs.map((t) => {
      const isDebit = t.sourceAccountId === accountId;
      return [
        t.referenceNumber,
        new Date(t.createdAt).toLocaleString(),
        t.transactionType,
        `"${t.description.replace(/"/g, '""')}"`,
        isDebit ? 'DEBIT' : 'CREDIT',
        t.amount.toFixed(2),
        t.status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `statement_${acc.accountNumber}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Statement for ${acc.accountNumber} downloaded successfully`);
  };

  return (
    <BankingContext.Provider
      value={{
        currentUser,
        users,
        accounts,
        transactions,
        auditLogs,
        toasts,
        currentRole,
        selectedAccountId,
        setSelectedAccountId,
        switchRole,
        showToast,
        removeToast,
        deposit,
        withdraw,
        transfer,
        updateAccountStatus,
        updateProfile,
        downloadCsvStatement,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) throw new Error('useBanking must be used within BankingProvider');
  return context;
};
