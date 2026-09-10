import { api } from "../utils/axios-client";
import type { PublicationComment } from "../types/comment.type";

export type { PublicationComment };

/**
 * Commentaires d'une publication (`/comment`). La lecture est publique ; la
 * création exige un compte (le token est injecté par l'intercepteur axios).
 */
export class CommentsApi {
  static async listByPublication(
    publicationId: number | string,
  ): Promise<PublicationComment[]> {
    const { data } = await api.get<PublicationComment[]>("comment", {
      params: { publicationId: Number(publicationId) },
    });
    return Array.isArray(data) ? data : [];
  }

  static async create(input: {
    publicationId: number;
    content: string;
    parentCommentId?: number;
  }): Promise<PublicationComment> {
    const { data } = await api.post<PublicationComment>("comment", {
      publication_id: input.publicationId,
      content: input.content,
      ...(input.parentCommentId
        ? { parent_comment_id: input.parentCommentId }
        : {}),
    });
    return data;
  }

  static async remove(id: number | string): Promise<void> {
    await api.delete(`comment/${id}`);
  }
}
