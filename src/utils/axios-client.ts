import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../store/auth.store";
import { AuthApi } from "../api/auth.api";
import { useToastStore } from "../store/toast.store";

/**
 * Cache ETag explicite (par URL, en mémoire — pas persisté) plutôt que de
 * compter sur le cache HTTP implicite du navigateur : ce dernier a un
 * comportement ambigu pour des requêtes cross-origin avec `Authorization`
 * (RFC 7234 §3.2, restreint aux caches "partagés" mais interprété
 * différemment selon les navigateurs). Explicite = déterministe et
 * vérifiable. Ne remplace pas `staleTime` (React Query décide toujours QUAND
 * refetch) : ça ne fait qu'alléger la réponse quand rien n'a changé.
 */
const etagCache = new Map<string, { etag: string; data: unknown }>();

function axiosClient(): AxiosInstance {
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/`,
    withCredentials: true,
    // Sans timeout, une requête qui n'aboutit pas (API ou DB injoignable)
    // reste bloquée indéfiniment côté client. 15 s : au-delà on rejette et
    // l'appelant peut afficher une erreur / proposer un réessai.
    timeout: 15000,
    // 304 traité comme un succès (pas une erreur) pour retomber dans
    // l'intercepteur de réponse ci-dessous plutôt que dans la branche catch.
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 304,
  });

  //REQUEST INTERCEPTOR
  api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.method === "get" && config.url) {
      const cached = etagCache.get(config.url);
      if (cached) {
        config.headers["If-None-Match"] = cached.etag;
      }
    }
    return config;
  });

  //RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (res) => {
      const url = res.config.url;
      if (res.config.method !== "get" || !url) {
        return res;
      }
      if (res.status === 304) {
        const cached = etagCache.get(url);
        if (cached) {
          res.data = cached.data;
          res.status = 200;
        }
        return res;
      }
      const etag = res.headers.etag as string | undefined;
      if (etag) {
        etagCache.set(url, { etag, data: res.data });
      }
      return res;
    },
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
          const { accessToken, user } = await AuthApi.refresh();
          useAuthStore.getState().setAccessToken(accessToken);
          useAuthStore.getState().setUser(user);
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
