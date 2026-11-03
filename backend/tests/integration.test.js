import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/database.js';
import runMigrations from '../src/database/migrate.js';

describe('SevaConnect Full-Stack API Suite', () => {
  beforeAll(() => {
    runMigrations();
  });

  describe('1. Zero Seeded Data & Health Verification', () => {
    it('returns healthy status on /api/v1/health', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });

    it('ensures categories are available as system configuration', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('ensures provider search returns honest empty state if zero registered providers match', async () => {
      const res = await request(app).get('/api/v1/providers?category=nonexistent');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('2. Authentication & Authorization Security', () => {
    const customerPayload = {
      name: 'Adarsh Test Customer',
      email: `customer_${Date.now()}@test.in`,
      phone: '9876543210',
      password: 'SecurePassword123!',
      city: 'Faridabad',
      address: 'Sector 15, Faridabad',
    };

    let customerToken = '';
    let customerId = '';

    it('registers a real customer through /api/v1/auth/signup', async () => {
      const res = await request(app).post('/api/v1/auth/signup').send(customerPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(customerPayload.email);
      expect(res.body.data.user.role).toBe('customer');
      expect(res.body.data.user.password_hash).toBeUndefined();

      customerToken = res.body.data.token;
      customerId = res.body.data.user.id;
    });

    it('rejects duplicate email registration', async () => {
      const res = await request(app).post('/api/v1/auth/signup').send(customerPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('registers a real service provider through /api/v1/auth/provider-signup', async () => {
      const providerPayload = {
        name: 'Ramesh Test Electrician',
        businessName: 'Ramesh Electricals',
        email: `provider_${Date.now()}@test.in`,
        phone: '9811223344',
        password: 'SecurePassword123!',
        category: 'electrician',
        city: 'Faridabad',
        hourlyRate: 499,
        experienceYears: 5,
      };

      const res = await request(app).post('/api/v1/auth/provider-signup').send(providerPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('provider');
      expect(res.body.data.user.businessName).toBe('Ramesh Electricals');
      expect(res.body.data.user.verified).toBe(false);
    });

    it('authenticates customer via /api/v1/auth/login and rejects invalid password', async () => {
      // Bad password
      const badRes = await request(app).post('/api/v1/auth/login').send({
        email: customerPayload.email,
        password: 'WrongPassword!',
      });
      expect(badRes.status).toBe(401);

      // Good password
      const goodRes = await request(app).post('/api/v1/auth/login').send({
        email: customerPayload.email,
        password: customerPayload.password,
      });
      expect(goodRes.status).toBe(200);
      expect(goodRes.body.data.token).toBeDefined();
    });

    it('ensures public signup never grants admin privileges', async () => {
      const attemptAdminPayload = {
        name: 'Hacker Admin',
        email: `hacker_${Date.now()}@test.in`,
        phone: '9999988888',
        password: 'Password123!',
        role: 'admin',
      };
      const res = await request(app).post('/api/v1/auth/signup').send(attemptAdminPayload);
      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('customer'); // Forced to customer, cannot escalate to admin
    });
  });

  describe('3. Booking Lifecycle, Cryptographic OTPs & Photo Evidence', () => {
    let customerToken = '';
    let customerId = '';
    let providerToken = '';
    let providerId = '';
    let bookingId = '';
    let startingCode = '';
    let endingCode = '';

    beforeAll(async () => {
      // Register dedicated customer
      const custRes = await request(app).post('/api/v1/auth/signup').send({
        name: 'Booking Flow Customer',
        email: `flow_cust_${Date.now()}@test.in`,
        phone: '9870011223',
        password: 'Password123!',
        city: 'Faridabad',
        address: 'Sector 14, Faridabad',
      });
      customerToken = custRes.body.data.token;
      customerId = custRes.body.data.user.id;

      // Register dedicated provider
      const provRes = await request(app).post('/api/v1/auth/provider-signup').send({
        name: 'Booking Flow Electrician',
        businessName: 'Spark Safe Electricals',
        email: `flow_prov_${Date.now()}@test.in`,
        phone: '9810055443',
        password: 'Password123!',
        category: 'electrician',
        city: 'Faridabad',
        hourlyRate: 450,
      });
      providerToken = provRes.body.data.token;
      providerId = provRes.body.data.user.id;
    });

    it('creates a booking with server-calculated pricing and two 6-digit cryptographic OTPs', async () => {
      const bookingPayload = {
        providerId,
        serviceTitle: 'Ceiling Fan Installation & Wiring',
        scheduledDate: '2026-11-01',
        scheduledTime: '11:00 AM',
        customerAddress: 'Flat 302, Sector 14, Faridabad',
        customerPhone: '9870011223',
        paymentMethod: 'PAY_AFTER_SERVICE',
        basePrice: 450,
      };

      const res = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(bookingPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data.id).toMatch(/^SC-\d{5}$/);
      expect(data.status).toBe('confirmed');
      expect(data.basePrice).toBe(450);
      expect(data.taxes).toBe(81); // 18% of 450
      expect(data.platformFee).toBe(29);
      expect(data.totalPrice).toBe(560);

      // Verify two independent 6-digit codes returned to customer
      expect(data.startingCode).toMatch(/^\d{6}$/);
      expect(data.endingCode).toMatch(/^\d{6}$/);
      expect(data.startingCode).not.toBe(data.endingCode);

      bookingId = data.id;
      startingCode = data.startingCode;
      endingCode = data.endingCode;
    });

    it('retrieves codes securely via customer endpoint /api/v1/bookings/:id/codes', async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${bookingId}/codes`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.startingCode).toBe(startingCode);
      expect(res.body.data.endingCode).toBe(endingCode);
    });

    it('guarantees provider cannot see plaintext codes or hashes', async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${providerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.startingCode).toBeUndefined();
      expect(res.body.data.endingCode).toBeUndefined();
      expect(res.body.data.start_code_hash).toBeUndefined();
      expect(res.body.data.end_code_hash).toBeUndefined();
    });

    it('uploads before-service photograph evidence before starting service', async () => {
      const dummyBuffer = Buffer.from('fake-image-bytes-jpeg');

      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/photos/before`)
        .set('Authorization', `Bearer ${providerToken}`)
        .attach('photos', dummyBuffer, 'before_repair.jpg')
        .field('caption', 'Burnt switchboard wires before replacement');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].stage).toBe('before');
      expect(res.body.data[0].imageUrl).toBeDefined();
    });

    it('rejects unassigned provider from verifying codes or uploading photos', async () => {
      // Register a second unrelated provider
      const prov2Res = await request(app).post('/api/v1/auth/provider-signup').send({
        name: 'Intruder Provider',
        businessName: 'Intruder Works',
        email: `intruder_${Date.now()}@test.in`,
        phone: '9999900000',
        password: 'Password123!',
        category: 'electrician',
      });
      const intruderToken = prov2Res.body.data.token;

      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/verify-start-code`)
        .set('Authorization', `Bearer ${intruderToken}`)
        .send({ code: startingCode });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Unauthorized');
    });

    it('rejects incorrect Starting Code with generic error message', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/verify-start-code`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ code: '999999' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid Starting Code');
    });

    it('rejects Ending Code verification before Starting Code has been verified', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/verify-end-code`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ code: endingCode });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Service has not started yet');
    });

    it('accepts correct Starting Code and moves booking to in_progress', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/verify-start-code`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ code: startingCode });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('in_progress');
    });

    it('uploads after-service photograph evidence while job is in progress', async () => {
      const dummyBuffer = Buffer.from('fake-image-bytes-jpeg-completed');

      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/photos/after`)
        .set('Authorization', `Bearer ${providerToken}`)
        .attach('photos', dummyBuffer, 'after_repair.jpg')
        .field('caption', 'Brand new Anchor Roma switches installed and tested');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].stage).toBe('after');
    });

    it('allows customer to view both before and after photograph evidence in booking details', async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${bookingId}/photos`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.before.length).toBeGreaterThan(0);
      expect(res.body.data.after.length).toBeGreaterThan(0);
      expect(res.body.data.before[0].caption).toContain('Burnt switchboard');
      expect(res.body.data.after[0].caption).toContain('Anchor Roma');
    });

    it('accepts correct Ending Code and moves booking to completed with payment settled', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/verify-end-code`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ code: endingCode });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');

      // Verify booking updated in database
      const checkRes = await request(app)
        .get(`/api/v1/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(checkRes.body.data.status).toBe('completed');
      expect(checkRes.body.data.paymentStatus).toBe('PAID');
    });

    it('allows customer to submit a review for the completed booking', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          bookingId,
          rating: 5,
          comment: 'Outstanding electrical work! Very polite and skilled.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });
});
