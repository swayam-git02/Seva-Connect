// Category Service
import apiClient from './apiClient';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';

export const categoryService = {
  async getCategories() {
    try {
      return await apiClient.get('/categories');
    } catch {
      return { success: true, data: SERVICE_CATEGORIES };
    }
  },

  async getCategoryBySlug(slug) {
    try {
      return await apiClient.get(`/categories/${slug}`);
    } catch {
      const found = SERVICE_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
      return { success: true, data: found || SERVICE_CATEGORIES[0] };
    }
  },
};

export default categoryService;
