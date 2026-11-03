// Ye admin-only routes platform users, verification aur operational data ko manage karte hain.

import { Router } from 'express';
import db from '../../config/database.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import { USER_ROLES, KYC_STATUS } from '../../constants/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router();

// Protect all admin routes with authentication and admin authorization
router.use(authenticate, authorize(USER_ROLES.ADMIN));

// Platform Real Statistics (Zero if fresh database, never fabricated)
router.get('/dashboard-stats', (req, res) => {
  const totalUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get().c;
  const totalProviders = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'provider'").get().c;
  const totalBookings = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;

  const revRow = db.prepare("SELECT SUM(total_price_paise) as sum FROM bookings WHERE status = 'completed'").get();
  const monthlyRevenue = revRow?.sum ? Math.round(revRow.sum / 100) : 0;

  const pendingVerifications = db.prepare("SELECT COUNT(*) as c FROM provider_profiles WHERE kyc_status = 'pending'").get().c;
  const activeDisputes = db.prepare("SELECT COUNT(*) as c FROM complaints WHERE status = 'OPEN'").get().c;

  return sendSuccess(res, {
    totalUsers,
    totalProviders,
    totalBookings,
    monthlyRevenue,
    pendingVerifications,
    activeDisputes,
  });
});

// User Management
router.get('/users', (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.city, u.role, u.is_active as isActive, u.created_at as joinedDate,
           (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = u.id OR b.provider_id = u.id) as bookingsCount
    FROM users u
    ORDER BY u.created_at DESC
  `).all();

  return sendSuccess(res, users);
});

// Pending Provider Verifications
router.get('/verifications', (req, res) => {
  const list = db.prepare(`
    SELECT 
      p.user_id as id, p.user_id as providerId, u.name as providerName,
      p.category_slug as category, u.phone, u.city, p.kyc_documents as documents,
      p.updated_at as submittedAt, p.kyc_status as status
    FROM provider_profiles p
    JOIN users u ON p.user_id = u.id
    WHERE p.kyc_status = 'pending'
    ORDER BY p.updated_at DESC
  `).all();

  const formatted = list.map((item) => ({
    ...item,
    documents: item.documents ? JSON.parse(item.documents) : ['Government ID Proof'],
  }));

  return sendSuccess(res, formatted);
});

// Approve Provider KYC
router.post('/verifications/:id/approve', (req, res) => {
  const now = new Date().toISOString();
  const update = db.prepare(`
    UPDATE provider_profiles
    SET verified = 1, kyc_status = ?, updated_at = ?
    WHERE user_id = ?
  `);
  update.run(KYC_STATUS.VERIFIED, now, req.params.id);

  return sendSuccess(res, null, 'Provider verification approved and verified badge activated.');
});

// Reject Provider KYC
router.post('/verifications/:id/reject', (req, res) => {
  const now = new Date().toISOString();
  const update = db.prepare(`
    UPDATE provider_profiles
    SET verified = 0, kyc_status = ?, updated_at = ?
    WHERE user_id = ?
  `);
  update.run(KYC_STATUS.REJECTED, now, req.params.id);

  return sendSuccess(res, null, 'Provider verification marked as rejected.');
});

// Platform Bookings Oversight
router.get('/bookings', (req, res) => {
  const bookings = db.prepare(`
    SELECT 
      b.id, b.service_title as serviceTitle, b.category_slug as category,
      b.scheduled_date as scheduledDate, b.scheduled_time as scheduledTime,
      b.status, b.total_price_paise / 100 as totalPrice, b.created_at as createdAt,
      cu.name as customerName, pu.name as providerName
    FROM bookings b
    JOIN users cu ON b.customer_id = cu.id
    JOIN users pu ON b.provider_id = pu.id
    ORDER BY b.created_at DESC
  `).all();

  return sendSuccess(res, bookings);
});

// Customer Complaints
router.get('/complaints', (req, res) => {
  const complaints = db.prepare(`
    SELECT 
      c.id, c.booking_id as bookingId, c.issue, c.priority, c.status, c.created_at as date,
      cu.name as customerName, pu.name as providerName
    FROM complaints c
    JOIN users cu ON c.complainant_id = cu.id
    LEFT JOIN users pu ON c.respondent_id = pu.id
    ORDER BY c.created_at DESC
  `).all();

  return sendSuccess(res, complaints);
});

export default router;
