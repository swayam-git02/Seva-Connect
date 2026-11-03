import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, IndianRupee, Clock, Star, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import ProviderMetrics from '../../components/provider/ProviderMetrics';
import BookingRequestCard from '../../components/provider/BookingRequestCard';
import ActiveJobPanel from '../../components/provider/ActiveJobPanel';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';

export const ProviderDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const res = await bookingService.getBookings({ providerId: user?.id });
      setBookings(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const activeJob = bookings.find((b) =>
    [BOOKING_STATUS.ON_THE_WAY, BOOKING_STATUS.STARTED].includes(b.status)
  );

  const pendingRequests = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING);

  const handleAcceptRequest = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, BOOKING_STATUS.CONFIRMED, 'Accepted by partner');
      showSuccess('Job Accepted', `Booking #${id} confirmed. Customer has been alerted.`);
      loadBookings();
    } catch (e) {
      showError('Error', 'Unable to accept request.');
    }
  };

  const handleDeclineRequest = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, BOOKING_STATUS.REJECTED, 'Declined by partner');
      showSuccess('Job Declined', `Request #${id} declined.`);
      loadBookings();
    } catch (e) {
      showError('Error', 'Unable to decline request.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Provider Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Partner Active • Sector 15 Faridabad</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {user?.name || 'Partner'}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            You have {pendingRequests.length} pending service requests and {activeJob ? '1 active job in progress' : 'no active jobs'}.
          </p>
        </div>

        <Link
          to={ROUTES.PROVIDER_CALENDAR}
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 text-white"
        >
          Manage Working Slots
        </Link>
      </div>

      {/* Metrics Row */}
      <ProviderMetrics />

      {/* CRITICAL: Active Job Panel if a technician is on the way or work is started */}
      {activeJob && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-content-dark flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-500 animate-ping" />
              <span>Current Active Job</span>
            </h2>
            <Link
              to={`/provider/bookings/${activeJob.id}`}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Full Job View
            </Link>
          </div>
          <ActiveJobPanel booking={activeJob} onStatusUpdated={loadBookings} />
        </div>
      )}

      {/* New Booking Requests Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-content-dark">
              New Booking Requests ({pendingRequests.length})
            </h2>
            <p className="text-xs text-content-secondary">
              Review address and scheduled time before accepting
            </p>
          </div>

          <Link to={ROUTES.PROVIDER_BOOKINGS} className="text-xs font-semibold text-brand-600 hover:underline">
            View All Jobs
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={2} />
        ) : pendingRequests.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-dashed border-surface-border">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-content-dark">All requests cleared!</p>
            <p className="text-[11px] text-content-muted mt-0.5">New bookings in your sector will appear here instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <BookingRequestCard
                key={req.id}
                request={req}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
