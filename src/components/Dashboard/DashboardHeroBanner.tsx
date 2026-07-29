interface DashboardHeroBannerProps {
  initials: string;
  name: string;
}

// Même structure que ProfileIdentity (bannière dégradée + avatar en overlap),
// condensée pour un aperçu rapide plutôt qu'une fiche complète.
export function DashboardHeroBanner({ initials, name }: DashboardHeroBannerProps) {
  return (
    <div className="rounded-none sm:rounded-box overflow-hidden">
      <div className="h-16 sm:h-24 bg-linear-to-r from-primary to-secondary" />
      <div className="relative bg-base-100 pt-8 px-4 pb-4 -mt-2">
        <div className="absolute left-4 -top-8 avatar placeholder">
          <div className="w-16 h-16 rounded-full ring-4 ring-base-100 shadow-md bg-primary text-primary-content flex items-center justify-center font-semibold">
            {initials}
          </div>
        </div>

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
