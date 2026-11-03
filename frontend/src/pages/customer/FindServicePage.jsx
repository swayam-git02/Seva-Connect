import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star } from 'lucide-react';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export const FindServicePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${ROUTES.CUSTOMER_SEARCH}?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Find a Service
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          Choose a verified technician category or search your required repair.
        </p>
      </div>

      {/* Search Header */}
      <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl border border-surface-border shadow-card flex items-center gap-3">
        <Search className="h-5 w-5 text-brand-500 ml-2 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="What do you need repaired? (e.g. fan installation, sink tap, sofa cleaning)..."
          className="flex-1 text-sm text-content-dark placeholder-content-placeholder focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all shrink-0"
        >
          Search Pros
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`${ROUTES.CUSTOMER_SEARCH}?category=${cat.id}`)}
            className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-40 w-full overflow-hidden relative">
                <ImageWithFallback
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-[11px] text-slate-200 block">Starting from</span>
                  <span className="text-lg font-bold">{formatCurrency(cat.startingPrice)}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-content-dark group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-content-secondary mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between text-xs font-semibold text-brand-600 border-t border-slate-100 mt-2">
              <span>View Available Pros</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindServicePage;
