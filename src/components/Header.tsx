// src/components/header.tsx
import { Link } from "react-router";
import { User, Menu } from "lucide-react";
import { PageContainer } from "./Layout/PageContainer";
import { useMenu } from "../context/useMenu";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { openMenu } = useMenu();

  return (
    <header className="sticky top-0 z-30 bg-base-100">
      <div className="max-w-5xl mx-auto bg-base-300 border-x border-b border-base-content/10 shadow-sm h-16">
        <PageContainer className="h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={openMenu}
              className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center bg-base-100 text-slate-300 hover:text-white hover:bg-base-content/10 transition-colors border border-base-100/10"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-xl font-bold text-white uppercase tracking-wide">
              {title}
            </h1>
          </div>

          <Link
            to="/app/profile"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-base-100 text-slate-300 hover:text-white hover:bg-base-content/10 transition-colors border border-base-100/10"
            aria-label="Voir mon profil"
          >
            <User className="w-5 h-5" />
          </Link>
        </PageContainer>
      </div>
    </header>
  );
}