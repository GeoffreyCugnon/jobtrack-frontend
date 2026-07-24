import { Outlet, Link, useLocation } from "react-router";
import { SideMenu } from "../components/SideMenu";
import { MessagingFab } from "../components/Messaging/MessagingFab";
import { MessagingPanel } from "../components/Messaging";
import { MenuProvider } from "../context/Menu/MenuContext";
import { useMenu } from "../context/Menu/useMenu";
import { MessagingProvider } from "../context/Messaging/MessagingContext";
import { useMessaging } from "../context/Messaging/useMessaging";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";
import { MAIN_NAV_ITEMS, isNavItemActive } from "../constants/nav";

function RootContent() {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useMenu();
  const { isMessagingOpen, closeMessaging } = useMessaging();

  return (
    <>
      <SideMenu open={isMenuOpen} onClose={closeMenu} />
      <MessagingPanel open={isMessagingOpen} onClose={closeMessaging} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col overflow-y-auto bg-base-200 w-full pb-16 lg:pb-0">
          <Outlet />
        </div>

        <MessagingFab unreadCount={3} hidden={isMessagingOpen} />

        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-300 px-2 py-3 shadow-lg z-40"
          style={{ height: BOTTOM_NAV_HEIGHT }}
        >
          <div className="max-w-5xl mx-auto h-full">
            <div className="flex items-center h-full">
              <div className="flex-1 flex justify-around items-center">
                {MAIN_NAV_ITEMS.map(({ path, icon: Icon, shortLabel }) => (
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
              <div className="w-14 shrink-0" aria-hidden="true" />
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
