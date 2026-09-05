import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Phone,
  Layers,
  Camera,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

import api from '../../api/client';
import {
  IBooking,
  IPhotoshootCategory,
  IStudio,
} from '../../types';

import { StudioCard } from '../../components/customer/StudioCard';

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [studios, setStudios] = useState<IStudio[]>([]);

  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingStudios, setIsLoadingStudios] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');

  // -----------------------------
  // Fetch existing bookings
  // -----------------------------
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoadingBookings(true);

        const res = await api.get('/bookings/my-bookings');

        if (res.data?.success) {
          setBookings(res.data.bookings || []);
        }
      } catch (error) {
        console.error('Fetch bookings error:', error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // -----------------------------
  // Fetch photoshoot categories
  // -----------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');

        if (res.data?.success) {
          setCategories(res.data.categories || []);
        }
      } catch (error) {
        console.error('Fetch categories error:', error);
      }
    };

    fetchCategories();
  }, []);

  // -----------------------------
  // Fetch studios based on category
  // -----------------------------
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setIsLoadingStudios(true);

        const endpoint =
          selectedCategory === 'All'
            ? '/studios?limit=6'
            : `/studios?category=${encodeURIComponent(
                selectedCategory
              )}&limit=12`;

        const res = await api.get(endpoint);

        if (res.data?.success) {
          setStudios(res.data.studios || []);
        } else {
          setStudios([]);
        }
      } catch (error) {
        console.error('Fetch studios error:', error);
        setStudios([]);
      } finally {
        setIsLoadingStudios(false);
      }
    };

    fetchStudios();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* =====================================================
          PHOTOSHOOT DISCOVERY
      ====================================================== */}
      <section
        id="photoshoot-discovery"
        className="space-y-7"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
              Capture Your Special Moments
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
              Find Your Perfect Photoshoot
            </h1>

            <p className="text-sm text-slate-500 mt-2 max-w-2xl">
              Choose your photoshoot type and discover matching photo
              studios, packages and booking options.
            </p>
          </div>

          <Link
            to="/studios"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
          >
            Browse All Studios
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Choose Photoshoot Type
              </h2>
            </div>

            <Link
              to="/categories"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {/* All */}
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`text-left bg-white rounded-2xl border p-4 transition ${
                selectedCategory === 'All'
                  ? 'border-amber-500 shadow-lg ring-2 ring-amber-100'
                  : 'border-slate-200 hover:border-amber-400 hover:shadow-lg'
              }`}
            >
              <div className="w-full aspect-square rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <Camera className="w-10 h-10 text-amber-500" />
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                All Photoshoots
              </h3>

              <p className="text-[11px] text-slate-500 mt-1">
                Explore all studios
              </p>
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category._id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`text-left bg-white rounded-2xl border p-4 transition ${
                  selectedCategory === category.slug
                    ? 'border-amber-500 shadow-lg ring-2 ring-amber-100'
                    : 'border-slate-200 hover:border-amber-400 hover:shadow-lg'
                }`}
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-10 h-10 text-amber-500" />
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {category.name}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  {category.packageCount
                    ? `${category.packageCount} Packages`
                    : 'Explore Studios'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected category */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <span className="text-xs text-slate-600">
            Showing studios for:{' '}
          </span>

          <span className="text-xs font-black text-amber-700">
            {selectedCategory === 'All'
              ? 'All Photoshoots'
              : categories.find(
                  (category) =>
                    category.slug === selectedCategory
                )?.name || selectedCategory}
          </span>
        </div>

        {/* Studios */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
                {selectedCategory === 'All'
                  ? 'Featured Studios'
                  : 'Matching Studios'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Photo Studios & Shops
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Select a studio to view packages and book your photoshoot.
              </p>
            </div>

            <Link
              to={
                selectedCategory === 'All'
                  ? '/studios'
                  : `/studios?category=${encodeURIComponent(
                      selectedCategory
                    )}`
              }
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View More
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingStudios ? (
            <div className="bg-white border border-slate-200 rounded-3xl py-16 text-center">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-semibold">
                Finding studios...
              </p>
            </div>
          ) : studios.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl py-14 px-8 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                No Studios Found
              </h3>

              <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
                No studios are currently available for this photoshoot
                category.
              </p>

              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="mt-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition"
              >
                Explore All Studios
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studios.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          MY BOOKINGS
      ====================================================== */}
      <section className="space-y-6">
        <div className="border-b border-slate-200/80 pb-4">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Scheduled Sessions
          </span>

          <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            My Photoshoot Bookings
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Manage your upcoming shoots, venue details, and payment summary.
          </p>
        </div>

        {isLoadingBookings ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-semibold">
              Loading your bookings...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              No Photoshoot Sessions Booked
            </h3>

            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2">
              Choose a photoshoot type above, select a studio and explore
              the available packages.
            </p>

            <a
              href="#photoshoot-discovery"
              className="inline-flex items-center gap-2 mt-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition"
            >
              Explore Photoshoot
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const studio = booking.studioId;
              const pkg = booking.packageId;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        #{booking.bookingId}
                      </span>

                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {pkg?.title || 'Photoshoot Package'}
                      </h3>

                      <Link
                        to={`/studios/${studio?._id}`}
                        className="text-xs text-amber-700 font-semibold hover:text-amber-800"
                      >
                        {studio?.name || 'Studio'}
                      </Link>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>
                          {booking.eventDate} ({booking.timeSlot})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>
                          {booking.venue?.address || 'Venue'}
                          {booking.venue?.city
                            ? `, ${booking.venue.city}`
                            : ''}
                          {booking.venue?.venueType
                            ? ` (${booking.venue.venueType})`
                            : ''}
                        </span>
                      </div>

                      {studio?.phone && (
                        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Studio Contact: {studio.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">
                        Total Package Value
                      </span>

                      <span className="text-sm font-black text-slate-900">
                        ₹{booking.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-emerald-600 font-bold block text-[11px]">
                        Advance Paid: ₹
                        {booking.advanceAmount.toLocaleString('en-IN')}
                      </span>

                      <span className="text-slate-500 text-[10px]">
                        Due on shoot: ₹
                        {booking.remainingAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};