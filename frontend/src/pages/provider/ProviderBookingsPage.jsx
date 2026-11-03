import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, Phone, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import bookingService from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../hooks/useAuth';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';

export const ProviderBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await bookingService.getBookings({ providerId: user?.id });
        setBookings(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const filtered = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ON_THE_WAY, BOOKING_STATUS.STARTED].includes(b.status);
    return b.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-dark tracking-tight">
            Customer Bookings & Job Queue
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Accept requests, execute jobs with customer OTP verification, and review payouts.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-white p-1 rounded-xl border border-surface-border shadow-subtle overflow-x-auto">
          {['ALL', 'ACTIVE', BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-content-secondary hover:text-content-dark'
              }`}
            >
              {tab === 'ALL' ? 'All Jobs' : tab === 'ACTIVE' ? 'Active / Scheduled' : tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No bookings in this tab" description="No customer requests match this filter." />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    #{b.id}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                <h3 className="text-base font-bold text-content-dark mt-1.5">{b.serviceTitle}</h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Customer: <strong className="text-content-dark">{b.customerName}</strong> • {b.customerAddress}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-content-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(b.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{b.scheduledTime}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div>
                  <span className="text-[11px] text-content-muted block">Gross Payout</span>
                  <span className="text-base font-bold text-brand-700">
                    {formatCurrency(b.totalPrice)}
                  </span>
                </div>

                <Link
                  to={`/provider/bookings/${b.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition-all"
                >
                  <span>Open Job Console</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookingsPage;
