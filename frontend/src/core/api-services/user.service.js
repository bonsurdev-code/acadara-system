import apiClient from '../api-client';

export const userService = {
  // Full update
  updateProfile: async (data) => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  // Partial update (e.g., just updating a single field)
  patchProfile: async (partialData) => {
    const response = await apiClient.patch('/user/profile', partialData);
    return response.data;
  },

  runMatching: async (profileData) => {
    const response = await apiClient.post('/match/run', profileData);
    return response.data;
  },

  createMentorshipRequest: async (matchData) => {
    const response = await apiClient.post('/match/request', matchData);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await apiClient.get('/match/my-requests');
    return response.data;
  },

  getReceivedRequests: async () => {
    const response = await apiClient.get('/match/mentor-requests');
    return response.data;
  },

  updateRequestStatus: async (requestId, data) => {
    const response = await apiClient.patch(`/match/status/${requestId}`, { ...data });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/user/dashboard/mentee');
    return response.data;
  },

  getMentorDashboard: async () => {
    const response = await apiClient.get('/user/dashboard/mentor');
    return response.data;
  },

  updateUserPassword: async (passwordData) => {
    const response = await apiClient.put('/user/password', passwordData);
    return response.data;
  }
};