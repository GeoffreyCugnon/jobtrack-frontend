import { create } from "zustand";
import type { User } from "../types/user.type";


type AuthState = {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    setUser: (user) => set({ user }),
    setAccessToken: (token) => set({accessToken: token}),
    clearAuth: () => set({ user: null, accessToken: null}),
}));