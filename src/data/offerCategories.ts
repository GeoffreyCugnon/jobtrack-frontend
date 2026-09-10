import {
  BellRinging,
  Briefcase,
  Buildings,
  Clock,
  Factory,
  GraduationCap,
  Headphones,
  Heartbeat,
  House,
  Laptop,
  Megaphone,
  PiggyBank,
  ShoppingBag,
  Truck,
  type Icon as IconType,
} from "@phosphor-icons/react";

/**
 * Habillage (pictogramme + pastille de couleur) d'une catégorie d'offre,
 * indexé par la `key` renvoyée par `GET /job-categories`. La *donnée*
 * (`label`, `description`, `is_work_mode`) vit désormais en base
 * (`Job_category`) ; seul ce qui ne peut pas s'y stocker — un composant React
 * et une classe utilitaire — reste ici.
 *
 * `colorClass` : exception assumée à la règle « tokens DaisyUI uniquement ».
 * Il faut ~13 teintes distinctes que les 5 couleurs sémantiques du thème
 * (`primary`/`secondary`/`accent`/`info`…) ne peuvent pas fournir ; ces
 * classes Tailwind brutes (nuance 400/500 fixe) rendent pareil en
 * clair/sombre, donc pas de casse de thème.
 */
export interface CategoryStyle {
  icon: IconType;
  colorClass: string;
}

const STYLE_BY_KEY: Record<string, CategoryStyle> = {
  distance: { icon: Laptop, colorClass: "bg-sky-500" },
  hybride: { icon: House, colorClass: "bg-rose-400" },
  informatique: { icon: Headphones, colorClass: "bg-violet-500" },
  enseignement: { icon: GraduationCap, colorClass: "bg-blue-500" },
  hotellerie: { icon: BellRinging, colorClass: "bg-zinc-400" },
  administration: { icon: Buildings, colorClass: "bg-slate-500" },
  "temps-partiel": { icon: Clock, colorClass: "bg-amber-500" },
  commerce: { icon: ShoppingBag, colorClass: "bg-teal-500" },
  transport: { icon: Truck, colorClass: "bg-cyan-500" },
  sante: { icon: Heartbeat, colorClass: "bg-red-500" },
  industrie: { icon: Factory, colorClass: "bg-stone-500" },
  marketing: { icon: Megaphone, colorClass: "bg-fuchsia-500" },
  finance: { icon: PiggyBank, colorClass: "bg-emerald-500" },
};

const FALLBACK_STYLE: CategoryStyle = {
  icon: Briefcase,
  colorClass: "bg-base-300",
};

/** Habillage d'une catégorie ; repli neutre si la `key` est inconnue. */
export function getCategoryStyle(key: string): CategoryStyle {
  return STYLE_BY_KEY[key] ?? FALLBACK_STYLE;
}
