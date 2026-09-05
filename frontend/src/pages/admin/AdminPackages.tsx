import React, { useState, useEffect } from 'react';
import { Layers, Search, CheckCircle2, XCircle, Clock, Camera, Plus, Edit3, Trash2 } from 'lucide-react';
import api from '../../api/client';
import { Modal } from '../../components/common/Modal';

export const AdminPackages: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [studioId, setStudioId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [durationHours, setDurationHours] = useState('2');
  const [editedPhotosCount, setEditedPhotosCount] = useState('25');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/packages');
      if (res.data.success) {
        setPackages(res.data.packages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        api.get('/studios?status=all&limit=50'),
        api.get('/categories')
      ]);
      if (sRes.data.success) setStudios(sRes.data.studios || []);
      if (cRes.data.success) setCategories(cRes.data.categories || []);
    } catch (e) {
      console.error('Failed to load studios/categories:', e);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchMeta();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setTitle('');
    setStudioId(studios[0]?._id || '');
    setCategoryId(categories[0]?._id || '');
    setPrice('');
    setDiscountPrice('');
    setDurationHours('2');
    setEditedPhotosCount('25');
    setDescription('');
    setBannerImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: any) => {
    setEditingPkg(pkg);
    setTitle(pkg.title || '');
    setStudioId(pkg.studioId?._id || pkg.studioId || '');
    setCategoryId(pkg.categoryId?._id || pkg.categoryId || '');
    setPrice(String(pkg.price || ''));
    setDiscountPrice(pkg.discountPrice ? String(pkg.discountPrice) : '');
    setDurationHours(String(pkg.durationHours || 2));
    setEditedPhotosCount(String(pkg.editedPhotosCount || 25));
    setDescription(pkg.description || '');
    setBannerImage(pkg.bannerImage || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        title,
        studioId,
        categoryId,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        durationHours: Number(durationHours),
        editedPhotosCount: Number(editedPhotosCount),
        description,
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      };

      if (editingPkg) {
        await api.put(`/packages/${editingPkg._id}`, payload);
      } else {
        await api.post('/packages', payload);
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, pkgTitle: string) => {
    if (!confirm(`Are you sure you want to deactivate package "${pkgTitle}"?`)) return;
    try {
      await api.delete(`/packages/${id}`);
      fetchPackages();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete package');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.put(`/admin/packages/${id}/toggle-status`);
      fetchPackages();
    } catch (e) {
      alert('Failed to toggle package status');
    }
  };

  const filtered = packages.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.studioId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && p.isActive !== false) ||
      (statusFilter === 'Paused' && p.isActive === false);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Shoot Catalogue</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Photoshoot Packages</h1>
          <p className="text-xs text-slate-400 mt-0.5">Audit, add, edit, or pause packages offered by partner photography studios</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search packages by title, studio or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['All', 'Active', 'Paused'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === st ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading platform packages...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No photoshoot packages match your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {pkg.categoryId?.name || 'Photography'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    pkg.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {pkg.isActive !== false ? 'Active' : 'Paused'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{pkg.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pkg.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Camera className="w-3.5 h-3.5 text-purple-400" />
                    <span>Studio: <strong className="text-white">{pkg.studioId?.name}</strong> ({pkg.studioId?.city})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Duration: {pkg.durationHours} Hours • {pkg.editedPhotosCount} Edited Retouches</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-purple-400">
                    ₹{(pkg.discountPrice || pkg.price)?.toLocaleString('en-IN')}
                  </span>
                  {pkg.discountPrice && (
                    <span className="text-xs text-slate-500 line-through ml-2">
                      ₹{pkg.price?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition"
                    title="Edit Package"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pkg._id, pkg.title)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                    title="Deactivate Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(pkg._id)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition ${
                      pkg.isActive !== false
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {pkg.isActive !== false ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPkg ? `Edit Package: ${editingPkg.title}` : "Add New Photoshoot Package"}
          subtitle="Configure package deliverables, photoshoot category, and studio partner"
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Package Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Heritage Wedding Cinema"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Studio *</label>
                <select
                  required
                  value={studioId}
                  onChange={(e) => setStudioId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Select Studio</option>
                  {studios.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Regular Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Discount Price (₹)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Duration (Hours) *</label>
                <input
                  type="number"
                  required
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Retouched Photos *</label>
                <input
                  type="number"
                  required
                  value={editedPhotosCount}
                  onChange={(e) => setEditedPhotosCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-semibold text-slate-400 hover:text-white rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md"
              >
                {isSubmitting ? 'Saving...' : editingPkg ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

