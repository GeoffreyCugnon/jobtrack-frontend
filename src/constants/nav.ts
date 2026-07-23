// src/constants/nav.ts
import { Home, Briefcase, Users, FileText, Megaphone } from "lucide-react";

export const MAIN_NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Dashboard", shortLabel: "Dashb." },
  { path: "/app/offers", icon: Briefcase, label: "Offres", shortLabel: "Offres" },
  { path: "/app/network", icon: Users, label: "Relations", shortLabel: "Relat." },
  { path: "/app/documents", icon: FileText, label: "Documents", shortLabel: "Docs" },
  { path: "/app/posts", icon: Megaphone, label: "Publications", shortLabel: "Publis." },
];

export function isNavItemActive(pathname: string, path: string) {
  return path === "/app" ? pathname === "/app" : pathname.startsWith(path);
}
