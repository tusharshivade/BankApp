import type { Account, AuditLog, Contact, Transaction, User } from '../types/banking';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Clara',
    accountNumber: '**** **** **** 4312',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'CL',
  },
  {
    id: 'c2',
    name: 'John',
    accountNumber: '**** **** **** 8821',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    initials: 'JS',
  },
  {
    id: 'c3',
    name: 'Emma',
    accountNumber: '**** **** **** 1094',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    initials: 'EM',
  },
  {
    id: 'c4',
    name: 'Mark',
    accountNumber: '**** **** **** 6530',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    initials: 'MK',
  },
  {
    id: 'c5',
    name: 'Priya',
    accountNumber: 'FCB1001003001',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    initials: 'PP',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    fullName: 'FinCore Administrator',
    email: 'admin@fincore.bank',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 2,
    fullName: 'Emilia Smith',
    email: 'emilia.smith@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-10-05T10:30:00Z',
  },
  {
    id: 3,
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-10-07T14:15:00Z',
  },
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 1,
    userId: 2,
    accountNumber: '**** **** **** 4312',
    accountType: 'SAVINGS',
    currency: 'USD',
    balance: 18500.0,
    status: 'ACTIVE',
    createdAt: '2026-10-05T10:35:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  },
  {
    id: 2,
    userId: 2,
    accountNumber: '**** **** **** 9018',
    accountType: 'CURRENT',
    currency: 'USD',
    balance: 4250.0,
    status: 'ACTIVE',
    createdAt: '2026-10-06T11:20:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  },
  {
    id: 3,
    userId: 3,
    accountNumber: 'FCB1001003001',
    accountType: 'SAVINGS',
    currency: 'USD',
    balance: 12000.0,
    status: 'ACTIVE',
    createdAt: '2026-10-07T14:20:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    referenceNumber: 'TXN-DRK-1092',
    transactionType: 'WITHDRAWAL',
    category: 'drinks',
    status: 'SUCCESS',
    sourceAccountId: 1,
    sourceAccountNumber: '**** **** **** 4312',
    destinationAccountId: null,
    amount: 150.0,
    description: 'Drinks',
    subTitle: 'Cafe and Restaurant',
    createdAt: '2026-10-11T14:30:00Z',
    completedAt: '2026-10-11T14:30:01Z',
    ledgerEntries: [
      { id: 1, transactionId: 1, accountId: 1, entryType: 'DEBIT', amount: 150.0, balanceAfter: 18500.0, createdAt: '2026-10-11T14:30:01Z' }
    ]
  },
  {
    id: 2,
    referenceNumber: 'TXN-MKT-9912',
    transactionType: 'WITHDRAWAL',
    category: 'market',
    status: 'SUCCESS',
    sourceAccountId: 1,
    sourceAccountNumber: '**** **** **** 4312',
    destinationAccountId: null,
    amount: 250.0,
    description: 'Market',
    subTitle: 'Groceries',
    createdAt: '2026-10-10T11:15:00Z',
    completedAt: '2026-10-10T11:15:02Z',
    ledgerEntries: [
      { id: 2, transactionId: 2, accountId: 1, entryType: 'DEBIT', amount: 250.0, balanceAfter: 18650.0, createdAt: '2026-10-10T11:15:02Z' }
    ]
  },
  {
    id: 3,
    referenceNumber: 'TXN-TRF-4011',
    transactionType: 'DEPOSIT',
    category: 'transfer',
    status: 'SUCCESS',
    sourceAccountId: null,
    destinationAccountId: 1,
    destinationAccountNumber: '**** **** **** 4312',
    amount: 350.0,
    description: 'Quick Transfer',
    subTitle: 'John Smith',
    createdAt: '2026-10-09T18:40:00Z',
    completedAt: '2026-10-09T18:40:01Z',
    ledgerEntries: [
      { id: 3, transactionId: 3, accountId: 1, entryType: 'CREDIT', amount: 350.0, balanceAfter: 18900.0, createdAt: '2026-10-09T18:40:01Z' }
    ]
  },
  {
    id: 4,
    referenceNumber: 'TXN-SAL-7721',
    transactionType: 'DEPOSIT',
    category: 'salary',
    status: 'SUCCESS',
    sourceAccountId: null,
    destinationAccountId: 1,
    destinationAccountNumber: '**** **** **** 4312',
    amount: 3200.0,
    description: 'Payroll Deposit',
    subTitle: 'FinCore Global Tech',
    createdAt: '2026-10-01T09:00:00Z',
    completedAt: '2026-10-01T09:00:01Z',
    ledgerEntries: [
      { id: 4, transactionId: 4, accountId: 1, entryType: 'CREDIT', amount: 3200.0, balanceAfter: 18550.0, createdAt: '2026-10-01T09:00:01Z' }
    ]
  },
  {
    id: 5,
    referenceNumber: 'TXN-BIL-3329',
    transactionType: 'WITHDRAWAL',
    category: 'bills',
    status: 'SUCCESS',
    sourceAccountId: 1,
    sourceAccountNumber: '**** **** **** 4312',
    destinationAccountId: null,
    amount: 80.0,
    description: 'Electricity Bill',
    subTitle: 'Power Grid Co.',
    createdAt: '2026-09-28T16:20:00Z',
    completedAt: '2026-09-28T16:20:02Z',
    ledgerEntries: [
      { id: 5, transactionId: 5, accountId: 1, entryType: 'DEBIT', amount: 80.0, balanceAfter: 15350.0, createdAt: '2026-09-28T16:20:02Z' }
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
    actorEmail: 'emilia.smith@example.com',
    action: 'USER_LOGIN',
    resourceType: 'AUTH',
    resourceId: 'USER_2',
    ipAddress: '192.168.1.104',
    details: 'Customer authentication successful via biometric / JWT grant.',
    createdAt: '2026-10-11T09:30:00Z',
  },
  {
    id: 3,
    actorUserId: 2,
    actorEmail: 'emilia.smith@example.com',
    action: 'TRANSFER_EXECUTED',
    resourceType: 'TRANSACTION',
    resourceId: 'TXN-TRF-4011',
    ipAddress: '192.168.1.104',
    details: 'Simulated transfer of $350.00 posted to double-entry ledger.',
    createdAt: '2026-10-11T11:45:02Z',
  }
];

export const MONTHLY_CHART_DATA = [
  { month: 'May', deposits: 4500, withdrawals: 1200 },
  { month: 'Jun', deposits: 6200, withdrawals: 2400 },
  { month: 'Jul', deposits: 5800, withdrawals: 3100 },
  { month: 'Aug', deposits: 7100, withdrawals: 2800 },
  { month: 'Sep', deposits: 8500, withdrawals: 3900 },
  { month: 'Oct', deposits: 9200, withdrawals: 1800 },
];
