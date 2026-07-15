import { Outlet, Link, useLocation } from "react-router";
import { Home, Briefcase, Users, FileText, Megaphone } from "lucide-react";
import { SideMenu } from "../components/SideMenu";
import { MessagingFab } from "../components/Message/MessagingFab";
import { MessagingPanel } from "../components/MessagingPanel";
import { MenuProvider } from "../context/MenuContext";
import { useMenu } from "../context/useMenu";
import { MessagingProvider } from "../context/MessagingContext";
import { useMessaging } from "../context/useMessaging";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";

function RootContent() {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useMenu();
  const { isMessagingOpen, closeMessaging } = useMessaging();

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/app", icon: Home, label: "Dashb." },
    { path: "/app/offers", icon: Briefcase, label: "Offres" },
    { path: "/app/network", icon: Users, label: "Relat." },
    { path: "/app/documents", icon: FileText, label: "Docs" },
    { path: "/app/posts", icon: Megaphone, label: "Publis." },
  ];

  return (
    <>
      <SideMenu open={isMenuOpen} onClose={closeMenu} />
      <MessagingPanel open={isMessagingOpen} onClose={closeMessaging} />

      <div className="min-h-screen flex flex-col bg-base-100">
        <div
          className="flex-1 overflow-y-auto bg-base-200 w-full max-w-5xl mx-auto border-x border-base-content/10"
          style={{ paddingBottom: BOTTOM_NAV_HEIGHT }}
        >
          <Outlet />
        </div>

        <MessagingFab unreadCount={3} hidden={isMessagingOpen} />

        <nav
          className="fixed bottom-0 left-0 right-0 bg-base-100 z-40"
          style={{ height: BOTTOM_NAV_HEIGHT }}
        >
          <div className="max-w-5xl mx-auto h-full bg-base-300 border-x border-t border-base-content/10 shadow-lg">
            <div className="flex items-center h-full">
              <div className="flex-1 flex justify-around items-center">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                      isActive(path)
                        ? "text-primary"
                        : "text-base-content/50 hover:text-base-content/80"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
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
