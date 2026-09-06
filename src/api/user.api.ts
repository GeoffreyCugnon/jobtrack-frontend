import { api } from "../utils/axios-client";
import type { User } from "../types/user.type";

/**
 * Endpoints liés au compte de l'utilisateur connecté.
 * Le changement de mot de passe passe par le module `auth` côté Backend
 * (`PATCH /auth/password`), la suppression de compte par `user`
 * (`DELETE /user/account`, réponse 204). Les deux sont protégés par
 * `AuthGuard` : le token est injecté par l'intercepteur axios.
 */
export class UserApi {
  static async changePassword(body: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const { data } = await api.patch("auth/password", body);
    return data;
  }

  static async deleteAccount(): Promise<void> {
    await api.delete("user/account");
  }

  /**
   * Liste des utilisateurs (`GET /user`, protégé par `AuthGuard`). Utilisé
   * par la recherche globale ; tolère une réponse non-tableau.
   */
  static async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>("user");
    return Array.isArray(data) ? data : [];
  }

  /**
   * Met à jour l'avatar de l'utilisateur courant (`PATCH /user/avatar`).
   * `avatarUrl` : URL https ou data URL d'image. Renvoie l'utilisateur à jour.
   */
  static async updateAvatar(avatarUrl: string): Promise<User> {
    const { data } = await api.patch<User>("user/avatar", { avatarUrl });
    return data;
  }
}
