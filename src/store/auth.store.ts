import { create } from "zustand";
import type { User } from "../types/user.type";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setAuthenticated: (value: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
