import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, Sparkles, TrendingUp, DollarSign } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30_days');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const reportData = [
    { category: 'Wedding Photography', sales: 245000, bookings: 18, commission: 24500 },
    { category: 'Pre-Wedding & Couple', sales: 112000, bookings: 14, commission: 11200 },
    { category: 'Baby & Newborn', sales: 78000, bookings: 11, commission: 7800 },
    { category: 'Puberty Ceremony (Manjal Neerattu)', sales: 64500, bookings: 8, commission: 6450 },
    { category: 'Photo Products & Frames', sales: 45500, bookings: 44, commission: 4550 },
  ];

  const totalSales = reportData.reduce((acc, r) => acc + r.sales, 0);
  const totalCommission = reportData.reduce((acc, r) => acc + r.commission, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Business Intelligence</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Financial & Sales Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive revenue, sales, and booking volume reports filtered by category</p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-purple-400" /> Export / Print Report
        </button>
      </div>

      {/* High-level Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Gross Platform Volume</span>
          <p className="text-3xl font-black text-white font-mono">₹{totalSales.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.5% Growth
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Platform 10% Net Commission</span>
          <p className="text-3xl font-black text-purple-400 font-mono">₹{totalCommission.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-purple-300 font-semibold">Realized Net Platform Profit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Transactions</span>
          <p className="text-3xl font-black text-amber-400 font-mono">95 Completed</p>
          <span className="text-[10px] text-slate-400 font-semibold">Average Order Value: ₹5,736</span>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Discipline & Category Financial Breakdown</h3>
          <span className="text-xs text-slate-400">All figures in INR (₹)</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-4">Photoshoot Category</th>
              <th className="p-4">Total Bookings / Orders</th>
              <th className="p-4">Gross Sales Volume</th>
              <th className="p-4 text-right">Platform Commission (10%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {reportData.map((r) => (
              <tr key={r.category} className="hover:bg-slate-800/40 transition">
                <td className="p-4 font-bold text-white">{r.category}</td>
                <td className="p-4 font-semibold text-slate-300">{r.bookings} shoots</td>
                <td className="p-4 font-mono font-bold text-white">₹{r.sales.toLocaleString('en-IN')}</td>
                <td className="p-4 text-right font-mono font-bold text-purple-400">₹{r.commission.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
