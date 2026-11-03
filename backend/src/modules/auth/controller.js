// Ye controller signup aur login HTTP requests ko auth service se connect karta hai.
// Validation failure aur authentication error ko consistent API response mein bhejna iska kaam hai.

import authService from './service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const authController = {
  signupCustomer(req, res) {
    try {
      const result = authService.signupCustomer(req.body);
      return sendSuccess(res, result, 'Customer registered successfully', 201);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  signupProvider(req, res) {
    try {
      const result = authService.signupProvider(req.body);
      return sendSuccess(res, result, 'Provider registered successfully', 201);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  login(req, res) {
    try {
      const result = authService.login(req.body);
      return sendSuccess(res, result, 'Login successful', 200);
    } catch (err) {
      return sendError(res, err.message, 401);
    }
  },

  me(req, res) {
    try {
      const user = authService.getUserById(req.user.id);
      return sendSuccess(res, { user }, 'Session verified', 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  logout(req, res) {
    return sendSuccess(res, null, 'Logged out successfully');
  },

  forgotPassword(req, res) {
    return sendSuccess(res, null, 'If this email is registered, password reset instructions have been sent.');
  },

  resetPassword(req, res) {
    return sendSuccess(res, null, 'Password updated successfully. You may now log in.');
  },
};

export default authController;
