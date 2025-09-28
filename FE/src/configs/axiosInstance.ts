import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const AUTH_TOKEN_KEY = 'auth_token';

const axiosInstance = axios.create({
  baseURL: 'http://moda-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;