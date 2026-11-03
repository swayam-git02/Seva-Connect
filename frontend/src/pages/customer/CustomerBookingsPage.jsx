import React, { useState, useEffect } from 'react';
import BookingCard from '../../components/customer/BookingCard';
import BookingFilters from '../../components/customer/BookingFilters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const CustomerBookingsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getBookings({ customerId: user?.id });
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

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(selectedBookingForCancel, 'Cancelled by customer');
      showSuccess('Booking Cancelled', 'Your appointment has been cancelled.');
      setSelectedBookingForCancel(null);
      loadBookings();
    } catch (err) {
      showError('Cancellation Failed', err.message || 'Unable to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'ON_THE_WAY'
        ? ['PENDING', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
        : b.status === activeTab;

    const term = searchQuery.toLowerCase();
    const matchesSearch =
      !term ||
      b.id.toLowerCase().includes(term) ||
      b.serviceTitle.toLowerCase().includes(term) ||
      b.providerName.toLowerCase().includes(term);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          My Service Bookings
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Track upcoming appointments, verify technician codes, and review completed jobs.
        </p>
      </div>

      <BookingFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings in this tab"
          description="You don't have any matching service bookings at the moment."
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={(id) => setSelectedBookingForCancel(id)}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedBookingForCancel}
        onClose={() => setSelectedBookingForCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel This Booking?"
        message="Are you sure you want to cancel this scheduled service? Cancellation is free if done before the technician departs."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default CustomerBookingsPage;
