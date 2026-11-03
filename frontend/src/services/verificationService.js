// Ye service secure Starting Code aur Ending Code APIs ko call karti hai.
// Provider verification ke liye code bhejta hai, jabki customer apne authorized codes dekh sakta hai.

import apiClient from './apiClient';

export const verificationService = {
  // Ye provider ka Starting Code backend ko bhejta hai; backend hi ownership aur status validate karta hai.
  async verifyStartingCode(bookingId, code) {
    const response = await apiClient.post(`/bookings/${bookingId}/verify-start-code`, { code });
    return {
      success: true,
      message: response?.message || 'Starting code accepted! Work is now in progress.',
      data: response?.data,
    };
  },

  // Provider verifies customer's 6-digit Ending Code
  async verifyEndingCode(bookingId, code) {
    const response = await apiClient.post(`/bookings/${bookingId}/verify-end-code`, { code });
    return {
      success: true,
      message: response?.message || 'Ending code verified! Job closed successfully.',
      data: response?.data,
    };
  },

  // Customer securely retrieves their codes
  async getCustomerCodes(bookingId) {
    const response = await apiClient.get(`/bookings/${bookingId}/codes`);
    return {
      success: true,
      data: response?.data,
    };
  },
};

export default verificationService;
