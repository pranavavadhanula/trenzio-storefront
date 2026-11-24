import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Package } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id') || '';
  const orderId = searchParams.get('order_id') || '';
  const amountParam = searchParams.get('amount');
  const amountINR = amountParam ? Number(amountParam) : null;

  return (
    <div className="min-h-[80vh] py-12 sm:py-20 max-w-4xl mx-auto px-6 sm:px-10 bg-[#F4F1EA] text-[#171717] font-sans">
      <div className="bg-white border border-[#DDD8CE] p-8 sm:p-14 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-700" />
        </div>

        <span className="block mt-6 text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold">
          Payment Successful
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-2">
          Thank You For Your Order
        </h1>
        <p className="text-sm text-[#706B64] mt-4 max-w-md mx-auto leading-relaxed">
          Your payment has been received and verified. A confirmation with your order details and
          tracking link will be sent to your registered email shortly.
        </p>

        <div className="mt-10 divide-y divide-[#DDD8CE] border-y border-[#DDD8CE] text-left">
          {orderId && (
            <div className="flex items-center justify-between py-4 gap-4">
              <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-semibold">Order ID</span>
              <span className="text-sm font-mono text-[#171717] break-all text-right">{orderId}</span>
            </div>
          )}
          {paymentId && (
            <div className="flex items-center justify-between py-4 gap-4">
              <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-semibold">Payment ID</span>
              <span className="text-sm font-mono text-[#171717] break-all text-right">{paymentId}</span>
            </div>
          )}
          {amountINR !== null && Number.isFinite(amountINR) && (
            <div className="flex items-center justify-between py-4 gap-4">
              <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-semibold">Amount Paid</span>
              <span className="text-lg font-serif text-[#171717]">
                ₹{amountINR.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#171717] text-white text-[11px] uppercase tracking-widest font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/account"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#DDD8CE] text-[#171717] text-[11px] uppercase tracking-widest font-medium hover:bg-[#F4F1EA] transition-colors"
          >
            <Package className="w-4 h-4" />
            View My Orders
          </Link>
        </div>

        <p className="mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#706B64]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          Secured by Razorpay · 256-bit encrypted
        </p>
      </div>
    </div>
  );
};
