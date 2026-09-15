// Port du helper Backend `utils/relative-time.ts` : calculé ici plutôt que
// reçu figé du serveur (`timeAgo`/`postedHoursAgo`/`isUpcoming` n'existent
// plus dans les DTO d'offres/publications/entretiens/candidatures) pour ne
// jamais rester périmé entre deux vraies mutations de données — un champ
// précalculé côté serveur ne se rafraîchirait qu'à la prochaine mutation, pas
// au simple écoulement du temps, une fois la réponse mise en cache (ETag).
const MINUTE = 60_000;
const HOUR = 3_600_000;

/** Ancienneté d'une date, formatée en français : « Il y a 3 min » / « Il y a 5 h » / « Il y a 2 j ». */
export function formatRelativeFr(date: string | Date): string {
  const then = new Date(date).getTime();
  const minutes = Math.max(1, Math.round((Date.now() - then) / MINUTE));

  if (minutes < 60) return `Il y a ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;

  const days = Math.round(hours / 24);
  return `Il y a ${days} j`;
}

/** Nombre d'heures écoulées depuis `date`, borné à `[1, max]` — sert au tri des offres. */
export function hoursSince(date: string | Date, max = 168): number {
  const then = new Date(date).getTime();
  return Math.max(1, Math.min(max, Math.round((Date.now() - then) / HOUR)));
}

/** `true` si `date` est dans le futur. */
export function isUpcoming(date: string | Date): boolean {
  return new Date(date).getTime() > Date.now();
}
