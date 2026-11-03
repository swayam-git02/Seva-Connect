// Ye page user ko service categories browse aur filter karne deta hai.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export const ServicesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = SERVICE_CATEGORIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.id === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-12 bg-surface-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            All Service Offerings
          </span>
          <h1 className="text-3xl font-extrabold text-content-dark tracking-tight mt-1">
            Certified Home Repair & Maintenance Services
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Standardized rates, vetted technicians, and 30-day service warranty across Delhi NCR.
          </p>
        </div>

        {/* Search & Filter pills */}
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-card mb-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-content-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services (e.g. fan, tap, sofa cleaning, ac repair)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-surface-border bg-surface-muted placeholder-content-placeholder focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-brand-500 text-white font-semibold'
                  : 'bg-surface-subtle text-content-secondary hover:text-content-dark'
              }`}
            >
              All
            </button>
            {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-brand-500 text-white font-semibold'
                    : 'bg-surface-subtle text-content-secondary hover:text-content-dark'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-content-dark">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>{category.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[11px] text-slate-300 block">Starting from</span>
                    <span className="text-xl font-extrabold text-white">
                      {formatCurrency(category.startingPrice)}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-content-dark group-hover:text-brand-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-brand-700 font-medium mt-0.5">
                    {category.tagline}
                  </p>
                  <p className="mt-2 text-xs text-content-secondary leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`${ROUTES.SEARCH}?category=${category.slug}`}
                  className="w-full py-2.5 px-4 bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Find {category.name} Pros</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
