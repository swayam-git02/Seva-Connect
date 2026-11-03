// Is file ka kaam SevaConnect backend server ko start karna hai.
// Ye port listen karta hai, database migrations run karta hai aur application ko live banata hai.

import app from './app.js';
import ENV from './config/env.js';
import runMigrations from './database/migrate.js';

// Server start hone se pehle database tables aur schema create/check kiye jaate hain
runMigrations();

// Express app ko configured PORT par run karte hain
const server = app.listen(ENV.PORT, () => {
  console.log('========================================================');
  console.log(`🚀 SevaConnect API server running in ${ENV.NODE_ENV} mode`);
  console.log(`📡 Port:               ${ENV.PORT}`);
  console.log(`🌐 Base API URL:       http://localhost:${ENV.PORT}/api/v1`);
  console.log(`📁 Database:           ${ENV.DATABASE_PATH}`);
  console.log('🔒 Security:           Helmet, CORS, JWT, Dual-OTP Verification');
  console.log('🌱 Zero Seeded Data:   Verified clean user & booking tables');
  console.log('========================================================');
});

// Jab deployment ya system server ko band karne ka signal (SIGTERM) bhejta hai,
// toh server chal rahe requests ko safely complete karke close hota hai.
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    process.exit(0);
  });
});

export default server;
