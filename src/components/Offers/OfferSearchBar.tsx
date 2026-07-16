import { Search } from "lucide-react";

export function OfferSearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
      <input
        type="text"
        placeholder="Rechercher une offre..."
        className="input w-full bg-base-100 border-base-200 rounded-full pl-11 shadow-sm"
      />
    </div>
  );
}
