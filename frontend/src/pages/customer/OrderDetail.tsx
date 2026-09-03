import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  CreditCard, 
  FileText, 
  Truck, 
  Download, 
  Printer, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import api from '../../api/client';
import { IOrder } from '../../types';
import { OrderTimelineStepper } from '../../components/customer/OrderTimelineStepper';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Order fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading order details & timeline...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
        <Link to="/orders" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl mt-3 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Order #{order.orderId}
            </h1>
            <span className="bg-amber-500/20 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
              {order.currentStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/invoices/${order.invoiceId?._id || order.invoiceId || order._id}`}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>View Tax Invoice (PDF)</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Real-Time Stepper Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <OrderTimelineStepper
            timeline={order.timeline}
            currentStatus={order.currentStatus}
          />
        </div>

        {/* Right Side: Order Summary, Custom Details & Shipping */}
        <div className="lg:col-span-5 space-y-6">
          {/* Items Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Purchased Keepsakes ({order.items.length})</h3>

            <div className="space-y-3 divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-start gap-3 text-xs">
                  <img
                    src={item.customization?.uploadedPhoto || item.thumbnail}
                    alt=""
                    className="w-14 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <span className="text-[10px] text-amber-700 font-semibold block">{item.category}</span>

                    {item.customization && (
                      <div className="text-[10px] text-slate-500 pt-0.5 space-y-0.5">
                        {item.customization.customName && <div>Names: <strong className="text-slate-700">{item.customization.customName}</strong></div>}
                        {item.customization.customText && <div>Text: <em>"{item.customization.customText}"</em></div>}
                        {item.customization.frameColor && <div>Finish: {item.customization.frameColor}</div>}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 font-bold text-slate-900">
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.itemTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-600 font-bold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Total Paid</span>
                <span className="text-amber-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Address Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" /> Delivery Address
            </h3>

            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mt-1 font-semibold text-slate-600">Phone: {order.shippingAddress.phone}</p>
            </div>

            {order.trackingNumber && (
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-amber-500" /> {order.courierName}</span>
                <span className="font-mono font-bold text-slate-900">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
