import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import providerService from '../../services/providerService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export const CustomerProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) return <SkeletonLoader type="card" count={2} />;
  if (!provider) return <div>Provider not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={provider.avatar}
            alt={provider.name}
            className="h-20 w-20 rounded-2xl object-cover border border-surface-border"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-content-dark">{provider.name}</h1>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-brand-700">{provider.businessName}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-content-secondary">
              <span className="flex items-center gap-1 font-semibold text-content-dark">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                {provider.rating} ({provider.reviewsCount})
              </span>
              <span>•</span>
              <span>{provider.location}</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/customer/book/${provider.id}`)}
        >
          Book This Professional
        </Button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-base font-semibold text-content-dark">
          Offered Services & Upfront Price
        </h3>
        <div className="divide-y divide-slate-100">
          {(provider.services || []).map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-semibold text-content-dark text-sm">{s.title}</h4>
                <p className="text-content-muted">Est. Duration: {s.duration}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <span className="text-sm font-bold text-brand-700">
                  {formatCurrency(s.price)}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/customer/book/${provider.id}?serviceId=${s.id}`)}
                >
                  Select & Book
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProviderProfilePage;
