// Ye routes completed booking ke customer reviews aur provider replies ko handle karte hain.
// Review ownership aur booking completion checks backend par enforce hote hain.

import { Router } from 'express';
import crypto from 'crypto';
import db from '../../config/database.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import { USER_ROLES, BOOKING_STATUS } from '../../constants/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router();

// Submit Review (Customer only for completed booking)
router.post('/', authenticate, authorize(USER_ROLES.CUSTOMER), (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating) {
      return sendError(res, 'Booking ID and star rating (1-5) are required.', 400);
    }

    const booking = db.prepare('SELECT customer_id, provider_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) return sendError(res, 'Booking not found.', 404);

    if (booking.customer_id !== req.user.id) {
      return sendError(res, 'Unauthorized to review this booking.', 403);
    }

    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      return sendError(res, 'Reviews can only be submitted after service completion.', 400);
    }

    const existingReview = db.prepare('SELECT id FROM reviews WHERE booking_id = ?').get(bookingId);
    if (existingReview) {
      return sendError(res, 'You have already submitted a review for this booking.', 400);
    }

    const reviewId = `rev-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    db.transaction(() => {
      db.prepare(`
        INSERT INTO reviews (id, booking_id, customer_id, provider_id, rating, comment, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(reviewId, bookingId, req.user.id, booking.provider_id, Number(rating), comment || '', now, now);

      // Recompute provider average rating
      const stats = db.prepare(`
        SELECT COUNT(*) as count, AVG(rating) as avgRating
        FROM reviews WHERE provider_id = ?
      `).get(booking.provider_id);

      db.prepare(`
        UPDATE provider_profiles
        SET rating_average = ROUND(?, 1), rating_count = ?, updated_at = ?
        WHERE user_id = ?
      `).run(stats.avgRating || 0, stats.count || 0, now, booking.provider_id);
    })();

    return sendSuccess(res, { id: reviewId, rating, comment }, 'Review submitted successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

// Get reviews for a provider
router.get('/provider/:providerId', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.id, r.rating, r.comment, r.provider_reply as providerReply, r.created_at as createdAt,
           u.name as customerName
    FROM reviews r
    JOIN users u ON r.customer_id = u.id
    WHERE r.provider_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.providerId);

  return sendSuccess(res, reviews);
});

export default router;
