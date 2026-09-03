import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ArrowLeft,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || 'Priya Ramanathan');
  const [phone, setPhone] = useState(user?.phone || '+91 98401 23456');
  const [street, setStreet] = useState('14, 4th Main Road, Besant Nagar');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('600090');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Add customized items to proceed to checkout.</p>
        <Link to="/products" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl">
          Browse Store
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsProcessing(true);

      const payload = {
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          pincode
        },
        paymentMethod,
        transactionId: `TXN_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        clearCart();
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Secure Order Checkout</h1>
        <p className="text-xs text-slate-500 mt-0.5">256-Bit SSL Encrypted Razorpay Gateway</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Shipping & Payment Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Pan-India Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / House No / Apartment *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Choose Payment Method (INR ₹)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'razorpay', label: 'UPI / Razorpay', desc: 'GPay, PhonePe, Paytm, QR' },
                { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                { id: 'upi', label: 'Net Banking', desc: 'All Major Indian Banks' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    paymentMethod === m.id
                      ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-bold">{m.label}</span>
                  <span className="block text-[10px] text-slate-500 mt-1">{m.desc}</span>
                </button>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Razorpay Instant Settlement Enabled • 100% Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Right Side: Order Review & Submit */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Order Items ({cart.items.length})</h3>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item._id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.customization?.uploadedPhoto || item.productId?.thumbnail}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.productId?.title}</p>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.itemTotal.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{cart.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">{cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Payable Amount</span>
                <span className="text-base text-amber-600">₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-4 rounded-2xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isProcessing ? 'Processing Razorpay Payment...' : `Pay ₹${cart.total.toLocaleString('en-IN')} & Place Order`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
