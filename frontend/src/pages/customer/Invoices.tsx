import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import { IInvoice } from '../../types';

export const Invoices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/invoices/${id}`);
        if (res.data.success) {
          setInvoice(res.data.invoice);
        }
      } catch (err) {
        console.error('Invoice fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Generating tax invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900">Invoice Not Found</h3>
        <Link to="/orders" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl mt-3 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Header (hidden in print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <button
          onClick={handlePrint}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print / Download PDF</span>
        </button>
      </div>

      {/* Tax Invoice Paper Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-lg text-slate-800 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-tight text-slate-900">
                MEM<span className="text-amber-600">ORA</span>
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                Tax Invoice / Bill of Supply
              </p>
            </div>
          </div>

          <div className="text-right text-xs space-y-0.5">
            <p className="font-mono text-sm font-black text-slate-900">Invoice: {invoice.invoiceNumber}</p>
            <p className="text-slate-500">Date: {new Date(invoice.issuedDate).toLocaleDateString('en-IN')}</p>
            <p className="text-emerald-600 font-bold">Status: {invoice.paymentStatus.toUpperCase()} ({invoice.paymentMethod})</p>
          </div>
        </div>

        {/* Seller & Buyer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-bold uppercase text-[10px] text-amber-800 tracking-wider">Sold & Issued By:</h4>
            <p className="font-bold text-slate-900">{invoice.sellerDetails?.businessName}</p>
            <p className="text-slate-600">{invoice.sellerDetails?.address}</p>
            <p className="text-slate-600">GSTIN: <strong className="text-slate-800">{invoice.sellerDetails?.gstin}</strong></p>
            <p className="text-slate-600">Email: {invoice.sellerDetails?.email}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold uppercase text-[10px] text-amber-800 tracking-wider">Billed To (Customer):</h4>
            <p className="font-bold text-slate-900">{invoice.customerDetails?.name}</p>
            <p className="text-slate-600">{invoice.customerDetails?.address}, {invoice.customerDetails?.city} - {invoice.customerDetails?.pincode}</p>
            <p className="text-slate-600">Phone: {invoice.customerDetails?.phone}</p>
            <p className="text-slate-600">Email: {invoice.customerDetails?.email}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">Item & Description</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Unit Price</th>
                <th className="py-3 px-2 text-right">Tax (GST)</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-2 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-2 font-semibold text-slate-900">{item.description}</td>
                  <td className="py-3 px-2 text-center">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2 text-right text-slate-500">{item.taxRate}%</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900 font-mono">₹{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="border-t border-slate-200 pt-4 flex flex-col items-end text-xs space-y-1.5">
          <div className="w-64 flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
          </div>

          {invoice.discount > 0 && (
            <div className="w-64 flex justify-between text-emerald-600 font-semibold">
              <span>Promo Discount:</span>
              <span className="font-mono">- ₹{invoice.discount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="w-64 flex justify-between text-slate-600">
            <span>Estimated GST (18% Included):</span>
            <span className="font-mono">₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="w-64 flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
            <span>Grand Total (INR):</span>
            <span className="text-amber-600 font-mono">₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Footer Disclaimers */}
        <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 text-center leading-relaxed">
          <p>This is a computer-generated tax invoice and requires no physical signature under Indian Information Technology Act.</p>
          <p>Thank you for choosing MEMORA. Capture Moments. Create Memories.</p>
        </div>
      </div>
    </div>
  );
};
