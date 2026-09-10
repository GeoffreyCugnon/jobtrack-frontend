/**
 * Catégorie d'offre telle que renvoyée par `GET /job-categories` (référentiel
 * `Job_category` côté Backend). Le pictogramme et la pastille de couleur ne
 * sont pas stockables en base : ils restent au Front, résolus par `key` via
 * `getCategoryStyle()` (`src/data/offerCategories.ts`).
 */
export type JobCategory = {
  key: string;
  label: string;
  description: string;
  /** `true` pour « À distance » / « Hybride » : modes de travail, pas des
   *  secteurs — masqués du filtre « Catégorie ». */
  isWorkMode: boolean;
  sortOrder: number;
};
