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
  /** Libellé FR déjà calculé (« Entretien prévu » si un entretien est à venir). */
  statusLabel: string;
  hasUpcomingInterview: boolean;
  interviewsCount: number;
  /** Date d'envoi formatée (`jj/mm/aaaa`). */
  appliedDate: string;
  createdAt: string;
}
