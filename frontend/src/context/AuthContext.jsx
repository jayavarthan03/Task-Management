import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile if token is present
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/profile');
      if (res.data && res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Fetch profile failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = !err.response
        ? 'Server offline or database disconnected. Please check if your MongoDB service and Node.js server are active.'
        : err.response.data?.message || 'Login failed, please check credentials';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = !err.response
        ? 'Server offline or database disconnected. Please check if your MongoDB service and Node.js server are active.'
        : err.response.data?.message || 'Registration failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
