import { api } from "../utils/axios-client";
import type { Offer } from "../types/offer.type";
import { formatRelativeFr, hoursSince } from "../utils/relative-time";

export type { Offer };

/** `timeAgo`/`postedHoursAgo` ne sont pas renvoyés par l'API : dérivés ici de `createdAt` à chaque lecture (jamais périmés entre deux mutations, cf. `offer.type.ts`). */
function withRelativeTime(offer: Offer): Offer {
  return {
    ...offer,
    timeAgo: formatRelativeFr(offer.createdAt),
    postedHoursAgo: hoursSince(offer.createdAt),
  };
}

export class OffersApi {
  static async getAll(): Promise<Offer[]> {
    const { data } = await api.get<Offer[] | { offers?: Offer[] }>(
      "job-offering",
    );
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.offers)
        ? data.offers
        : [];
    return items.map(withRelativeTime);
  }

  /** `GET job-offering/:id` (route publique). `null` si l'offre n'existe pas. */
  static async getById(id: number | string): Promise<Offer | null> {
    const { data } = await api.get<Offer | null>(`job-offering/${id}`);
    return data ? withRelativeTime(data) : null;
  }
}
