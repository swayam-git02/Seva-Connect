import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Error State view with Retry action
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-red-100 bg-red-50/50 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-state-error mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-content-dark">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-content-secondary leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={RefreshCw}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
