import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, CheckCircle2, User, MapPin, Truck } from 'lucide-react';
import api from '../../api/client';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/orders');
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
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { currentStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const filtered = orders.filter((o) => {
    return (
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Keepsake Commerce</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Physical Orders</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track frame manufacturing, layflat album printing, and Blue Dart logistics nationwide</p>
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading platform orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No orders found matching your search.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Shipping Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-purple-400">
                      #{order.orderId}
                      <span className="block font-sans text-[10px] text-slate-500 font-normal mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="text-white block">{order.customerId?.name || 'Customer'}</strong>
                      <span className="text-[11px] text-slate-400">{order.customerId?.email}</span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {order.items?.length || 1} product(s)
                    </td>
                    <td className="p-4 font-bold text-white">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {order.currentStatus}
                        </span>
                        <select
                          value={order.currentStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-0.5 outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="ORDER_PLACED">ORDER_PLACED</option>
                          <option value="PAYMENT_CONFIRMED">PAYMENT_CONFIRMED</option>
                          <option value="PHOTOS_UPLOADED">PHOTOS_UPLOADED</option>
                          <option value="EDITING">EDITING</option>
                          <option value="PROOF_READY">PROOF_READY</option>
                          <option value="CUSTOMER_APPROVED">CUSTOMER_APPROVED</option>
                          <option value="PRINTING">PRINTING</option>
                          <option value="QUALITY_CHECK">QUALITY_CHECK</option>
                          <option value="READY">READY</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
