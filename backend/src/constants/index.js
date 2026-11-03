// Is file mein backend ke sabhi standard constants define hain.
// User roles, booking lifecycle states, photo stages aur KYC verification statuses yahan centralize kiye gaye hain.

// System mein teen tarah ke users hote hain: customer, service provider aur platform admin
export const USER_ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

// Booking lifecycle ke steps:
// PENDING: customer ne request banayi
// CONFIRMED: provider ne accept kiya (Starting & Ending codes generate hote hain)
// IN_PROGRESS: provider ne customer ka Starting Code verify kiya aur kaam shuru hua
// COMPLETED: kaam khatam hone par customer ka Ending Code verify hua aur payment settle hui
// CANCELLED / DECLINED: booking cancel ya reject ho gayi
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
};

// Evidence photos ke do stages: service shuru hone se pehle (BEFORE) aur kaam pura hone ke baad (AFTER)
export const PHOTO_STAGE = {
  BEFORE: 'before',
  AFTER: 'after',
};

// Provider ke KYC verification ke status:
// unsubmitted -> pending review -> verified ya rejected
export const KYC_STATUS = {
  UNSUBMITTED: 'unsubmitted',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};
