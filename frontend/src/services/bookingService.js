// Ye service customer aur provider booking APIs ko frontend-friendly functions mein wrap karti hai.
// Iska use booking create, details, list aur cancellation workflow mein hota hai.

import apiClient from './apiClient';

export const bookingService = {
  // Ye optional status filters ke saath current user's authorized booking list load karta hai.
  async getBookings(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/bookings${query ? `?${query}` : ''}`);
    return {
      success: true,
      data: response?.data || [],
    };
  },

  async getBookingById(id) {
    const response = await apiClient.get(`/bookings/${id}`);
    return {
      success: true,
      data: response?.data || null,
    };
  },

  async createBooking(bookingPayload) {
    const response = await apiClient.post('/bookings', bookingPayload);
    return {
      success: true,
      data: response?.data,
      message: response?.message,
    };
  },

  async cancelBooking(id, reason = '') {
    const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
    return {
      success: true,
      message: response?.message || 'Booking cancelled.',
    };
  },
};

export default bookingService;
