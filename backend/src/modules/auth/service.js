// Ye service account registration aur login ki security-sensitive business logic rakhti hai.
// Password hash hota hai aur successful login par signed access token banta hai; original password kabhi store/return nahi hota.

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../../config/database.js';
import ENV from '../../config/env.js';
import { USER_ROLES, KYC_STATUS } from '../../constants/index.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
};

const sanitizeUser = (user, extra = {}) => {
  const { password_hash, ...safe } = user;
  return { ...safe, ...extra };
};

export const authService = {
  signupCustomer(data) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = `cust-${crypto.randomUUID()}`;
    const passwordHash = bcrypt.hashSync(data.password, 10);
    const now = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, role, city, address, avatar, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const insertProfile = db.prepare(`
      INSERT INTO customer_profiles (user_id, emergency_contact, created_at, updated_at)
      VALUES (?, NULL, ?, ?)
    `);

    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`;

    db.transaction(() => {
      insertUser.run(
        userId,
        data.name || data.fullName,
        data.email,
        passwordHash,
        data.phone,
        USER_ROLES.CUSTOMER,
        data.city || 'Faridabad',
        data.address || null,
        avatar,
        now,
        now
      );
      insertProfile.run(userId, now, now);
    })();

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const token = generateToken(user);
    return { token, user: sanitizeUser(user) };
  },

  signupProvider(data) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = `prov-${crypto.randomUUID()}`;
    const passwordHash = bcrypt.hashSync(data.password, 10);
    const now = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, role, city, address, avatar, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const insertProfile = db.prepare(`
      INSERT INTO provider_profiles (user_id, business_name, category_slug, experience_years, bio, hourly_rate, verified, kyc_status, rating_average, rating_count, total_jobs, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, 0.0, 0, 0, ?, ?)
    `);

    const avatar = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80`;

    const serviceId = `srv-${crypto.randomUUID()}`;
    const insertService = db.prepare(`
      INSERT INTO services (id, provider_id, category_slug, title, description, price_paise, duration_mins, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const catName = data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : 'Standard';
    const hourlyPricePaise = Math.round((Number(data.hourlyRate) || 499) * 100);

    db.transaction(() => {
      insertUser.run(
        userId,
        data.name || data.fullName,
        data.email,
        passwordHash,
        data.phone,
        USER_ROLES.PROVIDER,
        data.city || 'Faridabad',
        data.address || null,
        avatar,
        now,
        now
      );
      insertProfile.run(
        userId,
        data.businessName,
        data.category,
        Number(data.experienceYears) || 1,
        data.bio || null,
        Number(data.hourlyRate) || 499,
        KYC_STATUS.PENDING,
        now,
        now
      );
      insertService.run(
        serviceId,
        userId,
        data.category || 'general',
        `${catName} Inspection & General Service`,
        `Standard doorstep inspection, diagnosis, and basic repair for ${catName.toLowerCase()} requirements.`,
        hourlyPricePaise,
        45,
        now,
        now
      );
    })();

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const profile = db.prepare('SELECT * FROM provider_profiles WHERE user_id = ?').get(userId);
    const token = generateToken(user);

    return {
      token,
      user: sanitizeUser(user, {
        businessName: profile.business_name,
        category: profile.category_slug,
        verified: Boolean(profile.verified),
        kycStatus: profile.kyc_status,
      }),
    };
  },

  login({ email, password, role }) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.is_active) {
      throw new Error('Account has been suspended. Please contact platform support.');
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    if (role && user.role !== role) {
      throw new Error(`This account is registered as ${user.role}, not ${role}.`);
    }

    let extra = {};
    if (user.role === USER_ROLES.PROVIDER) {
      const profile = db.prepare('SELECT * FROM provider_profiles WHERE user_id = ?').get(user.id);
      if (profile) {
        extra = {
          businessName: profile.business_name,
          category: profile.category_slug,
          verified: Boolean(profile.verified),
          kycStatus: profile.kyc_status,
          hourlyRate: profile.hourly_rate,
        };
      }
    }

    const token = generateToken(user);
    return { token, user: sanitizeUser(user, extra) };
  },

  getUserById(userId) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return null;

    let extra = {};
    if (user.role === USER_ROLES.PROVIDER) {
      const profile = db.prepare('SELECT * FROM provider_profiles WHERE user_id = ?').get(user.id);
      if (profile) {
        extra = {
          businessName: profile.business_name,
          category: profile.category_slug,
          verified: Boolean(profile.verified),
          kycStatus: profile.kyc_status,
          hourlyRate: profile.hourly_rate,
          ratingAverage: profile.rating_average,
          totalJobs: profile.total_jobs,
        };
      }
    }

    return sanitizeUser(user, extra);
  },
};

export default authService;
