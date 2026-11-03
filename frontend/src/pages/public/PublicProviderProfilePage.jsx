// Ye public provider profile page provider ki services aur trust information dikhata hai.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Calendar, CheckCircle2, Phone, Clock, ArrowRight } from 'lucide-react';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import providerService from '../../services/providerService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const PublicProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await providerService.getProviderById(id);
        setProvider(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: { returnUrl: `/customer/book/${provider?.id}` },
      });
    } else {
      navigate(`/customer/book/${provider?.id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Provider not found</h2>
        <Link to={ROUTES.SERVICES} className="text-brand-600 mt-2 block">
          Return to services
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-surface-muted min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <ImageWithFallback
                src={provider.avatar}
                alt={provider.name}
                className="h-24 w-24 rounded-2xl object-cover border-2 border-surface-border shadow-md"
              />
              {provider.verified && (
                <div className="absolute -bottom-2 -right-2 bg-brand-500 text-white p-1.5 rounded-full shadow-md" title="Background Verified">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-content-dark">{provider.name}</h1>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Partner
                </span>
              </div>

              <p className="text-sm font-semibold text-brand-700 mt-1">{provider.businessName}</p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-content-secondary">
                <div className="flex items-center gap-1 font-semibold text-content-dark">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>{provider.rating}</span>
                  <span className="text-content-muted font-normal">({provider.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-content-muted" />
                  <span>{provider.location} ({provider.serviceRadiusKm} km coverage)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking CTA card box */}
          <div className="w-full md:w-auto p-4 bg-surface-muted rounded-xl border border-surface-border flex md:flex-col items-center justify-between gap-3 shrink-0">
            <div>
              <span className="text-[11px] text-content-muted block">Visiting Charge</span>
              <span className="text-xl font-bold text-brand-700">
                {formatCurrency(provider.hourlyRate)}
              </span>
            </div>

            <Button variant="primary" size="lg" onClick={handleBookNow} className="w-full sm:w-auto">
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bio & Services Offered */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card">
              <h3 className="text-base font-semibold text-content-dark mb-3">
                About Professional
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                {provider.bio}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-content-dark">
                <div>
                  <span className="text-content-muted block text-[11px]">Experience</span>
                  <strong>{provider.experienceYears}+ Years</strong>
                </div>
                <div>
                  <span className="text-content-muted block text-[11px]">Completed Jobs</span>
                  <strong>{provider.jobsCompleted}+ Doorstep Repairs</strong>
                </div>
                <div>
                  <span className="text-content-muted block text-[11px]">Service Area</span>
                  <strong>Faridabad & NCR</strong>
                </div>
              </div>
            </div>

            {/* Services Offered Rate Card */}
            <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card">
              <h3 className="text-base font-semibold text-content-dark mb-4">
                Services & Transparent Rate Card
              </h3>
              <div className="divide-y divide-slate-100">
                {(provider.services || []).map((s) => (
                  <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-content-dark text-sm">{s.title}</h4>
                      <p className="text-content-muted text-[11px]">Duration: ~{s.duration}</p>
                    </div>
                    <span className="text-sm font-bold text-brand-700">
                      {formatCurrency(s.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card">
              <h3 className="text-base font-semibold text-content-dark mb-4">
                Customer Reviews ({provider.reviews?.length || 0})
              </h3>
              <div className="space-y-4">
                {(provider.reviews || []).map((r) => (
                  <div key={r.id} className="p-4 bg-surface-muted rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-content-dark">{r.customerName}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-content-secondary leading-relaxed">
                      "{r.comment}"
                    </p>
                    <span className="text-[10px] text-content-muted mt-2 block">{formatDate(r.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Availability & Dual-OTP Safety */}
          <div className="space-y-6">
            {/* Availability Widget */}
            <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4">
              <h3 className="text-sm font-semibold text-content-dark flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-600" />
                <span>Working Days & Hours</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-content-secondary">Days Active:</span>
                  <span className="font-semibold text-content-dark">Mon - Sat</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-content-secondary">Working Hours:</span>
                  <span className="font-semibold text-content-dark">09:00 AM – 07:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-content-secondary">Emergency Slot:</span>
                  <span className="font-semibold text-emerald-700">Available on Call</span>
                </div>
              </div>

              <Button variant="primary" size="md" onClick={handleBookNow} className="w-full mt-2">
                Book This Professional
              </Button>
            </div>

            {/* Safety Guarantee */}
            <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-brand-800 font-bold text-xs">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <span>Protected by SevaConnect Dual OTP</span>
              </div>
              <p className="text-[11px] text-brand-900 leading-relaxed">
                Your payment is held securely in escrow. Share the Starting Code when {provider.name} arrives, and only share your Ending Code when you are 100% satisfied with the work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProviderProfilePage;
