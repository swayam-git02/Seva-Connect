// Is file mein SevaConnect database ka pura relational schema define hai.
// Users, profiles, bookings, two-code OTP verification, service evidence photos,
// reviews, payouts aur audit logs ke liye SQLite DDL queries yahan structured hain.

export const SCHEMA_SQL = `
-- Migrations table: Track karta hai ki kaunse database migrations apply ho chuke hain
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL
);

-- Users table: Sabhi customers, service providers aur admins ki primary account information
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('customer', 'provider', 'admin')),
  city TEXT DEFAULT 'Faridabad',
  address TEXT,
  avatar TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Customer Profiles: Customer-specific information jaise emergency contact
CREATE TABLE IF NOT EXISTS customer_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  emergency_contact TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Provider Profiles: Service provider ka business name, trade category, KYC status, rating aur earnings stats
CREATE TABLE IF NOT EXISTS provider_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  hourly_rate INTEGER DEFAULT 499,
  verified INTEGER DEFAULT 0,
  kyc_status TEXT DEFAULT 'pending' CHECK(kyc_status IN ('unsubmitted', 'pending', 'verified', 'rejected')),
  kyc_documents TEXT,
  service_areas TEXT,
  rating_average REAL DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_cat ON provider_profiles(category_slug);
CREATE INDEX IF NOT EXISTS idx_provider_verified ON provider_profiles(verified);

-- Service Categories: System ke predefined categories (e.g., Electrician, Plumbing, AC Repair)
CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  base_price INTEGER DEFAULT 299,
  active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Services: Providers dwara offer kiye jaane wale specific tasks aur unka rate card
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_paise INTEGER NOT NULL,
  duration_mins INTEGER DEFAULT 60,
  active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_cat ON services(category_slug);

-- Bookings table: Complete booking lifecycle record (amounts paise mein store hote hain taaki decimal rounding issue na aaye)
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES users(id),
  provider_id TEXT NOT NULL REFERENCES users(id),
  service_id TEXT,
  service_title TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined')),
  payment_method TEXT DEFAULT 'PAY_AFTER_SERVICE',
  payment_status TEXT DEFAULT 'PENDING' CHECK(payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
  base_price_paise INTEGER NOT NULL,
  tax_paise INTEGER NOT NULL,
  platform_fee_paise INTEGER NOT NULL,
  total_price_paise INTEGER NOT NULL,
  service_started_at TEXT,
  service_completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_cust ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_prov ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Booking Verification: Starting Code aur Ending Code ki cryptographic verification table
-- Yahan plaintext code ke bajay SHA-256 hash aur AES encrypted envelope store hota hai
-- Attempt counters brute-force attacks ko rokte hain
CREATE TABLE IF NOT EXISTS booking_verification (
  booking_id TEXT PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  start_code_hash TEXT NOT NULL,
  start_code_envelope TEXT NOT NULL,
  start_code_attempts INTEGER DEFAULT 0,
  start_code_max_attempts INTEGER DEFAULT 5,
  start_code_verified_at TEXT,
  start_code_expires_at TEXT,
  end_code_hash TEXT NOT NULL,
  end_code_envelope TEXT NOT NULL,
  end_code_attempts INTEGER DEFAULT 0,
  end_code_max_attempts INTEGER DEFAULT 5,
  end_code_verified_at TEXT,
  end_code_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Booking Status History: Audit trail jo track karta hai ki status kab aur kisne change kiya
CREATE TABLE IF NOT EXISTS booking_status_history (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by_user_id TEXT REFERENCES users(id),
  note TEXT,
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bsh_booking ON booking_status_history(booking_id);

-- Booking Service Photos: Service evidence photos (Before service & After service photos)
CREATE TABLE IF NOT EXISTS booking_service_photos (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  uploader_id TEXT NOT NULL REFERENCES users(id),
  stage TEXT NOT NULL CHECK(stage IN ('before', 'after')),
  image_url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  caption TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bsp_booking ON booking_service_photos(booking_id);
CREATE INDEX IF NOT EXISTS idx_bsp_stage ON booking_service_photos(booking_id, stage);

-- Reviews: Completed bookings par customer dwara diye gaye rating aur feedback
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES users(id),
  provider_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  provider_reply TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_prov ON reviews(provider_id);

-- Customer Addresses: Customers ke saved delivery/service addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Favorites: Customer ke favorite bookmarked service providers
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  UNIQUE(customer_id, provider_id)
);

-- Messages: Customer aur Provider ke beech in-app direct chat messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id),
  recipient_id TEXT NOT NULL REFERENCES users(id),
  booking_id TEXT REFERENCES bookings(id),
  content TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Notifications: System alerts, booking updates aur payment notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read INTEGER DEFAULT 0,
  link TEXT,
  created_at TEXT NOT NULL
);

-- Provider Transactions: Provider ka wallet ledger (job earnings credit & payout debit)
CREATE TABLE IF NOT EXISTS provider_transactions (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES users(id),
  booking_id TEXT REFERENCES bookings(id),
  amount_paise INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('credit', 'payout')),
  description TEXT,
  created_at TEXT NOT NULL
);

-- Complaints: Customer ya provider dwara raise kiye gaye dispute tickets
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id),
  complainant_id TEXT NOT NULL REFERENCES users(id),
  respondent_id TEXT REFERENCES users(id),
  issue TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM' CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')),
  status TEXT DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Audit Logs: Platform compliance aur security changes ka immutable log
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL
);
`;

// Initial System Categories (Essential System Configuration, NOT demo business data)
export const SYSTEM_CATEGORIES = [
  { id: 'cat-elec', name: 'Electrician', slug: 'electrician', icon: 'Zap', description: 'Switchboard repair, wiring, fan & inverter installation', base_price: 299 },
  { id: 'cat-plumb', name: 'Plumbing', slug: 'plumbing', icon: 'Wrench', description: 'Leakage repairs, tap fixing, pipe fitments & motor install', base_price: 349 },
  { id: 'cat-clean', name: 'Home Cleaning', slug: 'cleaning', icon: 'Sparkles', description: 'Deep home cleaning, bathroom disinfection & sofa sanitization', base_price: 799 },
  { id: 'cat-ac', name: 'AC Service & Repair', slug: 'ac-repair', icon: 'Wind', description: 'Filter cleaning, gas refill, compressor checks & installation', base_price: 499 },
  { id: 'cat-carp', name: 'Carpentry', slug: 'carpentry', icon: 'Hammer', description: 'Furniture repair, door lock installation & custom woodwork', base_price: 399 },
  { id: 'cat-appl', name: 'Appliance Repair', slug: 'appliance-repair', icon: 'Tv', description: 'Washing machine, refrigerator, microwave & geyser servicing', base_price: 449 },
  { id: 'cat-paint', name: 'Painting & Waterproofing', slug: 'painting', icon: 'Paintbrush', description: 'Interior/exterior wall painting & seepage treatment', base_price: 999 },
];
