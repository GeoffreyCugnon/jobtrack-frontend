import { api } from "../utils/axios-client";
import type { DocumentItem, DocumentType } from "../types/document.type";

export type { DocumentItem, DocumentType };

/** Bibliothèque de documents de l'utilisateur (`/document`, AuthGuard). */
export class DocumentsApi {
  static async list(type?: DocumentType): Promise<DocumentItem[]> {
    const { data } = await api.get<DocumentItem[]>("document", {
      params: type ? { type } : undefined,
    });
    return Array.isArray(data) ? data : [];
  }

  static async getById(id: number | string): Promise<DocumentItem | null> {
    const { data } = await api.get<DocumentItem | null>(`document/${id}`);
    return data ?? null;
  }

  static async create(input: {
    title: string;
    type: DocumentType;
  }): Promise<DocumentItem> {
    const { data } = await api.post<DocumentItem>("document", input);
    return data;
  }

  static async rename(
    id: number | string,
    title: string,
  ): Promise<DocumentItem> {
    const { data } = await api.patch<DocumentItem>(`document/${id}`, { title });
    return data;
  }

  static async remove(id: number | string): Promise<void> {
    await api.delete(`document/${id}`);
  }
}
