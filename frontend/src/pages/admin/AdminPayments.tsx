import React, { useState, useEffect } from 'react';
import { DollarSign, Search, CheckCircle2, XCircle, CreditCard, ArrowDownLeft, RotateCcw, X, AlertTriangle, Filter } from 'lucide-react';
import api from '../../api/client';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Refund Modal State
  const [refundTarget, setRefundTarget] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>('Customer requested cancellation');
  const [isRefunding, setIsRefunding] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/payments');
      if (res.data.success) {
        setPayments(res.data.payments || []);
      }
    } catch (e) {
      console.error('Failed to load payments:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openRefundModal = (pay: any) => {
    setRefundTarget(pay);
    setRefundAmount(pay.amount || 0);
    setRefundReason('Customer requested cancellation');
    setFeedbackMessage(null);
  };

  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;

    try {
      setIsRefunding(true);
      setFeedbackMessage(null);

      const res = await api.post('/payments/refund', {
        paymentId: refundTarget.paymentId,
        reason: refundReason,
        amount: Number(refundAmount)
      });

      if (res.data.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Refund of ₹${refundAmount} processed successfully for Payment #${refundTarget.paymentId}`
        });
        setTimeout(() => {
          setRefundTarget(null);
          fetchPayments();
        }, 1200);
      } else {
        setFeedbackMessage({ type: 'error', text: res.data.message || 'Refund processing failed' });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error communicating with refund gateway'
      });
    } finally {
      setIsRefunding(false);
    }
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.paymentId?.toLowerCase().includes(search.toLowerCase()) ||
      p.gatewayPaymentId?.toLowerCase().includes(search.toLowerCase()) ||
      p.gatewayOrderId?.toLowerCase().includes(search.toLowerCase()) ||
      p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.userId?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate real aggregates
  const totalVolume = payments
    .filter((p) => p.status === 'success')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'refunded')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const successCount = payments.filter((p) => p.status === 'success').length;
  const refundedCount = payments.filter((p) => p.status === 'refunded').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Gateway Transactions</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Payments & Settlements</h1>
          <p className="text-xs text-slate-400 mt-0.5">Complete ledger of Razorpay UPI, Cards, NetBanking, and refund transactions</p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto">
          {['All', 'Success', 'Refunded', 'Failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === st ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Ledger Entries</span>
          <p className="text-xl font-black text-white mt-1 font-mono">{payments.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Live DB records</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gross Settled Inflow</span>
          <p className="text-xl font-black text-emerald-400 mt-1 font-mono">₹{totalVolume.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">{successCount} successful</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Processed Refunds</span>
          <p className="text-xl font-black text-amber-400 mt-1 font-mono">₹{totalRefunded.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-amber-400/80 mt-1 block">{refundedCount} transactions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">10% Platform Fee</span>
          <p className="text-xl font-black text-purple-400 mt-1 font-mono">₹{Math.round(totalVolume * 0.10).toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-purple-400/80 mt-1 block">Platform earnings</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Payment ID, Gateway ID, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading platform transactions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No payment transactions match your search or filter criteria.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Payment ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Gateway Reference</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-purple-400">
                      #{pay.paymentId}
                    </td>
                    <td className="p-4">
                      <strong className="text-white block">{pay.userId?.name || 'Customer'}</strong>
                      <span className="text-[11px] text-slate-400">{pay.userId?.email}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-300">
                      <div>{pay.gatewayPaymentId || pay.gatewayOrderId || 'Direct INR'}</div>
                      {pay.bookingId && (
                        <span className="inline-block mt-0.5 text-[10px] text-purple-400 font-sans font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                          Booking #{pay.bookingId.bookingId || pay.bookingId}
                        </span>
                      )}
                      {pay.orderId && (
                        <span className="inline-block mt-0.5 text-[10px] text-amber-400 font-sans font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Order #{pay.orderId.orderId || pay.orderId}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      ₹{pay.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        pay.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : pay.status === 'refunded'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(pay.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right">
                      {pay.status === 'success' ? (
                        <button
                          onClick={() => openRefundModal(pay)}
                          className="inline-flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold text-xs transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Initiate Refund
                        </button>
                      ) : pay.status === 'refunded' ? (
                        <span className="text-[11px] text-slate-500 italic">Refunded</span>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Initiate Refund Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Initiate Payment Refund</h3>
                  <span className="font-mono text-[11px] text-amber-400">Payment #{refundTarget.paymentId}</span>
                </div>
              </div>
              <button
                onClick={() => setRefundTarget(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-start gap-2.5 text-amber-300 text-[11px]">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                Initiating a refund will mark this payment as refunded in the ledger, and automatically mark any associated booking or physical order as refunded/cancelled.
              </span>
            </div>

            {feedbackMessage && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/50 border border-rose-500/30 text-rose-300'
                }`}
              >
                {feedbackMessage.text}
              </div>
            )}

            <form onSubmit={handleExecuteRefund} className="space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Customer:</span>
                  <span className="text-white font-semibold">{refundTarget.userId?.name || 'Customer'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Gateway Ref:</span>
                  <span className="text-slate-200 font-mono">{refundTarget.gatewayPaymentId || 'Direct INR'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Original Settled:</span>
                  <span className="text-emerald-400 font-bold">₹{refundTarget.amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={refundTarget.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Refund Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Customer requested cancellation">Customer requested cancellation</option>
                  <option value="Duplicate payment made by customer">Duplicate payment made by customer</option>
                  <option value="Studio photoshoot rescheduled / cancelled">Studio photoshoot rescheduled / cancelled</option>
                  <option value="Print quality or delivery damage dispute">Print quality or delivery damage dispute</option>
                  <option value="Administrative courtesy reversal">Administrative courtesy reversal</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundTarget(null)}
                  disabled={isRefunding}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {isRefunding ? 'Processing...' : 'Confirm & Process Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
