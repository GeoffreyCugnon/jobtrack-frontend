import { Fragment } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Plus } from "@phosphor-icons/react";

import { SideMenu } from "../components/SideMenu/SideMenu";
import { MessagingFab } from "../components/Messaging/MessagingFab";
import { MessagingPanel } from "../components/Messaging/MessagingPanel";
import { MenuProvider } from "../context/Menu/MenuContext";
import { useMenu } from "../context/Menu/useMenu";
import { MessagingProvider } from "../context/Messaging/MessagingContext";
import { useSwipeGestures } from "../hooks/useSwipeGestures";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";
import { getMainNavItems, isNavItemActive } from "../constants/nav";
import { useAuthStore } from "../store/auth.store";
import { GuestHome } from "./GuestHome";

function RootContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMenuOpen, closeMenu } = useMenu();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navItems = getMainNavItems(isAuthenticated);
  useSwipeGestures();

  // Barre du bas mobile : "Documents" reste accessible via le SideMenu, on
  // libère un créneau pour un bouton central "Publier".
  const bottomNavItems = navItems.filter((item) => item.path !== "/documents");
  const publishIndex = isAuthenticated
    ? Math.floor(bottomNavItems.length / 2)
    : -1;

  const handlePublish = () => navigate("/publications/create");

  const guestHomeView =
    !isAuthenticated &&
    (location.pathname === "/" || location.pathname === "/dashboard");
  // Vue complète offres/publications en invité (atteinte depuis les liens
  // "Voir tout" de `GuestHome`) : pas de nav du bas non plus, remplacée par
  // le "←" du header pour revenir à l'accueil invité.
  const guestFullListView =
    !isAuthenticated &&
    (location.pathname === "/offers" || location.pathname === "/publications");
  const hideBottomNav = guestHomeView || guestFullListView;

  return (
    <>
      <SideMenu open={isMenuOpen} onClose={closeMenu} />
      <MessagingPanel />

      <div className="h-screen flex flex-col">
        <div
          className={`flex-1 flex flex-col overflow-y-auto bg-base-200 w-full min-h-0 ${
            hideBottomNav ? "" : "pb-16 lg:pb-0"
          }`}
        >
          {guestHomeView ? <GuestHome /> : <Outlet />}
        </div>

        {!isAuthenticated ? null : <MessagingFab />}

        {/* Accueil invité : pas de nav du bas, remplacée par le CTA de
            création de compte collé au bas de `GuestHome`. Idem sur les vues
            complètes offres/publications en invité (`guestFullListView`). */}
        {!hideBottomNav && (
          <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 px-2 py-3 z-40"
            style={{ height: BOTTOM_NAV_HEIGHT }}
          >
            <div className="max-w-5xl mx-auto h-full">
              <div
                className={`flex items-center h-full ${
                  isAuthenticated ? "justify-around" : "justify-center gap-12"
                }`}
              >
                {bottomNavItems.map(({ path, icon: Icon, shortLabel }, index) => (
                  <Fragment key={path}>
                    {index === publishIndex && (
                      <button
                        type="button"
                        onClick={handlePublish}
                        aria-label="Publier"
                        className="group flex flex-col items-center gap-1 px-3 py-2 rounded-field transition-colors text-base-content/50 hover:text-base-content/80"
                      >
                        {/* "+" inversé : carré gris, glyphe couleur du fond (blanc
                            en clair). Reste calé sur les icônes voisines (w-5 h-5). */}
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-base-content/50 text-base-100 transition-colors group-hover:bg-base-content/80">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs">Publier</span>
                      </button>
                    )}
                    <Link
                      to={path}
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-field transition-colors ${
                        isNavItemActive(location.pathname, path)
                          ? "text-link bg-primary/10 font-medium"
                          : "text-base-content/50 hover:text-base-content/80"
                      }`}
                    >
                      {/* w-6 (24px) : les glyphes `fill` ont une marge interne,
                          à cette taille leur masse visuelle égale le carré 20px
                          plein de « Publier ». */}
                      <Icon className="w-6 h-6" weight="fill" />
                      <span className="text-xs">{shortLabel}</span>
                    </Link>
                  </Fragment>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}

export function Root() {
  return (
    <MenuProvider>
      <MessagingProvider>
        <RootContent />
      </MessagingProvider>
    </MenuProvider>
  );
}
