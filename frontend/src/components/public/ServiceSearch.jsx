// Ye search form visitor ka service query collect karke search results route par bhejta hai.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { SERVICE_LOCATIONS } from '../../constants/serviceCategories';

export const ServiceSearch = ({ className = '', defaultService = '', defaultLocation = '' }) => {
  const [searchTerm, setSearchTerm] = useState(defaultService);
  const [location, setLocation] = useState(defaultLocation || 'Faridabad');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('query', searchTerm.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`${ROUTES.SEARCH}?${params.toString()}`);
  };

  const quickTags = ['Electrician', 'AC Repair', 'Plumber', 'Deep Cleaning', 'Carpenter'];

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form
        onSubmit={handleSearch}
        className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-elevated border border-surface-border flex flex-col md:flex-row gap-2 items-center"
      >
        {/* Service Input */}
        <div className="flex-1 w-full flex items-center px-3 py-1.5 sm:py-2">
          <Search className="h-5 w-5 text-brand-500 mr-3 shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[11px] font-semibold text-content-muted uppercase tracking-wider">
              Service
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Switchboard repair, AC cooling, plumber..."
              className="w-full text-sm font-medium text-content-dark placeholder-content-placeholder focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-surface-border" />

        {/* Location Dropdown / Input */}
        <div className="w-full md:w-64 flex items-center px-3 py-1.5 sm:py-2 border-t md:border-t-0 border-surface-border">
          <MapPin className="h-5 w-5 text-content-muted mr-3 shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[11px] font-semibold text-content-muted uppercase tracking-wider">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm font-medium text-content-dark bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Faridabad">Faridabad (All Sectors)</option>
              <option value="Sector 15, Faridabad">Sector 15 & 16, Faridabad</option>
              <option value="Green Field, Faridabad">Green Field Colony</option>
              <option value="Greater Faridabad">Greater Faridabad (Neharpar)</option>
              <option value="Gurugram">Gurugram (DLF & Cyber City)</option>
              <option value="Noida">Noida (Sector 50/62)</option>
              <option value="South Delhi">South Delhi (Saket / GK)</option>
            </select>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-7 py-4 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <span>Find Pros</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Popular quick tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-content-muted">
        <span className="font-medium text-content-secondary">Popular in Faridabad:</span>
        {quickTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setSearchTerm(tag);
              navigate(`${ROUTES.SEARCH}?query=${encodeURIComponent(tag)}&location=${encodeURIComponent(location)}`);
            }}
            className="px-2.5 py-1 rounded-full bg-white/80 border border-surface-border hover:border-brand-500 hover:text-brand-600 transition-colors shadow-subtle"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSearch;
