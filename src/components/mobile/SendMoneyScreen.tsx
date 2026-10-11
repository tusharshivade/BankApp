import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowLeft,
  MoreVertical,
  Search,
  ArrowRight,
  DollarSign,
  ArrowRightLeft,
  CreditCard,
  FileText,
  Smartphone,
  Lightbulb,
  Wallet,
  FileSpreadsheet,
  Receipt,
  Landmark,
  QrCode,
} from 'lucide-react';
import type { Contact } from '../../types/banking';

interface SendMoneyScreenProps {
  onBack: () => void;
  onSelectContact: (contact: Contact) => void;
  onOpenStatement: () => void;
  onOpenAccounts: () => void;
  onCustomTransfer: () => void;
}

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({
  onBack,
  onSelectContact,
  onOpenStatement,
  onOpenAccounts,
  onCustomTransfer,
}) => {
  const { contacts, showToast } = useBanking();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.accountNumber.includes(searchQuery)
  );

  const services = [
    { id: 'accounts', label: 'Accounts', icon: DollarSign, onClick: onOpenAccounts },
    { id: 'transfer', label: 'Transfer', icon: ArrowRightLeft, onClick: onCustomTransfer },
    { id: 'cards', label: 'Cards', icon: CreditCard, onClick: onOpenAccounts },
    { id: 'statement', label: 'Statement', icon: FileText, onClick: onOpenStatement },
    {
      id: 'recharge',
      label: 'Recharge',
      icon: Smartphone,
      onClick: () => showToast('Mobile recharge simulation ready', 'info'),
    },
    {
      id: 'electricity',
      label: 'Electricity',
      icon: Lightbulb,
      onClick: () => showToast('Utility bill simulation ready', 'info'),
    },
    {
      id: 'upi',
      label: 'UPI',
      icon: Wallet,
      onClick: () => showToast('Instant UPI simulation active', 'info'),
    },
    {
      id: 'services',
      label: 'Services',
      icon: FileSpreadsheet,
      onClick: () => showToast('Banking services loaded', 'info'),
    },
    {
      id: 'billpay',
      label: 'Bill Pay',
      icon: Receipt,
      onClick: () => showToast('Bill pay simulation ready', 'info'),
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header: Back, Title, More */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Send Money</h2>
        <button
          onClick={() => showToast('Send options', 'info')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
          aria-label="Options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search payee or account..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2555EA] shadow-sm transition"
        />
      </div>

      {/* Recent Contacts Carousel */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Recent</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none px-1">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0 active:scale-95 transition"
            >
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={contact.avatarUrl}
                  alt={contact.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#2555EA]">
                {contact.name}
              </span>
            </div>
          ))}

          {/* Right Arrow Button */}
          <button
            onClick={() => onSelectContact(contacts[0])}
            className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 shrink-0 self-start mt-1 transition active:scale-95"
            aria-label="Next contact"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Other Payments (3x3 Grid) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-900">Other Payments</h3>
          <button
            onClick={() => showToast('All financial services available', 'info')}
            className="text-xs font-semibold text-slate-400 hover:text-[#2555EA]"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 shadow-sm transition active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:text-[#2555EA] group-hover:bg-blue-50 transition">
                  <Icon className="w-5 h-5 stroke-[1.8px]" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Pills: Send to bank, Scan QR */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onCustomTransfer}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#EBF2FE] text-[#2555EA] font-bold text-xs hover:bg-blue-100/80 transition active:scale-[0.98]"
        >
          <Landmark className="w-4 h-4" />
          <span>Send to bank</span>
        </button>

        <button
          onClick={() => showToast('Camera QR scanner opened (Simulation)', 'info')}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#EBF2FE] text-[#2555EA] font-bold text-xs hover:bg-blue-100/80 transition active:scale-[0.98]"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
};
