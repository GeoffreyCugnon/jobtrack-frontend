import { Link } from "react-router";
import { User, Menu } from "lucide-react"; 

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-base-300 border-b border-base-300 px-4 py-3 flex items-center justify-between shadow-sm h-16">
      
      {/* 1. BLOC GAUCHE : Bouton Burger + Titre */}
      <div className="flex items-center gap-3">
        {/* Bouton burger bleu avec DaisyUI */}
      <button className="btn btn-circle btn-sm h-9 w-9 min-h-0 border-none flex items-center justify-center text-white bg-[#004bfa] hover:bg-[#003cb8] transition-colors">
        <Menu className="w-5 h-5" />
      </button>
        
        {/* Titre de l'application */}
        <h1 className="text-xl font-bold text-white uppercase tracking-wide">
          {title}
        </h1>
      </div>

      {/* 2. BLOC DROITE : Le bonhomme cliquable discret du prototype */}
      <Link
        to="/profile"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-base-100 text-slate-300 hover:text-white hover:bg-base-100 transition-colors border border-base-100/10"
        aria-label="Voir mon profil"
      >
        <User className="w-5 h-5" />
      </Link>

    </header>
  );
}