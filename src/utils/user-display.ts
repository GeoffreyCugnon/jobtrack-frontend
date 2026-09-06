import type { User } from "../types/user.type";

export type UserDisplay = {
  firstName: string;
  lastName: string;
  /** "Prénom Nom", ou "Invité" si personne n'est connecté. */
  name: string;
  /** Initiales en majuscules, ou "?" en repli. */
  initials: string;
  email: string;
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
  };
}
