import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/auth': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/clothes': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/cart': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/category': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/cartItem': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/user': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/vnpay': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/momo': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/file': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/admin': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/metrics': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/report': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/notice': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/log': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/search': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/points': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/refund': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/comments': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/shipping': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/coupon': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/order': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/branch': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/friendship': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/chat': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/virtual-tryon': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/posts': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/devices': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
      '/c2c': { target: 'https://moda-production.up.railway.app', changeOrigin: true, secure: false },
    },
  },
});
