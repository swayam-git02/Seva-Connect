import apiClient from './apiClient';

export const providerService = {
  async getProviders(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/providers${query ? `?${query}` : ''}`);
    return {
      success: true,
      data: response?.data || [],
      total: response?.data?.length || 0,
    };
  },

  async getFeaturedProviders() {
    const response = await apiClient.get('/providers/featured');
    return {
      success: true,
      data: response?.data || [],
    };
  },

  async getProviderById(id) {
    const response = await apiClient.get(`/providers/${id}`);
    return {
      success: true,
      data: response?.data,
    };
  },

  async getMyProfile() {
    const response = await apiClient.get('/providers/me');
    return { success: true, data: response?.data };
  },

  async updateAvailability(isOnline) {
    const response = await apiClient.put('/providers/me', { isOnline });
    return { success: true, data: response?.data, message: response?.message };
  },

  async updateProviderProfile(id, updates) {
    const response = await apiClient.put(`/providers/${id}`, updates);
    return {
      success: true,
      data: response?.data,
      message: response?.message,
    };
  },

  async getMyServices() {
    const response = await apiClient.get('/providers/me/services');
    return {
      success: true,
      data: response?.data || [],
    };
  },

  async addService(serviceData) {
    const response = await apiClient.post('/providers/me/services', serviceData);
    return {
      success: true,
      data: response?.data,
      message: response?.message,
    };
  },

  async updateService(serviceId, serviceData) {
    const response = await apiClient.put(`/providers/me/services/${serviceId}`, serviceData);
    return {
      success: true,
      data: response?.data,
      message: response?.message,
    };
  },

  async deleteService(serviceId) {
    const response = await apiClient.delete(`/providers/me/services/${serviceId}`);
    return {
      success: true,
      data: response?.data,
      message: response?.message,
    };
  },
};

export default providerService;
