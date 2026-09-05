import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, CheckCircle2, User, Camera } from 'lucide-react';
import api from '../../api/client';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/bookings/${id}/status`, { bookingStatus: newStatus });
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.studioId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Master Ledger</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Photoshoot Bookings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time oversight of all scheduled and completed studio bookings across India</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['All', 'Confirmed', 'In_Progress', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === st ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Booking ID, customer or studio name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading platform bookings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No photoshoot bookings match your search or filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-purple-400">#{b.bookingId}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    b.bookingStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {b.bookingStatus?.replace('_', ' ')}
                  </span>
                  <select
                    value={b.bookingStatus}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-0.5 outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{b.packageId?.title || 'Photoshoot Package'}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  Studio: <strong className="text-slate-200">{b.studioId?.name} ({b.studioId?.city})</strong>
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  Customer: <strong className="text-slate-200">{b.customerId?.name} ({b.customerId?.phone})</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Advance (20%)</span>
                  <span className="font-bold text-emerald-400">₹{b.advanceAmount?.toLocaleString('en-IN')} (Paid)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Package</span>
                  <span className="font-bold text-white">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {b.eventDate} ({b.timeSlot})
                </span>
                <span className="truncate max-w-[160px] text-slate-500">{b.venue?.address}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
