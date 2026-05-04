import { useState, useCallback } from 'react';
import chatService from '../api-services/chat.service';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async (matchId) => {
    setLoading(true);
    try {
      const res = await chatService.getChatHistory(matchId);
      if (res?.success) setMessages(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (matchId, content) => {
    try {
      const res = await chatService.sendMessage({ match_id: matchId, content });
      if (res?.success) {
        setMessages(prev => [...prev, res.data]);
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { messages, setMessages, fetchMessages, sendMessage, loading };
};