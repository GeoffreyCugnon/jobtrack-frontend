import { useLocation, useNavigate } from "react-router";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  Megaphone,
  BarChart3,
  User,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { MenuOverlay } from "./MenuOverlay";
import { MenuHeader } from "./MenuHeader";
import { MenuSection } from "./MenuSection";
import { MenuLink } from "./MenuLink";
import { ThemeToggle } from "../UI/ThemeToggle";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

// Routes accessibles depuis la bottom nav : sur ces pages, "Retour" n'a pas
// de sens (on est déjà à la racine de la navigation principale).
const MAIN_ROUTES = [
  "/app",
  "/app/offers",
  "/app/network",
  "/app/documents",
  "/app/posts",
];

export function SideMenu({ open, onClose }: SideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isMainRoute = MAIN_ROUTES.some((path) =>
    path === "/app"
      ? location.pathname === "/app"
      : location.pathname.startsWith(path)
  );

  const mainLinks = [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/offers", label: "Offres", icon: Briefcase },
    { to: "/app/network", label: "Relations", icon: Users },
    { to: "/app/documents", label: "Documents", icon: FileText },
    { to: "/app/profile", label: "Profil", icon: User },
  ];

  const secondaryLinks = [
    { to: "/app/posts", label: "Posts & veille", icon: Megaphone },
    { to: "/app/statistics", label: "Statistiques", icon: BarChart3 },
  ];

  return (
    <>
      <MenuOverlay open={open} onClose={onClose} />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-base-100 border-r border-base-content/10 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MenuHeader
          name="UserName"
          email="exemple@email.fr"
          onClose={onClose}
        />

        <div className="flex h-[calc(100%-88px)] flex-col justify-between overflow-y-auto">
          <div>
            {!isMainRoute && (
              <ul className="menu menu-vertical w-full border-b border-base-content/10">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(-1);
                    }}
                    className="text-base-content"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                </li>
              </ul>
            )}
            <MenuSection links={mainLinks} onLinkClick={onClose} />
            <MenuSection links={secondaryLinks} onLinkClick={onClose} />
          </div>

          <ul className="menu menu-vertical w-full py-4">
            <ThemeToggle />
            <MenuLink
              to="/app/settings"
              label="Paramètres"
              onClick={onClose}
              icon={Settings}
            />
            <MenuLink
              to="/"
              label="Déconnexion"
              onClick={onClose}
              variant="danger"
              icon={LogOut}
            />
          </ul>
        </div>
      </aside>
    </>
  );
}
