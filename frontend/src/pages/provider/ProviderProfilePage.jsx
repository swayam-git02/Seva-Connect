import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Star, ShieldCheck, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import providerService from '../../services/providerService';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const ProviderProfilePage = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await providerService.getProviderById(user?.id || 'prov-1');
        setProvider(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <SkeletonLoader type="card" count={2} />;
  if (!provider) return <div>Provider record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content-dark tracking-tight">
            Business Profile & Public Storefront
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            This is how customer households see your profile across search results.
          </p>
        </div>

        <Link to={ROUTES.PROVIDER_PROFILE_EDIT}>
          <Button variant="primary" size="sm" leftIcon={Edit3}>
            Edit Profile Info
          </Button>
        </Link>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <img
          src={provider.avatar}
          alt={provider.name}
          className="h-24 w-24 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-content-dark">{provider.name}</h2>
            {provider.verified && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          <p className="text-xs font-bold text-brand-700">{provider.businessName}</p>
          <p className="text-xs text-content-secondary">{provider.location} • {provider.phone}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              {provider.rating} ({provider.reviewsCount} reviews)
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-medium">
              {provider.jobsCompleted}+ Doorstep Repairs Done
            </span>
          </div>
        </div>
      </div>

      {/* Bio & Details */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-content-dark">Professional Bio</h3>
        <p className="text-xs text-content-secondary leading-relaxed">{provider.bio}</p>

        <h3 className="text-sm font-bold text-content-dark pt-3 border-t border-slate-100">
          Covered Service Areas in Faridabad & NCR
        </h3>
        <div className="flex flex-wrap gap-2">
          {(provider.serviceAreas || ['Sector 14-17', 'Green Field', 'NIT', 'Neharpar']).map((area) => (
            <span key={area} className="px-3 py-1 bg-surface-muted text-content-dark rounded-lg border border-surface-border text-xs font-medium">
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;
