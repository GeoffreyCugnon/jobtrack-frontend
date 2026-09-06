import { ChevronRight, X } from "lucide-react";
import { Link } from "react-router";
import { Avatar } from "../UI/Avatar";

interface MenuHeaderProps {
  name: string;
  email: string;
  initials: string;
  // Photo réelle optionnelle : l'avatar dégradé + initiales n'est qu'un
  // fallback tant qu'aucune photo de profil n'est disponible.
  avatarUrl?: string;
  // Cible du profil. Renseigné -> le bloc identité devient cliquable (accès
  // au profil + fermeture du menu), avec un chevron. Sinon bloc statique
  // (ex. invité).
  profileHref?: string;
  onClose: () => void;
}

export function MenuHeader({
  name,
  email,
  initials,
  avatarUrl,
  profileHref,
  onClose,
}: MenuHeaderProps) {
  const identity = (
    <>
      <Avatar label={initials} avatarUrl={avatarUrl} size="lg" />
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-base-content truncate">{name}</h2>
        <p className="text-sm text-base-content/70 truncate">{email}</p>
      </div>
    </>
  );

  return (
    <div className="flex items-center justify-between gap-3 border-b border-base-content/10 px-4 pt-6 pb-6">
      {profileHref ? (
        <Link
          to={profileHref}
          onClick={onClose}
          aria-label="Voir mon profil"
          className="-m-1 flex min-w-0 flex-1 items-center gap-4 rounded-field p-1 transition-colors hover:bg-base-200"
        >
          {identity}
          <ChevronRight className="w-4 h-4 shrink-0 text-base-content/40" />
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-4">{identity}</div>
      )}

      <button
        onClick={onClose}
        aria-label="Fermer le menu"
        className="btn btn-ghost btn-circle btn-sm shrink-0 bg-base-200 transition-colors hover:bg-base-300"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
