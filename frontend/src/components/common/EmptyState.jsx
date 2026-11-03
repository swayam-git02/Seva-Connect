import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State view when search, bookings, or lists have zero items
 */
export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-surface-border bg-white ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-content-dark">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-content-secondary leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
