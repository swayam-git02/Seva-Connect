import apiClient from './apiClient';

export const earningsService = {
  async getProviderEarnings() {
    return await apiClient.get('/providers/me/earnings');
  },
};

export default earningsService;
