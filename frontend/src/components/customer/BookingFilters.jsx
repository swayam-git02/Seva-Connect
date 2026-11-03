import React from 'react';
import { Search } from 'lucide-react';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';

export const BookingFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}) => {
  const tabs = [
    { id: 'ALL', label: 'All Bookings' },
    { id: BOOKING_STATUS.ON_THE_WAY, label: 'Active / On The Way' },
    { id: BOOKING_STATUS.COMPLETED, label: 'Completed' },
    { id: BOOKING_STATUS.CANCELLED, label: 'Cancelled' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-surface-border shadow-subtle overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-content-secondary hover:text-content-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-content-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ID or service..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-surface-border bg-white placeholder-content-placeholder focus:border-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default BookingFilters;
