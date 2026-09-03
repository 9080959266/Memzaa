import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Sparkles, 
  ZoomIn, 
  Send, 
  ShieldCheck, 
  ThumbsUp, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { IProof } from '../../types';
import api from '../../api/client';

interface ProofReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proof: IProof | null;
  onProofReviewed?: () => void;
}

export const ProofReviewModal: React.FC<ProofReviewModalProps> = ({
  isOpen,
  onClose,
  proof,
  onProofReviewed,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [photoStatuses, setPhotoStatuses] = useState<Record<number, 'selected' | 'rejected'>>({});
  const [revisionComments, setRevisionComments] = useState<Record<number, string>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!proof) return null;

  const currentPhotoUrl = proof.previewUrls[activePhotoIdx];
  const isApproved = proof.status === 'approved';

  const handleToggleStatus = (idx: number, status: 'selected' | 'rejected') => {
    setPhotoStatuses(prev => ({
      ...prev,
      [idx]: prev[idx] === status ? undefined as any : status
    }));
  };

  const handleCommentChange = (idx: number, text: string) => {
    setRevisionComments(prev => ({
      ...prev,
      [idx]: text
    }));
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await api.put(`/proofs/${proof._id}/review`, {
        status: 'approved',
        customerFeedback: generalFeedback || 'Approved! Looks wonderful.'
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onProofReviewed) onProofReviewed();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!generalFeedback && Object.keys(revisionComments).length === 0) {
      alert('Please provide notes or comments explaining what changes you would like the studio to make.');
      return;
    }

    try {
      setIsSubmitting(true);
      const revisionRequests = Object.entries(revisionComments).map(([idx, comment]) => ({
        photoIndex: parseInt(idx),
        comment,
        requestedAt: new Date()
      }));

      await api.put(`/proofs/${proof._id}/review`, {
        status: 'changes_requested',
        customerFeedback: generalFeedback,
        revisionRequests
      });

      alert('Your revision feedback has been sent to the studio editor.');
      if (onProofReviewed) onProofReviewed();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit revision request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proof.title}
      subtitle={`Proof Version v${proof.version} • ${proof.previewUrls.length} Digital Preview Retouches`}
      maxWidth="5xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Large Photo Viewer with Zoom/Pan */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden p-4 flex flex-col items-center justify-center relative min-h-[420px] shadow-2xl border border-slate-800">
          <div className="relative w-full max-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={currentPhotoUrl}
              alt={`Proof draft ${activePhotoIdx + 1}`}
              className="max-h-[460px] w-auto object-contain rounded-xl shadow-lg"
            />

            {/* Watermark Notice */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 font-mono">
              MEMORA WATERMARKED DRAFT (High-res unwatermarked released on approval)
            </div>

            {/* Current Photo Status Badge */}
            {photoStatuses[activePhotoIdx] && (
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 ${
                photoStatuses[activePhotoIdx] === 'selected'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}>
                {photoStatuses[activePhotoIdx] === 'selected' ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {photoStatuses[activePhotoIdx] === 'selected' ? 'Selected for Print' : 'Changes Requested'}
              </div>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="w-full flex items-center gap-2 overflow-x-auto py-3 px-1 mt-2 scrollbar-thin">
            {proof.previewUrls.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                  activePhotoIdx === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Approval Controls & Comment Box */}
        <div className="lg:col-span-4 space-y-5">
          {/* Photo specific approval */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Photo #{activePhotoIdx + 1} Review</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {activePhotoIdx + 1} of {proof.previewUrls.length}
              </span>
            </h4>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleToggleStatus(activePhotoIdx, 'selected')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  photoStatuses[activePhotoIdx] === 'selected'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Photo
              </button>

              <button
                type="button"
                onClick={() => handleToggleStatus(activePhotoIdx, 'rejected')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  photoStatuses[activePhotoIdx] === 'rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <XCircle className="w-4 h-4" /> Request Change
              </button>
            </div>

            {/* Specific Photo Revision Comment */}
            <div>
              <input
                type="text"
                placeholder={`Revision comment for photo #${activePhotoIdx + 1}...`}
                value={revisionComments[activePhotoIdx] || ''}
                onChange={(e) => handleCommentChange(activePhotoIdx, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Overall Feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Overall Instructions / Feedback
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Skin tones look very natural! Please brighten the 2nd photo's temple backdrop slightly."
              value={generalFeedback}
              onChange={(e) => setGeneralFeedback(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={isSubmitting || isApproved}
              onClick={handleApprove}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4" />
              {isApproved ? 'Proof Already Approved' : 'Approve All Proofs & Start Printing'}
            </button>

            <button
              type="button"
              disabled={isSubmitting || isApproved}
              onClick={handleRequestChanges}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              Submit Revision Requests to Studio
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
