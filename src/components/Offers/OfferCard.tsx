import { Link } from "react-router";
import { Check, Heart, X } from "@phosphor-icons/react";
import { useTheme } from "../../context/Theme/useTheme";
import { THEME_DARK } from "../../context/Theme/themeContextInstance";

type WorkMode = "onSite" | "Remote" | "Hybrid";

const WORK_MODE_LABEL: Record<WorkMode, string> = {
  onSite: "Sur site",
  Remote: "À distance",
  Hybrid: "Hybride",
};

// En dessous de ce nombre de candidatures, on met en avant « Premier candidat »
// plutôt que la seule date de publication.
const EARLY_APPLICANT_THRESHOLD = 5;

interface OfferCardProps {
  id: number;
  role: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  timeAgo: string;
  workMode?: WorkMode;
  applicantCount?: number;
  saved: boolean;
  verified?: boolean;
  /** Boutons favori / masquer : masqués en vue invité (rien à sauvegarder). */
  showActions?: boolean;
  onToggleSave: () => void;
  onDismiss: () => void;
}

export function OfferCard({
  id,
  role,
  company,
  companyLogoUrl,
  location,
  timeAgo,
  workMode = "onSite",
  applicantCount,
  saved,
  verified,
  showActions = true,
  onToggleSave,
  onDismiss,
}: OfferCardProps) {
  const isEarlyApplicant =
    applicantCount !== undefined && applicantCount < EARLY_APPLICANT_THRESHOLD;
  const { theme } = useTheme();
  const isDark = theme === THEME_DARK;

  // Ligne méta compacte : ville (1er segment du lieu) · mode · ancienneté.
  const city = location.split(",")[0].trim();
  const meta = [city, WORK_MODE_LABEL[workMode], timeAgo]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="py-3 pl-1 pr-2 flex items-start gap-3">
      {/* Toute la zone titre/entreprise/lieu mène au détail de l'offre ;
          les boutons favori / masquer restent hors du lien. */}
      <Link
        to={`/offers/${id}`}
        className="group flex min-w-0 flex-1 items-start gap-3"
      >
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-primary/10 font-semibold text-base-content/60">
            {companyLogoUrl ? (
              <img
                src={companyLogoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              company.charAt(0)
            )}
          </div>
          {verified && (
            <span
              aria-label="Offre vérifiée"
              className={`absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full ring-2 ring-base-100 ${
                isDark ? "bg-white text-black" : "bg-primary text-primary-content"
              }`}
            >
              <Check className="h-3 w-3" weight="bold" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-link group-hover:underline">
            {role}
          </h3>
          <p className="truncate text-sm font-medium text-base-content/70">
            {company}
          </p>
          <p className="mt-0.5 truncate text-sm text-base-content/60">{meta}</p>
          {isEarlyApplicant && (
            <span className="badge badge-soft badge-success badge-sm mt-1.5 font-medium">
              Premier candidat
            </span>
          )}
        </div>
      </Link>

      {showActions && (
        <div className="flex shrink-0 items-center gap-0.5 -mt-1">
          <button
            type="button"
            aria-label={saved ? "Retirer des favoris" : "Sauvegarder l'offre"}
            onClick={onToggleSave}
            className={`rounded-full p-2 transition-colors ${
              saved
                ? isDark
                  ? "text-white"
                  : "text-primary"
                : isDark
                  ? "text-base-content/40 hover:bg-base-200 hover:text-white"
                  : "text-base-content/40 hover:bg-base-200 hover:text-primary"
            }`}
          >
            <Heart className="h-5 w-5" weight={saved ? "fill" : "regular"} />
          </button>
          <button
            type="button"
            aria-label="Masquer cette offre"
            onClick={onDismiss}
            className="rounded-full p-2 text-base-content/40 transition-colors hover:bg-base-200 hover:text-error"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
