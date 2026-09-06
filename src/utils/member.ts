import type { User } from "../types/user.type";

// Le modèle `User` ne porte pas d'intitulé de poste : on en dérive un de
// démo, déterministe par utilisateur, pour que la carte réseau et la fiche
// affichent la même chose.
const HEADLINES = [
  "Talent Acquisition Partner",
  "Référent·e recrutement",
  "IT Recruiter",
  "Chargé·e de recrutement",
  "Assistant·e RH",
  "Responsable talent",
  "Tech Recruiter",
  "People & Culture",
];

export function memberName(user: Pick<User, "first_name" | "last_name" | "email">): string {
  return (
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email
  );
}

export function memberInitials(
  user: Pick<User, "first_name" | "last_name">,
): string {
  return (
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?"
  );
}

export function memberHeadline(user: Pick<User, "id">, fallbackIndex = 0): string {
  return HEADLINES[(Number(user.id) || fallbackIndex) % HEADLINES.length];
}
