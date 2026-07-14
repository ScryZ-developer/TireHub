import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccountType, AuthResponse, User } from '@tirehub/shared';
import type { RegisterPayload } from '@/lib/api';
import { api } from '@/lib/api';

export type RegisterData = RegisterPayload;

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: () => boolean;
}

function applyAuth(set: (partial: Partial<AuthState>) => void, data: AuthResponse) {
  set({ user: data.user, token: data.accessToken, error: null });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.auth.login(email, password);
          applyAuth(set, data);
        } catch {
          set({ error: 'Неверный email или пароль' });
          throw new Error('login failed');
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const result = await api.auth.register(data);
          applyAuth(set, result);
        } catch {
          set({ error: 'Не удалось зарегистрироваться. Проверьте данные.' });
          throw new Error('register failed');
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user = await api.auth.me(token);
          if (user) set({ user });
        } catch {
          set({ user: null, token: null });
        }
      },

      clearError: () => set({ error: null }),
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'tirehub-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
