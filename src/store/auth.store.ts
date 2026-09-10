import { create } from "zustand";
import type { User } from "../types/user.type";
import { clearSessionHint, markSessionHint } from "../utils/session-hint";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: !!token });
    if (token) markSessionHint();
    else clearSessionHint();
  },
  clearAuth: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
    clearSessionHint();
  },
}));
