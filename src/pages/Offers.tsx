import { useState } from "react";
import { Search } from "lucide-react";
import { FilterChip } from "../components/Offers/FilterChip";
import { OfferCard, type JobOffer } from "../components/Offers/OfferCard";
import { Header } from "../components/Header";

const OFFERS: JobOffer[] = [
  { id: "1", title: "Dev Fullstack Jr - TechCorp", location: "Sophia", postedAt: "Il y a 2h" },
  { id: "2", title: "Concepteur Appli - InnovA", location: "Cannes", postedAt: "Il y a 1j" },
];

const FILTERS = ["Télétravail", "CDI", "Date"];

export function Offers() {
  const [query, setQuery] = useState("Développeur TypeScript, Cannes");
  const [offers] = useState(OFFERS);

  return (
    <>
      <Header title="MON CRM EMPLOI" />
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        {/* Barre de recherche */}
        <label className="input input-bordered flex w-full items-center gap-3 rounded-full bg-white px-5 py-6 shadow-sm">
          <Search className="size-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un poste, une ville..."
            className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </label>

        {/* Filtres */}
        <div className="mt-4 flex flex-wrap gap-3">
          {FILTERS.map((label) => (
            <FilterChip key={label} label={label} defaultActive={label === "Télétravail"} />
          ))}
        </div>

        {/* Compteur de résultats */}
        <p className="mt-6 text-sm text-slate-500">{offers.length} offres trouvées</p>

        {/* Liste des offres */}
        <div className="mt-3 flex flex-col gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </>
  );
}
