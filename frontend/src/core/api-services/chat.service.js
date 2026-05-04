import apiClient from '../api-client';

const chatService = {
  getChatHistory: async (matchId) => {
    const response = await apiClient.get(`/messages/${matchId}`);
    return response.data;
  },
  sendMessage: async (messageData) => {
    // messageData: { match_id, content }
    const response = await apiClient.post('/messages/send', messageData);
    return response.data;
  }
};

export default chatService;