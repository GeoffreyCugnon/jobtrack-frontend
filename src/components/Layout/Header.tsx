// src/components/Layout/Header.tsx
import { Link, useLocation } from "react-router";
import { ArrowLeft, ChatCircleDots, Moon, SignIn, Sun } from "@phosphor-icons/react";
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
  /** false : retire le liseré sous le header (ex. accueil invité, dont le
   *  bandeau logo juste en dessous rendrait la séparation redondante). */
  divider?: boolean;
  /** Chemin d'un "←" affiché à gauche de la recherche (ex. vue complète
   *  offres/publications en invité, pour revenir à l'accueil invité — ces
   *  vues n'ont alors pas de nav du bas, cf. `Root`). */
  backTo?: string;
}

export function Header({ search = "app", divider = true, backTo }: HeaderProps) {
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
  // utilisateur connecté. En invité, la navigation tient dans la barre du bas
  // sur l'accueil, ou dans le "←" (`backTo`) sur les vues complètes
  // offres/publications, qui n'ont pas de nav du bas (cf. `Root`).
  const canOpenMenu = isAuthenticated;
  const showLogo = search === "none";

  return (
    <header
      className={`sticky top-0 z-30 bg-base-100 h-16 ${divider ? "border-b border-base-200" : ""}`}
    >
      <div className="max-w-5xl mx-auto h-full">
        <PageContainer className="h-full flex items-center justify-between gap-2">
          <div
            className={`flex items-center min-w-0 flex-1 ${backTo ? "gap-2" : "gap-3"}`}
          >
            {backTo && (
              <Link
                to={backTo}
                aria-label="Retour"
                className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
            )}
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
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-base-content/70 transition-colors hover:text-base-content"
              >
                <ThemeIcon className="h-6 w-6" />
              </button>
              <Link
                to="/auth"
                className={
                  isDark
                    ? "btn shrink-0 gap-1.5 border-none bg-base-200 text-base-content/80 transition-colors hover:bg-base-300 hover:text-base-content"
                    : "btn shrink-0 gap-1.5 border-none bg-primary text-primary-content shadow-sm transition-opacity hover:opacity-90"
                }
                aria-label="Se connecter"
              >
                {/* Sous 350px, le bouton perd son texte (icône seule) pour
                    laisser assez de place à la recherche + au sélecteur de
                    thème sans les compresser — icône agrandie pour ne pas
                    paraître perdue seule dans le bouton. */}
                <SignIn className="h-4.5 w-4.5 min-[350px]:h-3.5 min-[350px]:w-3.5" />
                <span className="hidden min-[350px]:inline">Connexion</span>
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
