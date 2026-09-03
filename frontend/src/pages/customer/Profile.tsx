import React, { useState } from 'react';
import { User as UserIcon, MapPin, Phone, Mail, Plus, Trash2, CheckCircle2, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Address book states
  const [addresses, setAddresses] = useState(user?.addresses || [
    {
      label: 'Home',
      fullName: user?.name || 'Priya Ramanathan',
      phone: user?.phone || '+91 98401 23456',
      street: '14, 4th Main Road, Besant Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600090',
      isDefault: true
    }
  ]);

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
      await updateProfile({ name, phone, addresses });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
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
        isDefault: false
      }
    ];
    setAddresses(updated);
    await updateProfile({ addresses: updated });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = async (index: number) => {
    const updated = addresses.filter((_, idx) => idx !== index);
    setAddresses(updated);
    await updateProfile({ addresses: updated });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Account Settings</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">My Profile & Saved Addresses</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal information, contact preferences and delivery addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-center space-y-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
            alt={user?.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-500 shadow-md"
          />

          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-2 bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {user?.role.replace('_', ' ')}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full text-xs font-bold text-rose-600 hover:bg-rose-50 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out from Account
            </button>
          </div>
        </div>

        {/* Right Side: Edit Form & Address Book */}
        <div className="md:col-span-8 space-y-6">
          {/* Profile Form */}
          <form onSubmit={handleProfileSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-amber-500" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Profile changes saved!
                </span>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="ml-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

          {/* Saved Delivery Addresses */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" /> Saved Delivery Addresses
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{addr.fullName}</span>
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {addr.label || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="text-emerald-600 text-[10px] font-bold">Default</span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-slate-500 mt-0.5 font-medium">Contact: {addr.phone}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Address Form Modal / Expandable */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3 pt-4">
                <h4 className="text-xs font-bold text-slate-900">New Delivery Address</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Address Label (e.g. Home, Office, Studio)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Recipient Full Name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street Address / House No."
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="text-xs text-slate-600 px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
