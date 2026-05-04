import apiClient from '../api-client';

const ratingService = {
  submitRating: async (ratingData) => {
    // Hits the new endpoint we created in the backend
    const response = await apiClient.post('/ratings/submit', ratingData);
    return response.data;
  }
};

export default ratingService;