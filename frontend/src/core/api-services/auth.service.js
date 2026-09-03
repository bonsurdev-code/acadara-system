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

  verifyOTP: async (payload) => {
    const { data } = await apiClient.post('/auth/verify-otp', { otp: payload.otp, usr_email: payload.usr_email });
    return data;
  },

  resendOTP: async (payload) => {
    const email = typeof payload === 'string' ? payload : payload?.usr_email;
    const { data } = await apiClient.post('/auth/resend-otp', { usr_email: email });
    return data;
  },

  oauthLogin: async (provider, token) => {
    const { data } = await apiClient.post(`/auth/oauth/${provider}`, { token });
    return data;
  }
};