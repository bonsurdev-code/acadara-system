import apiClient from '../api-client.js';

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },
  
  register: async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },

  verifySession: async () => {
    const { data } = await apiClient.get('/user/verify');
    return data;
  },

  oauthLogin: async (provider, token) => {
    const { data } = await apiClient.post(`/auth/oauth/${provider}`, { token });
    return data;
  }
};