import { useState } from "react";
import { OfferSearchBar } from "../components/Offers/OfferSearchBar";
import { OfferFilters } from "../components/Offers/OfferFilters";
import { OfferList } from "../components/Offers/OfferList";
import { Header } from "../components/header";
import { PageContainer } from "../components/layout/PageContainer";

export function Offers() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["Télétravail"]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const offers = [
    {
      id: 1,
      title: "Dev Fullstack Jr - TechCorp",
      location: "Sophia",
      timeAgo: "Il y a 2h",
    },
    {
      id: 2,
      title: "Concepteur Appli - InnovA",
      location: "Cannes",
      timeAgo: "Il y a 1j",
    },
  ];

  return (
    <>
      <Header title="Offres" />
      <PageContainer className="py-4 space-y-4">
        <OfferSearchBar />
        <OfferFilters active={activeFilters} onToggle={toggleFilter} />

        <p className="text-sm text-base-content/50">
          {offers.length} offres trouvées
        </p>

        <OfferList offers={offers} />
      </PageContainer>
    </>
  );
}
