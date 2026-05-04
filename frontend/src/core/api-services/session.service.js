import apiClient from '../api-client';

const sessionService = {
  proposeSession: async (sessionData) => {
    const response = await apiClient.post('/session/propose', sessionData);
    return response.data;
  },

  reviewSession: async (sessionId, reviewData) => {
    const response = await apiClient.patch(`/session/review/${sessionId}`, reviewData);
    return response.data;
  },

  getActiveSession: async (matchId) => {
    const response = await apiClient.get(`/session/active/${matchId}`);
    return response.data;
  }
};

export default sessionService;