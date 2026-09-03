import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import api from '../../api/client';
import { IProof } from '../../types';
import { ProofReviewModal } from '../../components/customer/ProofReviewModal';

export const Proofs: React.FC = () => {
  const [proofs, setProofs] = useState<IProof[]>([]);
  const [selectedProof, setSelectedProof] = useState<IProof | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProofs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/proofs/my-proofs');
      if (res.data.success) {
        setProofs(res.data.proofs);
      }
    } catch (err) {
      console.error('Fetch proofs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Quality Assurance</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">Photo Proof Approvals</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review digital retouches uploaded by your studio editor. Approve or request adjustments before printing!
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading photo proofs...</p>
        </div>
      ) : proofs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Photo Proofs Pending Review</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When your studio uploads retouched color grades for your photoshoot, they will appear here for your review!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proofs.map((proof) => {
            const isApproved = proof.status === 'approved';

            return (
              <div
                key={proof._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      #{proof.proofId} (v{proof.version})
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isApproved ? 'Approved by You' : 'Pending Customer Review'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{proof.title}</h3>
                    <p className="text-xs text-amber-700 font-semibold">{proof.studioId?.name}</p>
                  </div>

                  {/* Preview Thumbnails */}
                  <div className="grid grid-cols-3 gap-2">
                    {proof.previewUrls?.slice(0, 3).map((url, idx) => (
                      <div key={idx} className="relative h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {proof.previewUrls?.length} Retouched Draft Photos
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedProof(proof)}
                    className={`font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm ${
                      isApproved
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {isApproved ? 'View Approved Proof' : 'Review & Approve Proof'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedProof && (
        <ProofReviewModal
          isOpen={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          proof={selectedProof}
          onProofReviewed={fetchProofs}
        />
      )}
    </div>
  );
};
