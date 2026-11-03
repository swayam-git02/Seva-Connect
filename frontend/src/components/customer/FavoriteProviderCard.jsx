import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Heart, Trash2 } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export const FavoriteProviderCard = ({ provider, onRemove }) => {
  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={provider.avatar}
              alt={provider.name}
              className="h-12 w-12 rounded-xl object-cover border border-surface-border"
            />
            <div>
              <h4 className="text-sm font-semibold text-content-dark">{provider.name}</h4>
              <p className="text-xs text-brand-700 font-medium">{provider.businessName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(provider.id)}
            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove from favorites"
          >
            <Heart className="h-4 w-4 fill-rose-500" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-content-secondary">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold text-content-dark">{provider.rating}</span>
            <span className="text-content-muted">({provider.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-content-muted" />
            <span>{provider.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-content-muted block">Visiting Fee</span>
          <span className="text-sm font-bold text-content-dark">
            {formatCurrency(provider.hourlyRate)}
          </span>
        </div>

        <Link to={`/customer/book/${provider.id}`}>
          <Button variant="primary" size="sm">
            Book Again
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FavoriteProviderCard;
