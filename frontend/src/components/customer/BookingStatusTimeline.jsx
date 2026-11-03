import React from 'react';
import { CheckCircle2, Clock, Truck, PlayCircle, CheckSquare, XCircle } from 'lucide-react';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';
import { formatDateTime } from '../../utils/formatDate';

export const BookingStatusTimeline = ({ status, statusHistory = [] }) => {
  const steps = [
    { key: BOOKING_STATUS.PENDING, label: 'Booking Placed', icon: Clock },
    { key: BOOKING_STATUS.CONFIRMED, label: 'Provider Confirmed', icon: CheckCircle2 },
    { key: BOOKING_STATUS.ON_THE_WAY, label: 'On The Way', icon: Truck },
    { key: BOOKING_STATUS.STARTED, label: 'Service In Progress', icon: PlayCircle },
    { key: BOOKING_STATUS.COMPLETED, label: 'Completed & Paid', icon: CheckSquare },
  ];

  if (status === BOOKING_STATUS.CANCELLED) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-state-error">
        <XCircle className="h-6 w-6 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold">This booking was cancelled</h4>
          <p className="text-xs text-red-600 mt-0.5">
            If any refund is applicable, it will reflect in 3-5 business days.
          </p>
        </div>
      </div>
    );
  }

  // Determine current active step index
  const statusOrder = [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.ON_THE_WAY,
    BOOKING_STATUS.STARTED,
    BOOKING_STATUS.COMPLETED,
  ];

  const currentIdx = statusOrder.indexOf(status);

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-subtle">
      <h3 className="text-sm font-semibold text-content-dark mb-6">
        Live Service Status
      </h3>

      <div className="relative">
        <div className="overflow-hidden">
          <ol className="flex items-center w-full">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <li
                  key={step.key}
                  className={`relative flex-1 ${
                    idx !== steps.length - 1
                      ? "after:content-[''] after:w-full after:h-0.5 after:bg-slate-200 after:inline-block after:absolute after:top-4 after:left-1/2"
                      : ''
                  } ${isPast ? 'after:bg-brand-500' : ''}`}
                >
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPast
                          ? 'bg-brand-500 text-white'
                          : isCurrent
                          ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`mt-2 text-xs font-semibold ${
                        isCurrent
                          ? 'text-brand-700'
                          : isPast
                          ? 'text-content-dark'
                          : 'text-content-muted'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Status history log items */}
      {statusHistory.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-3">
            Activity Log
          </h4>
          <div className="space-y-2">
            {statusHistory.map((item, i) => (
              <div key={i} className="flex items-start justify-between text-xs gap-3">
                <span className="text-content-secondary font-medium">{item.note}</span>
                <span className="text-content-muted shrink-0">{formatDateTime(item.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatusTimeline;
