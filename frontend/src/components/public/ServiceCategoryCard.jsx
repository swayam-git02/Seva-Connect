// Ye ek service category ka reusable visual card hai, jo user ko related search tak le jata hai.

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export const ServiceCategoryCard = ({ category }) => {
  return (
    <Link
      to={`${ROUTES.SEARCH}?category=${category.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-surface-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
    >
      {/* Category Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Rating chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-content-dark shadow-sm">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{category.rating}</span>
        </div>

        {/* Starting price on image bottom */}
        <div className="absolute bottom-3 left-3 text-white">
          <span className="text-[11px] text-slate-200 block font-medium">Starts from</span>
          <span className="text-base font-bold text-white leading-tight">
            {formatCurrency(category.startingPrice)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-content-dark group-hover:text-brand-600 transition-colors">
            {category.name}
          </h3>
          <p className="mt-1 text-xs text-content-secondary line-clamp-2 leading-relaxed">
            {category.tagline}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-brand-600">
          <span>{category.serviceCount || '40+'} verified pros</span>
          <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCategoryCard;
