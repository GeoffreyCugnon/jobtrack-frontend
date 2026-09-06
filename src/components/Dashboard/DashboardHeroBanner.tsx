import { Link } from "react-router";

interface DashboardHeroBannerProps {
  initials: string;
  name: string;
  /** Avatar de l'utilisateur ; repli sur les initiales si absent. */
  avatarUrl?: string;
}

// Même structure que ProfileIdentity (bannière dégradée + avatar en overlap),
// condensée pour un aperçu rapide plutôt qu'une fiche complète.
export function DashboardHeroBanner({
  initials,
  name,
  avatarUrl,
}: DashboardHeroBannerProps) {
  return (
    <div className="rounded-none sm:rounded-box overflow-hidden">
      <div className="h-16 sm:h-24 bg-linear-to-r from-primary to-secondary" />
      <div className="relative bg-base-100 pt-8 px-4 pb-4 -mt-2">
        <Link
          to="/profile"
          aria-label="Voir mon profil"
          className="absolute left-4 -top-8 avatar placeholder"
        >
          <div
            className={`w-16 h-16 rounded-full ring-4 ring-base-100 shadow-md overflow-hidden flex items-center justify-center font-semibold transition-transform hover:scale-105 ${
              avatarUrl ? "bg-base-300" : "bg-primary text-primary-content"
            }`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </Link>

        <div>
          <h2 className="text-lg font-bold text-base-content">
            Bonjour {name} !
          </h2>
          <p className="text-sm text-base-content/60">
            Continuez sur cette lancée, chaque candidature vous rapproche du
            bon poste.
          </p>
        </div>
      </div>
    </div>
  );
}
