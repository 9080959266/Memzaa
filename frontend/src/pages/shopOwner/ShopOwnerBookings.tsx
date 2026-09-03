import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { IBooking } from '../../types';

export const ShopOwnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/bookings/studio-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Bookings error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { bookingStatus: newStatus });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredBookings = filterStatus === 'All'
    ? bookings
    : bookings.filter(b => b.bookingStatus === filterStatus.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Calendar & Schedules</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Photoshoot Bookings Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Accept, reschedule or mark photoshoot milestones completed</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['All', 'Confirmed', 'In_Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterStatus === st ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading studio bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No bookings match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">#{b.bookingId}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                    {b.bookingStatus}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Created {new Date(b.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{b.packageId?.title || 'Photoshoot Session'}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{b.customerId?.name} ({b.customerId?.phone})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{b.eventDate} ({b.timeSlot})</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{b.venue?.address} ({b.venue?.venueType})</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded-xl border border-slate-800">
                    Client Note: "{b.notes}"
                  </p>
                )}
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className="text-base font-black text-white">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Advance: ₹{b.advanceAmount}</span>
                </div>

                <div className="flex items-center gap-2">
                  {b.bookingStatus !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(b._id, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
