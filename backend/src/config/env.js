// Is file ka kaam environment variables (.env) ko load karna aur puri backend app ke liye central config provide karna hai.
// Agar koi variable .env file mein define na ho, toh safe default value use hoti hai.

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory ya local directory se .env file load karte hain
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

// Centralized application configuration object
export const ENV = {
  // Application mode ('development' ya 'production')
  NODE_ENV: process.env.NODE_ENV || 'development',
  // API server ka listening port
  PORT: parseInt(process.env.PORT || '5000', 10),
  // Frontend application ka origin URL (CORS verification ke liye)
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  // SQLite database file ka local storage path
  DATABASE_PATH: process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/sevaconnect.sqlite'),
  // JWT tokens generate aur verify karne ke secrets
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'sevaconnect_super_secret_jwt_access_key_2026_dev',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'sevaconnect_super_secret_jwt_refresh_key_2026_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  // Starting/Ending Code envelopes ko encrypt karne ke liye 32-character AES key
  CODE_ENCRYPTION_KEY: process.env.CODE_ENCRYPTION_KEY || 'sevaconnect_32_byte_secret_key_!!',
  // Cloudinary credentials (before & after service photos store karne ke liye)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  // Local disk upload directory jab Cloudinary configured na ho
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
};

export default ENV;
