// Ligne « motivation » du hero du Dashboard.
//
// Stratégie : d'abord une phrase *contextuelle* si le tableau de bord a quelque
// chose de saillant à dire (relance du jour, entretien à venir, nouveautés,
// aucune candidature…) ; sinon une citation tirée au sort dans `MOTIVATION_LINES`
// (jamais deux fois la même d'affilée). Pas de lib ni d'API : liste locale curée,
// FR, orientée recherche d'emploi, ton aligné sur la copie existante (vouvoiement).

const MOTIVATION_KEY = "dashboard-motivation-idx";

/** Encouragements « maison » + quelques citations. La 1re sert aussi de défaut. */
export const MOTIVATION_LINES: readonly string[] = [
  "Continuez sur cette lancée, chaque candidature vous rapproche du bon poste.",
  "Une candidature envoyée aujourd'hui, c'est une porte de plus qui peut s'ouvrir.",
  "Le bon poste n'attend pas la candidature parfaite — juste la prochaine.",
  "Relancer, c'est montrer que le poste compte vraiment pour vous.",
  "Chaque refus vous rapproche statistiquement du oui. Continuez.",
  "Postuler régulièrement bat postuler beaucoup, une seule fois.",
  "Un entretien préparé, c'est déjà la moitié du chemin.",
  "Votre prochaine opportunité est peut-être dans les offres du jour.",
  "Cinq minutes suffisent : une relance, un message, une candidature.",
  "Le marché caché passe par les gens — pensez à activer votre réseau.",
  "Soignez la première ligne : c'est souvent tout ce qu'un recruteur lit.",
  "Ajustez, testez, recommencez : une candidature est un brouillon qu'on affine.",
  "Ce n'est pas le temps passé qui paie, c'est la régularité.",
  "Un non aujourd'hui n'engage pas le recruteur de demain.",
  "Chercher un poste, c'est un projet à piloter, pas une attente.",
  "Gardez une trace de tout : les relances oubliées coûtent des postes.",
  "« La chance, c'est la rencontre du talent et de l'opportunité. » — Sénèque",
  "« Cela semble toujours impossible, jusqu'à ce qu'on le fasse. » — Nelson Mandela",
  "« Le succès, c'est aller d'échec en échec sans perdre son enthousiasme. » — Winston Churchill",
  "« Le génie, c'est 1 % d'inspiration et 99 % de transpiration. » — Thomas Edison",
  "« La meilleure façon de commencer, c'est d'arrêter d'en parler et de s'y mettre. » — Walt Disney",
  "« Choisissez un travail que vous aimez et vous n'aurez pas à travailler un seul jour de votre vie. » — Confucius",
  "« Ce n'est pas parce que les choses sont difficiles que nous n'osons pas ; c'est parce que nous n'osons pas qu'elles sont difficiles. » — Sénèque",
  "« Le talent, c'est d'avoir envie de faire quelque chose. » — Jacques Brel",
];

/** Défaut hors contexte (composant monté sans données). */
export const DEFAULT_MOTIVATION = MOTIVATION_LINES[0];

export interface MotivationContext {
  /** Relances à faire aujourd'hui (tâches `type: "relance"`, `dueCategory: "today"`). */
  todayRelances: number;
  /** Entretiens listés dans « Prochaines actions » (tâches `type: "entretien"`). */
  upcomingInterviews: number;
  /** Entretiens planifiés (stat « Entretiens prévus »). */
  scheduledInterviews: number;
  /** Événements pas encore vus dans « Derniers événements ». */
  newEvents: number;
  /** Candidatures actives (stat). */
  activeApplications: number;
}

const s = (n: number): string => (n > 1 ? "s" : "");

/**
 * Phrase déduite du contexte, ou `null` si rien de saillant (→ citation
 * aléatoire). Ordre de priorité : action urgente > préparation > nouveautés >
 * relance d'activité.
 */
export function contextualMotivation(c: MotivationContext): string | null {
  if (c.todayRelances >= 1) {
    return c.todayRelances === 1
      ? "Une relance vous attend aujourd'hui — c'est le moment de la faire."
      : `${c.todayRelances} relances vous attendent aujourd'hui — commencez par la plus importante.`;
  }

  const interviews = Math.max(c.upcomingInterviews, c.scheduledInterviews);
  if (interviews >= 1) {
    return `${interviews} entretien${s(interviews)} en vue — prenez dix minutes pour préparer vos exemples.`;
  }

  if (c.newEvents >= 1) {
    return `${c.newEvents} nouveauté${s(c.newEvents)} depuis votre dernière visite — jetez un œil aux derniers événements.`;
  }

  if (c.activeApplications === 0) {
    return "Aucune candidature en cours — et si vous en lanciez une aujourd'hui ?";
  }

  if (c.activeApplications >= 10) {
    return `${c.activeApplications} candidatures actives : vous couvrez du terrain, gardez le rythme.`;
  }

  return null;
}

/** Citation aléatoire, jamais identique à la précédente (mémoire de session). */
export function randomMotivation(): string {
  const n = MOTIVATION_LINES.length;

  let last = -1;
  try {
    last = Number(sessionStorage.getItem(MOTIVATION_KEY));
  } catch {
    /* mode privé / storage indisponible */
  }

  let i = Math.floor(Math.random() * n);
  if (n > 1 && i === last) {
    i = (i + 1) % n;
  }

  try {
    sessionStorage.setItem(MOTIVATION_KEY, String(i));
  } catch {
    /* noop */
  }

  return MOTIVATION_LINES[i];
}

/** Contextuel si pertinent, sinon citation aléatoire. */
export function pickMotivation(c: MotivationContext): string {
  return contextualMotivation(c) ?? randomMotivation();
}
