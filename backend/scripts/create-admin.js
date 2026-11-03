import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../src/config/database.js';
import { USER_ROLES } from '../src/constants/index.js';
import runMigrations from '../src/database/migrate.js';

runMigrations();

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const name = getArg('--name') || 'Platform Administrator';
const email = (getArg('--email') || 'admin@sevaconnect.in').toLowerCase().trim();
const password = getArg('--password') || 'Admin@Seva2026!';
const phone = getArg('--phone') || '+91 99999 00000';

const checkExisting = db.prepare('SELECT id, email, role FROM users WHERE email = ?').get(email);
if (checkExisting) {
  console.error(`User with email ${email} already exists (Role: ${checkExisting.role}). Aborting.`);
  process.exit(1);
}

const id = `admin-${crypto.randomUUID()}`;
const passwordHash = bcrypt.hashSync(password, 10);
const now = new Date().toISOString();

const insertAdmin = db.prepare(`
  INSERT INTO users (id, name, email, password_hash, phone, role, city, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, 'Delhi NCR', 1, ?, ?)
`);

insertAdmin.run(id, name, email, passwordHash, phone, USER_ROLES.ADMIN, now, now);

console.log('--------------------------------------------------');
console.log('✅ Admin account provisioned securely:');
console.log(`   ID:       ${id}`);
console.log(`   Name:     ${name}`);
console.log(`   Email:    ${email}`);
console.log(`   Role:     ${USER_ROLES.ADMIN}`);
console.log('--------------------------------------------------');
process.exit(0);
