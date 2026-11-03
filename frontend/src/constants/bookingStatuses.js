// Booking Status Constants and configuration
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ON_THE_WAY: 'ON_THE_WAY',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

// UI Badge visual mappings
export const BOOKING_STATUS_CONFIG = {
  [BOOKING_STATUS.PENDING]: {
    label: 'Pending Confirmation',
    color: 'warning',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    stepIndex: 1,
  },
  [BOOKING_STATUS.CONFIRMED]: {
    label: 'Booking Confirmed',
    color: 'info',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    stepIndex: 2,
  },
  [BOOKING_STATUS.ON_THE_WAY]: {
    label: 'Technician On The Way',
    color: 'info',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    stepIndex: 3,
  },
  [BOOKING_STATUS.STARTED]: {
    label: 'Service In Progress',
    color: 'warning',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    stepIndex: 4,
  },
  [BOOKING_STATUS.COMPLETED]: {
    label: 'Service Completed',
    color: 'success',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    stepIndex: 5,
  },
  [BOOKING_STATUS.CANCELLED]: {
    label: 'Booking Cancelled',
    color: 'error',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    stepIndex: 0,
  },
  [BOOKING_STATUS.REJECTED]: {
    label: 'Request Declined',
    color: 'error',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    stepIndex: 0,
  },
};
