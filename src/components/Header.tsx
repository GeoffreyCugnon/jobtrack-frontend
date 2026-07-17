import { Link } from "react-router";
import { User, Menu } from "lucide-react";
import { PageContainer } from "./Layout/PageContainer";
import { useMenu } from "../context/Menu/useMenu";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { openMenu } = useMenu();

  return (
    <header className="sticky top-0 z-30 bg-base-100 border-b border-base-content/10 shadow-sm h-16">
      <div className="max-w-5xl mx-auto h-full">
        <PageContainer className="h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={openMenu}
              className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center bg-base-200 text-base-content/70 hover:text-base-content hover:bg-base-300 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-xl font-bold text-base-content uppercase tracking-wide">
              {title}
            </h1>
          </div>

          <Link
            to="/app/profile"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-base-200 text-base-content/70 hover:text-base-content 
            hover:bg-base-300 transition-colors"
            aria-label="Voir mon profil"
          >
            <User className="w-5 h-5" />
          </Link>
        </PageContainer>
      </div>
    </header>
  );
}
