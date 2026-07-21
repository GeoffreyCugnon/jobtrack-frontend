import { OfferCard } from "./OfferCard";

interface Offer {
  id: number;
  title: string;
  location: string;
  timeAgo: string;
}

interface OfferListProps {
  offers: Offer[];
}

export function OfferList({ offers }: OfferListProps) {
  return (
    <div className="space-y-3">
      {offers.map((offer) => (
        <OfferCard key={offer.id} {...offer} />
      ))}
    </div>
  );
}
