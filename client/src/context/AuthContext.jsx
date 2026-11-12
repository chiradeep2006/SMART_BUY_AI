import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('smartbuy_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('smartbuy_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('smartbuy_token');
        localStorage.removeItem('smartbuy_user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartbuy_token', res.data.token);
      localStorage.setItem('smartbuy_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const register = async (name, email, password, language = 'en') => {
    const res = await api.post('/auth/register', { name, email, password, language });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartbuy_token', res.data.token);
      localStorage.setItem('smartbuy_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartbuy_token');
    localStorage.removeItem('smartbuy_user');
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
      localStorage.setItem('smartbuy_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
