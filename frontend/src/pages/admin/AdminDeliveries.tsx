import React, { useState, useEffect } from 'react';
import { Truck, Search, MapPin, CheckCircle2, Clock, AlertCircle, Plus, X, Navigation, PackageCheck, Send } from 'lucide-react';
import api from '../../api/client';

export const AdminDeliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Checkpoint & Status Modal State
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>('in_transit');
  const [checkpointStage, setCheckpointStage] = useState<string>('');
  const [checkpointLocation, setCheckpointLocation] = useState<string>('Central Logistics Hub, Chennai');
  const [checkpointDesc, setCheckpointDesc] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/deliveries');
      if (res.data.success) {
        setDeliveries(res.data.deliveries || []);
      }
    } catch (e) {
      console.error('Failed to load deliveries:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const openCheckpointModal = (del: any) => {
    setSelectedDelivery(del);
    const nextStatusMap: Record<string, string> = {
      ready: 'dispatched',
      dispatched: 'picked_up',
      picked_up: 'in_transit',
      in_transit: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: 'completed',
      completed: 'completed'
    };
    const next = nextStatusMap[del.status] || 'in_transit';
    setTargetStatus(next);
    setCheckpointStage(next === 'delivered' ? 'Delivered to Recipient' : `Package in transit (${next.replace('_', ' ')})`);
    setCheckpointLocation('Blue Dart South Hub, Chennai');
    setCheckpointDesc(`Status progressed to ${next.replace('_', ' ')}`);
    setFeedback(null);
  };

  const handleSaveCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    try {
      setIsUpdating(true);
      setFeedback(null);

      const res = await api.put(`/admin/deliveries/${selectedDelivery._id}/status`, {
        status: targetStatus,
        stage: checkpointStage.trim() || targetStatus.replace('_', ' '),
        location: checkpointLocation.trim() || 'Logistics Hub',
        description: checkpointDesc.trim() || `Shipment checkpoint reached`
      });

      if (res.data.success) {
        setFeedback({ type: 'success', text: `Shipment #${selectedDelivery.trackingNumber} updated to ${targetStatus.replace('_', ' ')}` });
        setTimeout(() => {
          setSelectedDelivery(null);
          fetchDeliveries();
        }, 1000);
      } else {
        setFeedback({ type: 'error', text: res.data.message || 'Failed to update delivery' });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Error updating courier checkpoint'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickMarkDelivered = async (id: string, trackingNumber: string) => {
    try {
      await api.put(`/admin/deliveries/${id}/status`, {
        status: 'delivered',
        stage: 'Delivered to recipient',
        location: 'Destination Address',
        description: 'Package successfully delivered and signed by customer'
      });
      fetchDeliveries();
    } catch (e) {
      alert('Failed to update delivery status');
    }
  };

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      d.deliveryAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      d.deliveryAddress?.city?.toLowerCase().includes(search.toLowerCase()) ||
      d.senderAddress?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter.toLowerCase().replace(/ /g, '_');
    return matchesSearch && matchesStatus;
  });

  const inTransitCount = deliveries.filter((d) => ['picked_up', 'in_transit', 'out_for_delivery'].includes(d.status)).length;
  const deliveredCount = deliveries.filter((d) => ['delivered', 'completed'].includes(d.status)).length;
  const readyCount = deliveries.filter((d) => ['ready', 'dispatched'].includes(d.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Logistics & Courier</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Blue Dart Shipments</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track airway bill numbers, dispatch timelines, and delivery confirmations</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto overflow-x-auto">
          {['All', 'Ready', 'In Transit', 'Out For Delivery', 'Delivered'].map((st) => (
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

      {/* Aggregate Logistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Shipments</span>
          <p className="text-xl font-black text-white mt-1 font-mono">{deliveries.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Live AWB trackings</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Ready / Dispatched</span>
          <p className="text-xl font-black text-purple-400 mt-1 font-mono">{readyCount}</p>
          <span className="text-[10px] text-purple-400/80 mt-1 block">Studio fulfillment stage</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Active In Transit</span>
          <p className="text-xl font-black text-amber-400 mt-1 font-mono">{inTransitCount}</p>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Courier air & road transit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Delivered & Complete</span>
          <p className="text-xl font-black text-emerald-400 mt-1 font-mono">{deliveredCount}</p>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">Proof of delivery signed</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Airway Bill (AWB), customer name, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading shipment tracking...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No courier shipments found matching your search or filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((del) => (
            <div key={del._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-purple-400">AWB: #{del.trackingNumber}</span>
                    <span className="block text-[11px] text-slate-400">Courier: {del.courierName || 'Blue Dart Air Express'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    del.status === 'delivered' || del.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : del.status === 'out_for_delivery'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                  }`}>
                    {del.status?.replace(/_/g, ' ')}
                  </span>

                  <button
                    onClick={() => openCheckpointModal(del)}
                    className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Update Checkpoint
                  </button>

                  {del.status !== 'delivered' && del.status !== 'completed' && (
                    <button
                      onClick={() => handleQuickMarkDelivered(del._id, del.trackingNumber)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-md flex items-center gap-1"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Destination Customer & Address</span>
                  <p className="text-white font-semibold">{del.deliveryAddress?.fullName} ({del.deliveryAddress?.phone})</p>
                  <p className="text-slate-400">{del.deliveryAddress?.street}, {del.deliveryAddress?.city}, {del.deliveryAddress?.state} - {del.deliveryAddress?.pincode}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Origin Studio & Dispatcher</span>
                  <p className="text-white font-semibold">{del.senderAddress?.name || 'Studio Partner'}</p>
                  <p className="text-slate-400">{del.senderAddress?.street}, {del.senderAddress?.city}</p>
                </div>
              </div>

              {/* Transit Timeline Checkpoints */}
              {del.trackingTimeline && del.trackingTimeline.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
                    Transit Checkpoints ({del.trackingTimeline.length})
                  </span>
                  <div className="space-y-2 text-[11px]">
                    {del.trackingTimeline.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 border-l-2 border-purple-500/40 pl-3 py-0.5">
                        <div>
                          <strong className="text-slate-200 block sm:inline mr-2">• {item.stage}</strong>
                          <span className="text-slate-400 text-[10px]">({item.location})</span>
                          {item.description && (
                            <span className="text-slate-500 block text-[10px] italic">{item.description}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5 sm:mt-0">
                          {new Date(item.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Checkpoint & Progression Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Logistics Checkpoint Update</h3>
                  <span className="font-mono text-[11px] text-purple-400">AWB #{selectedDelivery.trackingNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/50 border border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSaveCheckpoint} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Progress Shipment Stage</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="ready">Ready (Awaiting Courier Pickup)</option>
                  <option value="dispatched">Dispatched (Left Studio Origin)</option>
                  <option value="picked_up">Picked Up (In Courier Possession)</option>
                  <option value="in_transit">In Transit (Inter-Hub Transit)</option>
                  <option value="out_for_delivery">Out For Delivery (Courier on Route)</option>
                  <option value="delivered">Delivered (Received & Confirmed)</option>
                  <option value="completed">Completed (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Checkpoint Title / Action</label>
                <input
                  type="text"
                  value={checkpointStage}
                  onChange={(e) => setCheckpointStage(e.target.value)}
                  placeholder="e.g. Arrived at Sort Hub, Cleared for dispatch..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Current Facility / Location</label>
                <input
                  type="text"
                  value={checkpointLocation}
                  onChange={(e) => setCheckpointLocation(e.target.value)}
                  placeholder="e.g. Blue Dart Hub, Chennai / Bengaluru Sort Facility"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Checkpoint Remarks (Optional)</label>
                <input
                  type="text"
                  value={checkpointDesc}
                  onChange={(e) => setCheckpointDesc(e.target.value)}
                  placeholder="e.g. Scanned at delivery dock, in safe custody"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDelivery(null)}
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
                  {isUpdating ? 'Saving...' : 'Add Checkpoint & Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
