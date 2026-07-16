import { useState } from "react";
import { MapPin, Clock, Star, X } from "lucide-react";

export type JobOffer = {
  id: string;
  title: string;
  location: string;
  postedAt: string;
};

type OfferCardProps = {
  offer: JobOffer;
};

export function OfferCard({ offer }: OfferCardProps) {
  const [saved, setSaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <article className="card border border-slate-100 bg-white shadow-sm">
      <div className="card-body gap-4 p-5">
        <h3 className="text-lg font-semibold text-slate-900">{offer.title}</h3>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {offer.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {offer.postedAt}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setSaved((prev) => !prev)}
            className="btn flex-1 gap-2 border-none bg-indigo-50 font-medium text-indigo-600 normal-case hover:bg-indigo-100"
          >
            <Star className="size-4" />
            {saved ? "Sauvegardé" : "Sauvegarder"}
          </button>
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="btn flex-1 gap-2 border-none bg-slate-100 font-medium text-slate-600 normal-case hover:bg-slate-200"
          >
            <X className="size-4" />
            Masquer
          </button>
        </div>
      </div>
    </article>
  );
}
