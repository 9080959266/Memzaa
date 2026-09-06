import React, { useEffect, useMemo, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Receipt,
  CalendarDays,
  Wallet,
  IndianRupee,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

interface PaymentRecord {
  _id: string;
  paymentId: string;
  amount: number;
  currency?: string;
  gateway?: string;
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  status: 'success' | 'failed' | 'refunded' | 'initiated' | string;
  receiptNumber?: string;
  createdAt: string;
  bookingId?: {
    _id?: string;
    bookingId?: string;
    eventDate?: string;
    venueAddress?: string;
  } | null;
  orderId?: {
    _id?: string;
    orderId?: string;
    totalAmount?: number;
    currentStatus?: string;
  } | null;
}

export const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);

        const res = await api.get('/payments/history');

        if (res.data?.success) {
          setPayments(res.data.payments || []);
        }
      } catch (error: any) {
        console.error('Payment history error:', error);

        alert(
          error?.response?.data?.message ||
            error?.message ||
            'Failed to load payment history.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === 'all' || payment.status === statusFilter;

      const query = search.trim().toLowerCase();

      if (!query) {
        return matchesStatus;
      }

      const searchableText = [
        payment.paymentId,
        payment.receiptNumber,
        payment.gatewayPaymentId,
        payment.gatewayOrderId,
        payment.bookingId?.bookingId,
        payment.orderId?.orderId,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [payments, search, statusFilter]);

  const stats = useMemo(() => {
    const successful = payments.filter(
      (payment) => payment.status === 'success'
    );

    const failed = payments.filter(
      (payment) => payment.status === 'failed'
    );

    const refunded = payments.filter(
      (payment) => payment.status === 'refunded'
    );

    const totalPaid = successful.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    return {
      total: payments.length,
      successful: successful.length,
      failed: failed.length,
      refunded: refunded.length,
      totalPaid,
    };
  }, [payments]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle2;

      case 'failed':
        return XCircle;

      case 'refunded':
        return RotateCcw;

      default:
        return CreditCard;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Payment Successful';

      case 'failed':
        return 'Payment Failed';

      case 'refunded':
        return 'Payment Refunded';

      case 'initiated':
        return 'Payment Initiated';

      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      case 'refunded':
        return 'bg-violet-50 text-violet-700 border-violet-200';

      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const getInvoiceId = (payment: PaymentRecord) => {
    return payment.orderId?._id || payment.orderId?.orderId || '';
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />

        <p className="text-xs text-slate-500 font-semibold">
          Loading payment history...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
          Your MEMORA
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
          Payment History
        </h1>

        <p className="text-xs text-slate-500 mt-1">
          View all your booking and order payment transactions in one place.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5" />
          </div>

          <p className="text-[11px] text-slate-500 font-semibold">
            Total Paid
          </p>

          <p className="text-xl font-black text-slate-900 mt-1">
            {formatAmount(stats.totalPaid)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <p className="text-[11px] text-slate-500 font-semibold">
            Successful
          </p>

          <p className="text-xl font-black text-slate-900 mt-1">
            {stats.successful}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <XCircle className="w-5 h-5" />
          </div>

          <p className="text-[11px] text-slate-500 font-semibold">
            Failed
          </p>

          <p className="text-xl font-black text-slate-900 mt-1">
            {stats.failed}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
            <RotateCcw className="w-5 h-5" />
          </div>

          <p className="text-[11px] text-slate-500 font-semibold">
            Refunded
          </p>

          <p className="text-xl font-black text-slate-900 mt-1">
            {stats.refunded}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payment ID, receipt, booking or order..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-amber-500"
          >
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="initiated">Initiated</option>
          </select>
        </div>
      </div>

      {/* Payment list */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-7 h-7" />
          </div>

          <h2 className="text-base font-bold text-slate-900">
            No Payments Found
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {payments.length === 0
              ? 'Your payment transactions will appear here after you make a booking or order.'
              : 'Try changing your search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            const StatusIcon = getStatusIcon(payment.status);
            const invoiceId = getInvoiceId(payment);

            return (
              <div
                key={payment._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {payment.paymentId}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${getStatusClasses(
                            payment.status
                          )}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {getStatusLabel(payment.status)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(payment.createdAt)}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-600">
                        <span>
                          Gateway:{' '}
                          <strong className="text-slate-800 uppercase">
                            {payment.gateway || 'N/A'}
                          </strong>
                        </span>

                        {payment.receiptNumber && (
                          <span>
                            Receipt:{' '}
                            <strong className="text-slate-800">
                              {payment.receiptNumber}
                            </strong>
                          </span>
                        )}
                      </div>

                      {payment.bookingId && (
                        <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-600">
                          <CalendarDays className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />

                          <div>
                            <span className="font-semibold">
                              Booking:
                            </span>{' '}
                            {payment.bookingId.bookingId ||
                              payment.bookingId._id ||
                              'Booking'}
                          </div>
                        </div>
                      )}

                      {payment.orderId && (
                        <div className="mt-1 flex items-start gap-2 text-[11px] text-slate-600">
                          <Receipt className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />

                          <div>
                            <span className="font-semibold">
                              Order:
                            </span>{' '}
                            {payment.orderId.orderId ||
                              payment.orderId._id ||
                              'Order'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:text-right flex-shrink-0">
                    <p className="text-xl font-black text-slate-900">
                      {formatAmount(payment.amount)}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                      {payment.currency || 'INR'}
                    </p>

                    {invoiceId &&
                      payment.status === 'success' && (
                        <Link
                          to={`/invoices/${invoiceId}`}
                          className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-700 hover:text-amber-800"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Invoice
                        </Link>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};