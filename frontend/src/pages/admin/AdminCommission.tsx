import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CheckCircle2, Clock, Building, ArrowUpRight } from 'lucide-react';
import api from '../../api/client';

export const AdminCommission: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/commission');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommission();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Revenue & Earnings</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Commission & Settlements</h1>
        <p className="text-xs text-slate-400 mt-0.5">Automated 10% platform fee calculations, fortnightly studio payouts, and bank settlement audit logs</p>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Calculating platform commission metrics...</p>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gross Platform GMV</span>
              <p className="text-2xl font-black text-white mt-1">₹{data.metrics?.grossGMV?.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-slate-400 block mt-2">Combined bookings + physical keepsakes</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">MEMORA Commission (10%)</span>
              <p className="text-2xl font-black text-purple-400 mt-1">₹{data.metrics?.platformCommission?.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5" /> Direct Net Revenue
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Net Studio Payouts (90%)</span>
              <p className="text-2xl font-black text-amber-400 mt-1">₹{data.metrics?.netStudioPayouts?.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-slate-400 block mt-2">Payable to partner photo studios</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Batch Settlement</span>
              <p className="text-2xl font-black text-white mt-1">₹{data.metrics?.pendingSettlement?.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-amber-400 font-semibold block mt-2">Due on 15th of month</span>
            </div>
          </div>

          {/* Fortnightly Batch Settlements Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Fortnightly Studio Settlement Batches</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated NEFT/RTGS transfers with bank UTR reference tracking</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Batch ID</th>
                    <th className="p-4">Billing Period</th>
                    <th className="p-4">Studios Count</th>
                    <th className="p-4">Total Net Payout</th>
                    <th className="p-4">Bank UTR Reference</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {data.settlementBatches?.map((batch: any) => (
                    <tr key={batch.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono font-bold text-purple-400">{batch.id}</td>
                      <td className="p-4 text-white font-semibold">{batch.period}</td>
                      <td className="p-4 text-slate-300">{batch.studiosCount} Studios</td>
                      <td className="p-4 font-bold text-emerald-400">₹{batch.totalAmount?.toLocaleString('en-IN')}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">{batch.utrNumber}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          batch.status === 'settled'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
