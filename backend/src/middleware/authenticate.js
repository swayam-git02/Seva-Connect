// Is middleware ka kaam aane wali requests ka JWT Bearer token verify karna hai.
// Ye check karta hai ki user logged in hai ya nahi, token valid aur active hai ya nahi,
// aur authenticated user ki details req.user mein attach karta hai.

// Ye middleware Authorization header se JWT verify karke authenticated user ko req.user mein attach karta hai.
// Invalid ya expired token par protected route aage execute nahi hota.

import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import ENV from '../config/env.js';
import { sendError } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  // Authorization header check karte hain (Format: 'Bearer <token>')
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    // Secret key se token verify karte hain
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    // Token ke user ID se database check karte hain ki user exist karta hai aur active hai
    const user = db.prepare('SELECT id, name, email, phone, role, city, address, avatar, is_active FROM users WHERE id = ?').get(decoded.id);

    if (!user || !user.is_active) {
      return sendError(res, 'User session invalid or account inactive.', 401);
    }

    // req.user par authenticated user store karte hain taaki aage ke controllers access kar sakein
    req.user = user;
    next();
  } catch (err) {
    // Agar token ki validity khatam ho chuki hai
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session token expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
};

export default authenticate;
