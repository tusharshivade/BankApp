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
  avatarUrl?: string;
  createdAt: string;
  phone?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  upiId?: string;
  city?: string;
}

export interface Contact {
  id: string;
  name: string;
  accountNumber: string;
  avatarUrl: string;
  initials: string;
  upiId?: string;
  bankName?: string;
  ifsc?: string;
  phone?: string;
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
  ifscCode?: string;
  branchName?: string;
  upiId?: string;
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
  category?: 'drinks' | 'market' | 'transfer' | 'salary' | 'bills' | 'other';
  status: TransactionStatus;
  sourceAccountId: number | null;
  destinationAccountId: number | null;
  amount: number;
  description: string;
  subTitle?: string;
  idempotencyKey?: string;
  createdAt: string;
  completedAt?: string;
  sourceAccountNumber?: string;
  destinationAccountNumber?: string;
  ledgerEntries?: LedgerEntry[];
  upiReference?: string;
  transferMode?: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'INTERNAL';
  ifsc?: string;
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

export type LoanStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'PAID_OFF' | 'DEFAULTED';
export type LoanType = 'PERSONAL' | 'HOME' | 'BUSINESS' | 'EDUCATION' | 'VEHICLE' | 'GOLD';

export interface LoanBranch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  manager: string;
  phone: string;
  timing: string;
  badge?: string;
  ifsc: string;
}

export interface Loan {
  id: string;
  loanNumber: string;
  userId: number;
  accountId: number;
  accountNumber?: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  loanType: LoanType;
  principalAmount: number;
  interestRate: number; // e.g. 10.0 (%)
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  remainingBalance: number;
  emisPaid: number;
  totalEmis: number;
  status: LoanStatus;
  startDate: string;
  nextEmiDate: string;
  purpose: string;
}

export interface FixedDeposit {
  id: string;
  fdNumber: string;
  userId: number;
  accountId: number;
  principalAmount: number;
  interestRate: number; // e.g. 7.25 (%)
  tenureMonths: number;
  maturityAmount: number;
  interestEarned: number;
  startDate: string;
  maturityDate: string;
  status: 'ACTIVE' | 'MATURED' | 'CLOSED';
  isTaxSaver?: boolean;
}

export interface BillPaymentItem {
  id: string;
  category: 'electricity' | 'mobile' | 'fastag' | 'dth' | 'gas' | 'water';
  billerName: string;
  consumerNumber: string;
  amount: number;
  dueDate: string;
  status: 'DUE' | 'PAID';
  iconType?: string;
}
