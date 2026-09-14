import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Buildings, Gear, SignOut } from "@phosphor-icons/react";

import { MenuOverlay } from "./MenuOverlay";
import { MenuHeader } from "./MenuHeader";
import { MenuSection } from "./MenuSection";
import { MenuLink } from "./MenuLink";
import { ThemeToggle } from "../UI/ThemeToggle";
import { getMainNavItems, isNavItemActive } from "../../constants/nav";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { AuthApi } from "../../api/auth.api";
import { CompanyApi } from "../../api/company.api";
import { queryKeys } from "../../api/query-keys";
import { staleTimeByCategory } from "../../api/query-cache";
import { getUserDisplay } from "../../utils/user-display";
import { POST_LOGOUT_KEY } from "../../constants/auth";
import { logError } from "../../utils/log";

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

  // Détermine si l'entrée du menu pointe vers la création ou vers la liste
  // des entreprises déjà gérées par l'utilisateur (un `Employment` par
  // entreprise).
  const { data: myCompanies } = useQuery({
    queryKey: queryKeys.company.mineAll,
    queryFn: () => CompanyApi.getMineAll(),
    enabled: isAuthenticated,
    staleTime: staleTimeByCategory.company,
  });
  const companyCount = myCompanies?.length ?? 0;

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
  // "Documents" est descendu sous le trait avec les actions secondaires
  // (voir `secondaryLinks`) plutôt que dans le groupe de nav principal.
  const documentsNavItem = mainNavItems.find(
    (item) => item.path === "/documents",
  );
  const mainLinks = mainNavItems
    .filter((item) => item !== documentsNavItem)
    .map(({ path, label, icon }) => ({ to: path, label, icon }));

  const secondaryLinks = [
    {
      to: companyCount > 0 ? "/company" : "/company/create",
      label:
        companyCount > 1
          ? "Vos entreprises"
          : companyCount === 1
            ? "Votre entreprise"
            : "Créer une entreprise",
      icon: Buildings,
    },
    ...(documentsNavItem
      ? [
          {
            to: documentsNavItem.path,
            label: documentsNavItem.label,
            icon: documentsNavItem.icon,
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
    } catch (error) {
      logError("auth/logout", error);
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
            <MenuSection links={secondaryLinks} onLinkClick={onClose} />
          )}
          {isAuthenticated && (
            <ul className="menu menu-vertical w-full py-4">
              <ThemeToggle />
              <MenuLink
                to="/settings"
                label="Paramètres"
                onClick={onClose}
                icon={Gear}
              />
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10 w-full text-left"
                >
                  <SignOut className="w-4 h-4" />
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
