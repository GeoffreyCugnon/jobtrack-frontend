import { OfferCard } from "./OfferCard";
import type { Offer } from "../../types/offer.type";

interface OfferListProps {
  offers: Offer[];
  savedIds: number[];
  /** Boutons favori / masquer par offre : masqués en vue invité. */
  showActions?: boolean;
  onToggleSave: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function OfferList({
  offers,
  savedIds,
  showActions = true,
  onToggleSave,
  onDismiss,
}: OfferListProps) {
  return (
    <div className="divide-y divide-base-200">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          id={offer.id}
          role={offer.role}
          company={offer.company}
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
      ))}
    </div>
  );
}
