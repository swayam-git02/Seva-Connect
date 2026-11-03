// Is middleware ka kaam sabhi uncaught backend errors ko intercept karna hai.
// Ye error ko console mein log karta hai aur client ko clean, secure JSON error response bhejta hai.

import { sendError } from '../utils/response.js';

/**
 * Global Express Error Handler:
 * Input: err (error object), req, res, next
 * Output: Consistent JSON error response (development mein stack trace ke saath)
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, status, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

export default errorHandler;
