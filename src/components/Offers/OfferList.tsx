import { OfferCard } from "./OfferCard";
import type { Offer } from "../../types/offer.type";

interface OfferListProps {
  offers: Offer[];
  savedIds: number[];
  /** Boutons favori / masquer par offre : masqués en vue invité. */
  showActions?: boolean;
  /** true (accueil invité) : retire le padding bas de la dernière carte, cf.
   *  `OfferCard#previewLast`. Ignoré en 2 colonnes (`columns={2}`) : la
   *  notion de « dernière carte » n'a plus de sens en grille. */
  trimLastPadding?: boolean;
  /** 2 (résolutions paysage assez larges, cf. accueil invité) : grille deux
   *  colonnes. Pas de `gap` : chaque carte porte son propre liseré bas (et
   *  la colonne de droite un liseré gauche), collés bord à bord pour rester
   *  continus d'une carte à l'autre — un vrai `gap-x` couperait les traits
   *  horizontaux au niveau de la gouttière. */
  columns?: 1 | 2;
  onToggleSave: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function OfferList({
  offers,
  savedIds,
  showActions = true,
  trimLastPadding = false,
  columns = 1,
  onToggleSave,
  onDismiss,
}: OfferListProps) {
  if (columns === 2) {
    const lastRow = Math.floor((offers.length - 1) / 2);
    return (
      <div className="grid grid-cols-2">
        {offers.map((offer, index) => {
          const isRightColumn = index % 2 === 1;
          const isLastRow = Math.floor(index / 2) === lastRow;
          return (
            <div
              key={offer.id}
              // `border-b` toujours présent (largeur constante, jamais 0) :
              // seule sa couleur change sur la dernière rangée (transparent).
              // Une largeur de bordure conditionnelle changerait la hauteur
              // de la carte selon le nombre total affiché — exactement le
              // cercle vicieux déjà rencontré avec `previewLast` côté liste
              // à une colonne (la mesure de la 1re carte dépendrait alors du
              // compte lui-même, cf. commentaire dans `GuestHome`). `border-
              // base-200` reste toujours présent : c'est lui qui colore aussi
              // le liséré gauche (`border-color` s'applique aux 4 côtés) — ne
              // le retirer que sur la dernière rangée faisait retomber le
              // liséré gauche sur `currentColor` (noirâtre) au lieu du gris
              // clair attendu.
              className={`border-b border-base-200 ${
                isLastRow ? "border-b-transparent" : ""
              } ${isRightColumn ? "border-l pl-4" : "pr-4"}`}
            >
              <OfferCard
                id={offer.id}
                role={offer.role}
                company={offer.company}
                companyLogoUrl={offer.companyLogoUrl}
                location={offer.location}
                timeAgo={offer.timeAgo}
                workMode={offer.workMode}
                applicantCount={offer.applicantCount}
                verified={offer.verified}
                saved={savedIds.includes(offer.id)}
                showActions={showActions}
                onToggleSave={() => onToggleSave(offer.id)}
                onDismiss={() => onDismiss(offer.id)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="divide-y divide-base-200">
      {offers.map((offer, index) => (
        <OfferCard
          key={offer.id}
          id={offer.id}
          role={offer.role}
          company={offer.company}
          companyLogoUrl={offer.companyLogoUrl}
          location={offer.location}
          timeAgo={offer.timeAgo}
          workMode={offer.workMode}
          applicantCount={offer.applicantCount}
          verified={offer.verified}
          saved={savedIds.includes(offer.id)}
          showActions={showActions}
          previewLast={trimLastPadding && index === offers.length - 1}
          onToggleSave={() => onToggleSave(offer.id)}
          onDismiss={() => onDismiss(offer.id)}
        />
      ))}
    </div>
  );
}
