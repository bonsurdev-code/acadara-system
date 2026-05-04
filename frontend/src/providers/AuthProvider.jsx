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
    try {
      await authService.login(credentials);

      const response = await authService.verifySession();
      await handleAuthSuccess(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authService.register(userData);

      const response = await authService.verifySession();
      await handleAuthSuccess(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
    <AuthContext.Provider value={{ user, setUser, login, register, logout, oauthLogin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};