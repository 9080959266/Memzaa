import React, { useState, useEffect } from 'react';
import { Kanban, Sparkles, RefreshCw, Plus } from 'lucide-react';
import api from '../../api/client';
import { KanbanBoard } from '../../components/shopOwner/KanbanBoard';

export const ShopOwnerKanban: React.FC = () => {
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKanbanJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/photo-jobs/kanban');
      if (res.data.success) {
        setColumns(res.data.kanbanColumns || {});
        setTotalJobs(res.data.totalJobs || 0);
      }
    } catch (err) {
      console.error('Kanban jobs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanJobs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Visual Order Workflow</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">
            Photo Job Kanban Board ({totalJobs} Active Projects)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag, advance or upload proofs across all 10 stages: New Order → Photo Upload → Editing → Proof → Customer Approval → Printing → QC → Ready → Delivery → Completed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchKanbanJobs}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Refresh Board
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-32">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading Kanban stages...</p>
        </div>
      ) : (
        <KanbanBoard
          columns={columns}
          onJobUpdated={fetchKanbanJobs}
        />
      )}
    </div>
  );
};
