import { api } from "../utils/axios-client";

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
}
