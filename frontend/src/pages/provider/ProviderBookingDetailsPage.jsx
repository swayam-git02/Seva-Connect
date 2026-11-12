// Ye page assigned provider ko booking detail aur valid service actions dikhata hai.
// Provider actual customer codes nahi dekh sakta; woh sirf entered code verify karta hai.

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, Clock, Truck, ShieldCheck, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import ActiveJobPanel from '../../components/provider/ActiveJobPanel';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import bookingService from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../constants/routes';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';
import { useNotifications } from '../../hooks/useNotifications';

export const ProviderBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Provider booking ko delete/reject kar sakta hai jo wo accept nahi karna chahta
  const handleDeleteBooking = async () => {
    if (!booking) return;
    setIsDeleting(true);
    try {
      await bookingService.deleteBooking(booking.id);
      showSuccess('Booking Deleted', `Booking #${booking.id} has been removed from your job queue.`);
      navigate(ROUTES.PROVIDER_BOOKINGS);
    } catch (err) {
      showError('Delete Failed', err.message || 'Unable to delete booking.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <SkeletonLoader type="card" count={2} />;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between gap-3">
        <Link
          to={ROUTES.PROVIDER_BOOKINGS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-content-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Job Queue</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Delete booking button */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 rounded-lg transition-colors"
            title="Delete this booking from your queue"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Booking</span>
          </button>

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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Booking Request"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Are you sure you want to delete this booking?</p>
              <p className="text-xs text-rose-700 mt-1">
                Booking #{booking?.id} ({booking?.serviceTitle}) will be permanently deleted from your job queue.
              </p>
            </div>
          </div>

          <p className="text-xs text-content-secondary">
            Customer: <strong className="text-content-dark">{booking?.customerName}</strong>
            <br />
            Scheduled for: <strong>{booking?.scheduledDate ? formatDate(booking.scheduledDate) : ''} at {booking?.scheduledTime}</strong>
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteBooking}
              isLoading={isDeleting}
              leftIcon={Trash2}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProviderBookingDetailsPage;
