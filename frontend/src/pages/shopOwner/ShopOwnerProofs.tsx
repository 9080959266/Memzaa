import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Eye, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import api from '../../api/client';
import { IProof } from '../../types';

export const ShopOwnerProofs: React.FC = () => {
  const [proofs, setProofs] = useState<IProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/proofs/studio-proofs');
        if (res.data.success) {
          setProofs(res.data.proofs || []);
        }
      } catch (err) {
        console.error('Studio proofs fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProofs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Client Proof Tracking</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Proof Management & Approvals</h1>
        <p className="text-xs text-slate-400 mt-0.5">Track customer revision requests, approvals, and comments</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading studio proofs...</p>
        </div>
      ) : proofs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No proofs uploaded yet. Upload proofs directly from the Kanban board!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proofs.map((proof) => (
            <div key={proof._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">#{proof.proofId} (v{proof.version})</span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  proof.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {proof.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{proof.title}</h3>
                <p className="text-xs text-slate-400">Client: {proof.customerId?.name} ({proof.customerId?.email})</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {proof.previewUrls?.slice(0, 3).map((url, idx) => (
                  <div key={idx} className="relative h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {proof.customerFeedback && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Customer Feedback:</span>
                  <p className="italic leading-relaxed">"{proof.customerFeedback}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
