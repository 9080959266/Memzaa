import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Camera, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { StudioCard } from '../../components/customer/StudioCard';

export const Wishlist: React.FC = () => {
  const { studios, products, toggleProduct } = useWishlist();

  const isEmpty = studios.length === 0 && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Saved Favorites</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">My Wishlist ({studios.length + products.length})</h1>
        <p className="text-xs text-slate-500 mt-0.5">Your shortlisted photography studios and customized photo keepsakes</p>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save your favorite studios and personalized photo products while browsing to revisit them later!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/studios" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm">
              Browse Studios
            </Link>
            <Link to="/products" className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm">
              Browse Photo Store
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Saved Studios */}
          {studios.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" /> Shortlisted Studios ({studios.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studios.map((studio) => (
                  <StudioCard key={studio._id} studio={studio} />
                ))}
              </div>
            </div>
          )}

          {/* Saved Products */}
          {products.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" /> Saved Photo Gifts ({products.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div key={prod._id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={prod.thumbnail} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleProduct(prod._id)}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-rose-500 hover:bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.title}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-bold text-slate-900 text-sm">₹{(prod.discountPrice || prod.basePrice).toLocaleString('en-IN')}</span>
                      <Link to={`/products/${prod.slug}`} className="bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl">
                        Customize
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
