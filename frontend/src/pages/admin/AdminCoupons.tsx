import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../api/client';
import { ICoupon } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(499);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(2000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/coupons/admin-all');
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err) {
      console.error('Coupons error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/coupons', {
        code: code.toUpperCase(),
        description,
        discountPercent: Number(discountPercent),
        minOrderAmount: Number(minOrderAmount),
        maxDiscountAmount: Number(maxDiscountAmount),
        validTill: new Date(Date.now() + 180 * 86400000)
      });
      setIsModalOpen(false);
      setCode('');
      setDescription('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Promotion Engine</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Discount Coupon Codes</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage promotional discounts, minimum thresholds, and expiry</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                {c.code}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-300 font-semibold">{c.description}</p>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-bold text-white">{c.discountPercent > 0 ? `${c.discountPercent}% OFF` : `₹${c.flatDiscount} Flat`}</span>
              </div>
              <div className="flex justify-between">
                <span>Min Order:</span>
                <span>₹{c.minOrderAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Discount:</span>
                <span>₹{c.maxDiscountAmount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Discount Coupon"
          subtitle="Set promo code name and percentage savings"
          maxWidth="md"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
              <input
                type="text"
                required
                placeholder="e.g. FESTIVE30"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none uppercase focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Offer Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. 15% Flat Savings on Wedding Shoots"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Cap (₹)</label>
                <input
                  type="number"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
              >
                {isSubmitting ? 'Creating...' : 'Activate Coupon'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
