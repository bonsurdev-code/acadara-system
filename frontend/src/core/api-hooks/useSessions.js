import { useState, useCallback } from 'react';
import sessionService from '../api-services/session.service';

export const useSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const proposeSession = async (data) => {
    setLoading(true);
    try {
      const res = await sessionService.proposeSession(data);
      return res;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reviewSession = async (id, data) => {
    setLoading(true);
    try {
      const res = await sessionService.reviewSession(id, data);
      return res;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActiveSession = useCallback(async (matchId) => {
    setLoading(true);
    try {
      return await sessionService.getActiveSession(matchId);
    } finally {
      setLoading(false);
    }
  }, []);

  return { proposeSession, reviewSession, getActiveSession, loading, error };
};