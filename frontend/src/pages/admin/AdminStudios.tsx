import React, { useState, useEffect } from 'react';
import { 
  Store, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Eye, 
  Edit3, 
  Phone, 
  Mail, 
  Clock, 
  Power,
  Sparkles 
} from 'lucide-react';
import api from '../../api/client';
import { IStudio } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminStudios: React.FC = () => {
  const [studios, setStudios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedStudio, setSelectedStudio] = useState<any | null>(null);
  const [editingStudio, setEditingStudio] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStartingPrice, setEditStartingPrice] = useState('');
  const [editTagline, setEditTagline] = useState('');

  const fetchStudios = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/studios?status=all&limit=50');
      if (res.data.success) {
        setStudios(res.data.studios || []);
      }
    } catch (err) {
      console.error('Fetch studios error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/studios/${id}/moderate`, { status });
      fetchStudios();
      if (selectedStudio && selectedStudio._id === id) {
        setSelectedStudio({ ...selectedStudio, verifiedStatus: status });
      }
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.put(`/studios/${id}/toggle-active`);
      fetchStudios();
      if (selectedStudio && selectedStudio._id === id) {
        setSelectedStudio({ ...selectedStudio, isActive: !selectedStudio.isActive });
      }
    } catch (err) {
      alert('Failed to toggle active status');
    }
  };

  const openEditModal = (studio: any) => {
    setEditingStudio(studio);
    setEditName(studio.name || '');
    setEditCity(studio.city || '');
    setEditAddress(studio.address || '');
    setEditPhone(studio.phone || '');
    setEditEmail(studio.email || '');
    setEditStartingPrice(String(studio.startingPrice || 5000));
    setEditTagline(studio.tagline || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudio) return;
    try {
      setIsSubmitting(true);
      await api.put(`/studios/${editingStudio._id}/admin-update`, {
        name: editName,
        city: editCity,
        address: editAddress,
        phone: editPhone,
        email: editEmail,
        startingPrice: Number(editStartingPrice),
        tagline: editTagline,
      });
      setEditingStudio(null);
      fetchStudios();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update studio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = studios.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.verifiedStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Partner Verification & Control</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Studio Verification & Moderation</h1>
          <p className="text-xs text-slate-400 mt-0.5">Approve, reject, activate/deactivate, and manage photography studio partners across India</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['All', 'Approved', 'Pending', 'Rejected'].map((st) => (
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

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search studios by name, city or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading studios directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No studios match your search or filter.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">Studio Information</th>
                <th className="p-4">City</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Listing State</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img src={s.logoImage} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        {s.name}
                        {s.featured && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black">Featured</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400">{s.phone} • {s.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">{s.city}</td>
                  <td className="p-4 font-bold text-amber-400">⭐ {s.rating.toFixed(1)} ({s.reviewCount})</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {s.isActive !== false ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      s.verifiedStatus === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : s.verifiedStatus === 'pending'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {s.verifiedStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedStudio(s)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition inline-flex items-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs transition inline-flex items-center gap-1"
                      title="Edit Studio"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(s._id)}
                      className={`font-bold px-2.5 py-1 rounded-lg text-xs transition ${
                        s.isActive !== false
                          ? 'bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                      title={s.isActive !== false ? 'Deactivate from search' : 'Activate in search'}
                    >
                      {s.isActive !== false ? 'Pause' : 'Activate'}
                    </button>
                    {s.verifiedStatus !== 'approved' ? (
                      <button
                        type="button"
                        onClick={() => handleModerate(s._id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleModerate(s._id, 'rejected')}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Studio Details Modal */}
      {selectedStudio && (
        <Modal
          isOpen={!!selectedStudio}
          onClose={() => setSelectedStudio(null)}
          title={selectedStudio.name}
          subtitle={`${selectedStudio.city} • Starting ₹${selectedStudio.startingPrice?.toLocaleString('en-IN')}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img src={selectedStudio.bannerImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center gap-3">
                  <img src={selectedStudio.logoImage} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500" />
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedStudio.name}</h3>
                    <p className="text-purple-300 text-xs">{selectedStudio.tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">{selectedStudio.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 font-bold block">City & Address</span>
                <span className="text-white font-semibold">{selectedStudio.address}, {selectedStudio.city}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Contact Information</span>
                <span className="text-white">{selectedStudio.phone} • {selectedStudio.email}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Operating Hours</span>
                <span className="text-white">{selectedStudio.operatingHours?.open} - {selectedStudio.operatingHours?.close}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Rating</span>
                <span className="text-amber-400 font-bold">⭐ {selectedStudio.rating} ({selectedStudio.reviewCount} reviews)</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Verification Status</span>
                <span className={`font-black uppercase ${
                  selectedStudio.verifiedStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedStudio.verifiedStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Listing Active</span>
                <span className={`font-black ${
                  selectedStudio.isActive !== false ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedStudio.isActive !== false ? 'Yes (Visible in Search)' : 'No (Hidden)'}
                </span>
              </div>
            </div>

            {selectedStudio.portfolio && selectedStudio.portfolio.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Portfolio Samples</span>
                <div className="grid grid-cols-3 gap-2">
                  {selectedStudio.portfolio.slice(0, 3).map((p: any, idx: number) => (
                    <div key={idx} className="h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleActive(selectedStudio._id)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                {selectedStudio.isActive !== false ? 'Deactivate from Search' : 'Activate Studio Listing'}
              </button>
              {selectedStudio.verifiedStatus !== 'approved' ? (
                <button
                  type="button"
                  onClick={() => handleModerate(selectedStudio._id, 'approved')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Approve Studio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleModerate(selectedStudio._id, 'rejected')}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Reject / Suspend Studio
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Studio Information Modal */}
      {editingStudio && (
        <Modal
          isOpen={!!editingStudio}
          onClose={() => setEditingStudio(null)}
          title={`Edit Studio: ${editingStudio.name}`}
          subtitle="Update studio partner contact, city, starting price and tagline"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Studio Name *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Starting Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={editStartingPrice}
                  onChange={(e) => setEditStartingPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Phone *</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Tagline</label>
              <input
                type="text"
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingStudio(null)}
                className="px-4 py-2 text-slate-400 hover:text-white rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-xl transition shadow-md"
              >
                {isSubmitting ? 'Saving...' : 'Save Studio Info'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

