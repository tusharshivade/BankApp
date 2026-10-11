import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { TransactionTable } from '../components/TransactionTable';
import { Transaction } from '../types/banking';
import {
  Users,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Activity,
  History,
} from 'lucide-react';

interface AdminOverviewViewProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onSelectTransaction }) => {
  const { users, accounts, transactions, auditLogs, updateAccountStatus } = useBanking();

  const [activeTab, setActiveTab] = useState<'METRICS' | 'CUSTOMERS' | 'ACCOUNTS' | 'AUDIT'>('METRICS');
  const [accountActionModal, setAccountActionModal] = useState<{
    isOpen: boolean;
    accountId: number | null;
    targetStatus: 'ACTIVE' | 'SUSPENDED';
    accountNumber: string;
    reason: string;
  }>({
    isOpen: false,
    accountId: null,
    targetStatus: 'ACTIVE',
    accountNumber: '',
    reason: '',
  });

  // Calculate system-wide totals
  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE').length;
  const suspendedAccounts = accounts.filter((a) => a.status === 'SUSPENDED').length;

  const totalSystemDeposits = transactions
    .filter((t) => t.transactionType === 'DEPOSIT' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSystemWithdrawals = transactions
    .filter((t) => t.transactionType === 'WITHDRAWAL' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleOpenAccountAction = (accId: number, targetStatus: 'ACTIVE' | 'SUSPENDED', accNum: string) => {
    setAccountActionModal({
      isOpen: true,
      accountId: accId,
      targetStatus,
      accountNumber: accNum,
      reason: '',
    });
  };

  const handleConfirmAccountAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountActionModal.accountId) return;

    updateAccountStatus(
      accountActionModal.accountId,
      accountActionModal.targetStatus,
      accountActionModal.reason || 'Administrative policy audit'
    );

    setAccountActionModal({
      isOpen: false,
      accountId: null,
      targetStatus: 'ACTIVE',
      accountNumber: '',
      reason: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-900/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Administrative Governance Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              FinCore System Oversight
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time monitoring, customer management, account freeze controls, and audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5 self-start md:self-auto text-xs">
            <button
              onClick={() => setActiveTab('METRICS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'METRICS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('CUSTOMERS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'CUSTOMERS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setActiveTab('ACCOUNTS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'ACCOUNTS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Accounts
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'AUDIT' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Customers</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalCustomers}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active KYC accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">System Accounts</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalAccounts}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {activeAccounts} Active • {suspendedAccounts} Suspended
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">System Deposits</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{totalSystemDeposits.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cumulative credits</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">System Withdrawals</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{totalSystemWithdrawals.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cumulative debits</span>
        </div>
      </div>

      {/* Tab 1: Overview & All Transactions */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <TransactionTable
            transactions={transactions}
            onSelectTransaction={onSelectTransaction}
            title="Global Transaction Monitoring"
          />
        </div>
      )}

      {/* Tab 2: Customers Management */}
      {activeTab === 'CUSTOMERS' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Registered Customer Accounts</h3>
              <p className="text-xs text-slate-400">Manage user profiles and roles</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-medium text-slate-400">#{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{u.fullName}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Account Controls (Freeze / Suspend) */}
      {activeTab === 'ACCOUNTS' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Bank Accounts & Freeze Controls</h3>
              <p className="text-xs text-slate-400">
                Authorize administrative suspensions and reactivations with mandatory audit logging.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4">Account Holder</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {accounts.map((acc) => {
                  const owner = users.find((u) => u.id === acc.userId);
                  const isSuspended = acc.status === 'SUSPENDED';

                  return (
                    <tr key={acc.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">{acc.accountNumber}</td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{owner?.fullName || `User #${acc.userId}`}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-semibold">
                          {acc.accountType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSuspended
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isSuspended ? (
                          <button
                            onClick={() => handleOpenAccountAction(acc.id, 'ACTIVE', acc.accountNumber)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAccountAction(acc.id, 'SUSPENDED', acc.accountNumber)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Suspend Account
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Immutable Audit Trail Viewer */}
      {activeTab === 'AUDIT' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                Immutable System Audit Logs
              </h3>
              <p className="text-xs text-slate-400">
                Complete forensic audit trail recording actor identity, actions, resource targets, and IP addresses.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Forensic Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-500">#{log.id}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 text-purple-300 font-semibold">{log.actorEmail || 'System'}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.resourceType}:{log.resourceId}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-300 max-w-sm truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Account Action Confirmation Modal */}
      {accountActionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  accountActionModal.targetStatus === 'SUSPENDED'
                    ? 'bg-rose-600/20 text-rose-400'
                    : 'bg-emerald-600/20 text-emerald-400'
                }`}
              >
                {accountActionModal.targetStatus === 'SUSPENDED' ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Unlock className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {accountActionModal.targetStatus === 'SUSPENDED' ? 'Suspend Account' : 'Reactivate Account'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{accountActionModal.accountNumber}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmAccountAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Audit Reason (Mandatory)
                </label>
                <textarea
                  required
                  placeholder="e.g. Risk compliance check, customer request, unusual activity review"
                  value={accountActionModal.reason}
                  onChange={(e) =>
                    setAccountActionModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500 h-24"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAccountActionModal({
                      isOpen: false,
                      accountId: null,
                      targetStatus: 'ACTIVE',
                      accountNumber: '',
                      reason: '',
                    })
                  }
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold transition shadow-lg ${
                    accountActionModal.targetStatus === 'SUSPENDED'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  Confirm & Post Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
