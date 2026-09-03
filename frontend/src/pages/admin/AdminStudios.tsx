import React, { useState, useEffect } from 'react';
import { Store, CheckCircle2, XCircle, ShieldCheck, MapPin, Search } from 'lucide-react';
import api from '../../api/client';
import { IStudio } from '../../types';

export const AdminStudios: React.FC = () => {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudios = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/studios?limit=50');
      if (res.data.success) {
        setStudios(res.data.studios || []);
      }
    } catch (err) {
      console.error('Fetch studios error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/studios/${id}/moderate`, { status });
      fetchStudios();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Partner Verification</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Studio Verification & Moderation</h1>
        <p className="text-xs text-slate-400 mt-0.5">Approve, verify, or suspend studio partners across India</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading studios directory...</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">Studio Information</th>
                <th className="p-4">City</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {studios.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img src={s.logoImage} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                    <div>
                      <h4 className="font-bold text-white">{s.name}</h4>
                      <p className="text-[11px] text-slate-400">{s.phone} • {s.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">{s.city}</td>
                  <td className="p-4 font-bold text-amber-400">⭐ {s.rating.toFixed(1)} ({s.reviewCount})</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      s.verifiedStatus === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {s.verifiedStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {s.verifiedStatus !== 'approved' ? (
                      <button
                        type="button"
                        onClick={() => handleModerate(s._id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleModerate(s._id, 'rejected')}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
