import { MapPin, Clock, Star, X } from "lucide-react";

interface OfferCardProps {
  title: string;
  location: string;
  timeAgo: string;
}

export function OfferCard({ title, location, timeAgo }: OfferCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm rounded-box">
      <div className="card-body p-4 gap-3">
        <h3 className="font-bold text-base-content">{title}</h3>

        <div className="flex items-center gap-4 text-sm text-base-content/60">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo}
          </span>
        </div>

        <div className="flex gap-2 mt-1">
          <button className="btn btn-primary btn-sm flex-1 font-medium gap-1.5">
            <Star className="w-4 h-4" fill="currentColor" />
            Sauvegarder
          </button>
          <button className="btn btn-sm flex-1 font-medium gap-1.5">
            <X className="w-4 h-4" />
            Pas intéressé
          </button>
        </div>
      </div>
    </div>
  );
}
