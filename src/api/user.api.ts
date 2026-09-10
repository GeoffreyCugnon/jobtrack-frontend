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

  /** `GET /user/:id` (protégé). `null` si introuvable. */
  static async getById(id: number | string): Promise<User | null> {
    const { data } = await api.get<User | null>(`user/${id}`);
    return data ?? null;
  }

  /**
   * Met à jour l'avatar de l'utilisateur courant (`PATCH /user/avatar`).
   * `avatarUrl` : URL https ou data URL d'image. Renvoie l'utilisateur à jour.
   */
  static async updateAvatar(avatarUrl: string): Promise<User> {
    const { data } = await api.patch<User>("user/avatar", { avatarUrl });
    return data;
  }

  /**
   * Met à jour la bannière de profil de l'utilisateur courant
   * (`PATCH /user/banner`). `bannerUrl` : URL https ou data URL d'image
   * (redimensionnée côté client). Renvoie l'utilisateur à jour.
   */
  static async updateBanner(bannerUrl: string): Promise<User> {
    const { data } = await api.patch<User>("user/banner", { bannerUrl });
    return data;
  }

  /**
   * Met à jour les champs de profil éditables (`PATCH /user/profile`).
   * Chaîne vide = champ effacé (le Backend la range en `null`).
   */
  static async updateProfile(patch: {
    first_name?: string;
    last_name?: string;
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  }): Promise<User> {
    const { data } = await api.patch<User>("user/profile", patch);
    return data;
  }

  /** Compétences de l'utilisateur courant (`GET /skill`). */
  static async getSkills(): Promise<string[]> {
    const { data } = await api.get<string[]>("skill");
    return Array.isArray(data) ? data : [];
  }

  /** Remplace toute la liste de compétences (`PUT /skill`). */
  static async updateSkills(skills: string[]): Promise<string[]> {
    const { data } = await api.put<string[]>("skill", { skills });
    return Array.isArray(data) ? data : [];
  }

  /**
   * Active / désactive les notifications du compte
   * (`PATCH /user/settings/notifications`). Renvoie l'utilisateur à jour.
   */
  static async updateNotifications(enabled: boolean): Promise<User> {
    const { data } = await api.patch<User>("user/settings/notifications", {
      notifications_enabled: enabled,
    });
    return data;
  }

  /**
   * Langue de l'interface (`PATCH /user/settings/language`).
   * `language` : `fr` | `en` | `es` | `de`. Renvoie l'utilisateur à jour.
   */
  static async updateLanguage(language: string): Promise<User> {
    const { data } = await api.patch<User>("user/settings/language", {
      language,
    });
    return data;
  }
}
