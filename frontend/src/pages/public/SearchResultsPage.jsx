// Ye public search result page entered query ke hisaab se matching providers/services dikhata hai.

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Map, List, Search as SearchIcon, MapPin } from 'lucide-react';
import ProviderCard from '../../components/public/ProviderCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import providerService from '../../services/providerService';
import { SERVICE_CATEGORIES, SERVICE_LOCATIONS } from '../../constants/serviceCategories';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const locationParam = searchParams.get('location') || 'all';

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedLocation, setSelectedLocation] = useState(locationParam);
  const [minRating, setMinRating] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const filters = {
          search: queryParam,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: selectedLocation !== 'all' ? selectedLocation : undefined,
          minRating: minRating !== 'all' ? Number(minRating) : undefined,
        };
        const res = await providerService.getProviders(filters);
        let list = res.data || [];

        // Client side sorting
        if (sortBy === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'price-low') {
          list.sort((a, b) => a.hourlyRate - b.hourlyRate);
        } else if (sortBy === 'price-high') {
          list.sort((a, b) => b.hourlyRate - a.hourlyRate);
        } else if (sortBy === 'jobs') {
          list.sort((a, b) => b.jobsCompleted - a.jobsCompleted);
        }

        setProviders(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [queryParam, selectedCategory, selectedLocation, minRating, sortBy]);

  return (
    <div className="py-8 bg-surface-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top title and summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
          <div>
            <h1 className="text-2xl font-bold text-content-dark tracking-tight">
              {queryParam ? `Results for "${queryParam}"` : selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} Professionals` : 'All Service Professionals'}
            </h1>
            <p className="text-xs text-content-secondary mt-1">
              Found <strong className="text-content-dark">{providers.length} verified pros</strong> in {selectedLocation !== 'all' ? selectedLocation : 'Delhi NCR & Faridabad'}
            </p>
          </div>

          {/* View Mode & Sort Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-surface-border bg-white text-content-dark"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* List vs Map toggle */}
            <div className="hidden sm:flex bg-white rounded-lg border border-surface-border p-1 shadow-subtle">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-content-muted'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 ${
                  viewMode === 'map' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-content-muted'
                }`}
              >
                <Map className="h-4 w-4" />
                <span>Map</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-surface-border bg-white text-content-dark focus:outline-none focus:border-brand-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="jobs">Most Experienced</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content Layout: Left Sidebar Filters + Right Results */}
        <div className="mt-6 flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className={`w-full md:w-64 shrink-0 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-5 rounded-xl border border-surface-border shadow-card space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-content-dark uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-brand-600" />
                  <span>Refine Results</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                    setMinRating('all');
                  }}
                  className="text-[11px] font-semibold text-brand-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-content-dark mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-surface-border bg-white"
                >
                  <option value="all">All Categories</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Filter */}
              <div>
                <label className="block text-xs font-semibold text-content-dark mb-2">Location Area</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-surface-border bg-white"
                >
                  <option value="all">All Locations (Faridabad & NCR)</option>
                  {SERVICE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Rating Filter */}
              <div>
                <label className="block text-xs font-semibold text-content-dark mb-2">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-surface-border bg-white"
                >
                  <option value="all">Any Rating</option>
                  <option value="4.8">4.8 & Above (Top Rated)</option>
                  <option value="4.5">4.5 & Above</option>
                  <option value="4.0">4.0 & Above</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Results Grid / Map */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkeletonLoader type="card" count={6} />
            ) : providers.length === 0 ? (
              <EmptyState
                title="No service providers found"
                description="We couldn't find any professionals matching your filters. Try selecting 'All Categories' or expanding your area."
                actionText="Reset All Filters"
                onAction={() => {
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setMinRating('all');
                }}
              />
            ) : viewMode === 'map' ? (
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
                <div className="h-96 rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')` }} />
                  <div className="relative z-10 text-center p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-surface-border shadow-elevated max-w-sm">
                    <MapPin className="h-8 w-8 text-brand-600 mx-auto mb-2 animate-bounce" />
                    <h3 className="text-sm font-bold text-content-dark">Sector Service Map</h3>
                    <p className="text-xs text-content-secondary mt-1">
                      Showing coverage across {selectedLocation !== 'all' ? selectedLocation : 'Faridabad, Gurugram & Delhi NCR'}. All professionals operate within a 12-15km radius.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {providers.slice(0, 4).map((p) => (
                    <ProviderCard key={p.id} provider={p} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
