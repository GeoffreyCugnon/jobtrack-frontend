import {
  BellRingingIcon,
  BriefcaseIcon,
  BuildingsIcon,
  ClockIcon,
  FactoryIcon,
  GraduationCapIcon,
  HeadphonesIcon,
  HeartbeatIcon,
  HouseIcon,
  LaptopIcon,
  MegaphoneIcon,
  PiggyBankIcon,
  ShoppingBagIcon,
  TruckIcon,
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
  distance: { icon: LaptopIcon, colorClass: "bg-sky-500" },
  hybride: { icon: HouseIcon, colorClass: "bg-rose-400" },
  informatique: { icon: HeadphonesIcon, colorClass: "bg-violet-500" },
  enseignement: { icon: GraduationCapIcon, colorClass: "bg-blue-500" },
  hotellerie: { icon: BellRingingIcon, colorClass: "bg-zinc-400" },
  administration: { icon: BuildingsIcon, colorClass: "bg-slate-500" },
  "temps-partiel": { icon: ClockIcon, colorClass: "bg-amber-500" },
  commerce: { icon: ShoppingBagIcon, colorClass: "bg-teal-500" },
  transport: { icon: TruckIcon, colorClass: "bg-cyan-500" },
  sante: { icon: HeartbeatIcon, colorClass: "bg-red-500" },
  industrie: { icon: FactoryIcon, colorClass: "bg-stone-500" },
  marketing: { icon: MegaphoneIcon, colorClass: "bg-fuchsia-500" },
  finance: { icon: PiggyBankIcon, colorClass: "bg-emerald-500" },
};

const FALLBACK_STYLE: CategoryStyle = {
  icon: BriefcaseIcon,
  colorClass: "bg-base-300",
};

/** Habillage d'une catégorie ; repli neutre si la `key` est inconnue. */
export function getCategoryStyle(key: string): CategoryStyle {
  return STYLE_BY_KEY[key] ?? FALLBACK_STYLE;
}
