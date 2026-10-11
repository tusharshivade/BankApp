import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { UserCheck, ShieldCheck, Mail, Calendar, KeyRound, Check } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile } = useBanking();
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateProfile(fullName.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-blue-400" />
          Customer Profile & Settings
        </h1>
        <p className="text-xs text-slate-400">
          Manage your personal details and view KYC security status.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-blue-600/30">
            {currentUser.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentUser.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                KYC VERIFIED
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Role: {currentUser.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Registered Email (Primary Authentication)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-slate-400 text-sm font-mono cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Email address cannot be changed in demo mode.</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              {isSaved ? <Check className="w-4 h-4 text-white" /> : null}
              <span>{isSaved ? 'Changes Saved!' : 'Save Profile Changes'}</span>
            </button>

            <span className="text-xs text-slate-500">ID #{currentUser.id}</span>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-xs text-slate-400 space-y-2">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          Security Credentials
        </h4>
        <p>Password hashing is handled via BCrypt (10 rounds). Tokens are signed using HMAC-SHA256 (JWT).</p>
      </div>
    </div>
  );
};
