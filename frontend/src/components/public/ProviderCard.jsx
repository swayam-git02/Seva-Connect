// Ye reusable card provider ki basic profile, rating aur profile-open action dikhata hai.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const ProviderCard = ({ provider }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: { returnUrl: `/customer/book/${provider.id}` },
      });
    } else {
      navigate(`/customer/book/${provider.id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Avatar + Identity */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <ImageWithFallback
              src={provider.avatar}
              alt={provider.name}
              className="h-16 w-16 rounded-xl object-cover border border-surface-border"
            />
            {provider.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-brand-500 text-white p-1 rounded-full shadow-sm"
                title="Verified Professional"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-content-dark truncate group-hover:text-brand-600 transition-colors">
                {provider.name}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-semibold text-amber-700 shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{provider.rating}</span>
                <span className="text-[10px] text-content-muted">({provider.reviewsCount})</span>
              </div>
            </div>

            <p className="text-xs font-medium text-brand-700 truncate mt-0.5">
              {provider.businessName}
            </p>

            <div className="flex items-center gap-1 mt-1 text-xs text-content-secondary">
              <MapPin className="h-3 w-3 text-content-muted shrink-0" />
              <span className="truncate">{provider.location}</span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        {provider.bio && (
          <p className="mt-3 text-xs text-content-secondary line-clamp-2 leading-relaxed">
            {provider.bio}
          </p>
        )}

        {/* Specialties tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-100">
            {provider.categoryName || provider.category}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
            {provider.experienceYears || '8+'} yrs exp
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
            {provider.jobsCompleted || '100+'} jobs done
          </span>
        </div>
      </div>

      {/* Footer: Price + Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-content-muted block">Visiting / Base</span>
          <span className="text-base font-bold text-content-dark">
            {formatCurrency(provider.hourlyRate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/providers/${provider.id}`}
            className="px-3 py-2 text-xs font-medium text-content-secondary hover:text-content-dark hover:bg-surface-subtle rounded-lg transition-colors"
          >
            Profile
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleBookClick}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
