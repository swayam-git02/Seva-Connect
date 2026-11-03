import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Search, ShieldCheck, Clock, ArrowRight, Zap, Wrench, Sparkles, AlertCircle } from 'lucide-react';
import BookingCard from '../../components/customer/BookingCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';

export const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getBookings({ customerId: user?.id });
        setBookings(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  // Active / Upcoming booking
  const upcomingBooking = bookings.find((b) => ['PENDING', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status));

  return (
    <div className="space-y-8">
      {/* Welcome Greeting & Quick Search */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-brand-100 max-w-lg">
            Manage your scheduled home repairs, check live technician arrivals, and track confidential Starting & Ending codes.
          </p>
        </div>

        <Link
          to={ROUTES.CUSTOMER_SERVICES}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand-800 font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all shrink-0"
        >
          <Search className="h-4 w-4" />
          <span>Book a New Service</span>
        </Link>
      </div>

      {/* Active / Upcoming Booking Banner Card */}
      {upcomingBooking && (
        <div className="bg-white rounded-2xl border border-brand-200 shadow-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-content-dark">
                Upcoming Appointment Today
              </h2>
            </div>
            <Link
              to={`/customer/bookings/${upcomingBooking.id}`}
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>View OTP & Live Tracking</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4">
            <BookingCard booking={upcomingBooking} />
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to={ROUTES.CUSTOMER_SERVICES}
          className="bg-white p-4 rounded-xl border border-surface-border shadow-subtle hover:shadow-card hover:border-brand-500 transition-all text-center group"
        >
          <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Wrench className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-semibold text-content-dark">Book Service</h3>
          <p className="text-[10px] text-content-muted mt-0.5">Explore 40+ categories</p>
        </Link>

        <Link
          to={ROUTES.CUSTOMER_BOOKINGS}
          className="bg-white p-4 rounded-xl border border-surface-border shadow-subtle hover:shadow-card hover:border-brand-500 transition-all text-center group"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-semibold text-content-dark">My Bookings</h3>
          <p className="text-[10px] text-content-muted mt-0.5">Track & view history</p>
        </Link>

        <Link
          to={ROUTES.CUSTOMER_FAVORITES}
          className="bg-white p-4 rounded-xl border border-surface-border shadow-subtle hover:shadow-card hover:border-brand-500 transition-all text-center group"
        >
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-semibold text-content-dark">Saved Pros</h3>
          <p className="text-[10px] text-content-muted mt-0.5">Re-hire trusted experts</p>
        </Link>

        <Link
          to={ROUTES.CUSTOMER_HELP}
          className="bg-white p-4 rounded-xl border border-surface-border shadow-subtle hover:shadow-card hover:border-brand-500 transition-all text-center group"
        >
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-semibold text-content-dark">Help & Support</h3>
          <p className="text-[10px] text-content-muted mt-0.5">24/7 NCR desk</p>
        </Link>
      </div>

      {/* Recommended Services for Indian homes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-content-dark">
              Recommended for Faridabad Homes
            </h3>
            <p className="text-xs text-content-secondary">
              Seasonal repairs and essential maintenance in your area
            </p>
          </div>
          <Link to={ROUTES.CUSTOMER_SERVICES} className="text-xs font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              to={`${ROUTES.CUSTOMER_SERVICES}?category=${c.id}`}
              className="bg-white p-3.5 rounded-xl border border-surface-border shadow-subtle hover:shadow-card transition-all flex items-center gap-3 group"
            >
              <img
                src={c.imageUrl}
                alt={c.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-content-dark truncate group-hover:text-brand-600">
                  {c.name}
                </h4>
                <p className="text-[11px] text-content-muted">From ₹{c.startingPrice}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
