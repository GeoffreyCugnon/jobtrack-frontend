import { api } from "../utils/axios-client";
import type {
  ApplicationStatus,
  CandidatureItem,
} from "../types/candidature.type";
import { isUpcoming } from "../utils/relative-time";

export type { CandidatureItem, ApplicationStatus };

/**
 * `hasUpcomingInterview`/`statusLabel` ne sont pas renvoyés tels quels par
 * l'API : dérivés ici de `latestInterviewScheduledAt` à chaque lecture
 * (jamais périmés entre deux mutations, cf. `candidature.type.ts`).
 * `statusLabel` brut = libellé du statut seul ; « Entretien prévu » prime
 * dessus tant qu'un entretien est à venir (même règle qu'avant, côté Front).
 */
function withUpcomingInterview(candidature: CandidatureItem): CandidatureItem {
  const hasUpcomingInterview =
    candidature.latestInterviewScheduledAt !== null &&
    isUpcoming(candidature.latestInterviewScheduledAt);
  return {
    ...candidature,
    hasUpcomingInterview,
    statusLabel: hasUpcomingInterview
      ? "Entretien prévu"
      : candidature.statusLabel,
  };
}

/** Candidatures de l'utilisateur courant (`/application`, protégé par AuthGuard). */
export class ApplicationsApi {
  static async list(): Promise<CandidatureItem[]> {
    const { data } = await api.get<CandidatureItem[]>("application");
    return Array.isArray(data) ? data.map(withUpcomingInterview) : [];
  }

  static async getById(
    id: number | string,
  ): Promise<CandidatureItem | null> {
    const { data } = await api.get<CandidatureItem | null>(
      `application/${id}`,
    );
    return data ? withUpcomingInterview(data) : null;
  }

  static async create(input: {
    jobOfferingId: number;
    status?: ApplicationStatus;
  }): Promise<CandidatureItem> {
    const { data } = await api.post<CandidatureItem>("application", {
      job_offering_id: input.jobOfferingId,
      ...(input.status ? { status: input.status } : {}),
    });
    return withUpcomingInterview(data);
  }

  static async updateStatus(
    id: number | string,
    status: ApplicationStatus,
  ): Promise<CandidatureItem> {
    const { data } = await api.patch<CandidatureItem>(`application/${id}`, {
      status,
    });
    return withUpcomingInterview(data);
  }

  static async remove(id: number | string): Promise<void> {
    await api.delete(`application/${id}`);
  }
}
