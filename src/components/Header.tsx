// src/components/Header.tsx
import { Link } from "react-router";
import { User, Menu } from "lucide-react";
import { PageContainer } from "./Layout/PageContainer";
import { useMenu } from "../context/Menu/useMenu";
import { AuthLogo } from "./Auth/AuthLogo";

export function Header() {
  const { openMenu } = useMenu();

  return (
    <header className="sticky top-0 z-30 bg-base-100 border-b border-base-content/10 shadow-sm h-16">
      <div className="max-w-5xl mx-auto h-full">
        <PageContainer className="h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={openMenu}
              className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors translate-y-1"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              to="/app"
              aria-label="Retour au tableau de bord"
              className="-ml-2"
            >
              <AuthLogo size="sm" align="left" />
            </Link>
          </div>

          <Link
            to="/app/profile"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors translate-y-1"
            aria-label="Voir mon profil"
          >
            <User className="w-5 h-5" />
          </Link>
        </PageContainer>
      </div>
    </header>
  );
}
