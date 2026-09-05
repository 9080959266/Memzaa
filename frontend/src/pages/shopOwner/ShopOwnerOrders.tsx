import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, FileText } from 'lucide-react';
import api from '../../api/client';

export const ShopOwnerOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/seller/orders?status=${selectedStatus}&search=${searchQuery}`);
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, currentStatus: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const STATUS_COLUMNS = [
    'ORDER_PLACED',
    'PAYMENT_CONFIRMED',
    'PHOTOS_UPLOADED',
    'EDITING',
    'PROOF_READY',
    'CUSTOMER_APPROVED',
    'PRINTING',
    'QUALITY_CHECK',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Workshop & Keepsake Orders</h1>
          <p className="text-slate-400 text-xs mt-1">
            Track customer frame engravings, layflat album print jobs, and doorstep shipments.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Stages</option>
            {STATUS_COLUMNS.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-bold text-base mb-1">No Orders Found</h3>
          <p className="text-slate-400 text-xs">Customer keepsake orders will appear here for processing.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items / Customization</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Current Stage</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-black text-amber-400">{ord.orderId}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{ord.shippingAddress?.fullName || ord.customerId?.name}</div>
                      <div className="text-[10px] text-slate-500">{ord.shippingAddress?.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-semibold">{ord.items?.length || 1} Item(s)</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {ord.items?.map((it: any) => it.title).join(', ')}
                      </div>
                    </td>
                    <td className="p-4 font-black text-white">₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        {ord.currentStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs font-black text-amber-400">{selectedOrder.orderId}</span>
                <h3 className="text-lg font-extrabold text-white">Order Production Control</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Advance Production Stage */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2">Update Production Stage:</label>
              <div className="flex items-center gap-3">
                <select
                  value={selectedOrder.currentStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-bold flex-1 focus:outline-none focus:border-amber-500"
                >
                  {STATUS_COLUMNS.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.currentStatus)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition"
                >
                  Save Stage
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Shipping Address</span>
                <p className="text-white font-bold text-xs mt-1">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-slate-400 text-xs">{selectedOrder.shippingAddress?.street}</p>
                <p className="text-slate-400 text-xs">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
                <p className="text-amber-400 text-xs mt-2 font-semibold">📞 {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Payment & Invoice</span>
                <p className="text-white font-bold text-xs mt-1">Total: ₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</p>
                <p className="text-slate-400 text-xs">Method: {selectedOrder.paymentMethod?.toUpperCase()}</p>
                <p className="text-slate-400 text-xs">Status: {selectedOrder.paymentStatus?.toUpperCase()}</p>
                <div className="mt-3">
                  <a
                    href={`/invoices/${selectedOrder._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Print GST Tax Invoice
                  </a>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-slate-800 pt-4">
              <span className="text-xs font-bold text-white mb-3 block">Ordered Items:</span>
              <div className="space-y-3">
                {selectedOrder.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <img src={it.thumbnail} alt={it.title} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{it.title}</p>
                      <p className="text-[10px] text-slate-400">Qty: {it.quantity} • ₹{it.price}</p>
                      {it.customization && (
                        <p className="text-[10px] text-amber-400 mt-1">
                          Frame: {it.customization.frameStyle || 'Teak Wood'} • Engraved: "{it.customization.engravedNames || 'N/A'}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
