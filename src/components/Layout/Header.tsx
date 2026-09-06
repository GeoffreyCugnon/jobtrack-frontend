// src/components/Layout/Header.tsx
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { User, Menu, LogIn } from "lucide-react";
import { PageContainer } from "./PageContainer";
import { useMenu } from "../../context/Menu/useMenu";
import { AuthLogo } from "../Auth/AuthLogo";
import { getMainNavItems, isNavItemActive } from "../../constants/nav";
import { useAuthStore } from "../../store/auth.store";

interface HeaderProps {
  /**
   * Contenu affiché à la place du logo (ex. barre de recherche globale sur le
   * fil d'actus). Le logo bascule alors dans le contenu de la page.
   */
  centerSlot?: ReactNode;
}

export function Header({ centerSlot }: HeaderProps) {
  const { openMenu } = useMenu();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navItems = getMainNavItems(isAuthenticated);
  // Le burger n'ouvre le SideMenu (profil, paramètres, déconnexion...) que pour
  // un utilisateur connecté. En invité, toute la navigation tient dans la barre
  // du bas — même expérience sur `/` et sur `/offers`.
  const canOpenMenu = isAuthenticated;

  return (
    <header className="sticky top-0 z-30 bg-base-300 shadow-sm h-16">
      <div className="max-w-5xl mx-auto h-full">
        <PageContainer className="h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {canOpenMenu && (
              <button
                onClick={openMenu}
                className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center bg-base-200 text-base-content/70 hover:bg-base-100 hover:text-base-content transition-colors translate-y-1 shrink-0"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {centerSlot ? (
              <div className="min-w-0 flex-1">{centerSlot}</div>
            ) : (
              <Link to="/" aria-label="Retour à l'accueil" className="-ml-2">
                <AuthLogo size="sm" align="left" />
              </Link>
            )}
          </div>

          {!centerSlot && (
            <nav className="hidden lg:flex items-center h-full">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center justify-center gap-0.5 h-full px-4 text-xs transition-colors ${
                    isNavItemActive(location.pathname, path)
                      ? "text-primary font-medium"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          )}

          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-content shadow-sm transition-opacity hover:opacity-90"
              aria-label="Se connecter"
            >
              <LogIn className="h-3.5 w-3.5" />
              Connexion
            </Link>
          ) : (
            <Link
              to="/profile"
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-base-200 text-base-content/70 hover:bg-base-100 hover:text-base-content transition-colors translate-y-1"
              aria-label="Voir mon profil"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </PageContainer>
      </div>
    </header>
  );
}
