import React, { useState, useEffect } from 'react';
import { Settings, Building, CreditCard, Bell, Shield, CheckCircle2, Save } from 'lucide-react';
import api from '../../api/client';

export const ShopOwnerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'payouts' | 'notifications' | 'security'>('business');

  // Business State
  const [businessName, setBusinessName] = useState('Lumière Weddings & Cinematography');
  const [gstin, setGstin] = useState('33AAAAA0000A1Z5');
  const [pan, setPan] = useState('ABCDE1234F');
  const [address, setAddress] = useState('128, Studio Lane, Anna Nagar, Chennai - 600040');

  // Payout State
  const [accountHolder, setAccountHolder] = useState('Lumiere Photo Ventures Pvt Ltd');
  const [accountNumber, setAccountNumber] = useState('50200012345678');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [bankName, setBankName] = useState('HDFC Bank');

  // Notification Toggles
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifProofs, setNotifProofs] = useState(true);
  const [notifPayouts, setNotifPayouts] = useState(true);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Studio Partner Settings</h1>
        <p className="text-slate-400 text-xs mt-1">
          Manage your business information, bank settlement accounts, alert preferences, and credentials.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Settings updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'business', label: 'Business & Tax Profile', icon: Building },
          { id: 'payouts', label: 'Bank Settlement & Payouts', icon: CreditCard },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'security', label: 'Account Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Business & Tax Profile */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveBusiness} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Registered Entity Details</h3>
          <div>
            <label className="block text-slate-300 font-bold mb-1">Trade / Studio Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">GSTIN Number</label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                required
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Billing & Studio Address</label>
            <textarea
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Bank Settlement & Payouts */}
      {activeTab === 'payouts' && (
        <form onSubmit={handleSaveBusiness} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl space-y-4 text-xs">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-300 mb-2">
            <span className="font-bold block">Fortnightly Direct Settlements</span>
            <p className="text-[11px] text-amber-400/80 mt-0.5">
              Net customer shoot advances and keepsakes payments are transferred automatically on the 1st and 15th of every month.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Account Beneficiary Name</label>
            <input
              type="text"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Bank Account Number</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">IFSC Code</label>
              <input
                type="text"
                required
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Bank Name & Branch</label>
            <input
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Update Bank Details</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Real-Time Studio Notifications</h3>
          {[
            { id: 'notifBookings', title: 'New Photoshoot Bookings', desc: 'Alert when client books a wedding or event slot', val: notifBookings, set: setNotifBookings },
            { id: 'notifOrders', title: 'New Keepsake Orders', desc: 'Alert when custom frames or layflat albums are ordered', val: notifOrders, set: setNotifOrders },
            { id: 'notifProofs', title: 'Customer Proof Approvals & Changes', desc: 'Immediate ping when client approves or requests revisions', val: notifProofs, set: setNotifProofs },
            { id: 'notifPayouts', title: 'Bank Settlement Confirmations', desc: 'UTR number dispatched when fortnightly transfer completes', val: notifPayouts, set: setNotifPayouts },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => item.set(!item.val)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${item.val ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'}`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleSaveBusiness} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Change Password</h3>
          <div>
            <label className="block text-slate-300 font-bold mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
