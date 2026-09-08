// src/services/messaging-client.ts
//
// Client dédié pour MS-Messagerie (REST + WebSocket) : c'est le SEUL endroit
// de l'app qui parle directement à ce micro-service (base URL
// VITE_MESSAGING_API_URL, port distinct du Backend JobTrack). Le JWT présenté
// est obtenu via MessagingApi.getToken() (Backend JobTrack), jamais émis ici.
import axios, { type AxiosInstance } from "axios";
import { io, type Socket } from "socket.io-client";
import { MessagingApi } from "../api/messaging.api";
import type {
  MessagingConversationDto,
  MessagingMessageDto,
  MessagingMessagePageDto,
} from "../types/messaging.type";

const MESSAGING_API_URL = import.meta.env.VITE_MESSAGING_API_URL as string;

// --- Jeton de messagerie : cache mémoire simple ----------------------------
//
// Pas de persistance (comme accessToken côté auth.store) : un rechargement de
// page en redemande un via MessagingApi.getToken(). `tokenPromise` évite les
// appels concurrents en rafale (plusieurs requêtes MS en parallèle au premier
// rendu de la messagerie).

let cachedToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

async function getMessagingToken(forceRefresh = false): Promise<string> {
  if (cachedToken && !forceRefresh) return cachedToken;
  if (!tokenPromise || forceRefresh) {
    tokenPromise = MessagingApi.getToken().then((token) => {
      cachedToken = token;
      return token;
    });
  }
  return tokenPromise;
}

/** À appeler à la déconnexion JobTrack (le jeton de messagerie n'a plus lieu d'être). */
export function clearMessagingToken(): void {
  cachedToken = null;
  tokenPromise = null;
}

// --- REST -------------------------------------------------------------------

function createMessagingHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${MESSAGING_API_URL}/`,
    timeout: 15000,
  });

  client.interceptors.request.use(async (config) => {
    const token = await getMessagingToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Un seul rejeu : si le jeton était expiré/invalide, on en redemande un
  // (Backend JobTrack) et on retente une fois. Au-delà, l'erreur remonte
  // (ex. session JobTrack elle-même expirée : `api` gère déjà ce cas côté
  // Backend, MessagingApi.getToken() échouera alors aussi).
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        const token = await getMessagingToken(true);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      }
      return Promise.reject(error);
    },
  );

  return client;
}

const messagingHttp = createMessagingHttpClient();

export class MessagingRestApi {
  /** `GET /conversations` — conversations de l'utilisateur, triées par `lastMessageAt`. */
  static async getConversations(): Promise<MessagingConversationDto[]> {
    const { data } =
      await messagingHttp.get<MessagingConversationDto[]>("conversations");
    return data;
  }

  /** `POST /conversations` — ouvre (ou retrouve) la conversation avec `participantId`. */
  static async createConversation(
    participantId: string,
  ): Promise<MessagingConversationDto> {
    const { data } = await messagingHttp.post<MessagingConversationDto>(
      "conversations",
      { participantId },
    );
    return data;
  }

  /** `GET /conversations/:id/messages` — page de messages (curseur), plus récent d'abord. */
  static async getMessages(
    conversationId: string,
    params?: { cursor?: string; limit?: number },
  ): Promise<MessagingMessagePageDto> {
    const { data } = await messagingHttp.get<MessagingMessagePageDto>(
      `conversations/${conversationId}/messages`,
      { params },
    );
    return data;
  }

  /** `POST /conversations/:id/messages` — fallback REST (le WebSocket est le chemin nominal). */
  static async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<MessagingMessageDto> {
    const { data } = await messagingHttp.post<MessagingMessageDto>(
      `conversations/${conversationId}/messages`,
      { content },
    );
    return data;
  }

  /** `PATCH /messages/:id/read` — marque le message comme lu. */
  static async markRead(messageId: string): Promise<MessagingMessageDto> {
    const { data } = await messagingHttp.patch<MessagingMessageDto>(
      `messages/${messageId}/read`,
    );
    return data;
  }

  /** `PATCH /conversations/:id/messages/read` — marque toute la conversation comme lue. */
  static async markConversationRead(
    conversationId: string,
  ): Promise<{ updated: number }> {
    const { data } = await messagingHttp.patch<{ updated: number }>(
      `conversations/${conversationId}/messages/read`,
    );
    return data;
  }
}

// --- WebSocket (Socket.IO) ---------------------------------------------------
//
// Une seule connexion partagée par onglet, gérée par MessagingProvider
// (connect au montage si authentifié, disconnect à la déconnexion).

let socket: Socket | null = null;

export async function connectMessagingSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await getMessagingToken();
  socket = io(MESSAGING_API_URL, { auth: { token } });

  // AppAuthGuard (MS-Messagerie) rejette un handshake invalide en appelant
  // `client.disconnect(true)` *après* la connexion : côté client, ça remonte
  // comme un `disconnect` avec la raison "io server disconnect" (déconnexion
  // volontaire du serveur, pas de reconnexion auto contrairement aux autres
  // raisons) — cas typique : jeton expiré entre l'ouverture de l'app et la
  // connexion au socket. On retente une fois avec un jeton frais.
  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      void getMessagingToken(true).then((freshToken) => {
        if (!socket) return;
        socket.auth = { token: freshToken };
        socket.connect();
      });
    }
  });

  return socket;
}

export function disconnectMessagingSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function getMessagingSocket(): Socket | null {
  return socket;
}

export function joinConversationRoom(conversationId: string): void {
  socket?.emit("conversation:join", { conversationId });
}

export function leaveConversationRoom(conversationId: string): void {
  socket?.emit("conversation:leave", { conversationId });
}

/** Équivalent WebSocket de `MessagingRestApi.sendMessage` (chemin nominal). */
export function sendMessageViaSocket(conversationId: string, content: string): void {
  socket?.emit("message:send", { conversationId, content });
}
