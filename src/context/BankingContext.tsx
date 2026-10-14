import React, { createContext, useContext, useState } from 'react';
import type { Account, AuditLog, Contact, Loan, LoanBranch, LoanType, Transaction, User, UserRole } from '../types/banking';
import {
  BRANCH_LIST,
  INITIAL_ACCOUNTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONTACTS,
  INITIAL_LOANS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from '../services/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface BankingContextType {
  currentUser: User;
  users: User[];
  accounts: Account[];
  contacts: Contact[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  loans: Loan[];
  branches: LoanBranch[];
  toasts: Toast[];
  currentRole: UserRole;
  currencySymbol: string;
  isBalanceHidden: boolean;
  selectedContact: Contact;
  selectedAccountId: number;
  toggleCurrency: () => void;
  toggleBalanceHidden: () => void;
  setSelectedContact: (contact: Contact) => void;
  setSelectedAccountId: (id: number) => void;
  switchRole: (role: UserRole) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  deposit: (accountId: number, amount: number, description: string) => boolean;
  withdraw: (accountId: number, amount: number, description: string) => boolean;
  transfer: (sourceAccountId: number, destAccountNumber: string, amount: number, description: string) => boolean;
  applyLoan: (loanData: {
    accountId: number;
    branchId: string;
    loanType: LoanType;
    principalAmount: number;
    tenureMonths: number;
    purpose: string;
  }) => boolean;
  payLoanEmi: (loanId: string) => boolean;
  forecloseLoan: (loanId: string) => boolean;
  updateAccountStatus: (accountId: number, status: 'ACTIVE' | 'SUSPENDED', reason: string) => void;
  updateProfile: (fullName: string) => void;
  downloadCsvStatement: (accountId: number) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<number>(2); // Emilia Smith by default
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [branches] = useState<LoanBranch[]>(BRANCH_LIST);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact>(INITIAL_CONTACTS[0]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[1];
  const currentRole = currentUser.role;

  const toggleCurrency = () => {
    setCurrencySymbol((prev) => (prev === '$' ? '₹' : '$'));
  };

  const toggleBalanceHidden = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      setCurrentUserId(1); // FinCore Admin
      showToast('Switched to Administrator Governance Console', 'info');
    } else {
      setCurrentUserId(2); // Emilia Smith
      showToast('Switched to Customer App (Emilia Smith)', 'info');
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
      category: 'transfer',
      status: 'SUCCESS',
      sourceAccountId: null,
      destinationAccountId: accountId,
      destinationAccountNumber: targetAccount.accountNumber,
      amount,
      description: description || 'Add Money / Deposit',
      subTitle: 'Online Deposit',
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

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'DEPOSIT_EXECUTED',
        resourceType: 'ACCOUNT',
        resourceId: targetAccount.accountNumber,
        ipAddress: '127.0.0.1',
        details: `Deposit of ${currencySymbol}${amount.toLocaleString()} posted to account.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Added ${currencySymbol}${amount.toLocaleString()} to wallet`);
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
      showToast(`Insufficient funds! Available balance is ${currencySymbol}${sourceAccount.balance.toLocaleString()}`, 'error');
      return false;
    }

    const newBalance = sourceAccount.balance - amount;
    const now = new Date().toISOString();
    const refNum = `TXN-${Date.now().toString().slice(-8)}`;

    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'WITHDRAWAL',
      category: 'other',
      status: 'SUCCESS',
      sourceAccountId: accountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: null,
      amount,
      description: description || 'Withdrawal',
      subTitle: 'ATM / Cash',
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
        details: `Withdrawal of ${currencySymbol}${amount.toLocaleString()} from account.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Withdrew ${currencySymbol}${amount.toLocaleString()} successfully`);
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

    if (sourceAccount.balance < amount) {
      showToast(`Insufficient funds! Available: ${currencySymbol}${sourceAccount.balance.toLocaleString()}`, 'error');
      return false;
    }

    const now = new Date().toISOString();
    const sourceNewBal = sourceAccount.balance - amount;
    const refNum = `TXN-${Date.now().toString().slice(-8)}`;
    const txId = transactions.length + 1;

    const newTx: Transaction = {
      id: txId,
      referenceNumber: refNum,
      transactionType: 'TRANSFER',
      category: 'transfer',
      status: 'SUCCESS',
      sourceAccountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: 3,
      destinationAccountNumber: destAccountNumber,
      amount,
      description: description || 'Payment Transfer',
      subTitle: selectedContact?.name ? `To ${selectedContact.name}` : 'Direct Transfer',
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
      ],
    };

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === sourceAccountId ? { ...acc, balance: sourceNewBal, updatedAt: now } : acc))
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
        details: `Payment of ${currencySymbol}${amount.toLocaleString()} to ${destAccountNumber}.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Payment of ${currencySymbol}${amount.toLocaleString()} sent successfully!`);
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
        details: `Account status set to ${status}. Reason: ${reason}`,
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

    const headers = ['Reference Number', 'Date', 'Type', 'Description', 'Debit/Credit', `Amount (${currencySymbol})`, 'Status'];
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
    link.setAttribute('download', `statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Statement downloaded successfully`);
  };

  const applyLoan = (loanData: {
    accountId: number;
    branchId: string;
    loanType: LoanType;
    principalAmount: number;
    tenureMonths: number;
    purpose: string;
  }): boolean => {
    const { accountId, branchId, loanType, principalAmount, tenureMonths, purpose } = loanData;

    if (principalAmount <= 0) {
      showToast('Loan principal amount must be greater than zero', 'error');
      return false;
    }

    const targetAccount = accounts.find((a) => a.id === accountId);
    if (!targetAccount) {
      showToast('Disbursement account not found', 'error');
      return false;
    }

    if (targetAccount.status === 'SUSPENDED') {
      showToast('Cannot disburse loan to a suspended account', 'error');
      return false;
    }

    const selectedBranch = branches.find((b) => b.id === branchId) || branches[0];

    // Standard reducing balance EMI formula at fixed 10% annual interest
    const annualRate = 0.10; // 10.0% fixed p.a.
    const monthlyRate = annualRate / 12;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    const calculatedEmi = (principalAmount * monthlyRate * factor) / (factor - 1);
    const totalRepay = calculatedEmi * tenureMonths;
    const totalInt = totalRepay - principalAmount;

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(5); // 5th of each month

    const loanId = `ln-${Date.now().toString().slice(-6)}`;
    const loanNumber = `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const refNum = `TXN-LN-${Date.now().toString().slice(-8)}`;

    const newLoan: Loan = {
      id: loanId,
      loanNumber,
      userId: currentUser.id,
      accountId: targetAccount.id,
      accountNumber: targetAccount.accountNumber,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      branchCode: selectedBranch.code,
      loanType,
      principalAmount,
      interestRate: 10.0,
      tenureMonths,
      monthlyEmi: Math.round(calculatedEmi * 100) / 100,
      totalInterest: Math.round(totalInt * 100) / 100,
      totalRepayment: Math.round(totalRepay * 100) / 100,
      remainingBalance: Math.round(principalAmount * 100) / 100,
      emisPaid: 0,
      totalEmis: tenureMonths,
      status: 'ACTIVE',
      startDate: now.toISOString(),
      nextEmiDate: nextMonth.toISOString(),
      purpose: purpose || `${selectedBranch.name} 10% Retail Credit`,
    };

    // Disburse funds directly into chosen account
    const newBalance = targetAccount.balance + principalAmount;
    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'DEPOSIT',
      category: 'transfer',
      status: 'SUCCESS',
      sourceAccountId: null,
      destinationAccountId: targetAccount.id,
      destinationAccountNumber: targetAccount.accountNumber,
      amount: principalAmount,
      description: `Branch Loan Disbursed - ${selectedBranch.name} (Ref #${loanNumber})`,
      subTitle: '10.0% Fixed Loan Sanction',
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId: targetAccount.id,
          entryType: 'CREDIT',
          amount: principalAmount,
          balanceAfter: newBalance,
          createdAt: now.toISOString(),
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === targetAccount.id ? { ...acc, balance: newBalance, updatedAt: now.toISOString() } : acc))
    );
    setTransactions((prev) => [newTx, ...prev]);
    setLoans((prev) => [newLoan, ...prev]);

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'LOAN_SANCTIONED_AND_DISBURSED',
        resourceType: 'LOAN',
        resourceId: loanNumber,
        ipAddress: '127.0.0.1',
        details: `Loan ${loanNumber} of ${currencySymbol}${principalAmount.toLocaleString()} at 10% p.a. sanctioned by ${selectedBranch.name} and disbursed to ${targetAccount.accountNumber}.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(`🎉 Loan sanctioned! ${currencySymbol}${principalAmount.toLocaleString()} disbursed to ${targetAccount.accountNumber}`, 'success');
    return true;
  };

  const payLoanEmi = (loanId: string): boolean => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status !== 'ACTIVE') {
      showToast('Active loan not found', 'error');
      return false;
    }

    const account = accounts.find((a) => a.id === loan.accountId && a.status === 'ACTIVE') ||
                    accounts.find((a) => a.userId === currentUser.id && a.status === 'ACTIVE' && a.balance >= loan.monthlyEmi);

    if (!account) {
      showToast('No active account with sufficient balance found to pay EMI', 'error');
      return false;
    }

    if (account.balance < loan.monthlyEmi) {
      showToast(`Insufficient balance in account ${account.accountNumber} to pay EMI of ${currencySymbol}${loan.monthlyEmi.toFixed(2)}`, 'error');
      return false;
    }

    const now = new Date();
    const nextMonth = new Date(loan.nextEmiDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const newAccountBalance = account.balance - loan.monthlyEmi;
    const principalPaidPerMonth = loan.principalAmount / loan.totalEmis;
    const newRemaining = Math.max(0, loan.remainingBalance - principalPaidPerMonth);
    const newEmisPaid = loan.emisPaid + 1;
    const isPaidOff = newEmisPaid >= loan.totalEmis || newRemaining <= 0;

    const refNum = `TXN-EMI-${Date.now().toString().slice(-8)}`;

    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'WITHDRAWAL',
      category: 'bills',
      status: 'SUCCESS',
      sourceAccountId: account.id,
      sourceAccountNumber: account.accountNumber,
      destinationAccountId: null,
      amount: loan.monthlyEmi,
      description: `EMI Installment #${newEmisPaid} for Loan #${loan.loanNumber}`,
      subTitle: '10.0% Loan Repayment',
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId: account.id,
          entryType: 'DEBIT',
          amount: loan.monthlyEmi,
          balanceAfter: newAccountBalance,
          createdAt: now.toISOString(),
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, balance: newAccountBalance, updatedAt: now.toISOString() } : a))
    );
    setTransactions((prev) => [newTx, ...prev]);

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              emisPaid: newEmisPaid,
              remainingBalance: isPaidOff ? 0 : Math.round(newRemaining * 100) / 100,
              status: isPaidOff ? 'PAID_OFF' : 'ACTIVE',
              nextEmiDate: nextMonth.toISOString(),
            }
          : l
      )
    );

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'LOAN_EMI_PAID',
        resourceType: 'LOAN',
        resourceId: loan.loanNumber,
        ipAddress: '127.0.0.1',
        details: `EMI #${newEmisPaid} of ${currencySymbol}${loan.monthlyEmi.toFixed(2)} paid for Loan ${loan.loanNumber}.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(
      isPaidOff
        ? `🎉 Final EMI paid! Loan #${loan.loanNumber} is now fully closed!`
        : `EMI #${newEmisPaid} of ${currencySymbol}${loan.monthlyEmi.toFixed(2)} paid successfully`,
      'success'
    );
    return true;
  };

  const forecloseLoan = (loanId: string): boolean => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status !== 'ACTIVE') {
      showToast('Active loan not found', 'error');
      return false;
    }

    const account = accounts.find((a) => a.id === loan.accountId && a.status === 'ACTIVE') ||
                    accounts.find((a) => a.userId === currentUser.id && a.status === 'ACTIVE' && a.balance >= loan.remainingBalance);

    if (!account) {
      showToast('No active account found for foreclosure payment', 'error');
      return false;
    }

    if (account.balance < loan.remainingBalance) {
      showToast(`Insufficient balance for full foreclosure payment of ${currencySymbol}${loan.remainingBalance.toLocaleString()}`, 'error');
      return false;
    }

    const now = new Date();
    const payoffAmount = loan.remainingBalance;
    const newAccountBalance = account.balance - payoffAmount;
    const refNum = `TXN-FCL-${Date.now().toString().slice(-8)}`;

    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'WITHDRAWAL',
      category: 'bills',
      status: 'SUCCESS',
      sourceAccountId: account.id,
      sourceAccountNumber: account.accountNumber,
      destinationAccountId: null,
      amount: payoffAmount,
      description: `Full Loan Foreclosure #${loan.loanNumber} (0% Penalty)`,
      subTitle: 'Loan Settled & Closed',
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId: account.id,
          entryType: 'DEBIT',
          amount: payoffAmount,
          balanceAfter: newAccountBalance,
          createdAt: now.toISOString(),
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, balance: newAccountBalance, updatedAt: now.toISOString() } : a))
    );
    setTransactions((prev) => [newTx, ...prev]);

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              emisPaid: l.totalEmis,
              remainingBalance: 0,
              status: 'PAID_OFF',
            }
          : l
      )
    );

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'LOAN_FORECLOSED',
        resourceType: 'LOAN',
        resourceId: loan.loanNumber,
        ipAddress: '127.0.0.1',
        details: `Loan ${loan.loanNumber} foreclosed with zero penalty. Full settlement of ${currencySymbol}${payoffAmount.toLocaleString()}.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(`🎉 Loan #${loan.loanNumber} has been completely foreclosed and settled with 0% penalty!`, 'success');
    return true;
  };

  return (
    <BankingContext.Provider
      value={{
        currentUser,
        users,
        accounts,
        contacts,
        transactions,
        auditLogs,
        loans,
        branches,
        toasts,
        currentRole,
        currencySymbol,
        isBalanceHidden,
        selectedContact,
        selectedAccountId,
        toggleCurrency,
        toggleBalanceHidden,
        setSelectedContact,
        setSelectedAccountId,
        switchRole,
        showToast,
        removeToast,
        deposit,
        withdraw,
        transfer,
        applyLoan,
        payLoanEmi,
        forecloseLoan,
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
