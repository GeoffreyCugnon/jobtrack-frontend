import { api } from "../utils/axios-client";
import type { Offer } from "../types/offer.type";

export type { Offer };

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
    return items;
  }
}
