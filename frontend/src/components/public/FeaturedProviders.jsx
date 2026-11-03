// Ye section highlighted providers load karta hai aur loading/error ke hisaab se UI state dikhata hai.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProviderCard from './ProviderCard';
import SkeletonLoader from '../common/SkeletonLoader';
import providerService from '../../services/providerService';
import { ROUTES } from '../../constants/routes';

export const FeaturedProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await providerService.getFeaturedProviders();
        setProviders(response.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-surface-muted border-t border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              Top Rated Local Experts
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-dark tracking-tight mt-1">
              Featured Service Professionals
            </h2>
            <p className="mt-1.5 text-sm text-content-secondary max-w-xl">
              Verified technicians with consistently high customer ratings across Faridabad & Delhi NCR.
            </p>
          </div>

          <Link
            to={ROUTES.SERVICES}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors shrink-0"
          >
            <span>View All Professionals</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : providers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-border p-10 text-center max-w-xl mx-auto shadow-card space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-content-dark">
                Be the First Verified Professional in Your Area
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                We are actively onboarding background-verified electricians, plumbers, and home service technicians across Faridabad & NCR.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to={ROUTES.PROVIDER_SIGNUP}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
              >
                <span>Join as Service Partner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProviders;
