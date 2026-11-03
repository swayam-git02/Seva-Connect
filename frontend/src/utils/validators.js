// Form validation functions for email, Indian mobile number, passwords, and OTP verification codes
// Roman Hinglish: User inputs aur verification codes validate karne ke functions
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).toLowerCase());
};

export const isValidIndianMobile = (phone) => {
  if (!phone) return false;
  // Cleans spaces, dashes, +91 prefix
  const cleaned = String(phone).replace(/\D/g, '');
  const tenDigit = cleaned.slice(-10);
  return /^[6-9]\d{9}$/.test(tenDigit);
};

export const isValidPassword = (password) => {
  if (!password) return false;
  // Minimum 6 characters
  return password.length >= 6;
};

export const isValidVerificationCode = (code) => {
  if (!code) return false;
  // Exactly 4-digit code (Starting Code / Ending Code OTP)
  return /^\d{4}$/.test(String(code).trim());
};

export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  // Standard Indian 6-digit postal pincode
  return /^[1-9][0-9]{5}$/.test(String(pincode).trim());
};
