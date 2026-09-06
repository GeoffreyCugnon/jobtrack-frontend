import type { SignInData } from "../types/auth.type";
import type { User } from "../types/user.type";
import { api } from "../utils/axios-client";
import axios from "axios";

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type RefreshResponse = {
  accessToken: string;
  user: User;
};

export type RegisterBody = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export class AuthApi {
  static async register(body: RegisterBody) {
    const { data } = await api.post("auth/register", body);
    return data;
  }

  static async login(body: SignInData): Promise<LoginResponse> {
    const { data } = await api.post("auth/login", body);
    return data;
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post("auth/forgot-password", { email });
    return data;
  }

  static async resetPassword(body: {
    email: string;
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const { data } = await api.post("auth/reset-password", body);
    return data;
  }

  static async refresh(): Promise<RefreshResponse> {
    const { data } = await axios.post<RefreshResponse>(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return data;
  }

  static async logout(): Promise<void> {
    await api.post("auth/logout", {}, { withCredentials: true });
  }
}
