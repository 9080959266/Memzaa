import React, { useState } from 'react';
import {
  User as UserIcon,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
  ShoppingBag,
  Calendar,
  Image as ImageIcon,
  Heart,
  Star,
  Bell,
  CreditCard,
  FileText,
  Settings,
  HelpCircle,
  Shield,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [addresses, setAddresses] = useState(
    user?.addresses || [
      {
        label: 'Home',
        fullName: user?.name || 'User',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: true,
      },
    ]
  );

  const [showAddAddress, setShowAddAddress] = useState(false);

  const [newLabel, setNewLabel] = useState('Office');
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      await updateProfile({
        name,
        phone,
        addresses,
      });

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const updated = [
      ...addresses,
      {
        label: newLabel,
        fullName: newFullName || name,
        phone: newPhone || phone,
        street: newStreet,
        city: newCity,
        state: newState,
        pincode: newPincode,
        isDefault: addresses.length === 0,
      },
    ];

    try {
      await updateProfile({ addresses: updated });

      setAddresses(updated);
      setShowAddAddress(false);

      setNewLabel('Office');
      setNewFullName('');
      setNewPhone('');
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPincode('');
    } catch (err: any) {
      alert(err?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (index: number) => {
    const updated = addresses.filter(
      (_: (typeof addresses)[number], idx: number) => idx !== index
    );

    try {
      await updateProfile({ addresses: updated });
      setAddresses(updated);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete address');
    }
  };

  const quickLinks = [
    {
      title: 'My Orders',
      description: 'Track your products and package orders',
      path: '/orders',
      icon: ShoppingBag,
    },
    {
      title: 'My Photoshoots',
      description: 'View and manage your photoshoot bookings',
      path: '/bookings',
      icon: Calendar,
    },
    {
      title: 'My Photos',
      description: 'View your uploaded and edited photos',
      path: '/my-photos',
      icon: ImageIcon,
    },
    {
      title: 'Wishlist',
      description: 'View your saved studios and products',
      path: '/wishlist',
      icon: Heart,
    },
    {
      title: 'Reviews & Ratings',
      description: 'Manage your studio and product reviews',
      path: '/reviews',
      icon: Star,
    },
    {
      title: 'Notifications',
      description: 'View booking, order and service updates',
      path: '/notifications',
      icon: Bell,
    },
    {
      title: 'Payment History',
      description: 'View your payment transactions',
      path: '/payments',
      icon: CreditCard,
    },
    {
      title: 'Invoices',
      description: 'View and download your invoices',
      path: '/invoices',
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">

      {/* PAGE HEADER */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
          My Account
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
          My Profile
        </h1>

        <p className="text-xs text-slate-500 mt-1">
          Manage your personal information, addresses, orders, photos and
          account settings.
        </p>
      </div>

      {/* PROFILE + PERSONAL INFORMATION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* PROFILE CARD */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-center space-y-4">

          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.name || 'User'
              )}`
            }
            alt={user?.name || 'User'}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-500 shadow-md"
          />

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {user?.name || 'User'}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {user?.email || ''}
            </p>

            <span className="inline-block mt-2 bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {user?.role?.replace('_', ' ') || 'customer'}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="w-full text-xs font-bold text-rose-600 hover:bg-rose-50 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <form
          onSubmit={handleProfileSave}
          className="md:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-amber-500" />

            <h3 className="text-sm font-bold text-slate-900">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">

            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Profile saved successfully
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="ml-auto bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* SAVED ADDRESSES */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">

        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Saved Delivery Addresses
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Manage addresses used for your products and deliveries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        </div>

        <div className="space-y-3">
          {addresses.map(
            (addr: (typeof addresses)[number], idx: number) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {addr.fullName}
                    </span>

                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      {addr.label || 'Home'}
                    </span>

                    {addr.isDefault && (
                      <span className="text-emerald-600 text-[10px] font-bold">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 mt-1">
                    {addr.street}
                    {addr.city ? `, ${addr.city}` : ''}
                    {addr.state ? `, ${addr.state}` : ''}
                    {addr.pincode ? ` - ${addr.pincode}` : ''}
                  </p>

                  {addr.phone && (
                    <p className="text-slate-500 mt-0.5">
                      Contact: {addr.phone}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteAddress(idx)}
                  className="text-slate-400 hover:text-rose-600 transition"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          )}
        </div>

        {/* ADD ADDRESS FORM */}
        {showAddAddress && (
          <form
            onSubmit={handleAddAddress}
            className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4"
          >
            <h4 className="text-xs font-bold text-slate-900">
              Add New Delivery Address
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <input
                type="text"
                placeholder="Address Label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />

              <input
                type="text"
                placeholder="Full Name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />

              <input
                type="text"
                required
                placeholder="Street / House No."
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />

              <input
                type="text"
                required
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />

              <input
                type="text"
                required
                placeholder="State"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />

              <input
                type="text"
                required
                placeholder="Pincode"
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none sm:col-span-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddAddress(false)}
                className="text-xs text-slate-600 px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition"
              >
                Save Address
              </button>
            </div>
          </form>
        )}
      </section>

      {/* QUICK ACCESS */}
      <section className="space-y-5">

        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Your MEMORA
          </span>

          <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            Quick Access
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Everything related to your MEMORA account in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.path}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {item.description}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 flex-shrink-0 transition" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ACCOUNT SETTINGS */}
      <section className="space-y-5">

        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Security & Preferences
          </span>

          <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            Account Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Security */}
          <button
            type="button"
            className="text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-amber-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Security
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Manage your account security.
            </p>
          </button>

          {/* Change Password */}
          <button
            type="button"
            className="text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-amber-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Change Password
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Update your account password.
            </p>
          </button>

          {/* Preferences */}
          <button
            type="button"
            className="text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-amber-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Settings className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Preferences
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Manage notification and account preferences.
            </p>
          </button>

          {/* Help */}
          <button
            type="button"
            className="text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-amber-300 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Help & Support
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Get help with bookings, orders and payments.
            </p>
          </button>
        </div>
      </section>

      {/* SIGN OUT */}
      <section className="bg-slate-950 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">
            Ready to leave MEMORA?
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Your account data remains safely stored for your next visit.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </section>
    </div>
  );
};