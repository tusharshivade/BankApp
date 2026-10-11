import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Users, CreditCard, ArrowDownCircle, ArrowUpCircle, Lock, Unlock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { users, accounts, transactions, auditLogs, updateAccountStatus, currencySymbol } = useBanking();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'CUSTOMERS' | 'ACCOUNTS' | 'AUDIT'>('METRICS');
  const [freezeModal, setFreezeModal] = useState<{
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

  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
  const totalAccounts = accounts.length;
  const totalDeposits = transactions
    .filter((t) => t.transactionType === 'DEPOSIT' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => (t.transactionType === 'WITHDRAWAL' || t.transactionType === 'TRANSFER') && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freezeModal.accountId) return;

    updateAccountStatus(
      freezeModal.accountId,
      freezeModal.targetStatus,
      freezeModal.reason || 'Administrative policy audit'
    );

    setFreezeModal({
      isOpen: false,
      accountId: null,
      targetStatus: 'ACTIVE',
      accountNumber: '',
      reason: '',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-600" />
            Administrative Governance
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            System metrics, customer oversight, account controls, and forensic audit trail
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold self-start sm:self-auto">
          {(['METRICS', 'CUSTOMERS', 'ACCOUNTS', 'AUDIT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === tab ? 'bg-white text-purple-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'METRICS' ? 'Overview' : tab === 'CUSTOMERS' ? 'Customers' : tab === 'ACCOUNTS' ? 'Freeze Controls' : 'Audit Logs'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      {activeTab === 'METRICS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium block">Total Customers</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{totalCustomers}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium block">Total Accounts</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{totalAccounts}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ArrowDownCircle className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium block">Cumulative Inflows</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{currencySymbol}{totalDeposits.toLocaleString()}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium block">Cumulative Outflows</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{currencySymbol}{totalWithdrawals.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'CUSTOMERS' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Customer Name</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-5 font-mono text-slate-400">#{u.id}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{u.fullName}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Freeze Controls Tab */}
      {activeTab === 'ACCOUNTS' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Account Number</th>
                <th className="py-3 px-5">Type</th>
                <th className="py-3 px-5 text-right">Balance</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => {
                const isSuspended = acc.status === 'SUSPENDED';
                return (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{acc.accountNumber}</td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">{acc.accountType}</td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">
                      {currencySymbol}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {isSuspended ? (
                        <button
                          onClick={() => setFreezeModal({ isOpen: true, accountId: acc.id, targetStatus: 'ACTIVE', accountNumber: acc.accountNumber, reason: '' })}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Reactivate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setFreezeModal({ isOpen: true, accountId: acc.id, targetStatus: 'SUSPENDED', accountNumber: acc.accountNumber, reason: '' })}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Freeze Account</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'AUDIT' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-5">Target</th>
                <th className="py-3 px-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-5 text-slate-400">#{log.id}</td>
                  <td className="py-3.5 px-5 text-slate-500 font-sans">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-3.5 px-5 font-bold text-purple-700">{log.action}</td>
                  <td className="py-3.5 px-5 text-slate-700">{log.resourceType}:{log.resourceId}</td>
                  <td className="py-3.5 px-5 font-sans text-xs text-slate-600 max-w-sm truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Freeze Reason Modal */}
      {freezeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {freezeModal.targetStatus === 'SUSPENDED' ? 'Freeze Account' : 'Reactivate Account'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">{freezeModal.accountNumber}</p>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory Audit Reason</label>
                <textarea
                  required
                  placeholder="Compliance review, suspicious activity, customer request..."
                  value={freezeModal.reason}
                  onChange={(e) => setFreezeModal((prev) => ({ ...prev, reason: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-600 h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFreezeModal((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
