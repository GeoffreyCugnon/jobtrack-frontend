// Candidature telle que renvoyée par l'API (`GET /application`), produite côté
// Backend par `application.service.ts#toDto`.
export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface CandidatureItem {
  id: number;
  jobOfferingId: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  /** Libellé FR (« Entretien prévu » si un entretien est à venir, sinon le statut) — dérivé côté Front (`applications.api.ts`), jamais périmé entre deux mutations. */
  statusLabel: string;
  hasUpcomingInterview: boolean;
  interviewsCount: number;
  /** Brut, renvoyé par l'API : le plus tardif des entretiens planifiés (`null` si aucun). Source de `hasUpcomingInterview`/`statusLabel`. */
  latestInterviewScheduledAt: string | null;
  /** Date d'envoi formatée (`jj/mm/aaaa`). */
  appliedDate: string;
  createdAt: string;
}
