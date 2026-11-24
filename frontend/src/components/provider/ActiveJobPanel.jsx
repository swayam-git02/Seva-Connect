// Ye panel provider ko active booking par Starting/Ending Code verification aur evidence workflow ka UI deta hai.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  Camera,
  UploadCloud,
  UserX,
  Banknote,
  DollarSign,
  Receipt,
  ArrowRight,
  Check,
  CreditCard,
} from 'lucide-react';
import Button from '../common/Button';
import SlideButton from '../common/SlideButton';
import Modal from '../common/Modal';
import ServicePhotoGallery from '../bookings/ServicePhotoGallery';
import verificationService from '../../services/verificationService';
import photoService from '../../services/photoService';
import bookingService from '../../services/bookingService';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export const ActiveJobPanel = ({ booking, onStatusUpdated }) => {
  const navigate = useNavigate();
  const { user, isProvider } = useAuth();
  const [startingCodeInput, setStartingCodeInput] = useState('');
  const [endingCodeInput, setEndingCodeInput] = useState('');
  const [isVerifyingStart, setIsVerifyingStart] = useState(false);
  const [isVerifyingEnd, setIsVerifyingEnd] = useState(false);
  const [isWorkFinished, setIsWorkFinished] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(booking?.paymentStatus === 'PAID');

  // Auto-sync & redirection states (cross-tab payment detection)
  const [autoRedirecting, setAutoRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Photo upload states
  const [beforeFiles, setBeforeFiles] = useState([]);
  const [beforeCaption, setBeforeCaption] = useState('');
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);

  const [afterFiles, setAfterFiles] = useState([]);
  const [afterCaption, setAfterCaption] = useState('');
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);

  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const { showSuccess, showError } = useNotifications();

  // Keep the modal state in sync when the parent refreshes the booking.
  useEffect(() => {
    setPaymentReceived(booking?.paymentStatus === 'PAID');
  }, [booking?.paymentStatus]);

  // Assigned provider check
  const isAssignedProvider = isProvider && (!booking?.provider_id || user?.id === booking.provider_id);

  // Cross-tab synchronization: jab customer payment complete kare, auto-close aur provider dashboard par redirect
  useEffect(() => {
    if (!booking || booking.paymentStatus === 'PAID') return;

    const handlePaymentCompleted = (eventData) => {
      if (String(eventData?.bookingId) === String(booking.id)) {
        setPaymentReceived(true);
        setAutoRedirecting(true);
        showSuccess('Payment Received!', 'Customer has completed payment. Booking is closed. Redirecting to Provider Dashboard...');
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

    // 4. Background polling every 3 seconds while payment is pending
    const pollInterval = setInterval(async () => {
      try {
        const res = await bookingService.getBookingById(booking.id);
        if (res.data?.paymentStatus === 'PAID') {
          handlePaymentCompleted({ bookingId: booking.id });
        }
      } catch (err) {}
    }, 3000);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sevaconnect_payment_sync', onCustomSync);
      if (bc) bc.close();
      clearInterval(pollInterval);
    };
  }, [booking]);

  // Provider countdown auto-redirection
  useEffect(() => {
    let timer;
    if (autoRedirecting) {
      if (redirectCountdown > 0) {
        timer = setTimeout(() => setRedirectCountdown((prev) => prev - 1), 1000);
      } else {
        navigate(ROUTES.PROVIDER_DASHBOARD);
      }
    }
    return () => clearTimeout(timer);
  }, [autoRedirecting, redirectCountdown, navigate]);

  // 1. Upload Before Photos
  const handleUploadBeforePhotos = async (e) => {
    e.preventDefault();
    if (!beforeFiles.length) {
      showError('File Required', 'Please select at least one before-service photograph.');
      return;
    }
    if (!isAssignedProvider) {
      showError('Unauthorized (403)', 'Only the assigned provider can upload service evidence. Please sign in with the assigned provider account.');
      return;
    }
    setIsUploadingBefore(true);
    try {
      await photoService.uploadBeforePhotos(booking.id, beforeFiles, beforeCaption);
      showSuccess('Evidence Uploaded', 'Before-service photographs uploaded successfully.');
      setBeforeFiles([]);
      setBeforeCaption('');
      setGalleryRefreshKey((k) => k + 1);
    } catch (err) {
      const msg = err.status === 403
        ? 'Access Denied (403): You must be signed in as the assigned service provider to upload evidence.'
        : (err.message || 'Failed to upload photographs.');
      showError('Upload Error', msg);
    } finally {
      setIsUploadingBefore(false);
    }
  };

  // 2. Upload After Photos
  const handleUploadAfterPhotos = async (e) => {
    e.preventDefault();
    if (!afterFiles.length) {
      showError('File Required', 'Please select at least one after-service photograph.');
      return;
    }
    if (!isAssignedProvider) {
      showError('Unauthorized (403)', 'Only the assigned provider can upload service evidence. Please sign in with the assigned provider account.');
      return;
    }
    setIsUploadingAfter(true);
    try {
      await photoService.uploadAfterPhotos(booking.id, afterFiles, afterCaption);
      showSuccess('Evidence Uploaded', 'After-service photographs uploaded successfully.');
      setAfterFiles([]);
      setAfterCaption('');
      setGalleryRefreshKey((k) => k + 1);
    } catch (err) {
      const msg = err.status === 403
        ? 'Access Denied (403): You must be signed in as the assigned service provider to upload evidence.'
        : (err.message || 'Failed to upload photographs.');
      showError('Upload Error', msg);
    } finally {
      setIsUploadingAfter(false);
    }
  };

  // 3. Verify Starting Code (6-digit)
  const handleVerifyStartingCode = async (e) => {
    e.preventDefault();
    if (startingCodeInput.trim().length !== 6 && startingCodeInput.trim().length !== 4) {
      showError('Validation Error', 'Please enter a valid 6-digit Starting Code provided by customer.');
      return;
    }
    setIsVerifyingStart(true);
    try {
      const res = await verificationService.verifyStartingCode(booking.id, startingCodeInput.trim());
      showSuccess('Service Started', res.message || 'Starting code accepted! Work is now in progress.');
      setStartingCodeInput('');
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      showError('Starting Code Error', err.message || 'Incorrect Starting Code. Please verify with customer.');
    } finally {
      setIsVerifyingStart(false);
    }
  };

  // 4. Verify Ending Code (6-digit)
  const handleVerifyEndingCode = async (e) => {
    e.preventDefault();
    if (endingCodeInput.trim().length !== 6 && endingCodeInput.trim().length !== 4) {
      showError('Validation Error', 'Please enter a valid 6-digit Ending Code provided by customer.');
      return;
    }
    setIsVerifyingEnd(true);
    try {
      const res = await verificationService.verifyEndingCode(booking.id, endingCodeInput.trim());
      showSuccess('Service Completed', 'Ending Code verified. The customer can now complete payment from their booking screen.');
      setEndingCodeInput('');
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      const msg = err.status === 403
        ? (err.message || 'Access denied. Please ensure you are logged in as the assigned service provider.')
        : (err.message || 'Incorrect Ending Code. Please request customer for completion code.');
      showError('Ending Code Error', msg);
    } finally {
      setIsVerifyingEnd(false);
    }
  };


  const isStarted = booking.status === BOOKING_STATUS.STARTED || booking.status === 'in_progress';
  const isCompleted = booking.status === BOOKING_STATUS.COMPLETED || booking.status === 'completed';
  const isAwaitingCustomerPayment = isCompleted && !paymentReceived;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        {/* Header banner */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
                ACTIVE JOB #{booking.id}
              </span>
              <span className="text-xs text-slate-300">• {booking.serviceTitle}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Customer: {booking.customerName}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>Scheduled: {booking.scheduledTime}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Location & Contact details */}
          <div className="bg-surface-muted p-4 rounded-xl border border-surface-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-content-muted uppercase tracking-wider block">Address</span>
              <div className="flex items-start gap-2 text-content-dark font-medium">
                <MapPin className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{booking.customerAddress}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-content-muted uppercase tracking-wider block">Customer Contact</span>
              <div className="flex items-center gap-2 text-content-dark font-medium">
                <Phone className="h-4 w-4 text-brand-500 shrink-0" />
                <span>{booking.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Dual Code Verification & Photographic Evidence Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STEP 1: Before Photos & Starting Code */}
            <div className={`p-5 rounded-xl border space-y-4 ${
              isStarted || isCompleted
                ? 'bg-slate-50 border-slate-200'
                : 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/10'
            }`}>
              <div className="flex items-center gap-2">
                <PlayCircle className={`h-5 w-5 ${isStarted || isCompleted ? 'text-slate-400' : 'text-emerald-600'}`} />
                <h4 className="text-sm font-bold text-content-dark">
                  1. Before-Service Evidence & Start
                </h4>
              </div>

              {/* Photo Upload for Before Stage */}
              {!isCompleted && (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Camera className="h-4 w-4 text-brand-600" />
                    <span>Upload Before-Service Photo(s)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setBeforeFiles(Array.from(e.target.files))}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  <input
                    type="text"
                    value={beforeCaption}
                    onChange={(e) => setBeforeCaption(e.target.value)}
                    placeholder="Photo description (e.g., initial switch condition)"
                    className="w-full text-xs py-1.5 px-2.5 rounded border border-slate-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadBeforePhotos}
                    isLoading={isUploadingBefore}
                    disabled={!beforeFiles.length}
                    className="w-full text-xs"
                    leftIcon={UploadCloud}
                  >
                    Upload Before Photo
                  </Button>
                </div>
              )}

              {isStarted || isCompleted ? (
                <div className="bg-emerald-100/70 border border-emerald-300 p-3 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Starting Code Verified at {booking.startingCodeVerifiedAt ? new Date(booking.startingCodeVerifiedAt).toLocaleTimeString() : 'Earlier'}</span>
                </div>
              ) : (
                <form onSubmit={handleVerifyStartingCode} className="space-y-3 pt-2">
                  <p className="text-xs text-content-secondary leading-relaxed">
                    Ask customer for their 6-digit Starting Code upon arrival before touching tools.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={startingCodeInput}
                    onChange={(e) => setStartingCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 px-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:outline-none bg-white"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isVerifyingStart}
                  >
                    Verify & Start Service
                  </Button>
                </form>
              )}
            </div>

            {/* STEP 2: After Photos & Ending Code */}
            <div className={`p-5 rounded-xl border space-y-4 ${
              isCompleted
                ? 'bg-slate-50 border-slate-200'
                : isStarted
                ? 'bg-brand-50/40 border-brand-300 ring-2 ring-brand-500/10'
                : 'bg-slate-50/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-5 w-5 ${isCompleted ? 'text-slate-400' : 'text-brand-600'}`} />
                <h4 className="text-sm font-bold text-content-dark">
                  2. After-Service Evidence & Completion
                </h4>
              </div>

              {/* Photo Upload for After Stage */}
              {isStarted && !isCompleted && (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Camera className="h-4 w-4 text-emerald-600" />
                    <span>Upload After-Service Photo(s)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setAfterFiles(Array.from(e.target.files))}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  <input
                    type="text"
                    value={afterCaption}
                    onChange={(e) => setAfterCaption(e.target.value)}
                    placeholder="Photo description (e.g., repaired appliance running)"
                    className="w-full text-xs py-1.5 px-2.5 rounded border border-slate-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadAfterPhotos}
                    isLoading={isUploadingAfter}
                    disabled={!afterFiles.length}
                    className="w-full text-xs"
                    leftIcon={UploadCloud}
                  >
                    Upload After Photo
                  </Button>
                </div>
              )}

              {isCompleted ? (
                <div className="space-y-3.5 pt-1 animate-in fade-in duration-300">
                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Ending Code Verified ✓</span>
                        <span className="text-[11px] text-emerald-800 font-normal">Customer approved service completion.</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
                      Step 3: Collect Payment
                    </span>
                  </div>

                  {/* Payment Collection Card */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-content-muted block uppercase tracking-wider font-bold">
                          Amount to Collect
                        </span>
                        <span className="text-2xl font-mono font-black text-content-dark">
                          {formatCurrency(booking.totalPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-content-muted block uppercase tracking-wider font-bold">
                          Payment Mode
                        </span>
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 inline-block mt-0.5">
                          {booking.paymentMethod?.replace(/_/g, ' ') || 'Pay After Service'}
                        </span>
                      </div>
                    </div>

                    {booking.paymentStatus !== 'PAID' ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900">
                        Payment request sent to the customer. They will complete payment from their booking screen.
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Payment Collected & Booking Closed ✓</span>
                        </span>
                        <Link
                          to={ROUTES.PROVIDER_BOOKINGS}
                          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-0.5"
                        >
                          <span>Job Queue</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : !isStarted ? (
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-lg text-xs text-slate-500">
                  Please verify Starting Code in Step 1 first to start this job before completing it.
                </div>
              ) : !isWorkFinished ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold">Finished your physical repair work?</p>
                    <p className="mt-0.5 text-amber-800">
                      Slide the bar below to mark work done and request the customer's 6-digit Ending Code.
                    </p>
                  </div>

                  {/* Slide to complete work button */}
                  <SlideButton
                    label="👉 Slide to Complete Service"
                    completedLabel="Work Finished ✓"
                    onComplete={() => setIsWorkFinished(true)}
                  />

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setIsWorkFinished(true)}
                      className="text-[11px] text-brand-700 font-semibold hover:underline"
                    >
                      Already have customer's code? Enter code directly →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Service Work Completed!</span>
                        <span className="text-[11px] text-emerald-800">
                          Ask customer for the 6-digit Ending Code shown on their screen.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsWorkFinished(false)}
                      className="text-[10px] text-slate-500 hover:text-slate-700 underline font-medium shrink-0 ml-2"
                    >
                      Reset slider
                    </button>
                  </div>

                  <form onSubmit={handleVerifyEndingCode} className="space-y-3">
                    <p className="text-xs text-content-secondary leading-relaxed">
                      Enter the 6-digit customer Ending Code to verify completion and release your payment:
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={endingCodeInput}
                      onChange={(e) => setEndingCodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 px-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:outline-none bg-white shadow-inner"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      isLoading={isVerifyingEnd}
                    >
                      Verify & Complete Job
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* The provider must wait here after a valid ending-code verification. */}
      <Modal
        isOpen={isAwaitingCustomerPayment}
        title="Waiting for Customer Payment"
        subtitle="Service completed and ending code verified"
      >
        <div className="py-2 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <CreditCard className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Payment request sent</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Please wait while the customer completes payment of{' '}
              <strong>{formatCurrency(booking.totalPrice)}</strong> from their booking screen.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-900">
            This window will close automatically once payment is confirmed.
          </div>
        </div>
      </Modal>

      {/* Auto-Redirect Notification Modal (Jab customer online payment kare) */}
      <Modal
        isOpen={autoRedirecting}
        onClose={() => navigate(ROUTES.PROVIDER_DASHBOARD)}
        title="Job Closed & Paid"
      >
        <div className="p-4 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Payment Completed by Customer!
          </h3>
          <p className="text-xs text-slate-600">
            Customer has completed payment of <strong>{formatCurrency(booking.totalPrice)}</strong>. The booking has been officially closed and earnings added to your wallet.
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900">
            Redirecting to Provider Dashboard in {redirectCountdown}s...
          </div>
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => navigate(ROUTES.PROVIDER_DASHBOARD)}
          >
            Go to Dashboard Now
          </Button>
        </div>
      </Modal>

      {/* Embedded Service Photograph Evidence Gallery */}
      <ServicePhotoGallery key={galleryRefreshKey} bookingId={booking.id} />
    </div>
  );
};

export default ActiveJobPanel;
