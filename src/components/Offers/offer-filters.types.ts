/** Valeurs des filtres Offres, cumulables. `null` = pas de filtre sur cette dimension. */
export interface OfferFiltersValue {
  category: string | null;
  workMode: "onSite" | "Remote" | "Hybrid" | null;
  contract: string | null;
}

export const EMPTY_OFFER_FILTERS: OfferFiltersValue = {
  category: null,
  workMode: null,
  contract: null,
};

/** Liste fixe côté Front, matchée sur `offer.contractType` (insensible à la casse). */
export const CONTRACT_OPTIONS = ["CDI", "CDD", "Freelance", "Alternance", "Stage"];

export const WORK_MODE_OPTIONS: {
  value: NonNullable<OfferFiltersValue["workMode"]>;
  label: string;
}[] = [
  { value: "onSite", label: "Sur site" },
  { value: "Remote", label: "À distance" },
  { value: "Hybrid", label: "Hybride" },
];
