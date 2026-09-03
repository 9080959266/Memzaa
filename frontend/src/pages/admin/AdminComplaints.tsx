import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../api/client';

export const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/complaints');
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error('Complaints error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/complaints/${id}/status`, { status, resolution: 'Resolved by Admin Staff' });
      fetchComplaints();
    } catch (err) {
      alert('Failed to update ticket');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Customer Support & Disputes</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Complaints & Tickets Center</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage customer inquiries, studio dispute resolutions, and feedback</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading dispute tickets...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Open Dispute Tickets</h3>
          <p className="text-xs text-slate-400">All customer orders and studio bookings are operating smoothly!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400">#{c.ticketId}</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                  {c.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{c.subject}</h4>
              <p className="text-xs text-slate-300">{c.description}</p>
              <div className="pt-2 flex justify-end">
                {c.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(c._id, 'resolved')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
