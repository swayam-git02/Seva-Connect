import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export const BookingRequestCard = ({ request, onAccept, onDecline }) => {
  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
            #{request.id}
          </span>
          <h4 className="text-base font-semibold text-content-dark mt-1">
            {request.serviceTitle}
          </h4>
        </div>
        <div className="text-right sm:self-center">
          <span className="text-xs text-content-muted block">Estimated Payout</span>
          <span className="text-base font-bold text-brand-700">
            {formatCurrency(request.totalPrice)}
          </span>
        </div>
      </div>

      <div className="py-3 space-y-2 text-xs text-content-secondary">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-500 shrink-0" />
          <span className="font-medium text-content-dark truncate">{request.customerAddress}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-content-muted" />
            <span>{formatDate(request.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-content-muted" />
            <span>{request.scheduledTime}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDecline(request.id)}
          leftIcon={XCircle}
        >
          Decline
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAccept(request.id)}
          leftIcon={CheckCircle}
        >
          Accept Job
        </Button>
      </div>
    </div>
  );
};

export default BookingRequestCard;
