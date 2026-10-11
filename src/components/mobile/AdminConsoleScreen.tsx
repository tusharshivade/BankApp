import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowLeft,
  Users,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Lock,
  Unlock,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface AdminConsoleScreenProps {
  onBack: () => void;
}

export const AdminConsoleScreen: React.FC<AdminConsoleScreenProps> = ({ onBack }) => {
  const { users, accounts, transactions, auditLogs, updateAccountStatus, currencySymbol } = useBanking();

  const [activeTab, setActiveTab] = useState<'METRICS' | 'CUSTOMERS' | 'ACCOUNTS' | 'AUDIT'>('METRICS');
  const [modalAction, setModalAction] = useState<{
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

  const handleOpenAction = (accId: number, targetStatus: 'ACTIVE' | 'SUSPENDED', accNum: string) => {
    setModalAction({
      isOpen: true,
      accountId: accId,
      targetStatus,
      accountNumber: accNum,
      reason: '',
    });
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAction.accountId) return;

    updateAccountStatus(
      modalAction.accountId,
      modalAction.targetStatus,
      modalAction.reason || 'Administrative governance'
    );

    setModalAction({
      isOpen: false,
      accountId: null,
      targetStatus: 'ACTIVE',
      accountNumber: '',
      reason: '',
    });
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-900 text-center">Admin Governance</h2>
          <span className="text-[10px] text-purple-600 font-bold block text-center uppercase tracking-wider">
            FinCore Control Room
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 text-xs font-semibold">
        {(['METRICS', 'CUSTOMERS', 'ACCOUNTS', 'AUDIT'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === tab ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'METRICS' ? 'Overview' : tab === 'CUSTOMERS' ? 'Users' : tab === 'ACCOUNTS' ? 'Freeze' : 'Audit'}
          </button>
        ))}
      </div>

      {/* Tab: Overview / Metrics */}
      {activeTab === 'METRICS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-400 block">Total Customers</span>
              <span className="text-xl font-black text-slate-900">{totalCustomers}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-400 block">System Accounts</span>
              <span className="text-xl font-black text-slate-900">{totalAccounts}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <ArrowDownCircle className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-400 block">System Deposits</span>
              <span className="text-lg font-black text-slate-900">
                {currencySymbol}{totalDeposits.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                <ArrowUpCircle className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-400 block">System Outflows</span>
              <span className="text-lg font-black text-slate-900">
                {currencySymbol}{totalWithdrawals.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Customers */}
      {activeTab === 'CUSTOMERS' && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{u.fullName}</h4>
                <p className="text-xs text-slate-400 font-mono">{u.email}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Accounts / Freeze controls */}
      {activeTab === 'ACCOUNTS' && (
        <div className="space-y-2.5">
          {accounts.map((acc) => {
            const isSuspended = acc.status === 'SUSPENDED';
            return (
              <div key={acc.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block">{acc.accountNumber}</span>
                    <span className="text-[11px] text-slate-400">{acc.accountType} • Balance: {currencySymbol}{acc.balance.toLocaleString()}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {acc.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  {isSuspended ? (
                    <button
                      onClick={() => handleOpenAction(acc.id, 'ACTIVE', acc.accountNumber)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Reactivate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenAction(acc.id, 'SUSPENDED', acc.accountNumber)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Freeze Account</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Audit */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-700">{log.action}</span>
                <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-600 text-[11px]">{log.details}</p>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>By: {log.actorEmail}</span>
                <span>IP: {log.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Freeze Reason Modal */}
      {modalAction.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {modalAction.targetStatus === 'SUSPENDED' ? 'Freeze Account' : 'Reactivate Account'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">{modalAction.accountNumber}</p>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Reason</label>
                <textarea
                  required
                  placeholder="State reason for policy record..."
                  value={modalAction.reason}
                  onChange={(e) => setModalAction((prev) => ({ ...prev, reason: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-600 h-20"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalAction((prev) => ({ ...prev, isOpen: false }))}
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
