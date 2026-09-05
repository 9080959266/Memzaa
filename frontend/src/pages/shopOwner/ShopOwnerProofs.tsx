import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Eye, CheckCircle2, Clock, MessageSquare, Plus, Upload, Check } from 'lucide-react';
import api from '../../api/client';
import { IProof } from '../../types';

export const ShopOwnerProofs: React.FC = () => {
  const [proofs, setProofs] = useState<IProof[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [proofTitle, setProofTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProofs = async () => {
    try {
      setIsLoading(true);
      const [proofsRes, jobsRes] = await Promise.all([
        api.get('/proofs/studio-proofs'),
        api.get('/photo-jobs/kanban')
      ]);

      if (proofsRes.data.success) {
        setProofs(proofsRes.data.proofs || []);
      }

      if (jobsRes.data.success) {
        const allJobs: any[] = [];
        Object.values(jobsRes.data.kanbanColumns || {}).forEach((col: any) => {
          if (Array.isArray(col)) allJobs.push(...col);
        });
        setJobs(allJobs);
        if (allJobs.length > 0) {
          setSelectedJobId(allJobs[0]._id);
        }
      }
    } catch (err) {
      console.error('Studio proofs fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleCreateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post('/proofs', {
        photoJobId: selectedJobId,
        title: proofTitle || 'Retouched Draft Proof v1',
        previewUrls: [previewUrl],
        highResUrls: [previewUrl],
      });

      if (res.data.success) {
        setIsModalOpen(false);
        setProofTitle('');
        fetchProofs();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to upload proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Client Proof Tracking</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Proof Management & Approvals</h1>
          <p className="text-xs text-slate-400 mt-0.5">Upload watermarked proofs, track customer revisions, and approval stamps</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Proof</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading studio proofs...</p>
        </div>
      ) : proofs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No proofs uploaded yet. Click "Upload New Proof" to share retouched drafts with clients!
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

      {/* Upload Proof Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-black text-white">Upload Digital Proof</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProof} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Photo Job</label>
                <select
                  required
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.jobId} — {j.title} ({j.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Proof Title</label>
                <input
                  type="text"
                  required
                  value={proofTitle}
                  onChange={(e) => setProofTitle(e.target.value)}
                  placeholder="e.g. Wedding Album Layout Draft 1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Watermarked Preview URL</label>
                <input
                  type="url"
                  required
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {isSubmitting ? 'Uploading...' : 'Send to Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
