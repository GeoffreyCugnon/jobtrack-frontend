import { api } from "../utils/axios-client";

/**
 * Pont d'authentification vers MS-Messagerie, côté Backend JobTrack (voir
 * `Backend/CLAUDE.md` — « Pont d'authentification vers MS-Messagerie »).
 * Le Backend ne fait que fabriquer le jeton ; tous les autres appels
 * (conversations, messages, WebSocket) vont directement au micro-service via
 * `src/services/messaging-client.ts`.
 */
export class MessagingApi {
  /**
   * `GET /auth/messaging-token` (protégé par `AuthGuard`, token JobTrack
   * injecté par l'intercepteur axios). Renvoie un JWT dédié (HS256, claim
   * `sub`) à présenter à MS-Messagerie.
   */
  static async getToken(): Promise<string> {
    const { data } = await api.get<{ token: string }>("auth/messaging-token");
    return data.token;
  }
}
