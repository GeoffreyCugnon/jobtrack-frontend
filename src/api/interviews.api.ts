import { api } from "../utils/axios-client";
import type { EntretienItem, InterviewType } from "../types/interview.type";

export type { EntretienItem, InterviewType };

/** Entretiens de l'utilisateur courant (`/interview`, protégé par AuthGuard). */
export class InterviewsApi {
  static async list(): Promise<EntretienItem[]> {
    const { data } = await api.get<EntretienItem[]>("interview");
    return Array.isArray(data) ? data : [];
  }

  static async getById(id: number | string): Promise<EntretienItem | null> {
    const { data } = await api.get<EntretienItem | null>(`interview/${id}`);
    return data ?? null;
  }

  static async create(input: {
    applicationId: number;
    interviewType: InterviewType;
    scheduledAt: string;
    notes?: string;
  }): Promise<EntretienItem> {
    const { data } = await api.post<EntretienItem>("interview", {
      application_id: input.applicationId,
      interview_type: input.interviewType,
      scheduled_at: input.scheduledAt,
      ...(input.notes ? { notes: input.notes } : {}),
    });
    return data;
  }

  static async remove(id: number | string): Promise<void> {
    await api.delete(`interview/${id}`);
  }
}
