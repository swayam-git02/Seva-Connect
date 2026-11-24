// Script to purge all customer and provider data from SevaConnect database
// Preserves service_categories and migrations. Admin users (if any) are retained.

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPaths = [
  path.resolve(__dirname, '../data/sevaconnect.sqlite'),
  path.resolve(__dirname, '../../data/sevaconnect.sqlite'),
];

for (const dbPath of dbPaths) {
  if (!fs.existsSync(dbPath)) {
    console.log(`Skipping non-existent DB path: ${dbPath}`);
    continue;
  }

  console.log(`\n==================================================`);
  console.log(`Processing Database: ${dbPath}`);
  console.log(`==================================================`);

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = OFF;'); // Turn off temporarily for clean ordered wipe

  // Check if tables exist
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  if (!tableCheck) {
    console.log('No users table found in this database. Skipping.');
    continue;
  }

  // Count existing records before purge
  const countBefore = (table) => {
    try {
      return db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get()?.count || 0;
    } catch {
      return 0;
    }
  };

  const tablesToClear = [
    'booking_verification',
    'booking_status_history',
    'booking_service_photos',
    'reviews',
    'provider_transactions',
    'complaints',
    'messages',
    'notifications',
    'favorites',
    'customer_addresses',
    'bookings',
    'services',
    'customer_profiles',
    'provider_profiles',
  ];

  console.log('\n--- Before Deletion Counts ---');
  for (const tbl of tablesToClear) {
    console.log(`  ${tbl}: ${countBefore(tbl)}`);
  }
  console.log(`  users (customer/provider): ${db.prepare("SELECT COUNT(*) as c FROM users WHERE role IN ('customer', 'provider')").get()?.c || 0}`);
  console.log(`  users (admin): ${db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get()?.c || 0}`);

  // Perform purge inside a transaction
  db.exec('BEGIN TRANSACTION;');
  try {
    // 1. Delete dependent child records
    for (const tbl of tablesToClear) {
      db.exec(`DELETE FROM ${tbl};`);
    }

    // 2. Delete audit logs associated with customers/providers
    try {
      db.exec("DELETE FROM audit_logs WHERE user_id IN (SELECT id FROM users WHERE role IN ('customer', 'provider'));");
    } catch (e) {
      // audit_logs might not exist or be empty
    }

    // 3. Delete customer and provider users (preserve admin if any)
    const deleteUsersResult = db.prepare("DELETE FROM users WHERE role IN ('customer', 'provider')").run();
    console.log(`\nDeleted ${deleteUsersResult.changes} customer/provider user accounts.`);

    db.exec('COMMIT;');
    console.log('Transaction committed successfully.');
  } catch (err) {
    db.exec('ROLLBACK;');
    console.error('Error during purge, transaction rolled back:', err);
    throw err;
  }

  // Vacuum to reclaim disk space and reset indexes
  db.exec('PRAGMA foreign_keys = ON;');
  try {
    db.exec('VACUUM;');
  } catch (e) {
    console.warn('Vacuum warning:', e.message);
  }

  console.log('\n--- After Deletion Counts ---');
  for (const tbl of tablesToClear) {
    console.log(`  ${tbl}: ${countBefore(tbl)}`);
  }
  console.log(`  users (customer/provider): ${db.prepare("SELECT COUNT(*) as c FROM users WHERE role IN ('customer', 'provider')").get()?.c || 0}`);
  console.log(`  users (admin): ${db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get()?.c || 0}`);
  console.log(`  service_categories: ${countBefore('service_categories')}`);
  console.log('Database purge completed for this file.');
}

console.log('\nAll customer and provider data has been completely erased from all databases.');
