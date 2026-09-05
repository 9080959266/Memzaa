import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Clock, AlertCircle, Search, Filter, ShieldAlert, X, Edit3, User, Calendar } from 'lucide-react';
import api from '../../api/client';

export const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Interactive Ticket Resolution Modal
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('resolved');
  const [resolutionText, setResolutionText] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const openResolutionModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status === 'open' ? 'in_investigation' : ticket.status === 'in_investigation' ? 'resolved' : ticket.status);
    setResolutionText(ticket.resolution || '');
    setUpdateFeedback(null);
  };

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setIsUpdating(true);
      setUpdateFeedback(null);

      const res = await api.put(`/admin/complaints/${selectedTicket._id}/status`, {
        status: newStatus,
        resolution: resolutionText.trim() || 'Reviewed and resolved by Platform Admin'
      });

      if (res.data.success) {
        setUpdateFeedback({ type: 'success', text: `Ticket #${selectedTicket.ticketId} updated to ${newStatus.replace('_', ' ')}.` });
        setTimeout(() => {
          setSelectedTicket(null);
          fetchComplaints();
        }, 1000);
      } else {
        setUpdateFeedback({ type: 'error', text: res.data.message || 'Failed to update ticket' });
      }
    } catch (err: any) {
      setUpdateFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update ticket status'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.ticketId?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || c.status?.toLowerCase() === statusFilter.toLowerCase().replace(' ', '_');

    return matchesSearch && matchesStatus;
  });

  const openCount = complaints.filter((c) => c.status === 'open').length;
  const inInvestigationCount = complaints.filter((c) => c.status === 'in_investigation').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Customer Support & Disputes</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Complaints & Tickets Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage customer inquiries, studio dispute resolutions, and platform service feedback</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto overflow-x-auto">
          {['All', 'Open', 'In Investigation', 'Resolved', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                statusFilter === st ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Ticket Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Support Tickets</span>
          <p className="text-xl font-black text-white mt-1 font-mono">{complaints.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Live customer issues</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Awaiting Review (Open)</span>
          <p className="text-xl font-black text-rose-400 mt-1 font-mono">{openCount}</p>
          <span className="text-[10px] text-rose-400/80 mt-1 block">Requires immediate triage</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">In Investigation</span>
          <p className="text-xl font-black text-amber-400 mt-1 font-mono">{inInvestigationCount}</p>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Studio inquiry underway</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Resolved & Closed</span>
          <p className="text-xl font-black text-emerald-400 mt-1 font-mono">{resolvedCount}</p>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">Satisfied resolutions</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by ID, customer name, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading dispute tickets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-400">All customer orders and studio bookings match your criteria or are operating smoothly!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-purple-400">#{c.ticketId}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Category: {c.targetType || 'general'}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    c.priority === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : c.priority === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    Priority: {c.priority || 'medium'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    c.status === 'resolved' || c.status === 'closed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : c.status === 'in_investigation'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {c.status?.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => openResolutionModal(c)}
                    className="inline-flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-xl text-xs font-bold transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Manage Ticket
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1">{c.subject}</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  {c.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Customer: <strong className="text-slate-200">{c.userId?.name || 'Customer'}</strong> ({c.userId?.email || 'N/A'}{c.userId?.phone ? ` • ${c.userId?.phone}` : ''})</span>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Created: {new Date(c.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {c.resolution && (
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3 text-xs text-emerald-300">
                  <strong className="block text-[10px] uppercase font-bold text-emerald-400 mb-0.5">Resolution Notes:</strong>
                  <span>{c.resolution}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ticket Management & Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Dispute Triage & Resolution</h3>
                  <span className="font-mono text-[11px] text-purple-400">Ticket #{selectedTicket.ticketId}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateFeedback && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold ${
                  updateFeedback.type === 'success'
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/50 border border-rose-500/30 text-rose-300'
                }`}
              >
                {updateFeedback.text}
              </div>
            )}

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400">Customer:</span>{' '}
                <strong className="text-white">{selectedTicket.userId?.name}</strong>{' '}
                <span className="text-slate-400">({selectedTicket.userId?.email})</span>
              </div>
              <div>
                <span className="text-slate-400">Subject:</span>{' '}
                <strong className="text-white">{selectedTicket.subject}</strong>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block mb-0.5">Complaint Summary:</span>
                <p className="text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {selectedTicket.description}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveResolution} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Update Ticket Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="open">Open (Awaiting Initial Action)</option>
                  <option value="in_investigation">In Investigation (Auditing Studio / Logs)</option>
                  <option value="resolved">Resolved (Issue Addressed & Settled)</option>
                  <option value="closed">Closed (Ticket Concluded)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Resolution Remarks / Notes for Customer</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Explain actions taken (e.g. refund initiated, photoshoot rescheduled, studio warned, replacement frame dispatched)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Ticket Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
