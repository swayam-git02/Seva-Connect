import apiClient from './apiClient';

export const adminService = {
  async getDashboardStats() {
    return await apiClient.get('/admin/dashboard-stats');
  },

  async getAllUsers() {
    return await apiClient.get('/admin/users');
  },

  async getPendingVerifications() {
    return await apiClient.get('/admin/verifications');
  },

  async approveVerification(verificationId) {
    return await apiClient.post(`/admin/verifications/${verificationId}/approve`);
  },

  async rejectVerification(verificationId, reason) {
    return await apiClient.post(`/admin/verifications/${verificationId}/reject`, { reason });
  },

  async getAllBookings() {
    return await apiClient.get('/admin/bookings');
  },

  async getComplaints() {
    return await apiClient.get('/admin/complaints');
  },
};

export default adminService;
