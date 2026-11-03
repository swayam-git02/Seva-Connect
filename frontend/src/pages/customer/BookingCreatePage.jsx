// Ye page customer se service, schedule aur address collect karke nayi booking create karta hai.
// Submit ke baad backend final price aur secure verification codes handle karta hai.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import BookingPriceSummary from '../../components/customer/BookingPriceSummary';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import providerService from '../../services/providerService';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';

export const BookingCreatePage = () => {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId');

  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('2026-10-22');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [address, setAddress] = useState(
    user?.address || 'House 412, Sector 15 Main Market, Faridabad, Haryana - 121007'
  );
  const [paymentMethod, setPaymentMethod] = useState('PAY_AFTER_SERVICE'); // 'PAY_AFTER_SERVICE' | 'UPI_ONLINE'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await providerService.getProviderById(providerId);
        const prov = res.data;
        setProvider(prov);

        if (prov.services && prov.services.length > 0) {
          const pre = prov.services.find((s) => s.id === preselectedServiceId);
          setSelectedService(pre || prov.services[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId, preselectedServiceId]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      showError('Please Select Service', 'Choose a service item to continue.');
      return;
    }
    if (!address.trim()) {
      showError('Address Required', 'Please enter your service address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: user?.id || 'cust-1',
        customerName: user?.name || 'Adarsh Sharma',
        customerPhone: user?.phone || '+91 98765 43210',
        customerAddress: address.trim(),
        providerId: provider.id,
        providerName: provider.name,
        providerBusiness: provider.businessName,
        providerPhone: provider.phone,
        category: provider.category,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        scheduledDate,
        scheduledTime,
        paymentMethod,
        basePrice: selectedService.price,
      };

      const response = await bookingService.createBooking(payload);
      showSuccess('Booking Confirmed!', `Booking #${response.data.id} has been created.`);
      navigate(ROUTES.CUSTOMER_BOOKING_SUCCESS, {
        state: { booking: response.data },
        replace: true,
      });
    } catch (err) {
      showError('Booking Failed', err.message || 'Unable to place booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <SkeletonLoader type="card" count={2} />;
  if (!provider) return <div>Professional not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Schedule Doorstep Service
        </h1>
        <p className="mt-0.5 text-xs text-content-secondary">
          Booking with <strong className="text-content-dark">{provider.name}</strong> ({provider.businessName})
        </p>
      </div>

      <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Flow Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Select Service */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-content-dark">
              <span className="h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Select Service Requirement</span>
            </div>

            <div className="space-y-2.5">
              {(provider.services || []).map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <label
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-1 ring-brand-500'
                        : 'border-surface-border bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="service_selection"
                        checked={isSelected}
                        onChange={() => setSelectedService(srv)}
                        className="text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-content-dark">{srv.title}</p>
                        <p className="text-[11px] text-content-muted">~{srv.duration || `${srv.durationMins || 45} mins`}</p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-brand-700">
                      {formatCurrency(srv.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Date & Slot */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-content-dark">
              <span className="h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Date & Time Slot</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-content-dark mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-dark mb-1.5">
                  Arrival Slot
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value="09:00 AM">09:00 AM – 11:00 AM</option>
                  <option value="11:00 AM">11:00 AM – 01:00 PM</option>
                  <option value="02:00 PM">02:00 PM – 04:00 PM</option>
                  <option value="04:00 PM">04:00 PM – 06:00 PM</option>
                  <option value="06:00 PM">06:00 PM – 08:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: Service Address */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-content-dark">
              <span className="h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Service Location Address</span>
            </div>

            <FormField label="Full Street & House Address" required>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No., Sector / Colony, City, Pincode"
                className="w-full rounded-lg border border-surface-border bg-white p-3 text-xs text-content-dark focus:border-brand-500 focus:outline-none"
                required
              />
            </FormField>
          </div>

          {/* STEP 4: Payment Option */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-content-dark">
              <span className="h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">
                4
              </span>
              <span>Choose Payment Method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('PAY_AFTER_SERVICE')}
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'PAY_AFTER_SERVICE'
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                    : 'border-surface-border bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'PAY_AFTER_SERVICE'}
                  onChange={() => setPaymentMethod('PAY_AFTER_SERVICE')}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="text-xs font-semibold text-content-dark flex items-center gap-1.5">
                    <Banknote className="h-4 w-4 text-brand-600" />
                    <span>Pay After Service</span>
                  </p>
                  <p className="text-[11px] text-content-muted mt-0.5">Cash or UPI upon inspection</p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('UPI_ONLINE')}
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'UPI_ONLINE'
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                    : 'border-surface-border bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'UPI_ONLINE'}
                  onChange={() => setPaymentMethod('UPI_ONLINE')}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="text-xs font-semibold text-content-dark flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-brand-600" />
                    <span>Pay Online (UPI / Card)</span>
                  </p>
                  <p className="text-[11px] text-content-muted mt-0.5">Safe Escrow till Ending Code</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Price Breakdown & Confirm CTA */}
        <div className="space-y-6">
          <BookingPriceSummary basePrice={selectedService?.price || 399} />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              <span>Dual-OTP Safety Protected</span>
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              You will receive confidential Starting & Ending verification codes upon booking confirmation.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-sm font-bold shadow-md"
            isLoading={isSubmitting}
            rightIcon={ArrowRight}
          >
            Confirm & Reserve Slot
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingCreatePage;
