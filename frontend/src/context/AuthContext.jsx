import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Verify stored token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.warn('Session expired or invalid token. Logging out...');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  // Register action
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { user, token } = res.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please check your details.';
      return { success: false, message };
    }
  };

  // Login action
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid email or password. Please try again.';
      return { success: false, message };
    }
  };

  // Logout action
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
