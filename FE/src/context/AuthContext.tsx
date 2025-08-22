import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { IUser } from '../constants/IUser';
import axiosInstance from '../configs/axiosInstance';
import { Navigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const AUTH_TOKEN_KEY = 'auth_token';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (userData: IUser, token: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        try {
          const response = await axiosInstance.get<{ user: IUser }>('/auth/me');
          if (response.data && response.data.user) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status !== 401) {
            logout();
          }
        }
        finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (userData: IUser | null, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token && !loading
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};