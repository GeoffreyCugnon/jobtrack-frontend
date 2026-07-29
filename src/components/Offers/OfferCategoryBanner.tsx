import type { CSSProperties } from "react";

interface OfferCategoryBannerProps {
  label: string;
  resultsLabel: string;
  alertEnabled: boolean;
  onAlertToggle: (checked: boolean) => void;
  // false quand aucune catégorie n'est sélectionnée ("Toutes les offres") :
  // une alerte n'a pas de sens sans filtre à surveiller.
  showAlertToggle?: boolean;
}

// Hauteur fixe utilisée par Offers.tsx pour placer les badges juste en
// dessous (sticky top = hauteur header + cette valeur).
export const OFFER_CATEGORY_BANNER_HEIGHT = 56;

export function OfferCategoryBanner({
  label,
  resultsLabel,
  alertEnabled,
  onAlertToggle,
  showAlertToggle = true,
}: OfferCategoryBannerProps) {
  // Sans catégorie active, l'alerte n'existe pas : pas de sens à garder le
  // fond "success" d'une alerte qui ne peut pas être affichée dans cet état.
  const isSuccess = showAlertToggle && alertEnabled;

  return (
    <div
      className={`shadow-sm transition-colors ${
        isSuccess ? "bg-success text-success-content" : "bg-primary text-primary-content"
      }`}
      style={{ height: OFFER_CATEGORY_BANNER_HEIGHT }}
    >
      <div className="max-w-5xl mx-auto h-full">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          <div className="min-w-0 self-start mt-1.5">
            <h3 className="font-bold truncate">{label}</h3>
            <p
              className={`text-sm font-bold ${
                isSuccess ? "text-success-content/80" : "text-primary-content/80"
              }`}
            >
              {resultsLabel}
            </p>
          </div>

          {showAlertToggle && (
            <label
              className={`flex items-center gap-2 shrink-0 text-sm ${
                isSuccess ? "text-success-content/90" : "text-primary-content/90"
              }`}
            >
              <span className="whitespace-nowrap leading-none -mt-0.5">
                {alertEnabled ? "Alerte activée" : "Définir une alerte"}
              </span>
              <input
                type="checkbox"
                checked={alertEnabled}
                onChange={(e) => onAlertToggle(e.target.checked)}
                className="toggle toggle-md"
                // Piste/pastille daisyui par défaut : mix avec base-content, peu
                // visible sur le fond bleu tant que le toggle est décoché ; une
                // fois coché, daisyui bascule sur un fond clair déjà lisible.
                style={!alertEnabled ? ({ "--input-color": "#fff" } as CSSProperties) : undefined}
                aria-label="Définir une alerte pour cette catégorie"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
