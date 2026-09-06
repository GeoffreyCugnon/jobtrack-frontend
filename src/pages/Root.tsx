import { Fragment } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Plus } from "lucide-react";
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
import { useToastStore } from "../store/toast.store";
import { Publications } from "./Publications/Publications";

function RootContent() {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useMenu();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navItems = getMainNavItems(isAuthenticated);
  useSwipeGestures();

  // Barre du bas mobile : "Documents" reste accessible via le SideMenu, on
  // libère un créneau pour un bouton central "Publier" (placeholder).
  const bottomNavItems = navItems.filter((item) => item.path !== "/documents");
  const publishIndex = isAuthenticated
    ? Math.floor(bottomNavItems.length / 2)
    : -1;

  const handlePublish = () => {
    // TODO: ouvrir la création de publication
    useToastStore
      .getState()
      .addToast("Publier : bientôt disponible", "info");
  };

  const guestHomeView =
    !isAuthenticated &&
    (location.pathname === "/" || location.pathname === "/dashboard");

  return (
    <>
      <SideMenu open={isMenuOpen} onClose={closeMenu} />
      <MessagingPanel />

      <div className="h-screen flex flex-col">
        <div className="flex-1 flex flex-col overflow-y-auto bg-base-200 w-full pb-16 lg:pb-0 min-h-0">
          {guestHomeView ? <Publications /> : <Outlet />}
        </div>

        {!isAuthenticated ? null : <MessagingFab />}

        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-300 px-2 py-3 shadow-lg z-40"
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
                      className="flex flex-col items-center gap-1 px-2 text-base-content/50 hover:text-base-content/80 transition-colors"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-content shadow-md">
                        <Plus className="h-6 w-6" />
                      </span>
                      <span className="text-xs">Publier</span>
                    </button>
                  )}
                  <Link
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
                </Fragment>
              ))}
            </div>
          </div>
        </nav>
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
