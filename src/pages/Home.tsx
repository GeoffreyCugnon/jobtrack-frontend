import { Link, useLocation } from "react-router";
import { Briefcase, Home as HomeIcon, LogIn } from "lucide-react";
import { Publications } from "./Publications/Publications";
import { useAuthStore } from "../store/auth.store";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";
import { isNavItemActive } from "../constants/nav";

const GUEST_HOME_NAV_ITEMS = [
  { path: "/", icon: HomeIcon, label: "Accueil", shortLabel: "Accueil" },
  {
    path: "/app/offers",
    icon: Briefcase,
    label: "Offres",
    shortLabel: "Offres",
  },
];

export function Home() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="relative min-h-screen pb-20">
          <Publications />
        </div>

        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-300 px-2 py-3 shadow-lg z-40"
          style={{ height: BOTTOM_NAV_HEIGHT }}
        >
          <div className="max-w-5xl mx-auto h-full">
            <div className="flex justify-around items-center h-full">
              {GUEST_HOME_NAV_ITEMS.map(({ path, icon: Icon, shortLabel }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-field transition-colors ${
                    isNavItemActive(location.pathname, path)
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-base-content/50 hover:text-base-content/80"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{shortLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Publications />
      <div className="fixed top-4 right-4 z-50">
        <Link
          to="/app/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-content shadow-lg transition-opacity hover:opacity-90"
        >
          <LogIn className="h-4 w-4" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
