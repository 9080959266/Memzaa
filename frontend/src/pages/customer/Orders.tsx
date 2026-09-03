import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock, CheckCircle2, ChevronRight, Package } from 'lucide-react';
import api from '../../api/client';
import { IOrder } from '../../types';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Purchase History</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">My Orders & Production Status</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track your live photo printing, framing, proof approvals and express dispatch</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Orders Placed Yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Order custom solid teak wood frames, magic color mugs, or fine-art canvas wraps with your precious memories!
          </p>
          <Link
            to="/products"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
          >
            Explore Photo Store
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColor: Record<string, string> = {
              ORDER_PLACED: 'bg-blue-100 text-blue-800',
              PAYMENT_CONFIRMED: 'bg-indigo-100 text-indigo-800',
              PHOTOS_UPLOADED: 'bg-purple-100 text-purple-800',
              EDITING: 'bg-amber-100 text-amber-800',
              PROOF_READY: 'bg-cyan-100 text-cyan-800',
              CUSTOMER_APPROVED: 'bg-emerald-100 text-emerald-800',
              PRINTING: 'bg-orange-100 text-orange-800',
              QUALITY_CHECK: 'bg-pink-100 text-pink-800',
              READY: 'bg-emerald-100 text-emerald-800',
              OUT_FOR_DELIVERY: 'bg-teal-100 text-teal-800',
              DELIVERED: 'bg-green-100 text-green-900 font-black',
              CANCELLED: 'bg-rose-100 text-rose-800'
            };
            const badgeClass = statusColor[order.currentStatus] || 'bg-slate-100 text-slate-800';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-mono text-slate-900">
                        #{order.orderId}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                        {order.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <Link
                      to={`/orders/${order._id}`}
                      className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Track Timeline</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-wrap items-center gap-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <img
                        src={item.customization?.uploadedPhoto || item.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
