import axios from 'axios';
import { API_ROUTES } from './apiRoutes';
import { getAccessToken, setAccessToken, clearAuth } from '@/hooks/authStorage';

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

/**
 * Central axios instance for the Ekic University portal.
 * Comment: We centralise token and error handling here to keep components
 * lean and make it easy to plug in network-aware behaviour for slow or
 * intermittent Kenyan connectivity.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token && original.headers) {
                // eslint-disable-next-line no-param-reassign
                original.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(original));
            },
            reject
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          API_ROUTES.AUTH.REFRESH,
          {},
          {
            baseURL: api.defaults.baseURL,
            withCredentials: true
          }
        );

        const newAccess = res.data.accessToken as string;
        setAccessToken(newAccess);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        if (original.headers) {
          // eslint-disable-next-line no-param-reassign
          original.headers.Authorization = `Bearer ${newAccess}`;
        }

        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

