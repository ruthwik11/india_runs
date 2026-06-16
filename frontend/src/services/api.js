import axios from 'axios';
import { storage } from './storage';

const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT_MS || '10000', 10);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Inject Session UUID and Locale
    const session = storage.getUserSession();
    const locale = localStorage.getItem('SARKARI_SAATHI_LANG') || 'en';
    
    if (session) {
      config.headers['X-Session-ID'] = session;
    }
    config.headers['Accept-Language'] = locale;
    
    // Auth token injection (if implemented)
    // const token = memoryStore.getToken();
    // if (token) config.headers['Authorization'] = `Bearer ${token}`;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with Exponential Backoff for 429/5xx
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Auth Token Refresh Logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement token refresh logic here
        // const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`);
        // memoryStore.setToken(data.token);
        // return api(originalRequest);
        
        // If guest mode, simply redirect to home to restart session
        if (typeof window !== 'undefined') {
           // window.location.href = '/'; 
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Retry Logic for 429 Too Many Requests or 5xx Server Errors
    if ((error.response?.status === 429 || error.response?.status >= 500) && (!originalRequest._retryCount || originalRequest._retryCount < 3)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = Math.pow(2, originalRequest._retryCount) * 1000; // 2s, 4s, 8s
      
      console.warn(`API Error ${error.response?.status}. Retrying in ${delay}ms... (Attempt ${originalRequest._retryCount})`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api(originalRequest));
        }, delay);
      });
    }

    return Promise.reject(error);
  }
);

// API Endpoints
export const submitProfile = async (profileData) => {
  const { data } = await api.post('/profile', profileData);
  return data;
};

export const sendChatMessage = async (chatData) => {
  const { data } = await api.post('/chat', chatData);
  return data;
};

export default api;
