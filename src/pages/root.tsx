import { Outlet, Link, useLocation } from "react-router";
import { Home, Briefcase, Users, FileText, Megaphone } from "lucide-react";
import { SideMenu } from "../components/sideMenu";
import { MenuProvider, useMenu } from "../context/MenuContext";

function RootContent() {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useMenu();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", icon: Home, label: "Dashb." },
    { path: "/offers", icon: Briefcase, label: "Offres" },
    { path: "/network", icon: Users, label: "Relat." },
    { path: "/documents", icon: FileText, label: "Docs" },
    { path: "/posts", icon: Megaphone, label: "Publis." },
  ];

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
      <div className="min-h-screen flex flex-col bg-base-200">
        {/* Zone de contenu principale scrollable avec l'Outlet */}
        <div className="flex-1 overflow-y-auto bg-base-200 w-full">
          <Outlet />
        </div>

        {/* Barre de navigation basse (Mobile-First) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-base-300 border-t border-base-300 px-2 py-3 shadow-lg z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

export function Root() {
  return (
    <MenuProvider>
      <RootContent />
    </MenuProvider>
  );
}