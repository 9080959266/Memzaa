import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit3, CheckCircle2, Clock, Camera } from 'lucide-react';
import api from '../../api/client';
import { IPackage } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ShopOwnerPackages: React.FC = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(15000);
  const [discountPrice, setDiscountPrice] = useState(12999);
  const [durationHours, setDurationHours] = useState(3);
  const [editedPhotosCount, setEditedPhotosCount] = useState(30);
  const [rawPhotosCount, setRawPhotosCount] = useState(300);
  const [deliverablesText, setDeliverablesText] = useState('Velvet Photo Album (30 pages)\n30 Retouched High-Res Photos\nOnline Cloud Access');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const [pkgRes, catRes] = await Promise.all([
        api.get('/studios/my-studio'),
        api.get('/categories')
      ]);

      if (pkgRes.data.success) {
        setPackages(pkgRes.data.packages || []);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories || []);
        if (catRes.data.categories?.length > 0) {
          setCategoryId(catRes.data.categories[0]._id);
        }
      }
    } catch (err) {
      console.error('Packages fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const deliverables = deliverablesText.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        title,
        categoryId,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        durationHours: Number(durationHours),
        editedPhotosCount: Number(editedPhotosCount),
        rawPhotosCount: Number(rawPhotosCount),
        deliverables
      };

      const res = await api.post('/packages', payload);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchPackages();
        setTitle('');
        setDescription('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      fetchPackages();
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Service Catalog</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Photoshoot Packages & Pricing</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage session durations, deliverable items, and advance booking rates</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Package
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-3">
          <p className="text-xs text-slate-400">No packages created yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
          >
            Add Your First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      {pkg.categoryId?.name || 'Category'}
                    </span>
                    <h3 className="text-base font-bold text-white">{pkg.title}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-white font-mono">
                      ₹{(pkg.discountPrice || pkg.price).toLocaleString('en-IN')}
                    </span>
                    {pkg.discountPrice && (
                      <span className="text-xs text-slate-500 line-through block">₹{pkg.price}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{pkg.description}</p>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-wrap gap-3 text-xs text-slate-300">
                  <span>⏱️ {pkg.durationHours} Hours Session</span>
                  <span>•</span>
                  <span>✨ {pkg.editedPhotosCount} Edited Retouches</span>
                  <span>•</span>
                  <span>📷 {pkg.rawPhotosCount} Raw Shots</span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Deliverables:</span>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {pkg.deliverables?.map((d, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleDeletePackage(pkg._id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Package Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Photoshoot Package"
          subtitle="Define session pricing, deliverable items, and shoot duration"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreatePackage} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Package Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Heritage Wedding Extravaganza"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photoshoot Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offer / Discount Price (₹)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Edited Retouched Photos Count</label>
                <input
                  type="number"
                  value={editedPhotosCount}
                  onChange={(e) => setEditedPhotosCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Raw Photos Delivered Count</label>
                <input
                  type="number"
                  value={rawPhotosCount}
                  onChange={(e) => setRawPhotosCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deliverables Included (One per line)</label>
              <textarea
                rows={3}
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Package Description</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of session style and highlights"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
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
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md"
              >
                {isSubmitting ? 'Creating...' : 'Publish Package'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
