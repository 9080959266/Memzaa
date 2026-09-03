import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Sparkles, 
  User, 
  Eye, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { IPhotoJob } from '../../types';
import api from '../../api/client';
import { Modal } from '../common/Modal';

interface KanbanBoardProps {
  columns: Record<string, IPhotoJob[]>;
  onJobUpdated: () => void;
}

const STAGES = [
  { key: 'NEW_ORDER', label: 'New Order', color: 'bg-blue-500' },
  { key: 'PHOTOS_UPLOADED', label: 'Photos Uploaded', color: 'bg-indigo-500' },
  { key: 'EDITING', label: 'Editing & Retouching', color: 'bg-purple-500' },
  { key: 'PROOF_READY', label: 'Proof Ready', color: 'bg-amber-500' },
  { key: 'CUSTOMER_APPROVAL', label: 'Customer Approval', color: 'bg-cyan-500' },
  { key: 'PRINTING', label: 'Printing & Lab', color: 'bg-orange-500' },
  { key: 'QUALITY_CHECK', label: 'Quality Check (QC)', color: 'bg-pink-500' },
  { key: 'READY', label: 'Ready for Dispatch', color: 'bg-emerald-500' },
  { key: 'DELIVERY', label: 'Out for Delivery', color: 'bg-teal-500' },
  { key: 'COMPLETED', label: 'Completed', color: 'bg-green-600' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onJobUpdated,
}) => {
  const [selectedJobForProof, setSelectedJobForProof] = useState<IPhotoJob | null>(null);
  const [proofTitle, setProofTitle] = useState('');
  const [proofUrlsText, setProofUrlsText] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  const [selectedJobForQC, setSelectedJobForQC] = useState<IPhotoJob | null>(null);

  const handleAdvanceStage = async (job: IPhotoJob, nextStageKey: string) => {
    try {
      await api.put(`/photo-jobs/${job._id}/stage`, { stage: nextStageKey });
      onJobUpdated();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to advance stage');
    }
  };

  const handleUploadProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForProof) return;

    try {
      setIsSubmittingProof(true);
      const urls = proofUrlsText
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

      const finalUrls = urls.length > 0 
        ? urls 
        : [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
          ];

      await api.post('/proofs', {
        photoJobId: selectedJobForProof._id,
        previewUrls: finalUrls,
        title: proofTitle || `${selectedJobForProof.title} - Draft Proof v${(selectedJobForProof.proofVersion || 0) + 1}`
      });

      alert('Proof uploaded and customer notified for approval!');
      setSelectedJobForProof(null);
      setProofUrlsText('');
      setProofTitle('');
      onJobUpdated();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload proof');
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleToggleQCCheck = async (job: IPhotoJob, itemIndex: number) => {
    const updatedChecklist = [...job.qcChecklist];
    updatedChecklist[itemIndex].checked = !updatedChecklist[itemIndex].checked;

    try {
      await api.put(`/photo-jobs/${job._id}/qc`, { qcChecklist: updatedChecklist });
      setSelectedJobForQC({ ...job, qcChecklist: updatedChecklist });
      onJobUpdated();
    } catch (err: any) {
      alert('Failed to update checklist');
    }
  };

  return (
    <div>
      {/* Horizontally Scrollable Kanban Column Board */}
      <div className="flex items-start gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {STAGES.map((stage, stageIdx) => {
          const jobList = columns[stage.key] || [];

          return (
            <div
              key={stage.key}
              className="w-72 sm:w-80 flex-shrink-0 bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 flex flex-col max-h-[78vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <h4 className="text-xs font-bold text-white tracking-wide">{stage.label}</h4>
                </div>
                <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {jobList.length}
                </span>
              </div>

              {/* Job Cards in Column */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {jobList.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-xs italic border-2 border-dashed border-slate-800/60 rounded-xl">
                    No jobs at this stage
                  </div>
                ) : (
                  jobList.map((job) => {
                    const priorityColors = {
                      low: 'bg-slate-800 text-slate-400',
                      medium: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
                      high: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
                      urgent: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
                    };

                    return (
                      <div
                        key={job._id}
                        className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Bar: ID and Priority */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono text-amber-400 font-bold">
                              #{job.jobId}
                            </span>
                            <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md ${priorityColors[job.priority] || priorityColors.medium}`}>
                              {job.priority}
                            </span>
                          </div>

                          {/* Title */}
                          <h5 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                            {job.title}
                          </h5>

                          {/* Customer & Due Date */}
                          <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                            {job.customerId && (
                              <div className="flex items-center gap-1.5 truncate">
                                <User className="w-3 h-3 text-slate-500" />
                                <span>{job.customerId.name}</span>
                              </div>
                            )}
                            {job.dueDate && (
                              <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>Due: {job.dueDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Proof / QC Badges */}
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-900">
                            {job.proofVersion > 0 && (
                              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-md border border-purple-500/30">
                                Proof v{job.proofVersion} ({job.customerApprovalStatus})
                              </span>
                            )}
                            {job.assignedEditor && (
                              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md">
                                🎨 {job.assignedEditor}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-1">
                          {/* Upload Proof Button if at Editing stage */}
                          {stage.key === 'EDITING' && (
                            <button
                              type="button"
                              onClick={() => setSelectedJobForProof(job)}
                              className="text-[10px] font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition flex items-center gap-1"
                            >
                              <Upload className="w-3 h-3" /> Proof
                            </button>
                          )}

                          {/* QC Checklist Button if at QC stage */}
                          {stage.key === 'QUALITY_CHECK' && (
                            <button
                              type="button"
                              onClick={() => setSelectedJobForQC(job)}
                              className="text-[10px] font-bold bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white px-2.5 py-1.5 rounded-lg border border-pink-500/30 transition flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3 h-3" /> QC Checklist
                            </button>
                          )}

                          {/* Move Backward */}
                          {stageIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStage(job, STAGES[stageIdx - 1].key)}
                              className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded transition"
                              title={`Move back to ${STAGES[stageIdx - 1].label}`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}

                          {/* Move Forward */}
                          {stageIdx < STAGES.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStage(job, STAGES[stageIdx + 1].key)}
                              className="ml-auto text-[10px] font-bold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                              title={`Advance to ${STAGES[stageIdx + 1].label}`}
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Proof Modal */}
      {selectedJobForProof && (
        <Modal
          isOpen={!!selectedJobForProof}
          onClose={() => setSelectedJobForProof(null)}
          title={`Upload Edited Proof: #${selectedJobForProof.jobId}`}
          subtitle={selectedJobForProof.title}
          maxWidth="lg"
        >
          <form onSubmit={handleUploadProofSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proof Title / Draft Name
              </label>
              <input
                type="text"
                placeholder={`Draft Color Grade v${(selectedJobForProof.proofVersion || 0) + 1}`}
                value={proofTitle}
                onChange={(e) => setProofTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Image Preview URLs (One URL per line)
              </label>
              <textarea
                rows={4}
                placeholder="https://images.unsplash.com/photo-1519741497674...&#10;https://images.unsplash.com/photo-1583939003..."
                value={proofUrlsText}
                onChange={(e) => setProofUrlsText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leave empty to automatically attach sample high-res preview proof images.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedJobForProof(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingProof}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmittingProof ? 'Uploading...' : 'Publish Proof to Customer'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* QC Checklist Modal */}
      {selectedJobForQC && (
        <Modal
          isOpen={!!selectedJobForQC}
          onClose={() => setSelectedJobForQC(null)}
          title={`Quality Inspection (QC): #${selectedJobForQC.jobId}`}
          subtitle={selectedJobForQC.title}
          maxWidth="md"
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Complete the mandatory print & framing quality checks before dispatch:
            </p>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedJobForQC.qcChecklist.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition text-xs font-medium text-slate-800"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleQCCheck(selectedJobForQC, idx)}
                    className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
                  />
                  <span className={item.checked ? 'line-through text-slate-400' : ''}>
                    {item.item}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setSelectedJobForQC(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                Save & Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
