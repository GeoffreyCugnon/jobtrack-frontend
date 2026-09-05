import { Outlet, Link, useLocation } from "react-router";
import { MessageCircle } from "lucide-react";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { MessagingFab } from "../components/Messaging/MessagingFab";
import { MessagingPanel } from "../components/Messaging/MessagingPanel";
import { MenuProvider } from "../context/Menu/MenuContext";
import { useMenu } from "../context/Menu/useMenu";
import { MessagingProvider } from "../context/Messaging/MessagingContext";
import { useMessaging } from "../context/Messaging/useMessaging";
import { useSwipeGestures } from "../hooks/useSwipeGestures";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";
import { getMainNavItems, isNavItemActive } from "../constants/nav";
import { useAuthStore } from "../store/auth.store";
import { Publications } from "./Publications/Publications";

function RootContent() {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useMenu();
  const { openMessaging, unreadConversationIds } = useMessaging();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const unreadCount = unreadConversationIds.length;
  const navItems = getMainNavItems(isAuthenticated);
  useSwipeGestures();

  const guestHomeView =
    !isAuthenticated &&
    (location.pathname === "/app" || location.pathname === "/app/dashboard");

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
            <div className="flex justify-around items-center h-full">
              {navItems.map(({ path, icon: Icon, shortLabel }) => (
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
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={openMessaging}
                  aria-label={
                    unreadCount > 0
                      ? `Messages, ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
                      : "Messages"
                  }
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-field transition-colors text-base-content/50 hover:text-base-content/80"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs">Messages</span>
                </button>
              )}
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
