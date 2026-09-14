/**
 * `staleTime`/`gcTime` non couverts par les défauts globaux (`main.tsx` :
 * 30 s / 5 min), par type de donnée. Centralisé ici plutôt que répété à
 * chaque `useQuery` : plusieurs clés (`connections.all`, `company.mineAll`,
 * `skills.mine`...) sont interrogées depuis plusieurs pages, et dupliquer la
 * même valeur + le même commentaire à chaque site finirait par diverger
 * silencieusement dans le temps.
 *
 * Rien ici pour `queryKeys.jobCategories` (1 h en dur dans
 * `hooks/useJobCategories.ts`, seul call site) ni pour `queryKeys.messaging`
 * (piloté par invalidation WebSocket, pas par staleTime — cf.
 * `MessagingContext.tsx`).
 */
const MINUTE = 60_000;

export const staleTimeByCategory = {
  /** Entreprise éditée uniquement via son propre formulaire dédié
   *  (`EditCompany`), jamais en arrière-plan — change rarement. */
  company: 10 * MINUTE,
  /** Compétences éditées via une seule page dédiée (`ProfileSkillsEdit`). */
  skills: 10 * MINUTE,
  /** Relations réseau : les mutations (accepter/retirer, cf. `Network.tsx`)
   *  invalident déjà explicitement `connections.all` au succès — un
   *  staleTime plus long ne retarde que le refetch "passif" au remontage
   *  d'une page, jamais l'effet d'une action utilisateur. */
  connections: 5 * MINUTE,
  /** Profil d'un tiers consulté depuis `Network`/`MemberProfile` — change
   *  peu souvent en dehors de son propre profil (pas de notion de "mise à
   *  jour poussée" ici, contrairement à la messagerie). */
  userDetail: 5 * MINUTE,
  /** Stats agrégées du Dashboard (candidatures/entretiens) — fraîcheur
   *  raisonnable sans refetch à chaque remontage de la page d'accueil. */
  dashboardStats: 5 * MINUTE,
} as const;

/**
 * Pages détail atteintes en aller-retour depuis une liste (offre, profil
 * membre, entreprise, publication, candidature, entretien, document) :
 * `gcTime` augmenté pour un retour arrière instantané sur réseau moyen au
 * lieu d'un spinner. `staleTime` volontairement inchangé pour la plupart
 * (défaut global 30 s) — ces données bougent normalement (statut de
 * candidature, nouveaux commentaires...), seule la durée de rétention en
 * cache change.
 */
export const DETAIL_PAGE_GC_TIME = 15 * MINUTE;
