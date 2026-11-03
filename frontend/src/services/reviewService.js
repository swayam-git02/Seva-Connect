import apiClient from './apiClient';

export const reviewService = {
  async submitReview(bookingId, { rating, comment }) {
    return await apiClient.post('/reviews', { bookingId, rating, comment });
  },

  async getProviderReviews(providerId) {
    return await apiClient.get(`/reviews/provider/${providerId}`);
  },
};

export default reviewService;
