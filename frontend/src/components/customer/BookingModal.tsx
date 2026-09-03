import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { IPackage, IStudio } from '../../types';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: IPackage | null;
  studio: IStudio | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  pkg,
  studio,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const [timeSlot, setTimeSlot] = useState('10:00 AM - 02:00 PM');
  const [venueType, setVenueType] = useState<'studio' | 'outdoor' | 'customer_home' | 'resort_hotel' | 'temple_hall'>('studio');
  const [venueAddress, setVenueAddress] = useState(studio?.address || '');
  const [landmark, setLandmark] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [phone, setPhone] = useState(user?.phone || '+91 ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  if (!pkg || !studio) return null;

  const totalAmount = pkg.discountPrice || pkg.price;
  const advancePercentage = pkg.advancePercentage || 20;
  const advanceAmount = Math.round((totalAmount * advancePercentage) / 100);
  const remainingAmount = totalAmount - advanceAmount;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=booking');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        packageId: pkg._id,
        eventDate,
        timeSlot,
        venue: {
          address: venueType === 'studio' ? studio.address : venueAddress,
          city: studio.city,
          landmark,
          pincode: '600001',
          venueType
        },
        phone,
        specialRequests
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setBookingSuccess(res.data.booking);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setBookingSuccess(null);
    navigate('/bookings');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={bookingSuccess ? handleFinish : onClose}
      title={bookingSuccess ? 'Booking Confirmed! 🎉' : `Book Photoshoot with ${studio.name}`}
      subtitle={bookingSuccess ? `Your booking ID is ${bookingSuccess.bookingId}` : pkg.title}
      maxWidth="2xl"
    >
      {bookingSuccess ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h3 className="text-xl font-black text-slate-900">
            Booking #{bookingSuccess.bookingId} Reserved!
          </h3>
          <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            We have confirmed your shoot for <strong className="text-slate-900">{bookingSuccess.eventDate} ({bookingSuccess.timeSlot})</strong>. The studio owner has been notified and will contact you for coordination.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-6 text-left max-w-md mx-auto">
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate-500">Photoshoot Package</span>
              <span className="font-semibold text-slate-900">{pkg.title}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate-500">Advance Paid (20%)</span>
              <span className="font-bold text-emerald-600">₹{advanceAmount.toLocaleString('en-IN')} (Success)</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-t border-slate-200 mt-2 pt-2">
              <span className="text-slate-500">Balance on Shoot Day</span>
              <span className="font-bold text-slate-900">₹{remainingAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleFinish}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
            >
              View My Bookings
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-5">
          {/* Selected Package Summary Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Selected Package</span>
              <h4 className="text-sm font-bold text-slate-900">{pkg.title}</h4>
              <p className="text-xs text-slate-600">{pkg.durationHours} Hours Session • {pkg.editedPhotosCount} Edited Digital Retouches</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-amber-700 block font-semibold">Advance: ₹{advanceAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Choose Event Date *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Select Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              >
                <option value="06:00 AM - 10:00 AM">Morning Golden Hour (06:00 AM - 10:00 AM)</option>
                <option value="10:00 AM - 02:00 PM">Daytime Slot (10:00 AM - 02:00 PM)</option>
                <option value="03:00 PM - 07:00 PM">Evening Sunset (03:00 PM - 07:00 PM)</option>
                <option value="06:00 AM - 06:00 PM">Full Day Ritual Coverage (Full Day)</option>
              </select>
            </div>
          </div>

          {/* Venue Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Shoot Venue / Location Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'studio', label: 'At Studio Premises' },
                { type: 'outdoor', label: 'Outdoor / Beach' },
                { type: 'customer_home', label: 'Client Home' },
                { type: 'temple_hall', label: 'Temple / Marriage Hall' },
                { type: 'resort_hotel', label: 'Resort / Heritage Hotel' }
              ].map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVenueType(v.type as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition ${
                    venueType === v.type
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Address (if outside studio) */}
          {venueType !== 'studio' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Venue Address & Landmark *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Santhome Hall, ECR Beach Resort, Anna Nagar Residence"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          )}

          {/* Contact Phone & Special Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Requests / Themes (Optional)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Traditional yellow silk drape theme"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Total Package Cost</span>
              <span className="font-semibold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-amber-700">
              <span>Payable Now ({advancePercentage}% Advance Deposit)</span>
              <span className="text-sm">₹{advanceAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-2">
              <span>Remaining Balance (Due on shoot date)</span>
              <span>₹{remainingAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {isSubmitting ? 'Confirming Booking...' : `Pay ₹${advanceAmount.toLocaleString('en-IN')} Advance & Confirm`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
