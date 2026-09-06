import { api } from "../utils/axios-client";
import type { User } from "../types/user.type";

/** Utilisateur tel que renvoyé dans une relation (jamais de champ sensible). */
export type ConnectionUser = Pick<
  User,
  "id" | "first_name" | "last_name" | "email" | "avatar_url"
>;

export interface ConnectionEntry {
  user: ConnectionUser;
  since: string;
}

export interface ConnectionList {
  /** Relations acceptées. */
  connections: ConnectionEntry[];
  /** Invitations reçues, en attente de ma réponse. */
  incoming: ConnectionEntry[];
  /** Invitations que j'ai envoyées, en attente. */
  outgoing: ConnectionEntry[];
}

/** État de la relation entre l'utilisateur courant et un autre membre. */
export type ConnectionStatus =
  | "none"
  | "pending_out"
  | "pending_in"
  | "connected";

/**
 * Mise en relation entre membres (`/connection`, protégé par `AuthGuard`).
 * Le token est injecté par l'intercepteur axios.
 */
export class ConnectionApi {
  static async list(): Promise<ConnectionList> {
    const { data } = await api.get<Partial<ConnectionList>>("connection");
    return {
      connections: data?.connections ?? [],
      incoming: data?.incoming ?? [],
      outgoing: data?.outgoing ?? [],
    };
  }

  /** Envoie une invitation à `userId`. */
  static async request(userId: number | string): Promise<void> {
    await api.post("connection", { userId: Number(userId) });
  }

  /** Accepte l'invitation reçue de `userId`. */
  static async accept(userId: number | string): Promise<void> {
    await api.patch(`connection/${userId}/accept`);
  }

  /** Refuse / annule / retire le lien avec `userId`. */
  static async remove(userId: number | string): Promise<void> {
    await api.delete(`connection/${userId}`);
  }
}

/** Construit une table `userId -> statut` à partir de la réponse `list()`. */
export function connectionStatusByUser(
  list: ConnectionList,
): Map<ConnectionUser["id"], ConnectionStatus> {
  const map = new Map<ConnectionUser["id"], ConnectionStatus>();
  for (const e of list.connections) map.set(e.user.id, "connected");
  for (const e of list.incoming) map.set(e.user.id, "pending_in");
  for (const e of list.outgoing) map.set(e.user.id, "pending_out");
  return map;
}
