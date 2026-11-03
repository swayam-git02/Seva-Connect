import React, { useState, useEffect } from 'react';
import EarningsSummary from '../../components/provider/EarningsSummary';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import earningsService from '../../services/earningsService';
import { useAuth } from '../../hooks/useAuth';

export const ProviderEarningsPage = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await earningsService.getEarningsSummary(user?.id || 'prov-1');
        setEarnings(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [user]);

  if (loading) return <SkeletonLoader type="card" count={2} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Partner Earnings & Bank Payouts
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Review your gross revenue, platform commission deduction, and withdrawal history.
        </p>
      </div>

      <EarningsSummary earnings={earnings} />
    </div>
  );
};

export default ProviderEarningsPage;
