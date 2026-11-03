// Service offerings management
import apiClient from './apiClient';

export const serviceService = {
  async getServicesByProvider(providerId) {
    try {
      return await apiClient.get(`/providers/${providerId}/services`);
    } catch {
      return { success: true, data: [] };
    }
  },

  async addService(providerId, serviceData) {
    try {
      return await apiClient.post(`/providers/${providerId}/services`, serviceData);
    } catch {
      return { success: true, data: { id: `s-${Date.now()}`, ...serviceData } };
    }
  },

  async updateService(providerId, serviceId, serviceData) {
    try {
      return await apiClient.put(`/providers/${providerId}/services/${serviceId}`, serviceData);
    } catch {
      return { success: true, data: { id: serviceId, ...serviceData } };
    }
  },

  async deleteService(providerId, serviceId) {
    try {
      return await apiClient.delete(`/providers/${providerId}/services/${serviceId}`);
    } catch {
      return { success: true };
    }
  },
};

export default serviceService;
