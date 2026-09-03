import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../core/api-contexts/AuthContext';
import { authService } from '../core/api-services/auth.service';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleAuthSuccess = async (userData) => {
  //   try {
  //     setUser(userData);
  //     const role = userData.usr_role;
  //     if (role === 'admin') navigate('/admin/dashboard');
  //     else if (role === 'mentor') navigate('/mentor/dashboard');
  //     else navigate('/mentee/dashboard');
  //   } catch (err) {
  //     setUser(null);
  //     console.error('Error verifying session:', err);
  //   }
  // };

  const handleAuthSuccess = async (userData) => {
      setUser(userData);
      const role = userData.usr_role;

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'mentor') navigate('/mentor/dashboard');
      else navigate('/mentee/dashboard');
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      const response = await authService.verifySession();
      await handleAuthSuccess(response);
    } catch (error) {
      const msg = error.customMessage || error.message || 'Login failed';
      setError(msg);
      throw error; // Essential: allows LoginModal's catch block to intercept the 403
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      return response; 
    } catch (error) {
      const msg = 
        error.customMessage || 
        error.response?.data?.message || 
        error.message || 
        'Registration failed';
      
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOTP(payload);
      const userSession = await authService.verifySession();
      await handleAuthSuccess(userSession);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (payload) => {
    setError(null);
    try {
      const response = await authService.resendOTP(payload);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      setError(error.message);
    }finally {
      setLoading(false);
      setUser(null);
      window.location.href = '/';
    }
  };
  
  const oauthLogin = async (provider, token) => {
    try {
      setLoading(true);
      setError(null);

      await authService.oauthLogin(provider, token);

      const response = await authService.verifySession();
      await handleAuthSuccess(response);

    } catch (err) {
      setError(err.message || 'OAuth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, oauthLogin, verifyOTP, resendOTP, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};