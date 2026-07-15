import { Settings, LogOut } from "lucide-react";
import { MenuOverlay } from "./MenuOverlay";
import { MenuHeader } from "./MenuHeader";
import { MenuSection } from "./MenuSection";
import { MenuLink } from "./MenuLink";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const mainLinks = [
    { to: "/app", label: "Dashboard" },
    { to: "/app/offers", label: "Offres" },
    { to: "/app/network", label: "Relations" },
    { to: "/app/documents", label: "Documents" },
  ];

  const secondaryLinks = [
    { to: "/app/posts", label: "Posts & veille" },
    { to: "/app/statistics", label: "Statistiques" },
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
            <MenuSection links={mainLinks} onLinkClick={onClose} />
            <MenuSection links={secondaryLinks} onLinkClick={onClose} />
          </div>

          <ul className="menu menu-vertical w-full py-4">
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
