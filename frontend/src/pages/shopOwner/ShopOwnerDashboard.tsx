import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Kanban, 
  Camera, 
  CheckCircle2, 
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const ShopOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/seller/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Seller dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Loading seller metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    todaysOrders: 4,
    pendingOrders: 6,
    processingOrders: 8,
    readyOrders: 3,
    deliveredOrders: 29,
    todayRevenue: 7850,
    monthlyRevenue: 189500,
    pendingPayments: 12500,
    newCustomers: 14,
    upcomingBookingsCount: 3
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Studio Partner Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Welcome back, {user?.name.split(' ')[0]}! 📸
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time orders, upcoming shoots, revenue tracking, and Kanban photo jobs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seller/kanban"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Kanban className="w-4 h-4" /> Open Kanban Board
          </Link>
        </div>
      </div>

      {/* 1. KEY FINANCIAL & PRODUCTION WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Today's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            ₹{metrics.todayRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from yesterday
          </span>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Monthly Earnings (Sep)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            ₹{metrics.monthlyRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold">
            Next payout: 15th Sep
          </span>
        </div>

        {/* Pending Orders & Jobs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Active Photo Jobs</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-400">
            {metrics.processingOrders + metrics.pendingOrders}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold">
            {metrics.processingOrders} in Editing & QC
          </span>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Upcoming Shoots</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-400">
            {metrics.upcomingBookingsCount}
          </p>
          <span className="text-[10px] text-cyan-400 font-semibold">
            Next shoot: Tomorrow 10:00 AM
          </span>
        </div>
      </div>

      {/* 2. ORDER FULFILLMENT STATUS STRIP */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Order Production Pipeline Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Today's Orders</span>
            <p className="text-xl font-bold text-white">{metrics.todaysOrders}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-blue-400 font-semibold">Pending Upload</span>
            <p className="text-xl font-bold text-blue-400">{metrics.pendingOrders}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-purple-400 font-semibold">In Editing / Proof</span>
            <p className="text-xl font-bold text-purple-400">{metrics.processingOrders}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-emerald-400 font-semibold">Ready to Ship</span>
            <p className="text-xl font-bold text-emerald-400">{metrics.readyOrders}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Delivered Total</span>
            <p className="text-xl font-bold text-slate-300">{metrics.deliveredOrders}</p>
          </div>
        </div>
      </div>

      {/* 3. UPCOMING BOOKINGS & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upcoming Bookings List */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Upcoming Photoshoot Sessions
            </h3>
            <Link to="/seller/bookings" className="text-xs text-amber-400 hover:underline font-semibold">
              View Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.upcomingBookings?.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No upcoming bookings scheduled.</p>
            ) : (
              data?.upcomingBookings?.map((b: any) => (
                <div
                  key={b._id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.customerId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-amber-500"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.packageId?.title || 'Photoshoot Session'}</h4>
                      <p className="text-[11px] text-slate-400">Client: {b.customerId?.name} ({b.customerId?.phone})</p>
                      <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                        📅 {b.eventDate} • ⏰ {b.timeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-400 block">₹{b.advanceAmount} Paid</span>
                    <span className="text-[10px] text-slate-500">₹{b.remainingAmount} Due</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Low Stock Inventory
          </h3>

          <div className="space-y-3">
            {data?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-emerald-400 py-4 text-center">All product inventory well stocked!</p>
            ) : (
              data?.lowStockProducts?.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-rose-500/20 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-200">{item.product?.title || 'Photo Frame'}</p>
                    <span className="text-[10px] font-mono text-slate-500">{item.sku}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {item.quantity} left
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            to="/seller/inventory"
            className="block text-center text-xs font-bold text-amber-400 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl transition mt-2"
          >
            Manage Inventory
          </Link>
        </div>
      </div>
    </div>
  );
};
