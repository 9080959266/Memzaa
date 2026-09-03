import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { IBooking } from '../../types';

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Fetch bookings error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Scheduled Sessions</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">My Photoshoot Bookings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your upcoming shoots, venue details, and advance receipts</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Photoshoot Sessions Booked</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore verified photo studios for wedding rituals, pre-wedding romantic shoots, and newborn baby portraits!
          </p>
          <Link
            to="/studios"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
          >
            Explore Studios & Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => {
            const studio = b.studioId;
            const pkg = b.packageId;

            return (
              <div
                key={b._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: ID and Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      #{b.bookingId}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                      {b.bookingStatus}
                    </span>
                  </div>

                  {/* Studio & Package Header */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{pkg?.title || 'Photoshoot Package'}</h3>
                    <p className="text-xs text-amber-700 font-semibold">{studio?.name}</p>
                  </div>

                  {/* Event Date & Time */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{b.eventDate} ({b.timeSlot})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{b.venue?.address}, {b.venue?.city} ({b.venue?.venueType})</span>
                    </div>
                    {studio?.phone && (
                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Studio Contact: {studio.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total Package Value</span>
                    <span className="text-sm font-black text-slate-900">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-600 font-bold block text-[11px]">Advance Paid: ₹{b.advanceAmount.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 text-[10px]">Due on shoot: ₹{b.remainingAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
