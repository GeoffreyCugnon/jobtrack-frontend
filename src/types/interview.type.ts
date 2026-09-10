// Entretien tel que renvoyé par l'API (`GET /interview`), produit côté Backend
// par `interview.service.ts#toDto`.
export type InterviewType = "TELEPHONE" | "VISIO" | "PRESENTIEL";

export interface EntretienItem {
  id: number;
  applicationId: number;
  company: string;
  role: string;
  interviewType: InterviewType;
  /** Le Front n'affiche que deux modes ; le téléphone est rangé avec la visio. */
  mode: "visio" | "presentiel";
  scheduledAt: string;
  /** Date lisible déjà formatée (fr-FR). */
  date: string;
  isUpcoming: boolean;
  notes: string | null;
  visioLink: string | null;
  location: string | null;
}
