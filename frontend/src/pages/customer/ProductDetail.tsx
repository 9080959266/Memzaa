import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCw, 
  Star, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import api from '../../api/client';
import { IProduct, IReview } from '../../types';
import { RatingStars } from '../../components/common/RatingStars';
import { ProductCustomizerModal } from '../../components/customer/ProductCustomizerModal';
import { useWishlist } from '../../context/WishlistContext';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toggleProduct, isProductInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setReviews(res.data.reviews || []);
          setActiveImage(res.data.product.thumbnail || res.data.product.images[0]);
        }
      } catch (err) {
        console.error('Product fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900">Product Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">The item may have been discontinued.</p>
        <Link to="/products" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl">
          Back to Photo Store
        </Link>
      </div>
    );
  }

  const inWishlist = isProductInWishlist(product._id);
  const basePrice = product.discountPrice || product.basePrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Photo Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 sm:h-[460px] bg-slate-950 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              onClick={() => toggleProduct(product._id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition ${
                inWishlist ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-white hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                    activeImage === img ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="bg-amber-500/10 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 mt-2">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <RatingStars rating={product.rating} showCount={true} reviewCount={product.reviewCount} />
              <span className="text-slate-300">•</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock & Ready to Customize
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div>
              <span className="text-2xl font-black text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
              {product.discountPrice && (
                <span className="text-sm text-slate-400 line-through ml-2">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Free Shipping above ₹1,500
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Customization Details Highlights */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Customization Options Included:
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <li className="flex items-center gap-1.5">✓ Upload Any Photo from Phone</li>
              <li className="flex items-center gap-1.5">✓ Custom Engraved Couple Names</li>
              <li className="flex items-center gap-1.5">✓ Special Anniversary / Event Date</li>
              <li className="flex items-center gap-1.5">✓ Choice of 4 Premium Frame Colors</li>
            </ul>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm py-4 rounded-2xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              Launch Live 3D Customizer & Add to Cart
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            <div className="p-2">
              <ShieldCheck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="font-semibold text-slate-700 block text-[11px]">300 DPI Archival</span>
              <span className="text-[10px]">No fading for 50 yrs</span>
            </div>
            <div className="p-2">
              <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="font-semibold text-slate-700 block text-[11px]">Fast Dispatch</span>
              <span className="text-[10px]">3-5 Business Days</span>
            </div>
            <div className="p-2">
              <RotateCw className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="font-semibold text-slate-700 block text-[11px]">Safe Arrival</span>
              <span className="text-[10px]">100% Replacement Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900">Verified Customer Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400">Be the first to review this customized photo product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={rev.userId?.name}
                      className="w-7 h-7 rounded-full object-cover border border-amber-500"
                    />
                    <span className="text-xs font-bold text-slate-900">{rev.userId?.name}</span>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                <p className="text-xs text-slate-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-App Customizer Modal */}
      {isCustomizerOpen && (
        <ProductCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};
