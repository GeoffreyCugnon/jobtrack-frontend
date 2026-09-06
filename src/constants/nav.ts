// src/constants/nav.ts
import { Home, Briefcase, Users, FileText, Newspaper } from "@/lib/icons";

// Barre de navigation d'un visiteur non connecté : identique sur l'accueil
// (`/`) et sur les pages accessibles en invité (`/offers`), pour ne pas
// donner l'impression que le contexte change.

export const MAIN_NAV_ITEMS = [
  { path: "/", icon: Home, label: "Accueil", shortLabel: "Accueil" },
  {
    path: "/offers",
    icon: Briefcase,
    label: "Offres",
    shortLabel: "Offres",
  },
  { path: "/network", icon: Users, label: "Réseau", shortLabel: "Réseau" },
  {
    path: "/publications",
    icon: Newspaper,
    label: "Actus",
    shortLabel: "Actus",
  },
  {
    path: "/documents",
    icon: FileText,
    label: "Documents",
    shortLabel: "Docs",
  },
];

export const GUEST_NAV_ITEMS = [
  { path: "/", icon: Home, label: "Accueil", shortLabel: "Accueil" },
  {
    path: "/offers",
    icon: Briefcase,
    label: "Offres",
    shortLabel: "Offres",
  },
];

export function isNavItemActive(pathname: string, path: string) {
  // "Accueil" (`/`) et "Dashboard" (`/dashboard`) rendent le même écran :
  // l'onglet Accueil est actif sur les deux.
  return path === "/"
    ? pathname === "/" || pathname === "/dashboard"
    : pathname.startsWith(path);
}

export function getMainNavItems(isAuthenticated: boolean) {
  return isAuthenticated ? MAIN_NAV_ITEMS : GUEST_NAV_ITEMS;
}
