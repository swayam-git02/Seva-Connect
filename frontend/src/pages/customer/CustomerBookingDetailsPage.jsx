// Ye page customer ko selected booking ki status, provider, price, codes aur service evidence details dikhata hai.

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Download,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import BookingStatusTimeline from '../../components/customer/BookingStatusTimeline';
import BookingVerificationCodes from '../../components/customer/BookingVerificationCodes';
import ServicePhotoGallery from '../../components/bookings/ServicePhotoGallery';
import BookingPriceSummary from '../../components/customer/BookingPriceSummary';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import DummyPaymentGatewayModal from '../../components/payment/DummyPaymentGatewayModal';
import bookingService from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';

export const CustomerBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Auto-sync & redirection states (cross-tab payment detection)
  const [autoRedirecting, setAutoRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const loadBooking = async () => {
    try {
      const res = await bookingService.getBookingById(id);
      setBooking(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  // Cross-tab synchronization: jab provider ya customer payment complete kare, auto-close aur redirect
  useEffect(() => {
    if (!booking || booking.paymentStatus === 'PAID') return;

    const handlePaymentCompleted = (eventData) => {
      if (String(eventData?.bookingId) === String(booking.id)) {
        setAutoRedirecting(true);
        showSuccess('Payment Completed!', 'Booking has been paid & closed. Redirecting to your Customer Dashboard...');
      }
    };

    // 1. Cross-tab storage listener
    const onStorage = (e) => {
      if (e.key === 'sevaconnect_payment_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handlePaymentCompleted(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);

    // 2. Custom event listener for same window
    const onCustomSync = (e) => {
      if (e.detail) handlePaymentCompleted(e.detail);
    };
    window.addEventListener('sevaconnect_payment_sync', onCustomSync);

    // 3. BroadcastChannel listener
    let bc;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('sevaconnect_booking_channel');
        bc.onmessage = (msg) => {
          if (msg.data) handlePaymentCompleted(msg.data);
        };
      } catch (err) {}
    }

    // 4. Background polling every 3 seconds
    const pollInterval = setInterval(async () => {
      try {
        const res = await bookingService.getBookingById(id);
        if (res.data?.paymentStatus === 'PAID' || res.data?.status === 'completed') {
          handlePaymentCompleted({ bookingId: id });
        }
      } catch (err) {}
    }, 3000);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sevaconnect_payment_sync', onCustomSync);
      if (bc) bc.close();
      clearInterval(pollInterval);
    };
  }, [booking, id]);

  // Auto-redirect countdown timer for Customer Dashboard
  useEffect(() => {
    let timer;
    if (autoRedirecting) {
      if (redirectCountdown > 0) {
        timer = setTimeout(() => setRedirectCountdown((prev) => prev - 1), 1000);
      } else {
        navigate(ROUTES.CUSTOMER_DASHBOARD);
      }
    }
    return () => clearTimeout(timer);
  }, [autoRedirecting, redirectCountdown, navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await reviewService.submitReview(booking.id, { rating, comment: reviewText });
      showSuccess('Review Submitted', 'Thank you for rating your service experience!');
      setShowReviewModal(false);
      loadBooking();
    } catch (err) {
      showError('Error', err.message || 'Unable to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDownloadInvoice = () => {
    showSuccess('Invoice Downloaded', `Invoice_Tax_${booking?.id}.pdf downloaded.`);
  };

  if (loading) return <SkeletonLoader type="card" count={2} />;
  if (!booking) return <div>Booking not found.</div>;

  const isCompleted = booking.status === BOOKING_STATUS.COMPLETED;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.CUSTOMER_BOOKINGS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-content-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadInvoice}
            leftIcon={Download}
          >
            Invoice
          </Button>

          {isCompleted && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowReviewModal(true)}
              leftIcon={Star}
            >
              Rate & Review
            </Button>
          )}
        </div>
      </div>

      {/* Main Details Header */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
            BOOKING #{booking.id}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-content-dark mt-2">
            {booking.serviceTitle}
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Scheduled for <strong className="text-content-dark">{formatDate(booking.scheduledDate)}</strong> at{' '}
            <strong className="text-content-dark">{booking.scheduledTime}</strong>
          </p>
        </div>

        <div className="text-right sm:self-center">
          <span className="text-xs text-content-muted block">Payment Method</span>
          <span className="text-sm font-semibold text-content-dark">
            {booking.paymentMethod?.replace('_', ' ')}
          </span>
          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
            booking.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      {/* Payment Gateway Trigger Card (If not already paid) */}
      {booking.paymentStatus !== 'PAID' ? (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-lg border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700">
                Payment Pending
              </span>
              <span className="text-xs text-slate-300">• Pay via Dummy Gateway</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Total Amount Due: {formatCurrency(booking.totalPrice)}
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Pay securely via UPI (QR Code / VPA), Cards, Netbanking or Cash to automatically complete and close this booking.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPaymentGateway(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <CreditCard className="h-4 w-4" />
            <span>Pay Now ({formatCurrency(booking.totalPrice)})</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Payment Completed & Settled</span>
              <span className="text-xs text-emerald-700">Amount of {formatCurrency(booking.totalPrice)} paid successfully.</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            PAID ✓
          </span>
        </div>
      )}

      {/* CRITICAL: Dual Verification Codes Component */}
      <BookingVerificationCodes booking={booking} />

      {/* Before & After Service Evidence Photographs */}
      <ServicePhotoGallery bookingId={booking.id} />

      {/* Live Timeline Status Tracking */}
      <BookingStatusTimeline status={booking.status} statusHistory={booking.statusHistory} />

      {/* Provider Details & Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider Profile Card */}
        <div className="bg-white rounded-xl border border-surface-border p-5 shadow-subtle space-y-4">
          <h3 className="text-sm font-semibold text-content-dark">
            Assigned Service Professional
          </h3>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-base">
              {booking.providerName ? booking.providerName.charAt(0) : 'P'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-content-dark">{booking.providerName}</h4>
              <p className="text-xs text-brand-700 font-medium">{booking.providerBusiness}</p>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-content-muted">
                <Phone className="h-3 w-3 text-content-muted" />
                <span>{booking.providerPhone}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Police Background Verified</span>
            </div>

            <Link
              to={ROUTES.CUSTOMER_MESSAGES}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat with Pro</span>
            </Link>
          </div>
        </div>

        {/* Price Breakdown */}
        <BookingPriceSummary
          basePrice={booking.basePrice}
          taxes={booking.taxes}
          platformFee={booking.platformFee}
        />
      </div>

      {/* Review & Rating Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Rate & Review Your Service"
        subtitle={`How was your experience with ${booking.providerName}?`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-content-dark mb-2">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= rating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dark mb-1.5">
              Your Feedback Comments
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Was the technician punctual? Did they explain the work and test the repair?"
              required
              className="w-full text-xs p-3 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmittingReview}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dummy Payment Gateway Modal */}
      <DummyPaymentGatewayModal
        isOpen={showPaymentGateway}
        onClose={() => setShowPaymentGateway(false)}
        booking={booking}
        userRole="customer"
        onPaymentSuccess={() => {
          setShowPaymentGateway(false);
          loadBooking();
        }}
      />

      {/* Auto-Redirect Notification Modal (Cross-tab sync) */}
      <Modal
        isOpen={autoRedirecting}
        onClose={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
        title="Booking Completed & Closed"
      >
        <div className="p-4 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Payment Completed & Booking Closed!
          </h3>
          <p className="text-xs text-slate-600">
            Payment of <strong>{formatCurrency(booking.totalPrice)}</strong> has been confirmed. The booking has been officially closed.
          </p>
          <div className="p-2.5 bg-brand-50 border border-brand-200 rounded-xl text-xs font-semibold text-brand-900">
            Redirecting to Customer Dashboard in {redirectCountdown}s...
          </div>
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
          >
            Go to Dashboard Now
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerBookingDetailsPage;
