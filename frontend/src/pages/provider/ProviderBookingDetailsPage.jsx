// Ye page assigned provider ko booking detail aur valid service actions dikhata hai.
// Provider actual customer codes nahi dekh sakta; woh sirf entered code verify karta hai.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, Clock, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ActiveJobPanel from '../../components/provider/ActiveJobPanel';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import bookingService from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../constants/routes';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';
import { useNotifications } from '../../hooks/useNotifications';

export const ProviderBookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { showSuccess, showError } = useNotifications();

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

  const handleMarkOnTheWay = async () => {
    setIsUpdatingStatus(true);
    try {
      await bookingService.updateBookingStatus(booking.id, BOOKING_STATUS.ON_THE_WAY, 'Technician dispatched');
      showSuccess('Status Updated', 'Customer notified that you are On The Way.');
      loadBooking();
    } catch (e) {
      showError('Error', 'Unable to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) return <SkeletonLoader type="card" count={2} />;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.PROVIDER_BOOKINGS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-content-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Job Queue</span>
        </Link>

        {booking.status === BOOKING_STATUS.CONFIRMED && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleMarkOnTheWay}
            isLoading={isUpdatingStatus}
            leftIcon={Truck}
          >
            Mark as On The Way
          </Button>
        )}
      </div>

      {/* Main Execution Console */}
      <ActiveJobPanel booking={booking} onStatusUpdated={loadBooking} />

      {/* Details Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-content-dark">
          Booking & Payment Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-surface-muted rounded-xl">
            <span className="text-content-muted block">Scheduled Date</span>
            <span className="font-bold text-content-dark text-sm mt-0.5 block">{formatDate(booking.scheduledDate)}</span>
          </div>

          <div className="p-3 bg-surface-muted rounded-xl">
            <span className="text-content-muted block">Arrival Time Slot</span>
            <span className="font-bold text-content-dark text-sm mt-0.5 block">{booking.scheduledTime}</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 block">Total Earnings For You</span>
            <span className="font-bold text-emerald-900 text-sm mt-0.5 block">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderBookingDetailsPage;
