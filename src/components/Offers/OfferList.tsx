import { OfferCard } from "./OfferCard";

interface Offer {
  id: number;
  role: string;
  company: string;
  location: string;
  timeAgo: string;
  workMode?: "onSite" | "Remote" | "Hybrid";
  applicantCount?: number;
  verified?: boolean;
}

interface OfferListProps {
  offers: Offer[];
  savedIds: number[];
  onToggleSave: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function OfferList({
  offers,
  savedIds,
  onToggleSave,
  onDismiss,
}: OfferListProps) {
  return (
    <div className="divide-y divide-base-200">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          role={offer.role}
          company={offer.company}
          location={offer.location}
          timeAgo={offer.timeAgo}
          workMode={offer.workMode}
          applicantCount={offer.applicantCount}
          verified={offer.verified}
          saved={savedIds.includes(offer.id)}
          onToggleSave={() => onToggleSave(offer.id)}
          onDismiss={() => onDismiss(offer.id)}
        />
      ))}
    </div>
  );
}
