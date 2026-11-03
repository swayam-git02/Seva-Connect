import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Calendar, Clock, MapPin, ArrowRight, Copy } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export const BookingSuccessPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to={ROUTES.CUSTOMER_BOOKINGS} replace />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-card text-center space-y-5">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-75">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            BOOKING ID #{booking.id}
          </span>
          <h1 className="text-2xl font-extrabold text-content-dark tracking-tight mt-3">
            Service Booking Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            We have notified {booking.providerName}. You will receive SMS & WhatsApp updates.
          </p>
        </div>

        {/* Appointment Details Box */}
        <div className="bg-surface-muted rounded-2xl p-5 border border-surface-border text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-content-secondary">Service Task:</span>
            <span className="font-semibold text-content-dark">{booking.serviceTitle}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-content-secondary">Scheduled Date & Slot:</span>
            <span className="font-semibold text-content-dark">{formatDate(booking.scheduledDate)} at {booking.scheduledTime}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-content-secondary">Service Address:</span>
            <span className="font-semibold text-content-dark truncate max-w-xs">{booking.customerAddress}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-content-secondary">Total Amount:</span>
            <span className="font-bold text-sm text-brand-700">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>

        {/* Starting Code Highlight */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Your Confidential Starting Code</span>
          </div>
          <div className="text-3xl font-mono font-extrabold tracking-widest text-emerald-800">
            {booking.startingCode}
          </div>
          <p className="text-[11px] text-emerald-700">
            Share this 4-digit code with the technician when they arrive at your door to start the job.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={`/customer/bookings/${booking.id}`} className="w-full sm:w-auto">
            <Button variant="primary" size="md" rightIcon={ArrowRight} className="w-full sm:w-auto">
              View Tracking & Ending Code
            </Button>
          </Link>

          <Link to={ROUTES.CUSTOMER_DASHBOARD} className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
