import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProviderCard from '../../components/public/ProviderCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import providerService from '../../services/providerService';

export const CustomerSearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPros = async () => {
      setLoading(true);
      try {
        const res = await providerService.getProviders({
          search: query,
          category: category !== 'all' ? category : undefined,
        });
        setProviders(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPros();
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Available Service Professionals
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          {providers.length} verified experts ready for booking in your area
        </p>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={4} />
      ) : providers.length === 0 ? (
        <EmptyState
          title="No providers found"
          description="Try searching with a broader keyword or selecting another service category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSearchResultsPage;
