import apiClient from './apiClient';

export const photoService = {
  // Upload Before-Service photographs
  async uploadBeforePhotos(bookingId, files, caption = '') {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    if (caption) {
      formData.append('caption', caption);
    }
    return await apiClient.upload(`/bookings/${bookingId}/photos/before`, formData);
  },

  // Upload After-Service photographs
  async uploadAfterPhotos(bookingId, files, caption = '') {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    if (caption) {
      formData.append('caption', caption);
    }
    return await apiClient.upload(`/bookings/${bookingId}/photos/after`, formData);
  },

  // Get photographs for a booking (before and after)
  async getBookingPhotos(bookingId) {
    return await apiClient.get(`/bookings/${bookingId}/photos`);
  },
};

export default photoService;
