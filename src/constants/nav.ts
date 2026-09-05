// src/constants/nav.ts
import {
  Home,
  Briefcase,
  Users,
  FileText,
  LayoutDashboard,
} from "lucide-react";

export const MAIN_NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Accueil", shortLabel: "Accueil" },
  {
    path: "/app/offers",
    icon: Briefcase,
    label: "Offres",
    shortLabel: "Offres",
  },
  { path: "/app/network", icon: Users, label: "Réseau", shortLabel: "Réseau" },
  {
    path: "/app/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    shortLabel: "Dashboard",
  },
  {
    path: "/app/documents",
    icon: FileText,
    label: "Documents",
    shortLabel: "Docs",
  },
];

export const GUEST_NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Accueil", shortLabel: "Accueil" },
  {
    path: "/app/offers",
    icon: Briefcase,
    label: "Offres",
    shortLabel: "Offres",
  },
  {
    path: "/app/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    shortLabel: "Dashboard",
  },
];

export function isNavItemActive(pathname: string, path: string) {
  return path === "/app"
    ? pathname === "/app" || pathname === "/app/dashboard"
    : pathname.startsWith(path);
}

export function getMainNavItems(isAuthenticated: boolean) {
  return isAuthenticated ? MAIN_NAV_ITEMS : GUEST_NAV_ITEMS;
}
