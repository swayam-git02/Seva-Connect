import React from 'react';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatuses';

/**
 * Reusable Status Badge for Bookings, KYC Verifications, and Active flags
 */
export const StatusBadge = ({ status, customLabel, size = 'md', className = '' }) => {
  const normalizedStatus = (status || '').toUpperCase();
  const config = BOOKING_STATUS_CONFIG[normalizedStatus] || {
    label: customLabel || status,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  const label = customLabel || config.label;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeStyles} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};

export default StatusBadge;
