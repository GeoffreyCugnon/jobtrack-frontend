import { useLocation, useNavigate } from "react-router";
import { Settings, LogOut, ArrowLeft } from "@/lib/icons";
import { MenuOverlay } from "./MenuOverlay";
import { MenuHeader } from "./MenuHeader";
import { MenuSection } from "./MenuSection";
import { MenuLink } from "./MenuLink";
import { ThemeToggle } from "../UI/ThemeToggle";
import { getMainNavItems, isNavItemActive } from "../../constants/nav";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { AuthApi } from "../../api/auth.api";
import { getUserDisplay } from "../../utils/user-display";
import { POST_LOGOUT_KEY } from "../../constants/auth";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const mainNavItems = getMainNavItems(isAuthenticated);

  const {
    name: displayName,
    email: displayEmail,
    initials: displayInitials,
    avatarUrl: displayAvatarUrl,
  } = getUserDisplay(user);

  const MAIN_ROUTES = mainNavItems.map((item) => item.path);
  const isMainRoute = MAIN_ROUTES.some((path) =>
    isNavItemActive(location.pathname, path),
  );

  // "Profil" n'est plus un lien de liste : l'en-tête du menu (identité +
  // chevron) est devenu le point d'entrée vers le profil.
  const mainLinks = mainNavItems.map(({ path, label, icon }) => ({
    to: path,
    label,
    icon,
  }));

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      useAuthStore.getState().clearAuth();
      useToastStore.getState().addToast("Déconnexion réussie", "success");
      try {
        sessionStorage.setItem(POST_LOGOUT_KEY, String(Date.now()));
      } catch {
        // sessionStorage indisponible : on perd juste la temporisation.
      }
      onClose();
      navigate("/auth");
    }
  };

  return (
    <>
      <MenuOverlay open={open} onClose={onClose} />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-base-100 border-r border-base-content/10 shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MenuHeader
          name={displayName}
          email={displayEmail}
          initials={displayInitials}
          avatarUrl={displayAvatarUrl}
          profileHref={isAuthenticated ? "/profile" : undefined}
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
          {isAuthenticated && (
            <ul className="menu menu-vertical w-full py-4">
              <ThemeToggle />
              <MenuLink
                to="/settings"
                label="Paramètres"
                onClick={onClose}
                icon={Settings}
              />
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </li>
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
