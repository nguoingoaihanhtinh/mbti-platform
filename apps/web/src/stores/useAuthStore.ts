// src/store/useAuthStore.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  login: () => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          }),

        logout: () => {
          set({ user: null, isAuthenticated: false, error: null });
          // Optional: call backend /auth/logout to clear cookies
          fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        },

        login: async () => {
          const { isLoading, isAuthenticated } = get();
          if (isLoading || isAuthenticated) return;

          set({ isLoading: true, error: null });
          try {
            const res = await fetch(`${API_URL}/auth/profile`, {
              credentials: "include",
            });
            if (res.ok) {
              const user = await res.json();
              set({ user, isAuthenticated: true, isLoading: false });
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } catch (err) {
            set({ error: "Failed to fetch profile", isLoading: false });
          }
        },

        refreshProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            const res = await fetch(`${API_URL}/auth/profile`, {
              credentials: "include",
            });
            if (res.ok) {
              const user = await res.json();
              set({ user, isAuthenticated: true, isLoading: false });
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } catch (err) {
            set({ error: "Failed to refresh profile", isLoading: false });
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
