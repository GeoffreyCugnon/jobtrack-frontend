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

  /**
   * `POST publication` (protégé). `title` est dérivé du contenu côté appelant
   * (pas de champ dédié dans le composeur, cf. `CreatePublication.tsx`) — le
   * Backend le rend obligatoire (`CreatePublicationDto`).
   */
  static async create(payload: {
    title: string;
    content: string;
    type: "ARTICLE" | "ANNONCE" | "ACTU";
    imageUrl?: string;
  }): Promise<void> {
    await api.post("publication", {
      title: payload.title,
      content: payload.content,
      type: payload.type,
      image_url: payload.imageUrl,
    });
  }
}
