// Ye service booking lifecycle, price calculation aur dual-code state transitions ko database mein safely manage karti hai.
// Important changes transactions mein hote hain, taaki booking status aur verification/audit records aadhe update na rahen.

import crypto from 'crypto';
import db from '../../config/database.js';
import {
  generateSecureCode,
  hashCode,
  verifyCodeHash,
  encryptCodeEnvelope,
  decryptCodeEnvelope,
} from '../../utils/crypto.js';
import { BOOKING_STATUS, USER_ROLES } from '../../constants/index.js';

export const bookingService = {
  // Ye customer ki selected service se booking aur dono protected codes ek hi transaction mein banata hai.
  // Service/provider validity check ke baad hi amount calculate aur records save hote hain.
  createBooking(customerId, payload) {
    const customer = db.prepare('SELECT id, name, phone, address FROM users WHERE id = ?').get(customerId);
    if (!customer) throw new Error('Customer account not found.');

    const provider = db.prepare(`
      SELECT u.id, u.name, u.phone, p.business_name as businessName, p.category_slug as categorySlug, p.hourly_rate as hourlyRate
      FROM users u
      JOIN provider_profiles p ON u.id = p.user_id
      WHERE u.id = ? AND u.role = 'provider'
    `).get(payload.providerId);

    if (!provider) {
      throw new Error('Selected service professional was not found or is unavailable.');
    }

    // Calculate server-authoritative prices in integer paise
    const basePriceRupees = Number(payload.basePrice || provider.hourlyRate || 399);
    const basePricePaise = Math.round(basePriceRupees * 100);
    const taxPaise = Math.round(basePricePaise * 0.18); // 18% GST
    const platformFeePaise = 2900; // Flat ₹29 convenience fee
    const totalPricePaise = basePricePaise + taxPaise + platformFeePaise;

    // Generate unique human-readable booking ID: SC-XXXXX
    const bookingId = `SC-${crypto.randomInt(10000, 99999)}`;
    const now = new Date().toISOString();

    // Generate independent 6-digit cryptographic verification codes
    const startingCode = generateSecureCode(6);
    const endingCode = generateSecureCode(6);

    const startCodeHash = hashCode(startingCode);
    const endCodeHash = hashCode(endingCode);

    const startCodeEnvelope = encryptCodeEnvelope(startingCode);
    const endCodeEnvelope = encryptCodeEnvelope(endingCode);

    const initialStatus = BOOKING_STATUS.CONFIRMED;

    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        id, customer_id, provider_id, service_id, service_title, category_slug,
        scheduled_date, scheduled_time, customer_address, customer_phone, notes,
        status, payment_method, payment_status,
        base_price_paise, tax_paise, platform_fee_paise, total_price_paise,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?)
    `);

    const insertVerification = db.prepare(`
      INSERT INTO booking_verification (
        booking_id, start_code_hash, start_code_envelope, start_code_attempts,
        end_code_hash, end_code_envelope, end_code_attempts,
        created_at, updated_at
      ) VALUES (?, ?, ?, 0, ?, ?, 0, ?, ?)
    `);

    const insertHistory = db.prepare(`
      INSERT INTO booking_status_history (
        id, booking_id, status, changed_by_user_id, note, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      insertBooking.run(
        bookingId,
        customerId,
        provider.id,
        payload.serviceId || null,
        payload.serviceTitle || `${provider.categorySlug.toUpperCase()} Doorstep Service`,
        provider.categorySlug,
        payload.scheduledDate || new Date().toISOString().split('T')[0],
        payload.scheduledTime || '10:00 AM',
        payload.customerAddress || customer.address || 'Address provided at checkout',
        payload.customerPhone || customer.phone,
        payload.notes || null,
        initialStatus,
        payload.paymentMethod || 'PAY_AFTER_SERVICE',
        basePricePaise,
        taxPaise,
        platformFeePaise,
        totalPricePaise,
        now,
        now
      );

      insertVerification.run(
        bookingId,
        startCodeHash,
        startCodeEnvelope,
        endCodeHash,
        endCodeEnvelope,
        now,
        now
      );

      insertHistory.run(
        `bsh-${crypto.randomUUID()}`,
        bookingId,
        initialStatus,
        customerId,
        'Booking created and confirmed with Dual-Code OTP protection',
        now
      );
    })();

    const fullBooking = this.getBookingById(bookingId, customerId, USER_ROLES.CUSTOMER);
    return {
      ...fullBooking,
      startingCode,
      endingCode,
    };
  },

  // Ye current role ke liye authorized bookings laata hai aur customer ke alawa kisi ko actual codes nahi deta.
  getBookings(user, filters = {}) {
    let query = `
      SELECT 
        b.id, b.customer_id as customerId, b.provider_id as providerId,
        b.service_title as serviceTitle, b.category_slug as category,
        b.scheduled_date as scheduledDate, b.scheduled_time as scheduledTime,
        b.customer_address as customerAddress, b.customer_phone as customerPhone,
        b.status, b.payment_method as paymentMethod, b.payment_status as paymentStatus,
        b.base_price_paise / 100 as basePrice,
        b.tax_paise / 100 as taxes,
        b.platform_fee_paise / 100 as platformFee,
        b.total_price_paise / 100 as totalPrice,
        b.service_started_at as startingCodeVerifiedAt,
        b.service_completed_at as endingCodeVerifiedAt,
        b.created_at as createdAt,
        cu.name as customerName, cu.phone as customerPhoneUser,
        pu.name as providerName, pu.phone as providerPhone,
        pp.business_name as providerBusiness,
        v.start_code_verified_at as startVerifiedAt,
        v.end_code_verified_at as endVerifiedAt,
        v.start_code_envelope, v.end_code_envelope
      FROM bookings b
      JOIN users cu ON b.customer_id = cu.id
      JOIN users pu ON b.provider_id = pu.id
      JOIN provider_profiles pp ON pu.id = pp.user_id
      LEFT JOIN booking_verification v ON b.id = v.booking_id
      WHERE 1=1
    `;
    const params = [];

    if (user.role === USER_ROLES.CUSTOMER) {
      query += ` AND b.customer_id = ?`;
      params.push(user.id);
    } else if (user.role === USER_ROLES.PROVIDER) {
      query += ` AND b.provider_id = ?`;
      params.push(user.id);
    }

    if (filters.status && filters.status !== 'ALL') {
      query += ` AND b.status = ?`;
      params.push(filters.status.toLowerCase());
    }

    query += ` ORDER BY b.created_at DESC`;

    const rows = db.prepare(query).all(...params);

    return rows.map((b) => {
      const isCustomer = user.role === USER_ROLES.CUSTOMER;
      return {
        id: b.id,
        customerId: b.customerId,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        customerAddress: b.customerAddress,
        providerId: b.providerId,
        providerName: b.providerName,
        providerBusiness: b.providerBusiness,
        providerPhone: b.providerPhone,
        serviceTitle: b.serviceTitle,
        category: b.category,
        scheduledDate: b.scheduledDate,
        scheduledTime: b.scheduledTime,
        status: b.status,
        paymentMethod: b.paymentMethod,
        paymentStatus: b.paymentStatus,
        basePrice: b.basePrice,
        taxes: b.taxes,
        platformFee: b.platformFee,
        totalPrice: b.totalPrice,
        startingCodeVerifiedAt: b.startVerifiedAt,
        endingCodeVerifiedAt: b.endVerifiedAt,
        createdAt: b.createdAt,
        // Codes delivered ONLY to authorized customer
        startingCode: isCustomer ? decryptCodeEnvelope(b.start_code_envelope) : undefined,
        endingCode: isCustomer ? decryptCodeEnvelope(b.end_code_envelope) : undefined,
      };
    });
  },

  // Ye ek booking aur status history laata hai, lekin ownership check ke bina detail expose nahi karta.
  getBookingById(bookingId, userId, userRole) {
    const query = `
      SELECT 
        b.id, b.customer_id as customerId, b.provider_id as providerId,
        b.service_title as serviceTitle, b.category_slug as category,
        b.scheduled_date as scheduledDate, b.scheduled_time as scheduledTime,
        b.customer_address as customerAddress, b.customer_phone as customerPhone,
        b.notes, b.status, b.payment_method as paymentMethod, b.payment_status as paymentStatus,
        b.base_price_paise / 100 as basePrice,
        b.tax_paise / 100 as taxes,
        b.platform_fee_paise / 100 as platformFee,
        b.total_price_paise / 100 as totalPrice,
        b.service_started_at as startingCodeVerifiedAt,
        b.service_completed_at as endingCodeVerifiedAt,
        b.created_at as createdAt,
        cu.name as customerName, cu.phone as customerPhoneUser,
        pu.name as providerName, pu.phone as providerPhone,
        pp.business_name as providerBusiness,
        v.start_code_verified_at as startVerifiedAt,
        v.end_code_verified_at as endVerifiedAt,
        v.start_code_envelope, v.end_code_envelope
      FROM bookings b
      JOIN users cu ON b.customer_id = cu.id
      JOIN users pu ON b.provider_id = pu.id
      JOIN provider_profiles pp ON pu.id = pp.user_id
      LEFT JOIN booking_verification v ON b.id = v.booking_id
      WHERE b.id = ?
    `;

    const b = db.prepare(query).get(bookingId);
    if (!b) return null;

    // Enforce authorization: only customer, assigned provider, or admin
    if (userRole !== USER_ROLES.ADMIN && userId !== b.customerId && userId !== b.providerId) {
      throw new Error('Access denied. You do not have permission to view this booking.');
    }

    const history = db.prepare(`
      SELECT status, note, timestamp
      FROM booking_status_history
      WHERE booking_id = ?
      ORDER BY timestamp ASC
    `).all(bookingId);

    const isCustomer = userId === b.customerId || userRole === USER_ROLES.ADMIN;

    return {
      id: b.id,
      customerId: b.customerId,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      customerAddress: b.customerAddress,
      providerId: b.providerId,
      providerName: b.providerName,
      providerBusiness: b.providerBusiness,
      providerPhone: b.providerPhone,
      serviceTitle: b.serviceTitle,
      category: b.category,
      scheduledDate: b.scheduledDate,
      scheduledTime: b.scheduledTime,
      notes: b.notes,
      status: b.status,
      paymentMethod: b.paymentMethod,
      paymentStatus: b.paymentStatus,
      basePrice: b.basePrice,
      taxes: b.taxes,
      platformFee: b.platformFee,
      totalPrice: b.totalPrice,
      startingCodeVerifiedAt: b.startVerifiedAt,
      endingCodeVerifiedAt: b.endVerifiedAt,
      createdAt: b.createdAt,
      statusHistory: history,
      startingCode: isCustomer ? decryptCodeEnvelope(b.start_code_envelope) : undefined,
      endingCode: isCustomer ? decryptCodeEnvelope(b.end_code_envelope) : undefined,
    };
  },

  // Ye encrypted code envelopes decrypt karke codes sirf original customer ko deta hai.
  getCustomerCodes(bookingId, customerId) {
    const booking = db.prepare('SELECT customer_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');
    if (booking.customer_id !== customerId) {
      throw new Error('Unauthorized. Verification codes are private to the customer.');
    }

    const verification = db.prepare('SELECT start_code_envelope, end_code_envelope, start_code_verified_at, end_code_verified_at FROM booking_verification WHERE booking_id = ?').get(bookingId);
    if (!verification) throw new Error('Verification record not found.');

    return {
      startingCode: decryptCodeEnvelope(verification.start_code_envelope),
      endingCode: decryptCodeEnvelope(verification.end_code_envelope),
      startingCodeVerified: Boolean(verification.start_code_verified_at),
      endingCodeVerified: Boolean(verification.end_code_verified_at),
      status: booking.status,
    };
  },

  // Ye assigned provider ka input hash se compare karta hai; galat code par attempts badhte hain.
  // Sahi code par transaction booking ko in_progress aur audit trail ko update karta hai.
  verifyStartingCode(bookingId, providerId, inputCode) {
    const booking = db.prepare('SELECT id, provider_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');
    if (booking.provider_id !== providerId) {
      throw new Error('Unauthorized. You are not the assigned provider for this booking.');
    }

    if (booking.status === BOOKING_STATUS.IN_PROGRESS || booking.status === BOOKING_STATUS.COMPLETED) {
      return { success: true, message: 'Starting Code was already verified.', status: booking.status };
    }

    const verification = db.prepare('SELECT * FROM booking_verification WHERE booking_id = ?').get(bookingId);
    if (!verification) throw new Error('Verification data missing.');

    if (verification.start_code_attempts >= verification.start_code_max_attempts) {
      throw new Error('Maximum Starting Code attempts exceeded. Please ask customer to regenerate code.');
    }

    const isValid = verifyCodeHash(inputCode, verification.start_code_hash);

    if (!isValid) {
      db.prepare('UPDATE booking_verification SET start_code_attempts = start_code_attempts + 1, updated_at = ? WHERE booking_id = ?')
        .run(new Date().toISOString(), bookingId);
      throw new Error('Invalid Starting Code. Please verify with the customer and try again.');
    }

    // Atomic state transition to IN_PROGRESS
    const now = new Date().toISOString();
    db.transaction(() => {
      db.prepare(`
        UPDATE bookings SET status = ?, service_started_at = ?, updated_at = ?
        WHERE id = ?
      `).run(BOOKING_STATUS.IN_PROGRESS, now, now, bookingId);

      db.prepare(`
        UPDATE booking_verification SET start_code_verified_at = ?, updated_at = ?
        WHERE booking_id = ?
      `).run(now, now, bookingId);

      db.prepare(`
        INSERT INTO booking_status_history (id, booking_id, status, changed_by_user_id, note, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `bsh-${crypto.randomUUID()}`,
        bookingId,
        BOOKING_STATUS.IN_PROGRESS,
        providerId,
        'Starting Code verified. Service commenced.',
        now
      );
    })();

    return {
      success: true,
      message: 'Starting Code verified successfully. Work is now in progress.',
      status: BOOKING_STATUS.IN_PROGRESS,
    };
  },

  // Ye Ending Code verify karke job complete karta hai.
  // Assigned provider ya booking ka customer dono valid 6-digit cryptographic code enter karke service complete kar sakte hain.
  // Sahi code par completion, payment status aur provider earning ledger ek atomic transaction mein update hote hain.
  verifyEndingCode(bookingId, userId, inputCode, userRole = null) {
    const booking = db.prepare('SELECT id, provider_id, customer_id, status, total_price_paise FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const isAssignedProvider = booking.provider_id === userId;
    const isBookingCustomer = booking.customer_id === userId;
    const isAdmin = userRole === USER_ROLES.ADMIN;

    if (!isAssignedProvider && !isBookingCustomer && !isAdmin) {
      throw new Error('Unauthorized. You are not authorized to complete this booking.');
    }

    if (booking.status !== BOOKING_STATUS.IN_PROGRESS) {
      if (booking.status === BOOKING_STATUS.COMPLETED) {
        return { success: true, message: 'Job is already completed.', status: booking.status };
      }
      throw new Error('Service has not started yet. You must verify Starting Code before Ending Code.');
    }

    const verification = db.prepare('SELECT * FROM booking_verification WHERE booking_id = ?').get(bookingId);
    if (!verification) throw new Error('Verification data missing.');

    if (verification.end_code_attempts >= verification.end_code_max_attempts) {
      throw new Error('Maximum Ending Code attempts exceeded. Please contact platform support.');
    }

    const isValid = verifyCodeHash(inputCode, verification.end_code_hash);

    if (!isValid) {
      db.prepare('UPDATE booking_verification SET end_code_attempts = end_code_attempts + 1, updated_at = ? WHERE booking_id = ?')
        .run(new Date().toISOString(), bookingId);
      throw new Error('Invalid Ending Code. Please ensure all work is completed to customer satisfaction.');
    }

    // Atomic completion transition
    const now = new Date().toISOString();
    const netEarningPaise = Math.round(booking.total_price_paise * 0.9);
    const assignedProviderId = booking.provider_id;

    db.transaction(() => {
      db.prepare(`
        UPDATE bookings SET status = ?, payment_status = 'PAID', service_completed_at = ?, updated_at = ?
        WHERE id = ?
      `).run(BOOKING_STATUS.COMPLETED, now, now, bookingId);

      db.prepare(`
        UPDATE booking_verification SET end_code_verified_at = ?, updated_at = ?
        WHERE booking_id = ?
      `).run(now, now, bookingId);

      db.prepare(`
        UPDATE provider_profiles SET total_jobs = total_jobs + 1, updated_at = ?
        WHERE user_id = ?
      `).run(now, assignedProviderId);

      // Record transaction for assigned provider
      db.prepare(`
        INSERT INTO provider_transactions (id, provider_id, booking_id, amount_paise, type, description, created_at)
        VALUES (?, ?, ?, ?, 'credit', ?, ?)
      `).run(
        `txn-${crypto.randomUUID()}`,
        assignedProviderId,
        bookingId,
        netEarningPaise,
        `Payment credit for Booking #${bookingId}`,
        now
      );

      db.prepare(`
        INSERT INTO booking_status_history (id, booking_id, status, changed_by_user_id, note, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `bsh-${crypto.randomUUID()}`,
        bookingId,
        BOOKING_STATUS.COMPLETED,
        userId,
        'Ending Code verified. Job closed and payment processed.',
        now
      );
    })();

    return {
      success: true,
      message: 'Ending Code verified! Job marked as Completed and payment credited.',
      status: BOOKING_STATUS.COMPLETED,
    };
  },

  // Ye function ending code verification ke baad customer ya provider dwara payment process karne aur booking close karne ke liye use hota hai.
  collectPayment(bookingId, userId, payload = {}) {
    const booking = db.prepare('SELECT id, provider_id, customer_id, status, payment_status, total_price_paise FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (booking.provider_id !== userId && booking.customer_id !== userId) {
      throw new Error('Unauthorized. Only the customer or assigned service provider can process payment for this booking.');
    }

    const paymentMode = (payload.paymentMode || 'ONLINE').toUpperCase();
    const transactionId = payload.transactionId || `TXN_${Date.now().toString().slice(-8)}`;
    const amountRupees = (booking.total_price_paise ? booking.total_price_paise / 100 : 0) || Number(payload.amount || 0);
    const amountPaise = booking.total_price_paise || Math.round(amountRupees * 100);
    const now = new Date().toISOString();

    db.transaction(() => {
      // 1. Update booking status to completed and payment_status to PAID
      db.prepare(`
        UPDATE bookings 
        SET payment_status = 'PAID',
            status = 'completed',
            updated_at = ?
        WHERE id = ?
      `).run(now, bookingId);

      // 2. Add status history audit record
      db.prepare(`
        INSERT INTO booking_status_history (id, booking_id, status, changed_by_user_id, note, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `bsh-${crypto.randomUUID()}`,
        bookingId,
        BOOKING_STATUS.COMPLETED,
        userId,
        `Payment of ₹${amountRupees} settled via ${paymentMode} (${transactionId}). Booking officially closed.`,
        now
      );

      // 3. Record provider wallet earnings transaction (credit)
      try {
        const existingTxn = db.prepare('SELECT id FROM provider_transactions WHERE booking_id = ?').get(bookingId);
        if (!existingTxn) {
          db.prepare(`
            INSERT INTO provider_transactions (id, provider_id, booking_id, amount_paise, type, description, created_at)
            VALUES (?, ?, ?, ?, 'credit', ?, ?)
          `).run(
            `txn-${crypto.randomUUID()}`,
            booking.provider_id,
            bookingId,
            Math.round(amountPaise * 0.9), // Net after 10% platform fee
            `Earnings for Job #${bookingId} paid via ${paymentMode}`,
            now
          );
        }
      } catch (txnErr) {
        console.warn('Provider transaction notice:', txnErr.message);
      }

      // 4. Send notifications to both Customer and Provider
      try {
        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
          VALUES (?, ?, ?, ?, 'success', ?, ?)
        `).run(
          `notif-${crypto.randomUUID()}`,
          booking.customer_id,
          'Payment Successful & Booking Closed',
          `Your payment of ₹${amountRupees} for booking #${bookingId} was successful via ${paymentMode}. Thank you for using SevaConnect!`,
          `/customer/bookings/${bookingId}`,
          now
        );

        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
          VALUES (?, ?, ?, ?, 'success', ?, ?)
        `).run(
          `notif-${crypto.randomUUID()}`,
          booking.provider_id,
          'Payment Received & Booking Closed',
          `Payment of ₹${amountRupees} for booking #${bookingId} has been confirmed. Net earnings added to your wallet.`,
          `/provider/bookings/${bookingId}`,
          now
        );
      } catch (notifErr) {
        console.warn('Notification notice:', notifErr.message);
      }
    })();

    return {
      success: true,
      message: `Payment of ₹${amountRupees} settled via ${paymentMode}. Booking closed successfully!`,
      bookingId,
      amount: amountRupees,
      paymentMode,
      transactionId,
      paymentStatus: 'PAID',
      status: 'completed',
    };
  },

  // Ye incomplete booking ko sirf uske customer ya provider ke request par cancel karta hai aur history mein reason rakhta hai.
  cancelBooking(bookingId, userId, reason = '') {
    const booking = db.prepare('SELECT customer_id, provider_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (userId !== booking.customer_id && userId !== booking.provider_id) {
      throw new Error('Unauthorized to cancel this booking.');
    }

    if (booking.status === BOOKING_STATUS.COMPLETED) {
      throw new Error('Cannot cancel a completed booking.');
    }

    const now = new Date().toISOString();
    db.transaction(() => {
      db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?')
        .run(BOOKING_STATUS.CANCELLED, now, bookingId);

      db.prepare(`
        INSERT INTO booking_status_history (id, booking_id, status, changed_by_user_id, note, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `bsh-${crypto.randomUUID()}`,
        bookingId,
        BOOKING_STATUS.CANCELLED,
        userId,
        `Booking cancelled: ${reason || 'User requested cancellation'}`,
        now
      );
    })();

    return { success: true, message: 'Booking cancelled.' };
  },

  // Ye function booking ko completely delete/remove karta hai jab provider ya customer use nahi lena chahta.
  // Cascade delete se uske verification, photos, history aur audit records safely saaf ho jaate hain.
  deleteBooking(bookingId, userId, userRole = null) {
    const booking = db.prepare('SELECT id, customer_id, provider_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const isAssignedProvider = booking.provider_id === userId;
    const isCustomer = booking.customer_id === userId;
    const isAdmin = userRole === USER_ROLES.ADMIN;

    if (!isAssignedProvider && !isCustomer && !isAdmin) {
      throw new Error('Unauthorized. You do not have permission to delete this booking.');
    }

    db.transaction(() => {
      db.prepare('DELETE FROM provider_transactions WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM messages WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM complaints WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM reviews WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM booking_service_photos WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM booking_verification WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM booking_status_history WHERE booking_id = ?').run(bookingId);
      db.prepare('DELETE FROM bookings WHERE id = ?').run(bookingId);
    })();

    return {
      success: true,
      message: `Booking #${bookingId} has been successfully deleted from your job queue.`,
      bookingId,
    };
  },

  // Ye customer ke unused codes ko naye unpredictable values se replace karta hai aur failed attempts reset karta hai.
  regenerateCodes(bookingId, customerId) {
    const booking = db.prepare('SELECT customer_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');
    if (booking.customer_id !== customerId) throw new Error('Unauthorized.');
    if (booking.status === BOOKING_STATUS.IN_PROGRESS || booking.status === BOOKING_STATUS.COMPLETED) {
      throw new Error('Cannot regenerate codes after service has started.');
    }

    const startingCode = generateSecureCode(6);
    const endingCode = generateSecureCode(6);
    const startCodeHash = hashCode(startingCode);
    const endCodeHash = hashCode(endingCode);
    const startCodeEnvelope = encryptCodeEnvelope(startingCode);
    const endCodeEnvelope = encryptCodeEnvelope(endingCode);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE booking_verification
      SET start_code_hash = ?, start_code_envelope = ?, start_code_attempts = 0,
          end_code_hash = ?, end_code_envelope = ?, end_code_attempts = 0,
          updated_at = ?
      WHERE booking_id = ?
    `).run(startCodeHash, startCodeEnvelope, endCodeHash, endCodeEnvelope, now, bookingId);

    return { startingCode, endingCode };
  },
};

export default bookingService;
