import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeItem, applyCoupon, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setIsApplying(true);
      setCouponError('');
      const msg = await applyCoupon(couponCode.trim());
      setCouponMessage(msg);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200 space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Discover customized wooden photo frames, magic mugs, fine-art canvas prints, and heirloom albums!
        </p>
        <Link
          to="/products"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
        >
          Explore Photo Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Shopping Cart ({cart.items.length} Items)</h1>
        <p className="text-xs text-slate-500 mt-0.5">Review your personalized gifts & keepsakes before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.productId;
            const custom = item.customization;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Custom Photo Preview Thumbnail */}
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <img
                      src={custom?.uploadedPhoto || product?.thumbnail || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80'}
                      alt={product?.title}
                      className="w-full h-full object-cover"
                    />
                    {custom?.uploadedPhoto && (
                      <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{product?.title || 'Custom Photo Item'}</h3>
                    <span className="text-[10px] text-amber-700 font-semibold block">{product?.category}</span>

                    {/* Custom Attributes */}
                    {custom && (
                      <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                        {custom.customName && (
                          <p><span className="text-slate-400">Names:</span> <strong className="text-slate-700">{custom.customName}</strong></p>
                        )}
                        {custom.customText && (
                          <p><span className="text-slate-400">Text:</span> <span className="italic text-slate-700">"{custom.customText}"</span></p>
                        )}
                        {custom.frameColor && (
                          <p><span className="text-slate-400">Finish:</span> {custom.frameColor} {custom.size ? `(${custom.size})` : ''}</p>
                        )}
                      </div>
                    )}

                    <span className="text-xs font-bold text-slate-900 block pt-1">
                      ₹{item.unitPrice.toLocaleString('en-IN')} each
                    </span>
                  </div>
                </div>

                {/* Quantity & Item Total Controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-lg text-slate-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2 text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-lg text-slate-600 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">
                      ₹{item.itemTotal.toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Promo Code & Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-500" /> Apply Coupon Code
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. WELCOME10, MEMORA500"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 uppercase outline-none focus:bg-white focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isApplying}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </form>

            {couponMessage && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {couponMessage}
              </p>
            )}
            {couponError && (
              <p className="text-xs text-rose-600 font-semibold">{couponError}</p>
            )}

            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-amber-900">
              💡 Tip: Try code <strong className="font-mono font-bold">WELCOME10</strong> for 10% OFF your entire order!
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({cart.couponCode})</span>
                  <span>- ₹{cart.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                <span>
                  {cart.deliveryFee === 0 ? (
                    <strong className="text-emerald-600 font-bold">FREE</strong>
                  ) : (
                    `₹${cart.deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-base text-amber-600">₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) navigate('/login?redirect=checkout');
                else navigate('/checkout');
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
