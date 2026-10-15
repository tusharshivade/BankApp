import React, { createContext, useContext, useState } from 'react';
import type {
  Account,
  AuditLog,
  BillPaymentItem,
  Contact,
  FixedDeposit,
  Loan,
  LoanBranch,
  LoanType,
  Transaction,
  User,
  UserRole,
} from '../types/banking';
import {
  BRANCH_LIST,
  INITIAL_ACCOUNTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BILLS,
  INITIAL_CONTACTS,
  INITIAL_FIXED_DEPOSITS,
  INITIAL_LOANS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from '../services/mockData';
import { formatINR } from '../utils/formatters';

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
  fixedDeposits: FixedDeposit[];
  bills: BillPaymentItem[];
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
  upiTransfer: (sourceAccountId: number, upiId: string, amount: number, note: string) => boolean;
  impsNeftTransfer: (
    sourceAccountId: number,
    beneficiaryAccount: string,
    ifsc: string,
    beneficiaryName: string,
    amount: number,
    mode: 'IMPS' | 'NEFT' | 'RTGS',
    note: string
  ) => boolean;
  openFixedDeposit: (accountId: number, principal: number, tenureMonths: number, isTaxSaver?: boolean) => boolean;
  payBill: (billId: string, accountId: number) => boolean;
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
  const [currentUserId, setCurrentUserId] = useState<number>(2); // Aarav Sharma by default
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [branches] = useState<LoanBranch[]>(BRANCH_LIST);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>(INITIAL_FIXED_DEPOSITS);
  const [bills, setBills] = useState<BillPaymentItem[]>(INITIAL_BILLS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(1);
  const [currencySymbol] = useState<string>('₹'); // Always Indian Rupee
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact>(INITIAL_CONTACTS[0]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[1];
  const currentRole = currentUser.role;

  const toggleCurrency = () => {
    // Bank is exclusively for Indian citizens in Indian Rupees (₹)
    showToast('FinCore Bank operations are strictly denominated in Indian Rupees (₹ / INR)', 'info');
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
      showToast('Switched to RBI Governance & Administrative Console', 'info');
    } else {
      setCurrentUserId(2); // Aarav Sharma
      showToast(`Switched to Indian Retail Portal (${users[1]?.fullName || 'Aarav Sharma'})`, 'info');
    }
  };

  const updateProfile = (fullName: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, fullName } : u))
    );
    showToast('Customer profile details updated successfully');
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
      showToast('Cannot deposit into a frozen account', 'error');
      return false;
    }

    const newBalance = targetAccount.balance + amount;
    const now = new Date().toISOString();
    const refNum = `UPI/DEP/${Date.now().toString().slice(-8)}`;

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
      description: description || 'Instant UPI Wallet Top-up',
      subTitle: 'NPCI UPI 2.0 Inward Credit',
      transferMode: 'UPI',
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
        ipAddress: '49.36.128.45',
        details: `Deposit of ${formatINR(amount)} posted to ${targetAccount.accountNumber} with double-entry credit.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Added ${formatINR(amount)} to account successfully`);
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
      showToast(`Insufficient funds! Available balance is ${formatINR(sourceAccount.balance)}`, 'error');
      return false;
    }

    const newBalance = sourceAccount.balance - amount;
    const now = new Date().toISOString();
    const refNum = `ATM/MUM/${Date.now().toString().slice(-8)}`;

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
      description: description || 'RuPay ATM Cash Withdrawal',
      subTitle: 'Domestic NFS ATM Network',
      transferMode: 'INTERNAL',
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
        ipAddress: '49.36.128.45',
        details: `ATM Cash Withdrawal of ${formatINR(amount)} from account.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Withdrew ${formatINR(amount)} cash successfully`);
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
      showToast(`Insufficient balance! Available: ${formatINR(sourceAccount.balance)}`, 'error');
      return false;
    }

    const now = new Date().toISOString();
    const sourceNewBal = sourceAccount.balance - amount;
    const refNum = `TXN-IN-${Date.now().toString().slice(-8)}`;
    const txId = transactions.length + 1;

    // Check if recipient is internal account
    const recipientAcc = accounts.find((a) => a.accountNumber.toUpperCase() === destAccountNumber.toUpperCase());

    const newTx: Transaction = {
      id: txId,
      referenceNumber: refNum,
      transactionType: 'TRANSFER',
      category: 'transfer',
      status: 'SUCCESS',
      sourceAccountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: recipientAcc ? recipientAcc.id : null,
      destinationAccountNumber: destAccountNumber,
      amount,
      description: description || 'Bank Transfer',
      subTitle: selectedContact?.name ? `To ${selectedContact.name}` : `To A/c ${destAccountNumber}`,
      transferMode: 'INTERNAL',
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
      prev.map((acc) => {
        if (acc.id === sourceAccountId) {
          return { ...acc, balance: sourceNewBal, updatedAt: now };
        }
        if (recipientAcc && acc.id === recipientAcc.id) {
          return { ...acc, balance: acc.balance + amount, updatedAt: now };
        }
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
        ipAddress: '49.36.128.45',
        details: `Inter-account transfer of ${formatINR(amount)} sent to ${destAccountNumber}.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`Transferred ${formatINR(amount)} to ${destAccountNumber} successfully!`);
    return true;
  };

  const upiTransfer = (
    sourceAccountId: number,
    upiId: string,
    amount: number,
    note: string
  ): boolean => {
    if (amount <= 0) {
      showToast('Amount must be greater than zero', 'error');
      return false;
    }

    if (!upiId || !upiId.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g., name@okhdfc, name@upi)', 'error');
      return false;
    }

    const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
    if (!sourceAccount) {
      showToast('Source account not found', 'error');
      return false;
    }

    if (sourceAccount.balance < amount) {
      showToast(`Insufficient balance! Available: ${formatINR(sourceAccount.balance)}`, 'error');
      return false;
    }

    const now = new Date().toISOString();
    const sourceNewBal = sourceAccount.balance - amount;
    const utr = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const refNum = `UPI/${utr}/${upiId.split('@')[0]}`;
    const txId = transactions.length + 1;

    const newTx: Transaction = {
      id: txId,
      referenceNumber: refNum,
      transactionType: 'TRANSFER',
      category: 'transfer',
      status: 'SUCCESS',
      sourceAccountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: null,
      destinationAccountNumber: upiId,
      amount,
      description: note || `UPI Payment to ${upiId}`,
      subTitle: `UPI ID: ${upiId} • UTR: ${utr}`,
      upiReference: utr,
      transferMode: 'UPI',
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
        action: 'UPI_TRANSFER_SUCCESS',
        resourceType: 'UPI',
        resourceId: utr,
        ipAddress: '49.36.128.45',
        details: `Instant UPI payment of ${formatINR(amount)} completed to ${upiId}. NPCI UTR: ${utr}`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`✅ Instant UPI payment of ${formatINR(amount)} to ${upiId} successful! UTR: ${utr}`, 'success');
    return true;
  };

  const impsNeftTransfer = (
    sourceAccountId: number,
    beneficiaryAccount: string,
    ifsc: string,
    beneficiaryName: string,
    amount: number,
    mode: 'IMPS' | 'NEFT' | 'RTGS',
    note: string
  ): boolean => {
    if (amount <= 0) {
      showToast('Amount must be greater than zero', 'error');
      return false;
    }

    if (!ifsc || ifsc.trim().length !== 11) {
      showToast('Please enter a valid 11-character Indian IFSC code (e.g. SBIN0001234, FCBL0001001)', 'error');
      return false;
    }

    if (mode === 'RTGS' && amount < 200000) {
      showToast('RTGS transfers require a minimum amount of ₹2,00,000 as per RBI rules. Please choose IMPS or NEFT.', 'error');
      return false;
    }

    const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
    if (!sourceAccount) {
      showToast('Source account not found', 'error');
      return false;
    }

    if (sourceAccount.balance < amount) {
      showToast(`Insufficient balance! Available: ${formatINR(sourceAccount.balance)}`, 'error');
      return false;
    }

    const now = new Date().toISOString();
    const sourceNewBal = sourceAccount.balance - amount;
    const refNum = `${mode}/${Date.now().toString().slice(-8)}/${ifsc.slice(0, 4)}`;
    const txId = transactions.length + 1;

    const newTx: Transaction = {
      id: txId,
      referenceNumber: refNum,
      transactionType: 'TRANSFER',
      category: 'transfer',
      status: 'SUCCESS',
      sourceAccountId,
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountId: null,
      destinationAccountNumber: beneficiaryAccount,
      amount,
      description: note || `${mode} Transfer to ${beneficiaryName}`,
      subTitle: `${mode} • IFSC: ${ifsc.toUpperCase()} • ${beneficiaryName}`,
      transferMode: mode,
      ifsc: ifsc.toUpperCase(),
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
        action: `${mode}_DISPATCHED`,
        resourceType: 'PAYMENT_GATEWAY',
        resourceId: refNum,
        ipAddress: '49.36.128.45',
        details: `${mode} settlement of ${formatINR(amount)} processed to A/c ${beneficiaryAccount} (IFSC: ${ifsc}).`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`✅ ${mode} transfer of ${formatINR(amount)} dispatched to ${beneficiaryName}! Ref: ${refNum}`, 'success');
    return true;
  };

  const openFixedDeposit = (
    accountId: number,
    principal: number,
    tenureMonths: number,
    isTaxSaver?: boolean
  ): boolean => {
    if (principal < 1000) {
      showToast('Minimum Fixed Deposit amount is ₹1,000', 'error');
      return false;
    }

    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      showToast('Funding account not found', 'error');
      return false;
    }

    if (account.balance < principal) {
      showToast(`Insufficient balance in account ${account.accountNumber} to book FD of ${formatINR(principal)}`, 'error');
      return false;
    }

    // High Indian FD rates: 7.25% standard, 7.50% for 5-year tax saver
    const interestRate = isTaxSaver ? 7.5 : tenureMonths >= 24 ? 7.35 : 7.25;
    const interestEarned = Math.round(principal * (interestRate / 100) * (tenureMonths / 12));
    const maturityAmount = principal + interestEarned;

    const now = new Date();
    const maturityDate = new Date(now);
    maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

    const fdNumber = `FD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBal = account.balance - principal;

    const newFd: FixedDeposit = {
      id: `fd-${Date.now().toString().slice(-6)}`,
      fdNumber,
      userId: currentUser.id,
      accountId,
      principalAmount: principal,
      interestRate,
      tenureMonths,
      maturityAmount,
      interestEarned,
      startDate: now.toISOString(),
      maturityDate: maturityDate.toISOString(),
      status: 'ACTIVE',
      isTaxSaver: !!isTaxSaver,
    };

    const refNum = `FD/BOOK/${Date.now().toString().slice(-8)}`;
    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: refNum,
      transactionType: 'WITHDRAWAL',
      category: 'bills',
      status: 'SUCCESS',
      sourceAccountId: account.id,
      sourceAccountNumber: account.accountNumber,
      destinationAccountId: null,
      amount: principal,
      description: `Fixed Deposit Booked (#${fdNumber})`,
      subTitle: `${tenureMonths} Mo @ ${interestRate}% p.a. • Maturity: ${formatINR(maturityAmount)}`,
      transferMode: 'INTERNAL',
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId: account.id,
          entryType: 'DEBIT',
          amount: principal,
          balanceAfter: newBal,
          createdAt: now.toISOString(),
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, balance: newBal, updatedAt: now.toISOString() } : a))
    );
    setFixedDeposits((prev) => [newFd, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'FIXED_DEPOSIT_OPENED',
        resourceType: 'FD',
        resourceId: fdNumber,
        ipAddress: '49.36.128.45',
        details: `Fixed Deposit ${fdNumber} booked for ${formatINR(principal)} at ${interestRate}% p.a. for ${tenureMonths} months.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(`🎉 Fixed Deposit #${fdNumber} of ${formatINR(principal)} booked successfully! Maturity: ${formatINR(maturityAmount)}`, 'success');
    return true;
  };

  const payBill = (billId: string, accountId: number): boolean => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill) {
      showToast('Bill not found', 'error');
      return false;
    }

    if (bill.status === 'PAID') {
      showToast('This bill has already been paid', 'info');
      return false;
    }

    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      showToast('Account not found', 'error');
      return false;
    }

    if (account.balance < bill.amount) {
      showToast(`Insufficient balance to pay bill of ${formatINR(bill.amount)}`, 'error');
      return false;
    }

    const now = new Date().toISOString();
    const newBal = account.balance - bill.amount;
    const bbpsRef = `BBPS/IND/${Date.now().toString().slice(-8)}`;

    const newTx: Transaction = {
      id: transactions.length + 1,
      referenceNumber: bbpsRef,
      transactionType: 'WITHDRAWAL',
      category: 'bills',
      status: 'SUCCESS',
      sourceAccountId: account.id,
      sourceAccountNumber: account.accountNumber,
      destinationAccountId: null,
      amount: bill.amount,
      description: `${bill.billerName} Bill Payment`,
      subTitle: `Bharat BillPay (BBPS) • Consumer: ${bill.consumerNumber}`,
      transferMode: 'INTERNAL',
      createdAt: now,
      completedAt: now,
      ledgerEntries: [
        {
          id: Date.now(),
          transactionId: transactions.length + 1,
          accountId: account.id,
          entryType: 'DEBIT',
          amount: bill.amount,
          balanceAfter: newBal,
          createdAt: now,
        },
      ],
    };

    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, balance: newBal, updatedAt: now } : a))
    );
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'PAID' } : b))
    );
    setTransactions((prev) => [newTx, ...prev]);

    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        actorUserId: currentUser.id,
        actorEmail: currentUser.email,
        action: 'BBPS_BILL_PAID',
        resourceType: 'BBPS',
        resourceId: bbpsRef,
        ipAddress: '49.36.128.45',
        details: `BBPS utility payment of ${formatINR(bill.amount)} paid to ${bill.billerName}.`,
        createdAt: now,
      },
      ...prev,
    ]);

    showToast(`✅ ${bill.billerName} bill of ${formatINR(bill.amount)} paid successfully via Bharat BillPay!`, 'success');
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
        ipAddress: '49.36.128.45',
        details: `Account status updated to ${status}. Compliance reason: ${reason}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(`Account ${acc.accountNumber} status updated to ${status}`);
  };

  const downloadCsvStatement = (accountId: number) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;

    const relevantTxs = transactions.filter(
      (t) => t.sourceAccountId === accountId || t.destinationAccountId === accountId
    );

    const headers = [
      'Transaction Reference / UTR',
      'Date & Time (IST)',
      'Transaction Type',
      'Description',
      'Transfer Mode',
      'Debit/Credit',
      'Amount (INR ₹)',
      'Status',
    ];

    const rows = relevantTxs.map((t) => {
      const isDebit = t.sourceAccountId === accountId;
      return [
        t.referenceNumber,
        new Date(t.createdAt).toLocaleString('en-IN'),
        t.transactionType,
        `"${t.description.replace(/"/g, '""')}"`,
        t.transferMode || 'INTERNAL',
        isDebit ? 'DEBIT' : 'CREDIT',
        t.amount.toFixed(2),
        t.status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinCore_Bank_Statement_${acc.accountNumber}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Official bank statement downloaded successfully`);
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
      showToast('Cannot disburse loan to a frozen account', 'error');
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
    const refNum = `DISB/${loanNumber}/${Date.now().toString().slice(-6)}`;

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
      purpose: purpose || `${selectedBranch.name} Retail Credit`,
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
      description: `Loan Disbursed - ${selectedBranch.name} (Ref #${loanNumber})`,
      subTitle: '10.0% Retail Loan Sanction',
      transferMode: 'INTERNAL',
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
        ipAddress: '49.36.128.45',
        details: `Loan ${loanNumber} of ${formatINR(principalAmount)} sanctioned by ${selectedBranch.name} and credited to ${targetAccount.accountNumber}.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(`🎉 Loan sanctioned! ${formatINR(principalAmount)} credited to ${targetAccount.accountNumber}`, 'success');
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
      showToast(`Insufficient balance in account ${account.accountNumber} to pay EMI of ${formatINR(loan.monthlyEmi)}`, 'error');
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

    const refNum = `EMI/${loan.loanNumber}/${Date.now().toString().slice(-6)}`;

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
      subTitle: 'Loan Auto-Debit Repayment',
      transferMode: 'INTERNAL',
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
        ipAddress: '49.36.128.45',
        details: `EMI #${newEmisPaid} of ${formatINR(loan.monthlyEmi)} paid for Loan ${loan.loanNumber}.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(
      isPaidOff
        ? `🎉 Final EMI paid! Loan #${loan.loanNumber} is now completely closed!`
        : `EMI #${newEmisPaid} of ${formatINR(loan.monthlyEmi)} paid successfully`,
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
      showToast(`Insufficient balance for full foreclosure of ${formatINR(loan.remainingBalance)}`, 'error');
      return false;
    }

    const now = new Date();
    const payoffAmount = loan.remainingBalance;
    const newAccountBalance = account.balance - payoffAmount;
    const refNum = `FCL/${loan.loanNumber}/${Date.now().toString().slice(-6)}`;

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
      description: `Full Loan Foreclosure #${loan.loanNumber} (0% RBI Mandated Penalty)`,
      subTitle: 'Loan Settled & Closed',
      transferMode: 'INTERNAL',
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
        ipAddress: '49.36.128.45',
        details: `Loan ${loan.loanNumber} foreclosed with zero prepayment penalty as per RBI guidelines. Full settlement: ${formatINR(payoffAmount)}.`,
        createdAt: now.toISOString(),
      },
      ...prev,
    ]);

    showToast(`🎉 Loan #${loan.loanNumber} foreclosed with 0% penalty! Full settlement: ${formatINR(payoffAmount)}`, 'success');
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
        fixedDeposits,
        bills,
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
        upiTransfer,
        impsNeftTransfer,
        openFixedDeposit,
        payBill,
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
