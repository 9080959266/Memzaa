import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Sparkles } from 'lucide-react';
import api from '../../api/client';

export const ShopOwnerRevenue: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/seller/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Revenue error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  const chartData = data?.revenueChartData || [
    { month: 'Apr', revenue: 78000, bookings: 12, orders: 34 },
    { month: 'May', revenue: 92000, bookings: 15, orders: 48 },
    { month: 'Jun', revenue: 115000, bookings: 18, orders: 55 },
    { month: 'Jul', revenue: 138000, bookings: 22, orders: 68 },
    { month: 'Aug', revenue: 164000, bookings: 28, orders: 82 },
    { month: 'Sep', revenue: 189500, bookings: 31, orders: 94 }
  ];

  const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Financial Insights</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Revenue Dashboard & Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Earnings from wedding bookings, portrait sessions, and customized photo gifts</p>
        </div>
      </div>

      {/* Revenue High-level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Monthly Revenue (Sep)</span>
          <p className="text-3xl font-black text-amber-400 font-mono">₹1,89,500</p>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs Last Month
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Pending Client Balances</span>
          <p className="text-3xl font-black text-slate-200 font-mono">₹12,500</p>
          <span className="text-xs text-slate-400">Due on upcoming shoot dates</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Lifetime Earnings</span>
          <p className="text-3xl font-black text-emerald-400 font-mono">₹7,76,500</p>
          <span className="text-xs text-slate-400">Since Joining MEMORA</span>
        </div>
      </div>

      {/* Monthly Bar Chart (Pure CSS Modern Bar visualization) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Revenue Trends (Last 6 Months)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Includes session advance deposits and e-commerce product shares</p>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2 border-b border-slate-800">
          {chartData.map((d: any) => {
            const heightPercent = Math.round((d.revenue / maxRevenue) * 100);

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition">
                  ₹{(d.revenue / 1000).toFixed(0)}k
                </div>

                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-xl group-hover:scale-105 transition-all duration-300 shadow-md shadow-amber-500/10"
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-xs font-bold text-slate-400 mt-2">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
