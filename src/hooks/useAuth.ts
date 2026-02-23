import { create } from 'zustand';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/apiRoutes';
import type { AuthUser } from '@/types/user.types';
import type { AuthResponse } from '@/types/api.types';
import { clearAuth, setAccessToken } from './authStorage';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser(user) {
    set({ user });
  },

  async login(email, password, _remember) {
    set({ loading: true, error: null });
    try {
      const res = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, { email, password });
      const data = res.data;
      setAccessToken(data.accessToken);
      set({ user: data.user, loading: false });
    } catch (error) {
      console.error('Login failed', error);
      set({
        error: 'Login failed. Please check your credentials or try again later.',
        loading: false
      });
    }
  },

  async logout() {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearAuth();
      set({ user: null });
    }
  }
}));

