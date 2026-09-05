import React, { useState, useEffect } from 'react';
import { Settings, Shield, Percent, Bell, CheckCircle2, Save, AlertTriangle } from 'lucide-react';
import api from '../../api/client';

export const AdminSettings: React.FC = () => {
  const [platformFee, setPlatformFee] = useState(10);
  const [gstRate, setGstRate] = useState(18);
  const [autoApproveStudios, setAutoApproveStudios] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minPayoutThreshold, setMinPayoutThreshold] = useState(1000);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/settings');
        if (res.data.success) {
          const s = res.data.settings;
          setPlatformFee(s.platformFeePercent || 10);
          setGstRate(s.gstRatePercent || 18);
          setAutoApproveStudios(Boolean(s.autoApproveStudios));
          setEmailNotifications(Boolean(s.emailNotifications));
          setSmsNotifications(Boolean(s.smsNotifications));
          setMaintenanceMode(Boolean(s.maintenanceMode));
          setMinPayoutThreshold(s.minPayoutThreshold || 1000);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', {
        platformFeePercent: Number(platformFee),
        gstRatePercent: Number(gstRate),
        autoApproveStudios,
        emailNotifications,
        smsNotifications,
        maintenanceMode,
        minPayoutThreshold: Number(minPayoutThreshold)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">System Administration</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Governance & Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Control commission rates, taxation rules, studio onboarding verification, and system security</p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Platform configuration updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl text-xs">
        {/* Fee & Tax Rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-purple-400" />
            Platform Fee & Taxation
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Platform Commission Rate (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Deducted automatically from studio orders</span>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Applicable GST Rate (%)</label>
              <input
                type="number"
                min="0"
                max="28"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Tax invoice computation on photoshoot advance</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Minimum Studio Payout Threshold (₹)</label>
            <input
              type="number"
              value={minPayoutThreshold}
              onChange={(e) => setMinPayoutThreshold(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Operational Policies */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            Verification & Studio Onboarding
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <strong className="text-white block">Auto-Approve Studio Partners</strong>
              <span className="text-[11px] text-slate-400">If disabled, all newly registered studios require admin review</span>
            </div>
            <button
              type="button"
              onClick={() => setAutoApproveStudios(!autoApproveStudios)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${autoApproveStudios ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <strong className="text-white block">Email Dispatch Notifications</strong>
              <span className="text-[11px] text-slate-400">Send transactional receipts and booking schedules via email</span>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${emailNotifications ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <strong className="text-rose-400 block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Maintenance Mode
              </strong>
              <span className="text-[11px] text-slate-400">Temporary lock on public checkout during database upgrades</span>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${maintenanceMode ? 'bg-rose-600 justify-end' : 'bg-slate-800 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-purple-600/30 transition text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
