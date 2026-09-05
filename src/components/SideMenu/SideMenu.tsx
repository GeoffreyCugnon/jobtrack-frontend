import { useLocation, useNavigate } from "react-router";
import {
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
import { getMainNavItems, isNavItemActive } from "../../constants/nav";
import { currentUser } from "../../data/currentUser";
import { useAuthStore } from "../../store/auth.store";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const mainNavItems = getMainNavItems(isAuthenticated);

  const MAIN_ROUTES = mainNavItems.map((item) => item.path);
  const isMainRoute = MAIN_ROUTES.some((path) =>
    isNavItemActive(location.pathname, path),
  );

  const mainLinks = isAuthenticated
    ? [
        ...mainNavItems
          .filter((item) => item.path !== "/app/dashboard")
          .map(({ path, label, icon }) => ({ to: path, label, icon })),
        { to: "/app/profile", label: "Profil", icon: User },
      ]
    : mainNavItems.map(({ path, label, icon }) => ({ to: path, label, icon }));

  const secondaryLinks = isAuthenticated
    ? [
        { to: "/app/publications", label: "Actus", icon: Megaphone },
        { to: "/app/statistics", label: "Statistiques", icon: BarChart3 },
      ]
    : [];

  return (
    <>
      <MenuOverlay open={open} onClose={onClose} />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-base-100 border-r border-base-content/10 shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MenuHeader
          name={currentUser.name}
          email={currentUser.email}
          initials={currentUser.initials}
          onClose={onClose}
        />

        <div className="flex-1 flex flex-col overflow-y-auto">
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
          {secondaryLinks.length > 0 && (
            <MenuSection
              links={secondaryLinks}
              onLinkClick={onClose}
              title="Suivi"
            />
          )}

          {isAuthenticated && (
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
          )}
        </div>
      </aside>
    </>
  );
}
