// src/store/useAuthStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  login: () => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          }),

        logout: () => {
          set({ user: null, isAuthenticated: false, error: null });
          // Cookie is cleared by backend — no need to clear here
        },

        // Fetch current user from backend (uses cookie auth)
        login: async () => {
          set({ loading: true, error: null });
          try {
            const res = await fetch("http://localhost:3000/auth/profile", {
              credentials: "include", // critical for cookies
            });
            if (res.ok) {
              const user = await res.json();
              set({ user, isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          } catch (err) {
            set({ error: "Failed to fetch profile" });
          } finally {
            set({ loading: false });
          }
        },

        refreshProfile: async () => {
          set({ loading: true });
          try {
            const res = await fetch("http://localhost:3000/auth/profile", {
              credentials: "include",
            });
            if (res.ok) {
              const user = await res.json();
              set({ user, isAuthenticated: true, error: null });
            }
          } catch (err) {
            set({ error: "Failed to refresh profile" });
          } finally {
            set({ loading: false });
          }
        },
      }),
      {
        name: "auth-storage", // persisted in localStorage
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    )
  )
);
