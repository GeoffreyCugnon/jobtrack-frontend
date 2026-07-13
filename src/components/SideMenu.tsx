// Sidebar.tsx
import { Link } from "react-router";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SidebarProps) {
  const mainLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/offres", label: "Offres" },
    { to: "/relations", label: "Relations" },
    { to: "/documents", label: "Mes documents" },
  ];

  const secondaryLinks = [
    { to: "/posts", label: "Posts & veille" },
    { to: "/statistiques", label: "Statistiques" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-bg-card shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-bg-main pt-10 pl-5 pb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 text-2xl">
            👤
          </div>

          <div>
            <h2 className="font-semibold text-txt-title">UserName</h2>
            <p className="text-sm text-txt-body">exemple@email.fr</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex h-[calc(100%-96px)] flex-col justify-between">
          <div>
            <div className="border-b border-bg-main py-4">
              {mainLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className="block px-6 py-3 text-txt-body hover:bg-bg-main hover:text-txt-title transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-b border-bg-main py-4">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className="block px-6 py-3 text-txt-body hover:bg-bg-main hover:text-txt-title transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="py-4">
            <Link
              to="/parametres"
              onClick={onClose}
              className="block px-6 py-3 text-txt-body hover:bg-bg-main hover:text-txt-title transition-colors"
            >
              Paramètres
            </Link>

            <Link
              to="/login"
              onClick={onClose}
              className="block px-6 py-3 text-error hover:bg-error/10 transition-colors"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}