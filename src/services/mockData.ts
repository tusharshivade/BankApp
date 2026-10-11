import { Account, AuditLog, Transaction, User } from '../types/banking';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    fullName: 'FinCore Administrator',
    email: 'admin@fincore.bank',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 2,
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    createdAt: '2026-10-05T10:30:00Z',
  },
  {
    id: 3,
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    createdAt: '2026-10-07T14:15:00Z',
  },
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 1,
    userId: 2,
    accountNumber: 'FCB1001002001',
    accountType: 'SAVINGS',
    currency: 'INR',
    balance: 75000.0,
    status: 'ACTIVE',
    createdAt: '2026-10-05T10:35:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  },
  {
    id: 2,
    userId: 2,
    accountNumber: 'FCB1001002002',
    accountType: 'CURRENT',
    currency: 'INR',
    balance: 25000.0,
    status: 'ACTIVE',
    createdAt: '2026-10-06T11:20:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  },
  {
    id: 3,
    userId: 3,
    accountNumber: 'FCB1001003001',
    accountType: 'SAVINGS',
    currency: 'INR',
    balance: 50000.0,
    status: 'ACTIVE',
    createdAt: '2026-10-07T14:20:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    referenceNumber: 'TXN-20261008-8831',
    transactionType: 'DEPOSIT',
    status: 'SUCCESS',
    sourceAccountId: null,
    destinationAccountId: 1,
    destinationAccountNumber: 'FCB1001002001',
    amount: 50000.0,
    description: 'Initial Simulated Deposit via Cash Vault',
    createdAt: '2026-10-08T10:15:00Z',
    completedAt: '2026-10-08T10:15:01Z',
    ledgerEntries: [
      { id: 1, transactionId: 1, accountId: 1, entryType: 'CREDIT', amount: 50000.0, balanceAfter: 50000.0, createdAt: '2026-10-08T10:15:01Z' }
    ]
  },
  {
    id: 2,
    referenceNumber: 'TXN-20261009-4102',
    transactionType: 'DEPOSIT',
    status: 'SUCCESS',
    sourceAccountId: null,
    destinationAccountId: 1,
    destinationAccountNumber: 'FCB1001002001',
    amount: 30000.0,
    description: 'Simulated Salary Credit',
    createdAt: '2026-10-09T14:00:00Z',
    completedAt: '2026-10-09T14:00:02Z',
    ledgerEntries: [
      { id: 2, transactionId: 2, accountId: 1, entryType: 'CREDIT', amount: 30000.0, balanceAfter: 80000.0, createdAt: '2026-10-09T14:00:02Z' }
    ]
  },
  {
    id: 3,
    referenceNumber: 'TXN-20261010-1928',
    transactionType: 'WITHDRAWAL',
    status: 'SUCCESS',
    sourceAccountId: 1,
    sourceAccountNumber: 'FCB1001002001',
    destinationAccountId: null,
    amount: 5000.0,
    description: 'ATM Cash Withdrawal Simulation',
    createdAt: '2026-10-10T16:30:00Z',
    completedAt: '2026-10-10T16:30:01Z',
    ledgerEntries: [
      { id: 3, transactionId: 3, accountId: 1, entryType: 'DEBIT', amount: 5000.0, balanceAfter: 75000.0, createdAt: '2026-10-10T16:30:01Z' }
    ]
  },
  {
    id: 4,
    referenceNumber: 'TXN-20261011-5091',
    transactionType: 'TRANSFER',
    status: 'SUCCESS',
    sourceAccountId: 1,
    sourceAccountNumber: 'FCB1001002001',
    destinationAccountId: 2,
    destinationAccountNumber: 'FCB1001002002',
    amount: 10000.0,
    description: 'Funds Transfer to Current Account for Business Demo',
    createdAt: '2026-10-11T11:45:00Z',
    completedAt: '2026-10-11T11:45:02Z',
    ledgerEntries: [
      { id: 4, transactionId: 4, accountId: 1, entryType: 'DEBIT', amount: 10000.0, balanceAfter: 65000.0, createdAt: '2026-10-11T11:45:02Z' },
      { id: 5, transactionId: 4, accountId: 2, entryType: 'CREDIT', amount: 10000.0, balanceAfter: 25000.0, createdAt: '2026-10-11T11:45:02Z' }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    actorUserId: 1,
    actorEmail: 'admin@fincore.bank',
    action: 'SYSTEM_BOOTSTRAP',
    resourceType: 'SYSTEM',
    resourceId: 'GLOBAL',
    ipAddress: '127.0.0.1',
    details: 'FinCore banking services initialized with Flyway baseline migrations.',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 2,
    actorUserId: 2,
    actorEmail: 'aarav.sharma@example.com',
    action: 'USER_LOGIN',
    resourceType: 'AUTH',
    resourceId: 'USER_2',
    ipAddress: '192.168.1.104',
    details: 'Customer authentication successful via JWT grant.',
    createdAt: '2026-10-11T09:30:00Z',
  },
  {
    id: 3,
    actorUserId: 2,
    actorEmail: 'aarav.sharma@example.com',
    action: 'TRANSFER_EXECUTED',
    resourceType: 'TRANSACTION',
    resourceId: 'TXN-20261011-5091',
    ipAddress: '192.168.1.104',
    details: 'Simulated inter-account transfer of INR 10,000.00 posted to double-entry ledger.',
    createdAt: '2026-10-11T11:45:02Z',
  }
];

export const MONTHLY_CHART_DATA = [
  { month: 'May', deposits: 45000, withdrawals: 12000 },
  { month: 'Jun', deposits: 62000, withdrawals: 24000 },
  { month: 'Jul', deposits: 58000, withdrawals: 31000 },
  { month: 'Aug', deposits: 71000, withdrawals: 28000 },
  { month: 'Sep', deposits: 85000, withdrawals: 39000 },
  { month: 'Oct', deposits: 90000, withdrawals: 15000 },
];
