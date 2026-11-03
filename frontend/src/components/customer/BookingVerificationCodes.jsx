// Ye component customer ko uski authorized booking ke Starting aur Ending Code safely screen par dikhata hai.
// Provider ko ye component/code response access nahi milna chahiye.

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Copy, Check, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';
import verificationService from '../../services/verificationService';

export const BookingVerificationCodes = ({ booking }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [showEndingCode, setShowEndingCode] = useState(false);
  const [startingCode, setStartingCode] = useState(booking?.startingCode || '');
  const [endingCode, setEndingCode] = useState(booking?.endingCode || '');
  const [loadingCodes, setLoadingCodes] = useState(!booking?.startingCode);

  useEffect(() => {
    if (booking?.startingCode && booking?.endingCode) {
      setStartingCode(booking.startingCode);
      setEndingCode(booking.endingCode);
      setLoadingCodes(false);
      return;
    }

    if (booking?.id) {
      verificationService
        .getCustomerCodes(booking.id)
        .then((res) => {
          if (res?.data) {
            setStartingCode(res.data.startingCode || '');
            setEndingCode(res.data.endingCode || '');
          }
        })
        .catch((err) => console.error('Could not fetch customer codes:', err))
        .finally(() => setLoadingCodes(false));
    }
  }, [booking?.id, booking?.startingCode, booking?.endingCode]);

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isStartedOrDone = [BOOKING_STATUS.STARTED, BOOKING_STATUS.COMPLETED, 'in_progress', 'completed'].includes(
    booking?.status
  );
  const isCompleted = [BOOKING_STATUS.COMPLETED, 'completed'].includes(booking?.status);

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-brand-50/70 border-b border-brand-100 p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand-500 text-white flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-dark">
              Dual-OTP Security Verification Codes
            </h3>
            <p className="text-xs text-content-secondary">
              Cryptographically generated and controlled exclusively by you for safety
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-brand-200 text-brand-700 shadow-subtle">
          Confidential
        </span>
      </div>

      {/* Prominent Warning Callout as required by Master Prompt */}
      <div className="p-4 mx-5 mt-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <p className="font-bold text-amber-900">
            Never share your Ending Code before the service has been completed.
          </p>
          <p className="mt-0.5">
            The Ending Code releases your payment to the provider. Share it only after you have tested the repair, inspected the work, and are completely satisfied.
          </p>
        </div>
      </div>

      {/* Verification Code Cards Grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Starting Code */}
        <div className={`p-4 rounded-xl border transition-all ${
          isStartedOrDone ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-content-dark flex items-center gap-1.5">
              <span>1. Starting Code</span>
              {isStartedOrDone && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                  VERIFIED ✓
                </span>
              )}
            </span>
            <span className="text-[10px] text-content-muted">Share upon technician arrival</span>
          </div>

          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-inner my-2">
            <span className="text-2xl font-mono font-extrabold tracking-widest text-brand-800">
              {loadingCodes ? '••••••' : startingCode || 'Pending'}
            </span>
            {startingCode && (
              <button
                type="button"
                onClick={() => copyToClipboard(startingCode, 'start')}
                className="p-1.5 text-content-muted hover:text-brand-600 transition-colors"
                title="Copy code"
              >
                {copiedCode === 'start' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>

          <p className="text-[11px] text-content-muted leading-tight">
            Provide to {booking?.providerName || 'technician'} when they reach your doorstep to begin work.
          </p>
        </div>

        {/* 2. Ending Code */}
        <div className={`p-4 rounded-xl border transition-all ${
          isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-rose-50/40 border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-content-dark flex items-center gap-1.5">
              <span>2. Ending Code</span>
              {isCompleted && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                  COMPLETED ✓
                </span>
              )}
            </span>
            <span className="text-[10px] text-rose-700 font-semibold">Share AFTER completion</span>
          </div>

          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-inner my-2">
            <span className="text-2xl font-mono font-extrabold tracking-widest text-content-dark">
              {loadingCodes ? '••••••' : showEndingCode ? endingCode || 'Pending' : '••••••'}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowEndingCode(!showEndingCode)}
                className="p-1.5 text-content-muted hover:text-content-dark transition-colors"
                title={showEndingCode ? 'Hide' : 'Reveal'}
              >
                {showEndingCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {showEndingCode && endingCode && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(endingCode, 'end')}
                  className="p-1.5 text-content-muted hover:text-brand-600 transition-colors"
                  title="Copy code"
                >
                  {copiedCode === 'end' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-content-muted leading-tight">
            Share only when the repair is finished, tested, and room is clean.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingVerificationCodes;
