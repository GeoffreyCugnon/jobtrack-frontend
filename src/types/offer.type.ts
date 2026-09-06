// Offre d'emploi telle que renvoyée par l'API (`GET job-offering`) et affichée
// par la page Offres. La forme est produite côté Backend par
// `job_offering.service.ts#toOfferDto` (mapping + inférence catégorie/mode).
// Source unique : `OffersApi` et les composants Offres importent ce type d'ici,
// pas une copie locale.
export type Offer = {
  id: number;
  role: string;
  company: string;
  location: string;
  timeAgo: string;
  postedHoursAgo: number;
  category: string;
  workMode?: "onSite" | "Remote" | "Hybrid";
  applicantCount?: number;
  verified?: boolean;
  // Renseignés par `findOne` / `findAll` du Backend (peuvent manquer si l'API
  // n'a pas encore été redéployée).
  description?: string;
  contractType?: string;
};
