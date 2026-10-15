import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ShieldCheck,
  Download,
  Coins,
  Shield,
  User,
  Check,
} from 'lucide-react';

interface AccountScreenProps {
  onOpenAdmin: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onOpenAdmin }) => {
  const {
    currentUser,
    currencySymbol,
    toggleCurrency,
    downloadCsvStatement,
    updateProfile,
    accounts,
  } = useBanking();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateProfile(fullName.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="pt-1">
        <h2 className="text-lg font-bold text-slate-900">Account & Settings</h2>
        <p className="text-xs text-slate-400 font-medium">Profile, security, and preferences</p>
      </div>

      {/* User Profile Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'}
          alt={currentUser.fullName}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-slate-900">{currentUser.fullName}</h3>
            <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2555EA]">
            KYC VERIFIED
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Information</h4>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2555EA]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#2555EA] hover:bg-blue-600 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? 'Saved!' : 'Update Profile'}</span>
          </button>
        </form>
      </div>

      {/* Quick Preferences: Currency & Statement */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm divide-y divide-slate-100 text-xs">
        {/* Currency Switcher */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2555EA] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Currency Standard</span>
              <span className="text-[11px] text-slate-400">Indian Rupee (₹ / INR)</span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2555EA] dark:text-blue-400 font-bold font-mono text-xs">
            ₹ INR (Bharat Default)
          </span>
        </div>

        {/* Download CSV Statement */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Export Statement</span>
              <span className="text-[11px] text-slate-400">Official CSV ledger download</span>
            </div>
          </div>
          <button
            onClick={() => downloadCsvStatement(accounts[0]?.id || 1)}
            className="px-3 py-1.5 rounded-xl bg-[#2555EA] text-white font-semibold text-xs shadow-sm"
          >
            Download
          </button>
        </div>
      </div>

      {/* Switch to Admin Console */}
      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-900">Admin Governance</h4>
            <p className="text-[11px] text-purple-600">Freeze controls, customer search, audit logs</p>
          </div>
        </div>

        <button
          onClick={onOpenAdmin}
          className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition"
        >
          Open
        </button>
      </div>
    </div>
  );
};
