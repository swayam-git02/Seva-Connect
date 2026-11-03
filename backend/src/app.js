// Is file mein Express application ka core setup hota hai.
// Security headers, CORS settings, JSON body parsing, static files, routes aur error handlers yahan configure hote hain.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import ENV from './config/env.js';
import apiRouter from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// Helmet HTTP headers ko secure karta hai taaki common web attacks se bacha ja sake
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS allow karta hai ki frontend app (e.g., localhost:3000 ya production domain) backend API ko call kar sake
app.use(
  cors({
    origin: (origin, callback) => {
      // Local development ya specified client domain se aane wali requests allow hoti hain
      if (!origin || origin.includes('localhost') || origin === ENV.CLIENT_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Incoming requests ka JSON body parse karne ke liye taaki req.body mein data mil sake
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Agar upload directory exist nahi karti toh banayi jaati hai, aur uploaded photos publicly accessible hoti hain
if (!fs.existsSync(ENV.UPLOAD_DIR)) {
  fs.mkdirSync(ENV.UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(ENV.UPLOAD_DIR));

// API rate limiting taaki spam ya DDoS attack se bacha ja sake, aur sabhi v1 API routes ko mount kiya jata hai
app.use('/api/v1', apiLimiter, apiRouter);

// Root route - backend status check karne ke liye simple health info deta hai
app.get('/', (req, res) => {
  res.json({
    app: 'SevaConnect Backend API',
    version: '1.0.0',
    documentation: '/docs/api-documentation.md',
    status: 'ONLINE',
  });
});

// Centralized error handling middleware - agar kisi bhi route mein error aaye toh clean response bheja jata hai
app.use(errorHandler);

export default app;
