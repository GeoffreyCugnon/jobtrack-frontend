import type { User } from "../types/user.type";

export type UserDisplay = {
  firstName: string;
  lastName: string;
  /** "Prénom Nom", ou "Invité" si personne n'est connecté. */
  name: string;
  /** Initiales en majuscules, ou "?" en repli. */
  initials: string;
  email: string;
  /** Avatar généré (Backend) — `undefined` si pas d'utilisateur / pas d'URL. */
  avatarUrl: string | undefined;
  /** Bannière de profil choisie — `undefined` si aucune (dégradé par défaut). */
  bannerUrl: string | undefined;
  /** Champs de profil (`""` si non renseigné). */
  headline: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
};

/**
 * Dérive l'identité affichable de l'utilisateur réellement connecté
 * (`useAuthStore().user`), avec les mêmes replis « Invité » / « ? » que le
 * `SideMenu`. Source unique pour éviter que Dashboard/Settings/Profile
 * n'affichent chacun une valeur différente (l'ancien mock `data/currentUser`).
 */
export function getUserDisplay(user: User | null | undefined): UserDisplay {
  const firstName = user?.first_name ?? "";
  const lastName = user?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    firstName,
    lastName,
    name: fullName || "Invité",
    initials:
      `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?",
    email: user?.email ?? "",
    avatarUrl: user?.avatar_url ?? undefined,
    bannerUrl: user?.banner_url ?? undefined,
    headline: user?.headline ?? "",
    bio: user?.bio ?? "",
    location: user?.location ?? "",
    phone: user?.phone ?? "",
    website: user?.website ?? "",
    linkedin: user?.linkedin ?? "",
    github: user?.github ?? "",
  };
}
