import React from 'react';

/**
 * Shimmer skeleton loaders for cards, tables, and details
 */
export const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {items.map((i) => (
          <div key={i} className="rounded-xl border border-surface-border bg-white p-5 shadow-card animate-pulse">
            <div className="h-44 w-full bg-slate-200 rounded-lg mb-4" />
            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-1/2 bg-slate-200 rounded mb-4" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="h-4 w-1/4 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`w-full overflow-hidden rounded-xl border border-surface-border bg-white shadow-card animate-pulse ${className}`}>
        <div className="h-12 bg-slate-100 border-b border-surface-border" />
        {items.map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100">
            <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-3 w-1/4 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-8 w-16 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
      <div className="h-4 bg-slate-200 rounded w-4/6" />
    </div>
  );
};

export default SkeletonLoader;
