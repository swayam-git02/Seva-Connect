// Ye routes booking create, list, cancellation aur secure two-code verification ko expose karte hain.
// Har sensitive action authentication aur relevant customer/provider role check ke baad hi service layer tak jata hai.

import { Router } from 'express';
import bookingService from './service.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import { verifyLimiter } from '../../middleware/rateLimiter.js';
import { USER_ROLES } from '../../constants/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router();

// Ye endpoint sirf customer ki nayi booking banata hai. Price aur verification codes backend service mein safely calculate hote hain.
router.post('/', authenticate, authorize(USER_ROLES.CUSTOMER), (req, res) => {
  try {
    const booking = bookingService.createBooking(req.user.id, req.body);
    return sendSuccess(res, booking, 'Booking confirmed with secure OTP verification codes', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

// List bookings for current user (Customer / Provider / Admin)
router.get('/', authenticate, (req, res) => {
  try {
    const list = bookingService.getBookings(req.user, req.query);
    return sendSuccess(res, list);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

// Get booking details
router.get('/:id', authenticate, (req, res) => {
  try {
    const booking = bookingService.getBookingById(req.params.id, req.user.id, req.user.role);
    if (!booking) return sendError(res, 'Booking not found', 404);
    return sendSuccess(res, booking);
  } catch (err) {
    return sendError(res, err.message, 403);
  }
});

// Ye endpoint actual Starting aur Ending Code sirf booking ke customer ko deta hai.
// Provider codes retrieve nahi kar sakta; woh sirf customer se mila code verify karta hai.
router.get('/:id/codes', authenticate, authorize(USER_ROLES.CUSTOMER), (req, res) => {
  try {
    const codes = bookingService.getCustomerCodes(req.params.id, req.user.id);
    return sendSuccess(res, codes);
  } catch (err) {
    return sendError(res, err.message, 403);
  }
});

// Ye handler provider ke code ko verify karta hai. Rate limit guessing ko rokta hai aur successful check service ko start karta hai.
const handleVerifyStart = (req, res) => {
  try {
    const code = req.body.code;
    if (!code) return sendError(res, 'Starting Code is required', 400);
    const result = bookingService.verifyStartingCode(req.params.id, req.user.id, code);
    return sendSuccess(res, result, result.message);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

router.post('/:id/verify-start-code', authenticate, authorize(USER_ROLES.PROVIDER), verifyLimiter, handleVerifyStart);
router.post('/:id/verify-starting-code', authenticate, authorize(USER_ROLES.PROVIDER), verifyLimiter, handleVerifyStart);

// Ye handler Ending Code verify karke allowed workflow mein job complete karta hai.
// Provider ya booking customer (jisne Ending Code generate kiya hai) dono valid 6-digit code submit karke service conclude kar sakte hain.
const handleVerifyEnd = (req, res) => {
  try {
    const code = req.body.code;
    if (!code) return sendError(res, 'Ending Code is required', 400);
    const result = bookingService.verifyEndingCode(req.params.id, req.user.id, code, req.user.role);
    return sendSuccess(res, result, result.message);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

router.post(
  '/:id/verify-end-code',
  authenticate,
  authorize([USER_ROLES.PROVIDER, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN]),
  verifyLimiter,
  handleVerifyEnd
);
router.post(
  '/:id/verify-ending-code',
  authenticate,
  authorize([USER_ROLES.PROVIDER, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN]),
  verifyLimiter,
  handleVerifyEnd
);

// Ye endpoint ending code verification ke baad provider ya customer dwara payment process karne aur booking close karne ke liye use hota hai.
const handleProcessPayment = (req, res) => {
  try {
    const result = bookingService.collectPayment(req.params.id, req.user.id, req.body);
    return sendSuccess(res, result, result.message);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

router.post(
  '/:id/collect-payment',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  handleProcessPayment
);

router.post(
  '/:id/pay',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  handleProcessPayment
);

// Cancel booking
router.post('/:id/cancel', authenticate, (req, res) => {
  try {
    const result = bookingService.cancelBooking(req.params.id, req.user.id, req.body.reason);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

// Ye route provider ya customer ko unwanted booking completely delete/remove karne ki permission deta hai.
const handleDeleteBooking = (req, res) => {
  try {
    const result = bookingService.deleteBooking(req.params.id, req.user.id, req.user.role);
    return sendSuccess(res, result, result.message);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

router.delete('/:id', authenticate, handleDeleteBooking);
router.post('/:id/delete', authenticate, handleDeleteBooking);

// Ye endpoint customer ke unused codes replace karta hai; service start hone ke baad regeneration allowed nahi hai.
router.post('/:id/regenerate-codes', authenticate, authorize(USER_ROLES.CUSTOMER), (req, res) => {
  try {
    const result = bookingService.regenerateCodes(req.params.id, req.user.id);
    return sendSuccess(res, result, 'New verification codes generated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

export default router;
