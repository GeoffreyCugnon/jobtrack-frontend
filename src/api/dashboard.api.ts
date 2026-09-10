import { api } from "../utils/axios-client";

/** Compteurs des 3 tuiles du tableau de bord (`GET /dashboard/stats`). */
export interface DashboardStats {
  activeApplications: number;
  upcomingInterviews: number;
  availableOffers: number;
}

export class DashboardApi {
  static async stats(): Promise<DashboardStats> {
    const { data } = await api.get<Partial<DashboardStats>>("dashboard/stats");
    return {
      activeApplications: data?.activeApplications ?? 0,
      upcomingInterviews: data?.upcomingInterviews ?? 0,
      availableOffers: data?.availableOffers ?? 0,
    };
  }
}
