import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

/**
 * Reusable accessible Pagination bar
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className={`flex items-center justify-between border-t border-surface-border px-4 py-3 sm:px-6 ${className}`} aria-label="Pagination">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="text-sm font-medium text-content-dark self-center">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-content-muted">
            Page <span className="font-semibold text-content-dark">{currentPage}</span> of{' '}
            <span className="font-semibold text-content-dark">{totalPages}</span>
          </p>
        </div>
        <div>
          <ul className="isolate inline-flex -space-x-px rounded-lg shadow-subtle">
            <li>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-medium text-content-secondary hover:bg-surface-muted disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </button>
            </li>
            {pages.map((page, idx) => (
              <li key={idx}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center border border-surface-border bg-white px-3 py-1.5 text-xs text-content-muted">
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center border px-3 py-1.5 text-xs font-medium ${
                      currentPage === page
                        ? 'z-10 border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-surface-border bg-white text-content-secondary hover:bg-surface-muted'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}
            <li>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-medium text-content-secondary hover:bg-surface-muted disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
