// Ye service login, signup aur browser mein current user/session data manage karti hai.
// UI components iske through authentication API call karte hain.

import apiClient from './apiClient';
import { USER_ROLES } from '../constants/userRoles';

const STORAGE_KEY = 'sevaconnect_user';

export const authService = {
  // Ye entered credentials backend ko bhejkar successful user aur token ko local session mein rakhta hai.
  async login({ email, password, role = USER_ROLES.CUSTOMER }) {
    const response = await apiClient.post('/auth/login', { email, password, role });
    if (response?.data?.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    }
    throw new Error(response?.message || 'Login failed.');
  },

  async registerCustomer(customerData) {
    const payload = {
      ...customerData,
      name: (customerData.name || customerData.fullName || '').trim(),
      email: customerData.email?.trim(),
      phone: customerData.phone?.trim(),
    };
    const response = await apiClient.post('/auth/signup', payload);
    if (response?.data?.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    }
    throw new Error(response?.message || 'Registration failed.');
  },

  async registerProvider(providerData) {
    const payload = {
      ...providerData,
      name: (providerData.name || providerData.fullName || '').trim(),
      fullName: (providerData.fullName || providerData.name || '').trim(),
      businessName: providerData.businessName?.trim(),
      category: providerData.category,
      experienceYears: Number(providerData.experienceYears) || 1,
      email: providerData.email?.trim(),
      phone: providerData.phone?.trim(),
      city: providerData.city || 'Faridabad',
      password: providerData.password,
    };
    const response = await apiClient.post('/auth/provider-signup', payload);
    if (response?.data?.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    }
    throw new Error(response?.message || 'Provider registration failed.');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  async fetchCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      if (response?.data?.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch {
      this.logout();
      return null;
    }
  },

  updateCurrentUser(updates) {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  logout() {
    apiClient.setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  },

  async forgotPassword(email) {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, password) {
    return await apiClient.post('/auth/reset-password', { token, password });
  },
};

export default authService;
