import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Phone, Mail, Clock, Plus, Trash2, CheckCircle2, Upload, Sparkles } from 'lucide-react';
import api from '../../api/client';
import { IStudio } from '../../types';

export const ShopOwnerStudio: React.FC = () => {
  const [studio, setStudio] = useState<IStudio | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startingPrice, setStartingPrice] = useState(5000);
  const [bannerImage, setBannerImage] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('Wedding');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/studios/my-studio');
        if (res.data.success) {
          const s = res.data.studio;
          setStudio(s);
          setName(s.name || '');
          setTagline(s.tagline || '');
          setDescription(s.description || '');
          setCity(s.city || 'Chennai');
          setAddress(s.address || '');
          setPhone(s.phone || '');
          setEmail(s.email || '');
          setStartingPrice(s.startingPrice || 5000);
          setBannerImage(s.bannerImage || '');
          setLogoImage(s.logoImage || '');
          setPortfolio(s.portfolio || []);
        }
      } catch (err) {
        console.error('My studio fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudio();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        name,
        tagline,
        description,
        city,
        address,
        phone,
        email,
        startingPrice: Number(startingPrice),
        bannerImage,
        logoImage,
        portfolio
      };

      const res = await api.put('/studios/my-studio', payload);
      if (res.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update studio profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPortfolio = () => {
    if (!newPhotoUrl) return;
    const updated = [
      ...portfolio,
      {
        url: newPhotoUrl,
        title: newPhotoTitle || 'Studio Capture',
        category: newPhotoCategory,
        featured: false
      }
    ];
    setPortfolio(updated);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
  };

  const handleDeletePortfolio = (idx: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== idx));
  };

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Loading your studio profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Public Marketplace Profile</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Studio Profile & Portfolio Gallery</h1>
        <p className="text-xs text-slate-400 mt-0.5">Customize your public studio page, banners, starting price, and upload portfolio shots</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" /> Studio Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Studio Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Catchy Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">About the Studio (Description) *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Starting Session Price (₹) *</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Physical Studio Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Media Assets (Banner & Logo) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Banner & Logo URLs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Banner Image URL</label>
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Logo / Avatar URL</label>
              <input
                type="url"
                value={logoImage}
                onChange={(e) => setLogoImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Gallery Manager */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Portfolio Gallery ({portfolio.length} Uploads)</h3>

          {/* Add New Portfolio Photo Strip */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="url"
              placeholder="Photo Image URL"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
            />
            <input
              type="text"
              placeholder="Title (e.g. Grand Muhurtham)"
              value={newPhotoTitle}
              onChange={(e) => setNewPhotoTitle(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
            />
            <select
              value={newPhotoCategory}
              onChange={(e) => setNewPhotoCategory(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
            >
              <option value="Wedding">Wedding</option>
              <option value="Pre-Wedding">Pre-Wedding</option>
              <option value="Baby">Baby & Newborn</option>
              <option value="Puberty Ceremony">Puberty Ceremony</option>
              <option value="Maternity">Maternity</option>
              <option value="Portrait">Portrait</option>
            </select>
            <button
              type="button"
              onClick={handleAddPortfolio}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          </div>

          {/* Existing Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {portfolio.map((p, idx) => (
              <div key={idx} className="relative h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <img src={p.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                  <span className="text-[10px] text-amber-400 font-bold">{p.category}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(idx)}
                    className="self-end p-1.5 bg-rose-600 rounded-lg text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Studio profile updated and live on marketplace!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isSaving ? 'Saving Changes...' : 'Save Studio Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
