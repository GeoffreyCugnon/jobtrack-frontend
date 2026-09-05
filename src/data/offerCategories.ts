import {
  Building2,
  Home,
  Headphones,
  GraduationCap,
  ConciergeBell,
  Clock,
  ShoppingBag,
  Truck,
  HeartPulse,
  Factory,
  Megaphone,
  PiggyBank,
  Laptop,
  type LucideIcon,
} from "lucide-react";

export interface OfferCategory {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

export const offerCategories: OfferCategory[] = [
  {
    key: "distance",
    label: "À distance",
    description: "Travaillez entièrement à distance, sans contrainte de site.",
    icon: Laptop,
    colorClass: "bg-sky-500",
  },
  {
    key: "hybride",
    label: "Hybride",
    description:
      "Un équilibre entre présentiel et télétravail, où que vous soyez.",
    icon: Home,
    colorClass: "bg-rose-400",
  },
  {
    key: "informatique",
    label: "Informatique",
    description:
      "Développement, support et infrastructure pour les équipes tech.",
    icon: Headphones,
    colorClass: "bg-violet-500",
  },
  {
    key: "enseignement",
    label: "Enseignement",
    description:
      "Former et transmettre, du primaire à l'enseignement supérieur.",
    icon: GraduationCap,
    colorClass: "bg-blue-500",
  },
  {
    key: "hotellerie",
    label: "Hôtellerie",
    description:
      "Accueil, restauration et service dans l'hôtellerie-restauration.",
    icon: ConciergeBell,
    colorClass: "bg-zinc-400",
  },
  {
    key: "administration",
    label: "Administration publique",
    description:
      "Des postes au service de l'intérêt général, dans les collectivités et l'État.",
    icon: Building2,
    colorClass: "bg-slate-500",
  },
  {
    key: "temps-partiel",
    label: "Temps partiel",
    description: "Des missions flexibles, adaptées à votre emploi du temps.",
    icon: Clock,
    colorClass: "bg-amber-500",
  },
  {
    key: "commerce",
    label: "Commerce",
    description: "Vente, conseil et relation client en magasin ou à distance.",
    icon: ShoppingBag,
    colorClass: "bg-teal-500",
  },
  {
    key: "transport",
    label: "Transport & Logistique",
    description: "Acheminer, organiser et optimiser les flux de marchandises.",
    icon: Truck,
    colorClass: "bg-cyan-500",
  },
  {
    key: "sante",
    label: "Santé",
    description: "Prendre soin des patients, en établissement ou à domicile.",
    icon: HeartPulse,
    colorClass: "bg-red-500",
  },
  {
    key: "industrie",
    label: "Industrie",
    description: "Fabrication, maintenance et production sur site industriel.",
    icon: Factory,
    colorClass: "bg-stone-500",
  },
  {
    key: "marketing",
    label: "Marketing & Communication",
    description: "Faire connaître une marque et parler à ses clients.",
    icon: Megaphone,
    colorClass: "bg-fuchsia-500",
  },
  {
    key: "finance",
    label: "Finance",
    description: "Gérer, analyser et sécuriser les flux financiers.",
    icon: PiggyBank,
    colorClass: "bg-emerald-500",
  },
];

export interface CategoryOffer {
  id: number;
  role: string;
  company: string;
  location: string;
  timeAgo: string;
  postedHoursAgo: number;
  category: string;
  workMode?: "onSite" | "Remote" | "Hybrid";
  applicantCount?: number;
  verified?: boolean;
}
