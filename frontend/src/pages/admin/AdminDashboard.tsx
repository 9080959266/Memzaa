import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Store, 
  Users, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import api from '../../api/client';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApproveStudio = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/studios/${id}/moderate`, { status });
      fetchDashboard();
    } catch (err) {
      alert('Failed to update studio');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Loading platform KPIs...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalCustomers: 128,
    totalShopOwners: 24,
    totalStudios: 18,
    totalOrders: 95,
    totalBookings: 48,
    totalRevenue: 545000,
    platformCommission: 54500,
    pendingApprovals: 2,
    pendingPayments: 28400,
    activeUsers: 160
  };

  const revenueAnalytics = data?.revenueAnalytics || [
    { month: 'Apr', totalRevenue: 180000, commission: 18000 },
    { month: 'May', totalRevenue: 240000, commission: 24000 },
    { month: 'Jun', totalRevenue: 310000, commission: 31000 },
    { month: 'Jul', totalRevenue: 390000, commission: 39000 },
    { month: 'Aug', totalRevenue: 460000, commission: 46000 },
    { month: 'Sep', totalRevenue: 545000, commission: 54500 }
  ];

  const maxPlatformRev = Math.max(...revenueAnalytics.map((d: any) => d.totalRevenue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Super Administrator Control Center</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Platform Overview & KPIs</h1>
          <p className="text-xs text-slate-400 mt-1">Pan-India studio operations, commission revenue, and partner moderation</p>
        </div>
      </div>

      {/* 1. KEY PLATFORM KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Platform Volume (GMV)</span>
          <p className="text-2xl font-black text-white font-mono">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +32% YoY Growth
          </span>
        </div>

        {/* Platform Commission 10% */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Platform 10% Commission</span>
          <p className="text-2xl font-black text-purple-400 font-mono">₹{stats.platformCommission.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-purple-300 font-semibold">Net Platform Revenue</span>
        </div>

        {/* Total Bookings & Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Bookings & Orders</span>
          <p className="text-2xl font-black text-amber-400">{stats.totalBookings + stats.totalOrders}</p>
          <span className="text-[10px] text-slate-400">{stats.totalBookings} Shoots • {stats.totalOrders} Orders</span>
        </div>

        {/* Active Partners & Studios */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Verified Studios</span>
          <p className="text-2xl font-black text-cyan-400">{stats.totalStudios}</p>
          <span className="text-[10px] text-cyan-300 font-semibold">{stats.pendingApprovals} Pending Verification</span>
        </div>
      </div>

      {/* 2. PLATFORM REVENUE TRENDS (BAR CHART) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Platform GMV & 10% Take-Rate Trends</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly platform volume vs platform commission revenue</p>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2 border-b border-slate-800">
          {revenueAnalytics.map((d: any) => {
            const heightPercent = Math.round((d.totalRevenue / maxPlatformRev) * 100);

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-purple-300 font-bold opacity-0 group-hover:opacity-100 transition">
                  ₹{(d.totalRevenue / 1000).toFixed(0)}k
                </div>

                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-purple-800 via-purple-600 to-indigo-400 rounded-t-xl group-hover:scale-105 transition-all duration-300 shadow-md shadow-purple-600/20"
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-xs font-bold text-slate-400 mt-2">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. STUDIO APPROVAL VERIFICATION QUEUE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-purple-400" /> Studio Verification Queue ({data?.pendingStudios?.length || 0} Applications)
          </h3>
          <Link to="/admin/studios" className="text-xs text-purple-400 hover:underline font-semibold">
            View All Studios →
          </Link>
        </div>

        <div className="space-y-3">
          {(!data?.pendingStudios || data.pendingStudios.length === 0) ? (
            <p className="text-xs text-slate-500 py-4 text-center">No pending studio applications in queue.</p>
          ) : (
            data.pendingStudios.map((s: any) => (
              <div
                key={s._id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.logoImage || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-purple-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{s.name}</h4>
                    <p className="text-[11px] text-slate-400">{s.city} • Owner: {s.ownerId?.name} ({s.ownerId?.phone})</p>
                    <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                      Starting Price: ₹{s.startingPrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveStudio(s._id, 'approved')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Studio
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveStudio(s._id, 'rejected')}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
