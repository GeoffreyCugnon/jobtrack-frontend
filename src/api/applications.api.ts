import { api } from "../utils/axios-client";
import type {
  ApplicationStatus,
  CandidatureItem,
} from "../types/candidature.type";

export type { CandidatureItem, ApplicationStatus };

/** Candidatures de l'utilisateur courant (`/application`, protégé par AuthGuard). */
export class ApplicationsApi {
  static async list(): Promise<CandidatureItem[]> {
    const { data } = await api.get<CandidatureItem[]>("application");
    return Array.isArray(data) ? data : [];
  }

  static async getById(
    id: number | string,
  ): Promise<CandidatureItem | null> {
    const { data } = await api.get<CandidatureItem | null>(
      `application/${id}`,
    );
    return data ?? null;
  }

  static async create(input: {
    jobOfferingId: number;
    status?: ApplicationStatus;
  }): Promise<CandidatureItem> {
    const { data } = await api.post<CandidatureItem>("application", {
      job_offering_id: input.jobOfferingId,
      ...(input.status ? { status: input.status } : {}),
    });
    return data;
  }

  static async updateStatus(
    id: number | string,
    status: ApplicationStatus,
  ): Promise<CandidatureItem> {
    const { data } = await api.patch<CandidatureItem>(`application/${id}`, {
      status,
    });
    return data;
  }

  static async remove(id: number | string): Promise<void> {
    await api.delete(`application/${id}`);
  }
}
