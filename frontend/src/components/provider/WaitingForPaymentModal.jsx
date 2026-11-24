// Modal displayed to provider after Ending Code is verified until the customer completes payment.
// Automatically syncs and closes when payment is settled, redirecting the provider to their dashboard.

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Banknote,
  DollarSign,
  ArrowRight,
  Phone,
  User,
  Sparkles,
  CreditCard,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export const WaitingForPaymentModal = ({
  isOpen,
  onClose,
  booking,
  onCollectPaymentClick,
  isPaymentDone = false,
  countdown = 3,
  onRedirectNow,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-brand-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                  #{booking.id}
                </span>
                <span className="text-[11px] text-slate-300 font-semibold">• Ending Code Verified ✓</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {isPaymentDone ? 'Payment Confirmed & Closed!' : 'Waiting for Customer Payment'}
              </h3>
            </div>
          </div>

          {!isPaymentDone && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5">
          {isPaymentDone ? (
            /* SUCCESS STATE WHEN CUSTOMER PAYS */
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block uppercase">
                  Payment Succeeded
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2 font-mono">
                  {formatCurrency(booking.totalPrice)}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Customer <strong>{booking.customerName}</strong> has completed the payment. Earnings credited to your wallet!
                </p>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs font-semibold text-brand-900">
                Redirecting to Provider Dashboard in {countdown}s...
              </div>

              <Button
                type="button"
                variant="primary"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold"
                onClick={onRedirectNow}
              >
                Go to Dashboard Now
              </Button>
            </div>
          ) : (
            /* WAITING STATE */
            <div className="space-y-4">
              {/* Animated Waiting Callout */}
              <div className="p-4 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-10 w-10 bg-emerald-600 text-white items-center justify-center font-bold">
                    <Clock className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                    Listening Live
                  </span>
                  <h4 className="text-sm font-bold text-emerald-950 mt-1">
                    Waiting for customer to pay {formatCurrency(booking.totalPrice)}
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Customer has been prompted to pay on their screen. Once they complete payment, this window will automatically close.
                  </p>
                </div>
              </div>

              {/* Order & Customer Summary card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Service Name:</span>
                  <span className="font-bold text-slate-800">{booking.serviceTitle}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <span className="font-bold text-slate-800">{booking.customerName} ({booking.customerPhone})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Service Address:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[220px]">{booking.customerAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm">
                  <span className="text-slate-800 font-bold">Total Bill:</span>
                  <span className="font-mono font-black text-brand-700 text-base">{formatCurrency(booking.totalPrice)}</span>
                </div>
              </div>

              {/* Cash option if customer wants to pay provider in cash */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-start gap-2 text-xs text-amber-900">
                  <Banknote className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Customer paying in Cash?</span>
                    <span className="text-[11px] text-amber-800">
                      If the customer prefers to hand over physical cash or scan your QR code directly, you can settle it here.
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={onCollectPaymentClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  leftIcon={Banknote}
                >
                  Collect Cash / Open Payment Gateway ({formatCurrency(booking.totalPrice)})
                </Button>
              </div>

              {/* Minimize action */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
                >
                  Minimize popup and view job summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingForPaymentModal;
