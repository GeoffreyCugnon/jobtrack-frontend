import { Link } from "react-router";
import { User } from "lucide-react"; // On importe l'icône de bonhomme

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>
      
      {/* Le bonhomme cliquable qui redirige vers le profil */}
      <Link 
        to="/profile" 
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors border border-gray-200"
        aria-label="Voir mon profil"
      >
        <User className="w-5 h-5" />
      </Link>
    </header>
  );
}