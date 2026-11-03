import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, Phone } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';

export const BookingCard = ({ booking, onCancel }) => {
  const isCancellable = [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(booking.status);

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
              #{booking.id}
            </span>
            <StatusBadge status={booking.status} />
          </div>
          <h3 className="text-base font-semibold text-content-dark mt-2">
            {booking.serviceTitle}
          </h3>
        </div>

        <div className="text-right sm:self-center">
          <span className="text-xs text-content-muted block">Total Price</span>
          <span className="text-base font-bold text-content-dark">
            {formatCurrency(booking.totalPrice)}
          </span>
        </div>
      </div>

      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-content-secondary">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-content-muted shrink-0" />
          <span>Scheduled: <strong className="text-content-dark">{formatDate(booking.scheduledDate)}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-content-muted shrink-0" />
          <span>Slot: <strong className="text-content-dark">{booking.scheduledTime}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-content-muted shrink-0" />
          <span className="truncate">{booking.customerAddress || 'Sector 15, Faridabad'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-content-muted">Professional:</span>
          <strong className="text-content-dark truncate">{booking.providerName} ({booking.providerBusiness})</strong>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {isCancellable && onCancel ? (
          <button
            type="button"
            onClick={() => onCancel(booking.id)}
            className="text-xs font-medium text-state-error hover:underline"
          >
            Cancel Booking
          </button>
        ) : (
          <span className="text-[11px] text-content-muted">
            Payment: {booking.paymentMethod?.replace('_', ' ')} ({booking.paymentStatus})
          </span>
        )}

        <Link
          to={`/customer/bookings/${booking.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
        >
          <span>View Details & Codes</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
