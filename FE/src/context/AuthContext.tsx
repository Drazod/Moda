import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../configs/axiosInstance';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY  = 'auth_user';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY)) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axiosInstance.get('/user/profile'); // Authorization header comes from interceptor
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          // only clear session on invalid token
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          setToken(null);
          setUser(null);
        }
        // network/5xx: keep cached session
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  const login = (userData, newToken) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    // consider a user "signed in" if we have a token (profile may still be verifying)
    isAuthenticated: !!token && !loading,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
