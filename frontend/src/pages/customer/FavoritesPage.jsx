import React, { useState, useEffect } from 'react';
import FavoriteProviderCard from '../../components/customer/FavoriteProviderCard';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import providerService from '../../services/providerService';
import { useNotifications } from '../../hooks/useNotifications';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess } = useNotifications();

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await providerService.getProviders();
        setFavorites((res.data || []).slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  const handleRemove = (id) => {
    setFavorites(favorites.filter((f) => f.id !== id));
    showSuccess('Removed', 'Provider removed from your favorites list.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Favorite Service Providers
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Quickly re-book technicians you know and trust.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No favorite providers saved"
          description="Click the heart icon on any technician's profile to add them here for quick repeat booking."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((p) => (
            <FavoriteProviderCard key={p.id} provider={p} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
