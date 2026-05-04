import { useCallback, useState } from 'react';
import { userService } from '../api-services/user.service';
import { useAuth } from './useAuth';
import ratingService from '../api-services/rating.service';
import apiClient from '../api-client';

export const useUserService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useAuth();

  const updateProfile = async (data, isPartial = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = isPartial 
        ? await userService.patchProfile(data)
        : await userService.updateProfile(data);
      
      // Update the global auth state so the UI reflects changes immediately
      setUser(prev => ({ ...prev, ...data }));
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.runMatching(profileData);
      return response.recommendations; // This returns the array of matches
    } catch (err) {
      setError(err.response?.data?.message || "Matching process failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMentorshipRequest = async (matchData) => {
    const response = await userService.createMentorshipRequest(matchData);
    return response;
  };

  const getMyRequests = useCallback(async () => {
      const response = await userService.getMyRequests();
      return response;
  }, []);

  const getReceivedRequests = useCallback(async () => {
    const response = await userService.getReceivedRequests();
    return response;
  }, []);

  const updateRequestStatus = async (requestId, data) => {
    const response = await userService.updateRequestStatus(requestId, data);
    return response;
  };

    const submitRating = async (data) => {
    setLoading(true);
    try {
      const res = await ratingService.submitRating(data);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const unmatchPartners = async (matchId) => {
    setLoading(true);
    try {
      // Changed from .delete to .patch to match the new 'expired' logic
      const res = await apiClient.patch(`/match/terminate/${matchId}`);
      return res.data;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = async () => {
    const response = await userService.getDashboardStats();
    return response;
  };

  const getMentorDashboard = async () => {
    const response = await userService.getMentorDashboard();
    return response;
  };


  return { 
    updateProfile, 
    getRecommendations, 
    createMentorshipRequest, 
    getMyRequests, 
    getReceivedRequests,
    updateRequestStatus,
    submitRating,
    unmatchPartners,
    getDashboardStats,
    getMentorDashboard,
    loading, 
    error 
  };
};