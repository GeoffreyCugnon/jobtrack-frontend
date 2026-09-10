import { api } from "../utils/axios-client";
import type { JobCategory } from "../types/job-category.type";

export type { JobCategory };

/** Référentiel des catégories d'offres (`GET /job-categories`, route publique). */
export class JobCategoriesApi {
  static async list(): Promise<JobCategory[]> {
    const { data } = await api.get<JobCategory[]>("job-categories");
    return Array.isArray(data) ? data : [];
  }
}
