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

// --- Raisons de suggestion (démo, déterministes par utilisateur) ---
// Le Backend n'expose pas encore de graphe de relations : ces libellés
// donnent un contexte plausible et stable à chaque carte de la page Réseau.

const SUGGESTION_COMPANIES = [
  "Doctolib",
  "Alan",
  "Qonto",
  "Back Market",
  "Payfit",
  "Swile",
  "ManoMano",
  "Datadog",
];

const SUGGESTION_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Product Design",
  "UX Research",
  "Data",
  "Growth",
  "SEO",
  "Management",
  "GraphQL",
];

function seed(user: Pick<User, "id">, fallback = 0): number {
  return Number(user.id) || fallback;
}

/** Nombre de relations en commun (2 à 12). */
export function memberMutualCount(user: Pick<User, "id">): number {
  return (seed(user, 1) * 7) % 11 + 2;
}

/** Entreprise / page suivie en commun. */
export function memberSharedCompany(user: Pick<User, "id">): string {
  return SUGGESTION_COMPANIES[seed(user) % SUGGESTION_COMPANIES.length];
}

/** Compétences partagées (2 par défaut). */
export function memberSharedSkills(user: Pick<User, "id">, count = 2): string[] {
  const start = seed(user) % SUGGESTION_SKILLS.length;
  return Array.from(
    { length: count },
    (_, k) => SUGGESTION_SKILLS[(start + k) % SUGGESTION_SKILLS.length],
  );
}
