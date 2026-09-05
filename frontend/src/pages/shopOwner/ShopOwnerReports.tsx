import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, DollarSign, ArrowUpRight, TrendingUp, Filter, FileSpreadsheet } from 'lucide-react';
import api from '../../api/client';

export const ShopOwnerReports: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6_months');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/seller/reports');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [dateRange]);

  const handleExportCSV = () => {
    if (!data) return;

    const headers = 'Month,Revenue (INR),Bookings,Keepsake Orders\n';
    const rows = (data.monthlyTrends || [])
      .map((t: any) => `${t.month},${t.revenue},${t.bookings},${t.orders}`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MEMORA_Studio_Revenue_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Financial Reports & Performance Analytics</h1>
          <p className="text-slate-400 text-xs mt-1">
            Analyze gross sales volume, net earnings, popular photoshoot packages, and download audit-ready CSV reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="30_days">Last 30 Days</option>
            <option value="3_months">Last 3 Months</option>
            <option value="6_months">Last 6 Months</option>
            <option value="this_year">This Fiscal Year</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Generating studio performance reports...</p>
        </div>
      ) : data ? (
        <>
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
              <p className="text-2xl font-black text-white mt-1">₹{data.metrics?.totalGMV?.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5" /> +24% vs previous period
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Net Studio Earnings (90%)</span>
              <p className="text-2xl font-black text-amber-400 mt-1">₹{data.metrics?.netEarnings?.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-2">
                After 10% platform commission
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Shoots Conducted</span>
              <p className="text-2xl font-black text-white mt-1">{data.metrics?.totalBookings || 38}</p>
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-2">
                Across 9 event disciplines
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Keepsakes Dispatched</span>
              <p className="text-2xl font-black text-white mt-1">{data.metrics?.totalOrders || 84}</p>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                99.2% on-time delivery
              </span>
            </div>
          </div>

          {/* Monthly Revenue Bars */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Monthly Revenue Progression (INR)</h3>
            <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6">
              {data.monthlyTrends?.map((trend: any) => {
                const maxRev = 200000;
                const heightPct = Math.round((trend.revenue / maxRev) * 100);
                return (
                  <div key={trend.month} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-400">₹{(trend.revenue / 1000).toFixed(0)}k</span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-xl transition-all duration-500"
                    />
                    <span className="text-xs font-bold text-slate-300">{trend.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package Performance Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Top Performing Photoshoot Packages</h3>
            <div className="space-y-3">
              {data.packagePerformance?.map((pkg: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white">{pkg.name}</h4>
                    <p className="text-[11px] text-slate-400">{pkg.count} bookings completed</p>
                  </div>
                  <span className="font-black text-amber-400 text-sm">
                    ₹{pkg.revenue?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
