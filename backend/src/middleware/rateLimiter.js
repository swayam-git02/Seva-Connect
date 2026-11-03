// Is file mein rate limiting rules configure kiye gaye hain.
// API abuse, password brute-force aur OTP guessing attacks ko rokne ke liye
// alag-alag endpoints par request limit lagayi jaati hai.

import rateLimit from 'express-rate-limit';

// General API Limiter: 15 minute mein maximum 300 requests allow karta hai
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Auth Limiter: Login aur Signup routes par 15 minute mein maximum 30 requests (credential stuffing se bachata hai)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});

// Verification Limiter: Starting Code / Ending Code OTP verify karne par 10 minute mein max 15 requests
// Taaki koi automated script 6-digit OTP guess na kar sake
export const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts for this booking. Please try again shortly.',
  },
});
