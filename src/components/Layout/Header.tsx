// src/components/Layout/Header.tsx
import { Link, useLocation } from "react-router";
import { ChatCircleDots, Moon, SignIn, Sun } from "@phosphor-icons/react";
import { PageContainer } from "./PageContainer";
import { useMenu } from "../../context/Menu/useMenu";
import { AuthLogo } from "../Auth/AuthLogo";
import { Avatar } from "../UI/Avatar";
import { GlobalSearch } from "../Publications/GlobalSearch";
import { getMainNavItems, isNavItemActive } from "../../constants/nav";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";
import { useMessagingOptional } from "../../context/Messaging/useMessaging";
import { useTheme } from "../../context/Theme/useTheme";
import { THEME_DARK } from "../../context/Theme/themeContextInstance";

interface HeaderProps {
  /**
   * Contenu affiché à la place du logo :
   * - "app" (défaut) : recherche large (actus, offres, utilisateurs,
   *   documents, conversations)
   * - "feed" : recherche restreinte au fil d'actus (actus + offres)
   * - "none" : le logo (renvoie vers l'accueil)
   *
   * Quand une recherche est affichée, le logo est censé vivre dans le
   * contenu de la page (cf. `Publications`).
   */
  search?: "app" | "feed" | "none";
}

export function Header({ search = "app" }: HeaderProps) {
  const { openMenu } = useMenu();
  const messaging = useMessagingOptional();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEME_DARK;
  const ThemeIcon = isDark ? Moon : Sun;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const { initials: userInitials, avatarUrl: userAvatarUrl } =
    getUserDisplay(currentUser);
  const navItems = getMainNavItems(isAuthenticated);
  const unreadCount = messaging?.unreadConversationIds.length ?? 0;
  // Le SideMenu (profil, paramètres, déconnexion...) ne s'ouvre que pour un
  // utilisateur connecté. En invité, toute la navigation tient dans la barre
  // du bas — même expérience sur `/` et sur `/offers`.
  const canOpenMenu = isAuthenticated;
  const showLogo = search === "none";

  return (
    <header className="sticky top-0 z-30 bg-base-100 border-b border-base-300 h-16">
      <div className="max-w-5xl mx-auto h-full">
        <PageContainer className="h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {canOpenMenu && (
              <button
                onClick={openMenu}
                className="shrink-0 rounded-full transition-transform hover:scale-105"
                aria-label="Ouvrir le menu"
              >
                <Avatar
                  label={userInitials}
                  avatarUrl={userAvatarUrl}
                  size="sm"
                />
              </button>
            )}

            {showLogo ? (
              <Link to="/" aria-label="Retour à l'accueil" className="-ml-2">
                <AuthLogo size="sm" align="left" />
              </Link>
            ) : (
              <div className="min-w-0 flex-1 lg:max-w-sm">
                <GlobalSearch scope={search} />
              </div>
            )}
          </div>

          <nav className="hidden lg:flex items-center h-full">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center gap-0.5 h-full px-4 text-xs transition-colors ${
                  isNavItemActive(location.pathname, path)
                    ? "text-link font-medium"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {!isAuthenticated ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
                className="p-1.5 text-base-content/70 transition-colors hover:text-base-content"
              >
                <ThemeIcon className="h-5 w-5" />
              </button>
              <Link
                to="/auth"
                className={
                  isDark
                    ? "btn btn-sm shrink-0 gap-1.5 border-none bg-base-200 text-base-content/80 transition-colors hover:bg-base-300 hover:text-base-content"
                    : "btn btn-sm shrink-0 gap-1.5 border-none bg-primary text-primary-content shadow-sm transition-opacity hover:opacity-90"
                }
                aria-label="Se connecter"
              >
                <SignIn className="h-3.5 w-3.5" />
                Connexion
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => messaging?.openMessaging()}
              aria-label={
                unreadCount > 0
                  ? `Messages, ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
                  : "Messages"
              }
              className="relative shrink-0 p-1 text-base-content/70 transition-colors hover:text-base-content"
            >
              <ChatCircleDots className="w-8 h-8" weight="fill" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-error text-error-content text-[10px] font-medium flex items-center justify-center ring-2 ring-base-100">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}
        </PageContainer>
      </div>
    </header>
  );
}
