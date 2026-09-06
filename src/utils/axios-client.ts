import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../store/auth.store";
import { AuthApi } from "../api/auth.api";
import { useToastStore } from "../store/toast.store";

function axiosClient(): AxiosInstance {
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/`,
    withCredentials: true,
    // Sans timeout, une requête qui n'aboutit pas (API ou DB injoignable)
    // reste bloquée indéfiniment côté client. 15 s : au-delà on rejette et
    // l'appelant peut afficher une erreur / proposer un réessai.
    timeout: 15000,
  });

  //REQUEST INTERCEPTOR
  api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  //RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { addToast } = useToastStore.getState();

      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
        addToast(
          `Trop de tentatives. Réessayer dans ${seconds} secondes.`,
          "warning",
        );
        return Promise.reject(
          new Error(`Trop de tentatives. Réessayer dans ${seconds} secondes.`),
        );
      }

      if (error.response?.status === 401) {
        const originalRequest = error.config;
        if (originalRequest._retry) return Promise.reject(error);
        originalRequest._retry = true;

        try {
          const { accessToken } = await AuthApi.refresh();
          useAuthStore.getState().setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          window.location.href = "/auth";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );
  return api;
}

export const api = axiosClient();
