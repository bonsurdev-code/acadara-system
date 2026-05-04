import apiClient from '../api-client.js';

export const adminService = {
    stats: async () => {
        const { data } = await apiClient.get('/admin/stats');
        return data;
    },

    users: async () => {
        const { data } = await apiClient.get('/admin/users');
        return data;
    },

    submitPublicApplication: async (formData) => {
        const { data } = await apiClient.post('/public/mentor-apply', formData);
        return data;
    },

    getApplications: async (status) => {
        const { data } = await apiClient.get(`/admin/applications?status=${status}`);
        return data;
    },

    updateApplicationStatus: async (appId, status) => {
        const { data } = await apiClient.put(`/admin/applications/${appId}`, { status });
        return data;
    }
}