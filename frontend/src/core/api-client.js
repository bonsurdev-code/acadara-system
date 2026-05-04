import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response, // pass successful responses

  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong';

    if (error.response?.status === 401) {
      console.warn('Unauthorized');
    }

    if (error.response?.status === 403) {
      console.warn('Forbidden');
    }

    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      original: error,
    });
  }
);

export default apiClient;