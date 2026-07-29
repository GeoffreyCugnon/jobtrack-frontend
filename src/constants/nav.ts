// src/constants/nav.ts
import { Home, Briefcase, Users, FileText, Megaphone } from "lucide-react";

export const MAIN_NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Accueil", shortLabel: "Accueil" },
  { path: "/app/offers", icon: Briefcase, label: "Offres", shortLabel: "Offres" },
  { path: "/app/network", icon: Users, label: "Réseau", shortLabel: "Réseau" },
  { path: "/app/posts", icon: Megaphone, label: "Actus", shortLabel: "Actus" },
  { path: "/app/documents", icon: FileText, label: "Documents", shortLabel: "Docs" },
];

export function isNavItemActive(pathname: string, path: string) {
  return path === "/app" ? pathname === "/app" : pathname.startsWith(path);
}
