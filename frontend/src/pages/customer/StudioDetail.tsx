import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Layers, 
  Camera, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Calendar, 
  ArrowLeft,
  ShoppingCart
} from 'lucide-react';
import api from '../../api/client';
import { IStudio, IPackage, IReview } from '../../types';
import { RatingStars } from '../../components/common/RatingStars';
import { BookingModal } from '../../components/customer/BookingModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const StudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleStudio, isStudioInWishlist } = useWishlist();

  const [studio, setStudio] = useState<IStudio | null>(null);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active tabs
  const [activeTab, setActiveTab] = useState<'packages' | 'portfolio' | 'amenities' | 'reviews'>('packages');
  const [selectedPortfolioCat, setSelectedPortfolioCat] = useState('All');

  // Booking Modal
  const [selectedBookingPkg, setSelectedBookingPkg] = useState<IPackage | null>(null);

  // Cart integration
  const { addPackageToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addingCartPkgId, setAddingCartPkgId] = useState<string | null>(null);
  const [cartSuccessMsg, setCartSuccessMsg] = useState<string | null>(null);

  const handleAddToCart = async (pkg: IPackage) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setAddingCartPkgId(pkg._id);
      await addPackageToCart(pkg._id, studio?._id, 1);
      setCartSuccessMsg(`"${pkg.title}" added to cart!`);
      setTimeout(() => setCartSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to add package to cart');
    } finally {
      setAddingCartPkgId(null);
    }
  };

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/studios/${id}`);
        if (res.data.success) {
          setStudio(res.data.studio);
          setPackages(res.data.packages || []);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error('Studio fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchStudio();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading studio profile...</p>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900">Studio Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">The studio you are looking for might have been moved.</p>
        <Link to="/studios" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl">
          Back to Directory
        </Link>
      </div>
    );
  }

  const inWishlist = isStudioInWishlist(studio._id);

  // Filter portfolio
  const portfolioCategories = ['All', ...Array.from(new Set(studio.portfolio.map(p => p.category)))];
  const filteredPortfolio = selectedPortfolioCat === 'All' 
    ? studio.portfolio 
    : studio.portfolio.filter(p => p.category === selectedPortfolioCat);

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-slate-950 overflow-hidden">
        <img
          src={studio.bannerImage}
          alt={studio.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Back Link and Action Icons */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <Link
            to="/studios"
            className="flex items-center gap-1.5 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition"
          >
            <ArrowLeft className="w-4 h-4" /> All Studios
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStudio(studio._id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition ${
                inWishlist ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-white hover:text-rose-500'
              }`}
              title="Save Studio"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Studio Info Overlay at Banner Bottom */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-10">
          <div className="flex items-center gap-4">
            <img
              src={studio.logoImage}
              alt={studio.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-xl bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-serif font-extrabold tracking-tight">{studio.name}</h1>
                {studio.verifiedStatus === 'approved' && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">{studio.tagline}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {studio.city}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> {studio.operatingHours?.open} - {studio.operatingHours?.close}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center gap-4 self-start sm:self-auto">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Client Rating</span>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{studio.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">({studio.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Starts At</span>
              <span className="text-base font-black text-white">₹{studio.startingPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { key: 'packages', label: `Photoshoot Packages (${packages.length})` },
            { key: 'portfolio', label: `Portfolio Gallery (${studio.portfolio.length})` },
            { key: 'amenities', label: 'Studio Amenities & Gear' },
            { key: 'reviews', label: `Reviews (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 font-bold text-xs rounded-xl transition flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Available Photoshoot Packages</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a package to view deliverables and reserve your session</p>
              </div>
            </div>

            {packages.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
                No active photoshoot packages listed yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => {
                  const finalPrice = pkg.discountPrice || pkg.price;
                  const advanceAmt = Math.round((finalPrice * (pkg.advancePercentage || 20)) / 100);

                  return (
                    <div
                      key={pkg._id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            {pkg.isPopular && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 inline-block">
                                Most Popular
                              </span>
                            )}
                            <h4 className="text-base font-bold text-slate-900">{pkg.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pkg.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl font-black text-slate-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                            {pkg.discountPrice && (
                              <span className="text-xs text-slate-400 line-through block">₹{pkg.price.toLocaleString('en-IN')}</span>
                            )}
                            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
                              {pkg.advancePercentage}% Advance (₹{advanceAmt})
                            </span>
                          </div>
                        </div>

                        {/* Session specs */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="font-semibold">⏱️ {pkg.durationHours} Hours Session</span>
                          <span>•</span>
                          <span className="font-semibold">✨ {pkg.editedPhotosCount} Edited High-Res Retouches</span>
                          <span>•</span>
                          <span className="font-semibold">📷 {pkg.rawPhotosCount}+ Raw Photos</span>
                        </div>

                        {/* Deliverables */}
                        <div>
                          <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide block mb-1.5">Deliverables Included</span>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {pkg.deliverables?.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 hidden xl:inline">Free rescheduling up to 48 hrs</span>
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(pkg)}
                            disabled={addingCartPkgId === pkg._id}
                            className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {addingCartPkgId === pkg._id ? (
                              <span className="animate-spin text-xs">⏳</span>
                            ) : (
                              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedBookingPkg(pkg)}
                            className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PORTFOLIO GALLERY */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {portfolioCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPortfolioCat(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                    selectedPortfolioCat === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPortfolio.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative h-72 rounded-3xl overflow-hidden bg-slate-950 shadow-sm border border-slate-200/80 cursor-pointer"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase font-bold text-amber-400">{item.category}</span>
                    <h4 className="text-sm font-bold">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AMENITIES & GEAR */}
        {activeTab === 'amenities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Studio Amenities & Facilities
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                {studio.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" /> Cameras & Lighting Equipment
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                {studio.equipment?.map((gear, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{gear}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-serif text-2xl font-black">
                  {studio.rating.toFixed(1)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Overall Client Satisfaction</h4>
                  <RatingStars rating={studio.rating} size="md" showCount={false} />
                  <span className="text-xs text-slate-500 mt-0.5 block">Based on {reviews.length} verified shoot reviews</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={rev.userId?.name}
                        className="w-10 h-10 rounded-full object-cover border border-amber-500"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rev.userId?.name}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" />
                  </div>

                  <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  {/* Studio Reply */}
                  {rev.studioReply && (
                    <div className="bg-amber-50/70 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs text-slate-700 mt-3">
                      <span className="font-bold text-amber-900 block mb-0.5">Response from {studio.name}:</span>
                      <p className="italic text-slate-600">{rev.studioReply.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedBookingPkg && (
        <BookingModal
          isOpen={!!selectedBookingPkg}
          onClose={() => setSelectedBookingPkg(null)}
          pkg={selectedBookingPkg}
          studio={studio}
        />
      )}

      {/* Cart Success Toast */}
      {cartSuccessMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-950 text-white border border-amber-500/40 px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{cartSuccessMsg}</span>
          <Link to="/cart" className="ml-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-lg font-extrabold hover:bg-amber-400 transition">
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
};
