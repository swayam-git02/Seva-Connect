// Is middleware ka kaam role-based access control (RBAC) ensure karna hai.
// Ye check karta hai ki logged-in user ke paas us endpoint ko chalane ki permission (role) hai ya nahi.
// E.g., customer provider routes nahi chala sakta, aur provider admin routes nahi chala sakta.

import { sendError } from '../utils/response.js';

/**
 * Role authorization middleware factory
 * @param {string|string[]} allowedRoles - 'customer', 'provider', ya 'admin'
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // Agar user authenticated nahi hai
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Agar user ka role allowed roles ki list mein nahi hai, toh 403 Forbidden return hota hai
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Access denied. Requires ${roles.join(' or ')} privileges.`, 403);
    }

    next();
  };
};

export default authorize;
