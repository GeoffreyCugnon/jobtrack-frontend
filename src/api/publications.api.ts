import { api } from "../utils/axios-client";
import type { Publication } from "../types/publication.types";

export type { Publication };

export class PublicationsApi {
  static async getAll(): Promise<Publication[]> {
    const { data } = await api.get<
      Publication[] | { publications?: Publication[] }
    >("publication");
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.publications) ? data.publications : [];
  }

  /** `GET publication/:id` (route publique). `null` si introuvable. */
  static async getById(id: number | string): Promise<Publication | null> {
    const { data } = await api.get<Publication | null>(`publication/${id}`);
    return data ?? null;
  }
}
