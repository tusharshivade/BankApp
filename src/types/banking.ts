export type UserRole = 'CUSTOMER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type AccountType = 'SAVINGS' | 'CURRENT';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type LedgerEntryType = 'DEBIT' | 'CREDIT';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: AccountType;
  currency: string;
  balance: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: number;
  transactionId: number;
  accountId: number;
  entryType: LedgerEntryType;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  referenceNumber: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  sourceAccountId: number | null;
  destinationAccountId: number | null;
  amount: number;
  description: string;
  idempotencyKey?: string;
  createdAt: string;
  completedAt?: string;
  sourceAccountNumber?: string;
  destinationAccountNumber?: string;
  ledgerEntries?: LedgerEntry[];
}

export interface AuditLog {
  id: number;
  actorUserId: number | null;
  actorEmail?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  details: string;
  createdAt: string;
}

export interface AdminMetrics {
  totalCustomers: number;
  totalAccounts: number;
  totalSystemDeposits: number;
  totalSystemWithdrawals: number;
  totalTransactionsCount: number;
  activeAccountsCount: number;
  suspendedAccountsCount: number;
}
