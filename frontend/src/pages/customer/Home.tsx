import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Heart, 
  Calendar, 
  Clock, 
  Layers, 
  Gift, 
  Tag, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../api/client';
import { IStudio, IPhotoshootCategory, IProduct, IPackage } from '../../types';
import { StudioCard } from '../../components/customer/StudioCard';
import { ProductCustomizerModal } from '../../components/customer/ProductCustomizerModal';
import { BookingModal } from '../../components/customer/BookingModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [popularPackages, setPopularPackages] = useState<IPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Customizer & Booking modals
  const [customizingProduct, setCustomizingProduct] = useState<IProduct | null>(null);
  const [bookingPkg, setBookingPkg] = useState<{ pkg: IPackage; studio: IStudio } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studiosRes, catRes, prodRes, pkgRes] = await Promise.all([
          api.get('/studios?limit=6'),
          api.get('/categories'),
          api.get('/products?featured=true&limit=6'),
          api.get('/packages?featured=true')
        ]);

        if (studiosRes.data.success) setStudios(studiosRes.data.studios);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (prodRes.data.success) setProducts(prodRes.data.products);
        if (pkgRes.data.success) setPopularPackages(pkgRes.data.packages);
      } catch (err) {
        console.error('Home data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCity !== 'All') params.append('city', selectedCity);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    navigate(`/studios?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-b-3xl sm:rounded-b-[40px] pt-12 pb-20 px-4 sm:px-6 lg:px-8 shadow-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            INDIA’S PREMIER PHOTOGRAPHY & PHOTO PRODUCTS PLATFORM
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight leading-tight sm:leading-none">
            Capture Moments. <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Create Memories.
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover verified photo studios for grand weddings, puberty ceremonies, newborn milestones, and customize museum-grade photo frames, canvas prints, and gifts in real time.
          </p>

          {/* Interactive Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-white p-2.5 rounded-3xl shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 text-slate-800 border border-slate-200/40"
          >
            {/* City Selector */}
            <div className="flex items-center w-full md:w-48 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold">
              <MapPin className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent w-full text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Cities (India)</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Photoshoot Category Selector */}
            <div className="flex items-center w-full md:w-56 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold">
              <Layers className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent w-full text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="wedding">Wedding Shoot</option>
                <option value="pre-wedding">Pre-Wedding & Couple</option>
                <option value="baby">Baby & Newborn</option>
                <option value="puberty-ceremony">Puberty Ceremony (Manjal Neerattu)</option>
                <option value="maternity">Maternity Shoot</option>
                <option value="portrait">Fashion & Portrait</option>
                <option value="outdoor">Outdoor & Travel</option>
              </select>
            </div>

            {/* Keyword Input */}
            <div className="flex items-center flex-1 w-full px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search studio name, packages, custom gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-7 py-3.5 rounded-2xl transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              Explore
            </button>
          </form>

          {/* Quick Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Popular:</span>
            {['Wedding', 'Puberty Ceremony', 'Newborn', 'Pre-Wedding', 'Teak Wood Frames'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  navigate(`/studios?search=${encodeURIComponent(tag)}`);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROMO BANNER: COUPONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <span className="bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                SPECIAL FESTIVE OFFER
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight mt-1 text-slate-950">
                Get 10% Flat OFF on All Bookings & Custom Products!
              </h3>
              <p className="text-xs text-slate-900 font-medium mt-0.5">
                Use promo coupon code <strong className="font-mono bg-white/80 px-2 py-0.5 rounded text-slate-950">WELCOME10</strong> at checkout.
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center gap-2 flex-shrink-0"
          >
            Claim Discount Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. PHOTOSHOOT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Explore Specialities</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Photoshoot Categories</h2>
          </div>
          <Link to="/categories" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/studios?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-xl hover:border-amber-400/50 transition-all flex flex-col items-center text-center overflow-hidden"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 group-hover:scale-105 transition-transform bg-slate-100 shadow-sm">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">
                {cat.name}
              </h4>
              <span className="text-[10px] text-slate-500 mt-1">
                {cat.packageCount ? `${cat.packageCount} Packages` : 'Explore Studios'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PHOTO STUDIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Vetted Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Featured Photo Studios</h2>
          </div>
          <Link to="/studios" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            Browse All Studios ({studios.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      </section>

      {/* 5. POPULAR CUSTOMIZABLE PHOTO PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Keepsakes & Wall Art</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Customizable Photo Store</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            Explore Full Store <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => {
            const basePrice = prod.discountPrice || prod.basePrice;

            return (
              <div
                key={prod._id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={prod.thumbnail}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                      {prod.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <Link to={`/products/${prod.slug}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-1">
                        {prod.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-[11px] text-amber-700 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Custom Photo, Names & Engraved Date</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <div>
                    <span className="text-base font-black text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
                    {prod.discountPrice && (
                      <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">
                        ₹{prod.basePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomizingProduct(prod)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Customize Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. HOW MEMORA WORKS */}
      <section className="bg-slate-100/80 rounded-3xl py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">How MEMORA Works</h2>
          <p className="text-xs text-slate-500">From finding your dream studio to receiving museum-quality prints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900">Select Studio & Package</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Explore portfolios, compare pricing, and reserve dates with instant booking ID.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900">Shoot & Photo Upload</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Studio shoots rituals or portraits and uploads high-resolution raw assets for retouching.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900">Review & Approve Proofs</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Review digital drafts on your phone. Approve or request changes in 1-click.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-md">
              4
            </div>
            <h4 className="text-xs font-bold text-slate-900">Archival Print & Delivery</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Passed through 5-point QC and shipped safely to your doorstep with live tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      {customizingProduct && (
        <ProductCustomizerModal
          isOpen={!!customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          product={customizingProduct}
        />
      )}

      {bookingPkg && (
        <BookingModal
          isOpen={!!bookingPkg}
          onClose={() => setBookingPkg(null)}
          pkg={bookingPkg.pkg}
          studio={bookingPkg.studio}
        />
      )}
    </div>
  );
};
