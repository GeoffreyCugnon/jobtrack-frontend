import { useQuery } from "@tanstack/react-query";
import { JobCategoriesApi } from "../api/job-categories.api";
import type { JobCategory } from "../types/job-category.type";
import { queryKeys } from "../api/query-keys";

/**
 * Référentiel des catégories d'offres, partagé entre le filtre de la liste
 * d'offres (`OfferFilters`), la bannière de `Offers` et la fiche `OfferDetail`.
 * Rarement modifié → `staleTime` long, une seule requête pour les trois.
 * Renvoie `[]` tant que la requête n'a pas abouti (le filtre n'affiche alors
 * que « Toutes », la fiche retombe sur la `key` brute).
 */
export function useJobCategories(): {
  categories: JobCategory[];
  isPending: boolean;
} {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.jobCategories.all,
    queryFn: () => JobCategoriesApi.list(),
    staleTime: 1000 * 60 * 60,
  });

  return { categories: data ?? [], isPending };
}
