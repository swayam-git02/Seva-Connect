import React from 'react';
import { Search } from 'lucide-react';

export const AdminFilters = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search records...',
  filterValue,
  onFilterChange,
  filterOptions = [],
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Filter Select if options exist */}
      {filterOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AdminFilters;
