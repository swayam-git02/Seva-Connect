// Ye service provider records, offered services aur public profile data ko SQLite se safely manage karti hai.

import crypto from 'crypto';
import db from '../../config/database.js';
import { USER_ROLES, BOOKING_STATUS, KYC_STATUS } from '../../constants/index.js';

export const providerService = {
  getProviders(filters = {}) {
    let query = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.city, u.avatar,
        p.business_name as businessName,
        p.category_slug as category,
        p.experience_years as experienceYears,
        p.bio,
        p.hourly_rate as hourlyRate,
        p.verified,
        p.kyc_status as kycStatus,
        p.service_areas as serviceAreas,
        p.rating_average as rating,
        p.rating_count as reviewCount,
        p.total_jobs as totalJobs,
        p.is_online as isOnline,
        c.name as categoryName
      FROM users u
      JOIN provider_profiles p ON u.id = p.user_id
      LEFT JOIN service_categories c ON p.category_slug = c.slug
      WHERE u.role = 'provider' AND u.is_active = 1 AND p.is_online = 1
    `;
    const params = [];

    if (filters.category && filters.category !== 'all') {
      query += ` AND (p.category_slug = ? OR c.slug = ?)`;
      params.push(filters.category.toLowerCase(), filters.category.toLowerCase());
    }

    if (filters.search) {
      const term = `%${filters.search.toLowerCase().trim()}%`;
      query += ` AND (LOWER(u.name) LIKE ? OR LOWER(p.business_name) LIKE ? OR LOWER(p.category_slug) LIKE ? OR LOWER(u.city) LIKE ?)`;
      params.push(term, term, term, term);
    }

    if (filters.location && filters.location !== 'all') {
      const loc = `%${filters.location.toLowerCase().trim()}%`;
      query += ` AND LOWER(u.city) LIKE ?`;
      params.push(loc);
    }

    if (filters.minRating) {
      query += ` AND p.rating_average >= ?`;
      params.push(Number(filters.minRating));
    }

    if (filters.maxPrice) {
      query += ` AND p.hourly_rate <= ?`;
      params.push(Number(filters.maxPrice));
    }

    query += ` ORDER BY p.rating_average DESC, p.total_jobs DESC`;

    const stmt = db.prepare(query);
    const providers = stmt.all(...params);

    return providers.map((p) => ({
      ...p,
      verified: Boolean(p.verified),
      location: p.city,
    }));
  },

  getFeaturedProviders() {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.city, u.avatar,
        p.business_name as businessName,
        p.category_slug as category,
        p.experience_years as experienceYears,
        p.bio,
        p.hourly_rate as hourlyRate,
        p.verified,
        p.rating_average as rating,
        p.rating_count as reviewCount,
        p.total_jobs as totalJobs,
        p.is_online as isOnline,
        c.name as categoryName
      FROM users u
      JOIN provider_profiles p ON u.id = p.user_id
      LEFT JOIN service_categories c ON p.category_slug = c.slug
      WHERE u.role = 'provider' AND u.is_active = 1 AND p.is_online = 1
      ORDER BY p.verified DESC, p.rating_average DESC, p.total_jobs DESC
      LIMIT 6
    `;
    const providers = db.prepare(query).all();
    return providers.map((p) => ({
      ...p,
      verified: Boolean(p.verified),
      location: p.city,
    }));
  },

  getProviderById(id) {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.city, u.address, u.avatar,
        p.business_name as businessName,
        p.category_slug as category,
        p.experience_years as experienceYears,
        p.bio,
        p.hourly_rate as hourlyRate,
        p.verified,
        p.kyc_status as kycStatus,
        p.service_areas as serviceAreas,
        p.rating_average as rating,
        p.rating_count as reviewCount,
        p.total_jobs as totalJobs,
        p.is_online as isOnline,
        c.name as categoryName
      FROM users u
      JOIN provider_profiles p ON u.id = p.user_id
      LEFT JOIN service_categories c ON p.category_slug = c.slug
      WHERE u.id = ? AND u.role = 'provider'
    `;
    const provider = db.prepare(query).get(id);
    if (!provider) return null;

    let services = db.prepare(`
      SELECT id, title, description, price_paise / 100 as price, duration_mins as durationMins, (duration_mins || ' mins') as duration
      FROM services WHERE provider_id = ? AND active = 1
      ORDER BY created_at ASC
    `).all(id);

    if ((!services || services.length === 0) && provider) {
      const catName = provider.categoryName || (provider.category_slug ? provider.category_slug.charAt(0).toUpperCase() + provider.category_slug.slice(1) : 'Standard');
      const serviceId = `srv-${crypto.randomUUID()}`;
      const now = new Date().toISOString();
      const pricePaise = Math.round((provider.hourly_rate || 499) * 100);

      db.prepare(`
        INSERT INTO services (id, provider_id, category_slug, title, description, price_paise, duration_mins, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(
        serviceId,
        id,
        provider.category_slug || 'general',
        `${catName} Inspection & General Service`,
        `Standard doorstep inspection, diagnosis, and basic repair for ${catName.toLowerCase()} requirements.`,
        pricePaise,
        45,
        now,
        now
      );

      services = db.prepare(`
        SELECT id, title, description, price_paise / 100 as price, duration_mins as durationMins, (duration_mins || ' mins') as duration
        FROM services WHERE provider_id = ? AND active = 1
        ORDER BY created_at ASC
      `).all(id);
    }

    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.comment, r.created_at as createdAt, r.provider_reply as providerReply,
             u.name as customerName
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.provider_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `).all(id);

    return {
      ...provider,
      verified: Boolean(provider.verified),
      isOnline: Boolean(provider.isOnline),
      location: provider.city,
      services,
      reviews,
    };
  },

  updateProfile(userId, updates) {
    const now = new Date().toISOString();

    const updateUser = db.prepare(`
      UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), city = COALESCE(?, city), address = COALESCE(?, address), updated_at = ?
      WHERE id = ?
    `);

    const updateProfile = db.prepare(`
      UPDATE provider_profiles SET
        business_name = COALESCE(?, business_name),
        bio = COALESCE(?, bio),
        hourly_rate = COALESCE(?, hourly_rate),
        experience_years = COALESCE(?, experience_years),
        service_areas = COALESCE(?, service_areas),
        is_online = COALESCE(?, is_online),
        updated_at = ?
      WHERE user_id = ?
    `);

    db.transaction(() => {
      // An availability update intentionally supplies only `isOnline`; bind
      // missing profile fields as SQL NULL so COALESCE preserves their values.
      updateUser.run(
        updates.name ?? null,
        updates.phone ?? null,
        updates.city ?? null,
        updates.address ?? null,
        now,
        userId
      );
      updateProfile.run(
        updates.businessName ?? null,
        updates.bio ?? null,
        updates.hourlyRate ?? null,
        updates.experienceYears ?? null,
        updates.serviceAreas ?? null,
        updates.isOnline === undefined ? null : (updates.isOnline ? 1 : 0),
        now,
        userId
      );
    })();

    return this.getProviderById(userId);
  },

  getServices(providerId) {
    let services = db.prepare(`
      SELECT id, title, description, price_paise / 100 as price, duration_mins as durationMins, (duration_mins || ' mins') as duration, active, created_at as createdAt
      FROM services WHERE provider_id = ?
      ORDER BY created_at DESC
    `).all(providerId);

    if (!services || services.length === 0) {
      const profile = db.prepare(`
        SELECT p.business_name, p.category_slug, p.hourly_rate, c.name as category_name
        FROM provider_profiles p
        LEFT JOIN service_categories c ON p.category_slug = c.slug
        WHERE p.user_id = ?
      `).get(providerId);

      if (profile) {
        const id = `srv-${crypto.randomUUID()}`;
        const now = new Date().toISOString();
        const catName = profile.category_name || (profile.category_slug ? profile.category_slug.charAt(0).toUpperCase() + profile.category_slug.slice(1) : 'Standard');
        const pricePaise = Math.round((profile.hourly_rate || 499) * 100);

        db.prepare(`
          INSERT INTO services (id, provider_id, category_slug, title, description, price_paise, duration_mins, active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `).run(
          id,
          providerId,
          profile.category_slug || 'general',
          `${catName} Inspection & General Service`,
          `Standard doorstep inspection, diagnosis, and basic repair for ${catName.toLowerCase()} requirements.`,
          pricePaise,
          45,
          now,
          now
        );

        services = db.prepare(`
          SELECT id, title, description, price_paise / 100 as price, duration_mins as durationMins, (duration_mins || ' mins') as duration, active, created_at as createdAt
          FROM services WHERE provider_id = ?
          ORDER BY created_at DESC
        `).all(providerId);
      }
    }

    return services || [];
  },

  addService(providerId, data) {
    const id = `srv-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const pricePaise = Math.round(Number(data.price || data.basePrice || 499) * 100);

    let category = data.category;
    if (!category || category === 'general') {
      const profile = db.prepare('SELECT category_slug FROM provider_profiles WHERE user_id = ?').get(providerId);
      category = profile?.category_slug || 'general';
    }

    const durationMatch = String(data.durationMins || data.duration || '45').match(/\d+/);
    const durationMins = durationMatch ? parseInt(durationMatch[0], 10) : 45;

    const insert = db.prepare(`
      INSERT INTO services (id, provider_id, category_slug, title, description, price_paise, duration_mins, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    insert.run(
      id,
      providerId,
      category,
      data.title,
      data.description || '',
      pricePaise,
      durationMins,
      now,
      now
    );

    return db.prepare(`
      SELECT id, title, description, price_paise / 100 as price, duration_mins as durationMins, (duration_mins || ' mins') as duration
      FROM services WHERE id = ?
    `).get(id);
  },

  updateService(providerId, serviceId, data) {
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT * FROM services WHERE id = ? AND provider_id = ?').get(serviceId, providerId);
    if (!existing) {
      throw new Error('Service not found or unauthorized.');
    }

    const pricePaise = data.price !== undefined ? Math.round(Number(data.price) * 100) : existing.price_paise;
    let durationMins = existing.duration_mins;
    if (data.durationMins !== undefined || data.duration !== undefined) {
      const durationMatch = String(data.durationMins || data.duration).match(/\d+/);
      durationMins = durationMatch ? parseInt(durationMatch[0], 10) : existing.duration_mins;
    }

    const update = db.prepare(`
      UPDATE services
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          price_paise = ?,
          duration_mins = ?,
          updated_at = ?
      WHERE id = ? AND provider_id = ?
    `);

    update.run(
      data.title || existing.title,
      data.description !== undefined ? data.description : existing.description,
      pricePaise,
      durationMins,
      now,
      serviceId,
      providerId
    );

    return db.prepare(`
      SELECT id, title, description, price_paise / 100 as price, duration_mins as durationMins, (duration_mins || ' mins') as duration
      FROM services WHERE id = ?
    `).get(serviceId);
  },

  deleteService(providerId, serviceId) {
    const stmt = db.prepare('DELETE FROM services WHERE id = ? AND provider_id = ?');
    const result = stmt.run(serviceId, providerId);
    if (result.changes === 0) {
      throw new Error('Service not found or unauthorized.');
    }
    return { success: true };
  },

  submitVerification(providerId, documents) {
    const now = new Date().toISOString();
    const docJson = JSON.stringify(documents || ['Government ID Proof']);
    const update = db.prepare(`
      UPDATE provider_profiles
      SET kyc_status = ?, kyc_documents = ?, updated_at = ?
      WHERE user_id = ?
    `);
    update.run(KYC_STATUS.PENDING, docJson, now, providerId);
    return { success: true, message: 'KYC documents submitted for platform verification.' };
  },

  getEarnings(providerId) {
    // Calculate real earnings from completed bookings
    const bookings = db.prepare(`
      SELECT total_price_paise, service_completed_at
      FROM bookings
      WHERE provider_id = ? AND status = 'completed' AND payment_status = 'PAID'
    `).all(providerId);

    const totalRevenuePaise = bookings.reduce((sum, b) => sum + b.total_price_paise, 0);
    // Platform takes 10% commission, provider receives 90%
    const netEarningsPaise = Math.round(totalRevenuePaise * 0.9);

    const payouts = db.prepare(`
      SELECT id, amount_paise / 100 as amount, type, description, created_at as createdAt
      FROM provider_transactions
      WHERE provider_id = ?
      ORDER BY created_at DESC
    `).all(providerId);

    return {
      totalEarnings: netEarningsPaise / 100,
      availableBalance: netEarningsPaise / 100,
      completedJobs: bookings.length,
      payouts,
    };
  },
};

export default providerService;
