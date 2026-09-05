import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter, Sparkles, TrendingUp, DollarSign, Store, ShoppingBag, Layers, Star, RefreshCw } from 'lucide-react';
import api from '../../api/client';

export const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/reports');
      if (res.data.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredCategories = (reportData?.categoryReport || []).filter((r: any) =>
    r.category?.toLowerCase().includes(searchCategory.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Business Intelligence</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Financial & Sales Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time revenue, photoshoot category volumes, and studio performance from MongoDB</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> Refresh
          </button>
          <button
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <Download className="w-4 h-4" /> Export / Print
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs font-semibold">Aggregating live platform revenue & categories...</p>
        </div>
      ) : reportData ? (
        <>
          {/* High-level Aggregate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Gross Platform GMV</span>
              <p className="text-3xl font-black text-white font-mono">
                ₹{(reportData.summary?.totalRevenue || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Combined Bookings & Keepsakes
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Platform Net Commission (10%)</span>
              <p className="text-3xl font-black text-purple-400 font-mono">
                ₹{(reportData.summary?.platformCommission || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-purple-300 font-semibold">Net Retained Platform Revenue</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Net Studio Payouts (90%)</span>
              <p className="text-3xl font-black text-amber-400 font-mono">
                ₹{(reportData.summary?.netStudioPayouts || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-amber-300 font-semibold">Partner Studio Earnings</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Total Paid Transactions</span>
              <p className="text-3xl font-black text-white font-mono">
                {(reportData.summary?.totalBookings || 0) + (reportData.summary?.totalOrders || 0)}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">
                {reportData.summary?.totalBookings || 0} shoots • {reportData.summary?.totalOrders || 0} orders
              </span>
            </div>
          </div>

          {/* Category Financial Breakdown Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Photoshoot Category & Physical Products Financial Breakdown
                </h3>
                <span className="text-[11px] text-slate-400">Calculated directly from confirmed bookings and paid orders</span>
              </div>
              <input
                type="text"
                placeholder="Filter by category name..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 max-w-xs"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-4">Photoshoot Category / Service</th>
                    <th className="p-4">Paid Bookings / Orders</th>
                    <th className="p-4">Gross Sales Volume</th>
                    <th className="p-4">Platform Fee (10%)</th>
                    <th className="p-4 text-right">Studio Payout (90%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredCategories.map((r: any) => (
                    <tr key={r.category} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        {r.category}
                      </td>
                      <td className="p-4 font-semibold text-slate-300">
                        {r.bookings} transaction(s)
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        ₹{r.sales?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-mono font-bold text-purple-400">
                        ₹{r.commission?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400">
                        ₹{Math.round(r.sales * 0.9).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Status Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Photoshoot Bookings Pipeline
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Confirmed</span>
                  <p className="text-lg font-mono font-black text-emerald-400 mt-0.5">
                    {reportData.bookingStatusCounts?.confirmed || 0}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">In Progress</span>
                  <p className="text-lg font-mono font-black text-purple-400 mt-0.5">
                    {reportData.bookingStatusCounts?.in_progress || 0}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                  <p className="text-lg font-mono font-black text-blue-400 mt-0.5">
                    {reportData.bookingStatusCounts?.completed || 0}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cancelled</span>
                  <p className="text-lg font-mono font-black text-rose-400 mt-0.5">
                    {reportData.bookingStatusCounts?.cancelled || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                Physical Keepsake Orders Pipeline
              </h3>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Order Placed</span>
                  <p className="text-base font-mono font-black text-amber-400 mt-0.5">
                    {reportData.orderStatusCounts?.order_placed || 0}
                  </p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Paid / Printing</span>
                  <p className="text-base font-mono font-black text-purple-400 mt-0.5">
                    {(reportData.orderStatusCounts?.payment_confirmed || 0) + (reportData.orderStatusCounts?.printing || 0)}
                  </p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Delivered</span>
                  <p className="text-base font-mono font-black text-emerald-400 mt-0.5">
                    {reportData.orderStatusCounts?.delivered || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Studios Leaderboard */}
          {reportData.studioPerformance && reportData.studioPerformance.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-purple-400" />
                  Top Performing Studios Leaderboard
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Ranked by photoshoot volume and verified ratings</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Studio Name</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Total Bookings</th>
                      <th className="p-4 text-right">Gross Bookings Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {reportData.studioPerformance.map((s: any) => (
                      <tr key={s.studioId} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-bold text-white">{s.name}</td>
                        <td className="p-4 text-slate-300">{s.city}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {s.rating || 5.0}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-purple-300">{s.bookingsCount} shoot(s)</td>
                        <td className="p-4 text-right font-mono font-bold text-emerald-400">
                          ₹{s.revenue?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          Failed to load business intelligence reports.
        </div>
      )}
    </div>
  );
};
