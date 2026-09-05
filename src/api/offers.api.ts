import { api } from "../utils/axios-client";

export type OfferApiItem = {
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
};

export class OffersApi {
  static async getAll(): Promise<OfferApiItem[]> {
    const { data } = await api.get<
      OfferApiItem[] | { offers?: OfferApiItem[] }
    >("job-offering");
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.offers)
        ? data.offers
        : [];
    return items;
  }
}
