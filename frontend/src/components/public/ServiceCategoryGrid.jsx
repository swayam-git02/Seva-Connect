// Ye grid available service categories ko clickable cards ke form mein show karti hai.

import React from 'react';
import ServiceCategoryCard from './ServiceCategoryCard';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';

export const ServiceCategoryGrid = ({
  categories = SERVICE_CATEGORIES,
  title = 'Popular Service Categories',
  subtitle = 'Choose from certified, background-verified professionals in your neighborhood',
  limit,
}) => {
  const displayedCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="py-16 bg-surface-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-content-dark tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-content-secondary leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategoryGrid;
