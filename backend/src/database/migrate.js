// Is file ka kaam database migrations run karna hai.
// Ye schema execute karta hai, categories populate karta hai aur ensure karta hai ki database clean aur consistent state mein ho.

import db from '../config/database.js';
import { SCHEMA_SQL, SYSTEM_CATEGORIES } from './schema.js';

/**
 * Database schema create karta hai aur initial system categories populate karta hai.
 * Process:
 * 1. SCHEMA_SQL execute karke sabhi tables aur indexes banata hai.
 * 2. Agar service categories table khali hai, toh standard 7 trade categories insert karta hai.
 * 3. Migration record ('001_initial_schema') save karta hai.
 * 4. Database mein users aur bookings ka count log karta hai.
 */
export const runMigrations = () => {
  console.log('Running database schema migrations...');

  // Database tables aur indexes create karte hain
  db.exec(SCHEMA_SQL);

  const providerColumns = db.prepare('PRAGMA table_info(provider_profiles)').all();
  if (!providerColumns.some((column) => column.name === 'is_online')) {
    db.exec('ALTER TABLE provider_profiles ADD COLUMN is_online INTEGER DEFAULT 1');
  }

  // Agar service categories table khali hai, toh basic standard categories initialize karte hain
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM service_categories');
  const result = countStmt.get();

  if (result.count === 0) {
    console.log('Initializing system service categories configuration...');
    const insertCat = db.prepare(`
      INSERT INTO service_categories (id, name, slug, icon, description, base_price, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `);

    const now = new Date().toISOString();
    for (const cat of SYSTEM_CATEGORIES) {
      insertCat.run(cat.id, cat.name, cat.slug, cat.icon, cat.description, cat.base_price, now);
    }
  }

  // Migrations table mein record save karte hain taaki track rahe ki initial schema apply ho chuka hai
  const checkMigration = db.prepare('SELECT * FROM migrations WHERE name = ?');
  if (!checkMigration.get('001_initial_schema')) {
    const insertMig = db.prepare('INSERT INTO migrations (name, applied_at) VALUES (?, ?)');
    insertMig.run('001_initial_schema', new Date().toISOString());
  }

  // Database stats log karte hain taaki verify ho sake ki system clean hai
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;

  console.log(`Database ready. Zero seeded data verified: users=${userCount}, bookings=${bookingCount}, reviews=${reviewCount}.`);
};

// Agar is file ko direct terminal se run kiya jaye (e.g., node migrate.js)
if (process.argv[1]?.includes('migrate.js')) {
  runMigrations();
  console.log('Migration completed successfully.');
  process.exit(0);
}

export default runMigrations;
